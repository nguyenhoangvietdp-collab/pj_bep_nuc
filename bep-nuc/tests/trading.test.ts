import test from "node:test";
import assert from "node:assert/strict";
import {act,tradingDemoState as modernDemoState,issue,expire,view,catalogue,ledger,promotionUsed,orderTotal,empty} from "../lib/domain";
import {weekStart,voucherDiscount,validateRules,defaultTradingRules} from "../lib/trading";
const now=Date.parse("2026-11-02T18:30:00+07:00");
function fixture(){const s=modernDemoState(now);issue(s,s.users[0],now);return s;}
function call(s:ReturnType<typeof fixture>,who:string,action:string,args:any={},at=now,km:number|null=null){return act(s,s.users.find(u=>u.id===who)!,action,{key:crypto.randomUUID(),...args},at,km,{production:false,pilotEnabled:false,bankReady:false}) as any;}
function place(s:ReturnType<typeof fixture>){call(s,"student","save_place",{label:"Nơi ở",address:"Hồ Hoàn Kiếm, Hà Nội",lat:21.0285,lng:105.8542});}
function voucher(s:ReturnType<typeof fixture>,rate:number){return s.vouchers.find(v=>rate===9000?v.amount===9000:v.rate===rate&&!v.amount)!;}
function quote(s:ReturnType<typeof fixture>,rate=0,fulfillment="pickup",listingId="meal",km:number|null=null){return call(s,"student","quote",{listingId,qty:1,voucherId:rate?voucher(s,rate).id:undefined,fulfillment},now,km);}
function paid(s:ReturnType<typeof fixture>,rate=0,method="pickup",listing="meal"){
 const q=quote(s,rate,method,listing),o=call(s,"student","order",{quoteId:q.id,delivery:method==="delivery"?{recipient:"Khách thử",phone:"0912345678",address:"Hồ Hoàn Kiếm, Hà Nội"}:undefined});
 if(method==="delivery"){call(s,"ops","delivery_fee",{orderId:o.id,fee:30000});call(s,"student","accept_delivery_fee",{orderId:o.id,revision:1});}
 const order=s.orders.find(x=>x.id===o.id)!;call(s,"ops","payment",{orderId:o.id,reference:crypto.randomUUID(),amount:orderTotal(s,order),receivedAt:now});return {q,order};
}
test("Monday Vietnam boundary and weekly quota2/2/configured9k never issue twice",()=>{
 assert.equal(weekStart(Date.parse("2026-11-01T23:59:59+07:00")),"2026-10-26");assert.equal(weekStart(Date.parse("2026-11-02T00:00:00+07:00")),"2026-11-02");
 const s=fixture();issue(s,s.users[0],now+86400000);assert.equal(s.vouchers.length,8);assert.equal(s.vouchers.filter(v=>v.rate===.15).length,2);assert.equal(s.vouchers.filter(v=>v.amount===9000).length,4);
 issue(s,s.users[0],now+7*86400000);assert.equal(s.vouchers.length,16);assert.equal(view(s,s.users[0],now+7*86400000).vouchers.length,8);
});
test("production default has no funded promotion and no silently activated9k quota",()=>{const s=empty();s.users=fixture().users;issue(s,s.users[0],now);assert.equal(s.vouchers.length,0);assert.equal(defaultTradingRules().shippingCap,0);});
test("new lots follow their published window, including flower pickup before18h",()=>{const at=Date.parse("2026-11-02T16:30:00+07:00"),s=modernDemoState(at);issue(s,s.users[0],at);const q=call(s,"student","quote",{listingId:"flowers",qty:1},at);assert.equal(q.total,59000);assert.equal(q.expires,at+600000);});
test("9k is fixed across60k/90k boundaries; percentage caps are independent",()=>{
 for(const b of [59999,60000,60001,89999,90000,90001])assert.equal(voucherDiscount(b,{rate:0,amount:9000}),9000);
 assert.equal(voucherDiscount(100000,{rate:.15,cap:9000}),9000);assert.equal(voucherDiscount(40000,{rate:.15,cap:9000}),6000);
});
test("voucher requires saved place; no-voucher price is full lot price without hidden5%",()=>{const s=fixture();assert.throws(()=>quote(s,.1),/vị trí/);const q=quote(s);assert.equal(q.total,50000);assert.equal(q.baseDiscount,0);assert.equal(q.voucherId,"");call(s,"student","release_quote",{quoteId:q.id});place(s);const v=quote(s,9000);assert.equal(v.total,41000);assert.equal(v.voucherDiscount,9000);assert.equal(v.baseDiscount,0);});
test("budget and stock reservation are idempotent; releasing and expiration restore both",()=>{
 const s=fixture();place(s);const args={listingId:"meal",qty:1,voucherId:voucher(s,.1).id,key:"same-key-retry"};const a=call(s,"student","quote",args),b=call(s,"student","quote",args);assert.equal(a.id,b.id);assert.equal(s.listings[0].stock,11);assert.equal(promotionUsed(s,weekStart(now)),5000);
 assert.throws(()=>call(s,"student","save_place",{label:"Khác",address:"Địa chỉ khác Hà Nội",lat:21,lng:105.8}),/Bỏ giữ/);
 expire(s,now+600001);assert.equal(s.listings[0].stock,12);assert.equal(voucher(s,.1).state,"available");assert.equal(promotionUsed(s,weekStart(now)),0);
});
test("insufficient margin and weekly budget never reserve a voucher or stock",()=>{
 const s=fixture();place(s);s.listings[0].floor=45000;assert.throws(()=>quote(s,9000),/ngân sách/);assert.equal(voucher(s,9000).state,"available");assert.equal(s.listings[0].stock,12);
 s.listings[0].floor=32500;s.tradingRules!.weeklyBudget=4999;assert.throws(()=>quote(s,.1),/Ngân sách/);assert.equal(s.quotes.length,0);
});
test("farther support grows within bands, route unavailable earns none; no implicit stacking",()=>{
 const s=fixture();place(s);const a=quote(s,0,"pickup","meal",2.5);assert.equal(a.bonusDiscount,2000);call(s,"student","release_quote",{quoteId:a.id});const b=quote(s,0,"pickup","meal",null);assert.equal(b.bonusDiscount,0);call(s,"student","release_quote",{quoteId:b.id});const c=quote(s,.1,"pickup","meal",2.5);assert.equal(c.bonusDiscount,0);assert.equal(c.voucherDiscount,5000);
});
test("ship30% is capped, revised price needs consent and totals use only customer share",()=>{
 const s=fixture();const q=quote(s,0,"delivery"),o=call(s,"student","order",{quoteId:q.id,delivery:{recipient:"Khách thử",phone:"0912345678",address:"Hồ Hoàn Kiếm, Hà Nội"}});call(s,"ops","delivery_fee",{orderId:o.id,fee:20000});assert.equal(s.orders[0].delivery!.support,6000);call(s,"ops","delivery_fee",{orderId:o.id,fee:40000});assert.equal(s.orders[0].delivery!.support,9000);assert.throws(()=>call(s,"student","accept_delivery_fee",{orderId:o.id,revision:1}),/đổi/);call(s,"student","accept_delivery_fee",{orderId:o.id,revision:2});assert.equal(orderTotal(s,s.orders[0]),81000);assert.equal(s.orders[0].delivery!.customerFee,31000);
});
test("ship support with voucher is off unless funded stacking is explicitly enabled",()=>{
 const s=fixture();place(s);const {order}=paid(s,.1,"delivery");assert.equal(order.delivery!.support,0);assert.equal(orderTotal(s,order),75000);
});
test("weekly voucher is consumed at handover, with a snapshot unaffected by policy changes",()=>{
 const s=fixture();place(s);const {q,order}=paid(s,.1);assert.equal(voucher(s,.1).state,"reserved");const original=s.quotes.find(x=>x.id===q.id)!;s.listings[0].lot!.condition="Tình trạng đã thay đổi";s.tradingRules!.cap10=1000;
 assert.notEqual(original.lotSnapshot!.condition,s.listings[0].lot!.condition);call(s,"merchant","pickup",{orderId:order.id,code:order.code});assert.equal(voucher(s,.1).state,"used");assert.equal(original.price,45000);assert.throws(()=>call(s,"merchant","pickup",{orderId:order.id,code:order.code}),/Mã/);
});
test("refund after shop handover keeps merchant obligation, avoids duplicate refund",()=>{
 const s=fixture();const {order}=paid(s,0,"delivery","flowers");call(s,"ops","pickup",{orderId:order.id,code:order.code});call(s,"student","report_issue",{orderId:order.id,description:"Hoa nhận khác tình trạng đã công bố"});const id=s.issues![0].id;call(s,"ops","resolve_issue",{id,refund:true,resolution:"Lô nhận sai, hoàn tiền khách"});assert.equal(ledger(s).merchantDue,40000);assert.equal(s.refunds.length,1);assert.equal(s.refunds[0].amount,80000);assert.throws(()=>call(s,"ops","resolve_issue",{id,refund:true,resolution:"Không lặp lại"}),/đang mở/);
});
test("flower data and reference evidence are required; catalogue never exposes payout",()=>{
 const s=fixture();s.listings[1].lot!.stems=0;assert.throws(()=>quote(s,0,"pickup","flowers"),/chất lượng/);assert.equal(catalogue(s,now).listings.length,1);const l=catalogue(s,now).listings[0] as any;assert.equal(l.floor,undefined);assert.equal(l.cost,undefined);assert.equal((catalogue(s,now).tradingRules as any).weeklyBudget,undefined);assert.equal((view(s,s.users[0],now).tradingRules as any).weeklyBudget,undefined);
 assert.throws(()=>validateRules({...s.tradingRules!,pickupBands:[{maxKm:2,amount:2000},{maxKm:3,amount:1000}]}),/không giảm/);
});
test("only operator can commit budget; reductions cannot erase reserved liabilities",()=>{
 const s=fixture();place(s);quote(s,.1);assert.throws(()=>call(s,"student","configure_trading",{rules:s.tradingRules,fundingConfirmed:true,note:"Vốn thử"}),/vận hành/);assert.throws(()=>call(s,"ops","configure_trading",{rules:{...s.tradingRules,weeklyBudget:4999},fundingConfirmed:true,note:"Vốn thử"}),/thấp hơn/);
});
test("merchant cannot bypass platform cost checks by self-approving a lot",()=>{
 const s=fixture();const l=s.listings[0];const args={...l,id:undefined,lot:{...l.lot},floor:40000,cost:0,margin:0};
 call(s,"merchant","listing",args);const pending=s.listings.at(-1)!;assert.equal(pending.approved,false);assert.equal(catalogue(s,now).listings.some(l=>l.id===pending.id),false);
 assert.throws(()=>call(s,"student","quote",{listingId:pending.id,qty:1}),/duyệt/);
 assert.throws(()=>call(s,"merchant","approve_listing",{id:pending.id,floor:40000,cost:5000,margin:2000,confirmed:true}),/vận hành/);
 call(s,"ops","approve_listing",{id:pending.id,floor:40000,cost:5000,margin:2000,confirmed:true});assert.equal(pending.approved,true);assert.equal(catalogue(s,now).listings.some(l=>l.id===pending.id),true);
});
