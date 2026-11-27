import test from "node:test";
import assert from "node:assert/strict";
import {act,tradingDemoState,issue,publicQuote,publicListing,view} from "../lib/domain";
import {negotiatedPricing} from "../lib/catalogue-sale";
import {requestPayment} from "../lib/payment-summary";
const now=Date.parse("2026-11-03T18:30:00+07:00");
function setup(rate=30){const s=tradingDemoState(now),u=s.users[0],l=s.listings[0];l.floor=45000;l.cost=3000;l.margin=1000;l.negotiatedDiscountPercent=rate as 30|35;l.price=negotiatedPricing(l.floor,rate).salePrice;u.place={id:"qa",label:"Nhà",address:"Địa chỉ kiểm thử Hà Nội",lat:s.shops[0].lat!,lng:s.shops[0].lng!,savedAt:now};issue(s,u,now);const call=(who:string,action:string,args:any={},at=now)=>act(s,s.users.find(x=>x.id===who)!,action,{key:crypto.randomUUID(),...args},at,null,{production:false,pilotEnabled:false,bankReady:false}) as any;const quote=(rate=0)=>call("student","quote",{listingId:l.id,qty:1,voucherId:rate===0?undefined:s.vouchers.find(v=>rate===9000?v.amount===9000:v.rate===rate&&!v.amount)!.id});return {s,u,l,call,quote};}
test("voucher uses5%-discounted customer price, fixed merchant payout and private contract terms",()=>{
 for(const [rate,total,discount] of [[0,61072,0],[.15,52072,9000],[.1,54965,6107],[9000,52072,9000]]){const f=setup(),q=f.quote(rate);assert.equal(q.menuTotal,64286);assert.equal(q.saleTotal,61072);assert.equal(q.baseDiscount,3214);assert.equal(q.voucherDiscount,discount);assert.equal(q.total,total);assert.equal(f.s.quotes[0].payout,45000);assert.ok(total-45000-3000>=1000);assert.equal((q as any).payout,undefined);assert.equal((q.customerPricing as any).negotiatedPrice,undefined);const pub=publicListing(f.l);assert.equal((pub as any).floor,undefined);assert.equal((pub as any).negotiatedDiscountPercent,undefined);assert.equal(pub.customerPricing!.saleUnitPrice,61072);}
});
test("request preview displays original less5% then voucher, without another markdown",()=>{
 assert.deepEqual(requestPayment(61072,1,.15,9000,64286),{menuTotal:64286,baseDiscount:3214,voucherDiscount:9000,bonusDiscount:0,total:52072});
 const two=requestPayment(61072,2,.15,9000,64286);assert.equal(two.total,113144);assert.equal(two.baseDiscount,6428);assert.equal(two.voucherDiscount,9000);
});
test("insufficient net contribution still blocks vouchers and does not consume stock or budget",()=>{const f=setup();f.l.cost=12000;const stock=f.l.stock;assert.throws(()=>f.quote(9000),/ngân sách/);assert.equal(f.s.quotes.length,0);assert.equal(f.l.stock,stock);assert.ok(f.s.vouchers.every(v=>v.state==="available"));});
test("server rejects caller prices that skip5%; new pricing requires explicit negotiated confirmation",()=>{
 const f=setup(),args={...f.l,negotiatedConfirmed:true};f.l.price=45000;assert.throws(()=>f.quote(),/giảm nền5%/);assert.throws(()=>f.call("ops","listing",{...args,price:45000}),/giảm nền5%/);assert.throws(()=>f.call("ops","listing",{...args,negotiatedConfirmed:false}),/đàm phán/);assert.throws(()=>f.call("ops","listing",{...args,cost:20000}),/không đủ/);f.call("merchant","listing",args);const created=f.s.listings.at(-1)!;assert.equal(created.approved,false);f.call("ops","approve_listing",{id:created.id,floor:42000,cost:3000,margin:1000,confirmed:true});assert.equal(created.price,57000);assert.equal(created.floor,42000);
});
test("quote price, original-price display and payout remain snapshotted after later lot changes",()=>{
 const f=setup(),q=f.quote(9000),o=f.call("student","order",{quoteId:q.id});f.l.floor=55000;f.l.price=negotiatedPricing(55000,30).salePrice;const saved=publicQuote(f.s,f.s.quotes[0]);assert.equal(saved.total,52072);assert.equal(saved.menuTotal,64286);assert.equal(saved.saleTotal,61072);assert.equal(f.s.quotes[0].payout,45000);assert.equal(view(f.s,f.u,now).orders.find(x=>x.id===o.id)!.total,52072);
});
test("negotiated35% is internal and legacy modern lots do not get a new5% automatically",()=>{
 const f=setup(35),p=negotiatedPricing(45000,35),q=f.quote();assert.equal(q.total,p.salePrice);assert.equal(q.baseDiscount,p.originalPrice-p.salePrice);
 const g=setup();delete g.l.negotiatedDiscountPercent;g.l.price=50000;const old=g.quote();assert.equal(old.total,50000);assert.equal(old.baseDiscount,0);assert.equal(old.customerPricing,undefined);
});

test("delivery subsidy cannot consume the negotiated payout or minimum contribution",()=>{
 const f=setup();f.s.tradingRules!.stackReceiving=true;const q=f.call("student","quote",{listingId:f.l.id,qty:1,voucherId:f.s.vouchers.find(v=>v.amount===9000)!.id,fulfillment:"delivery"});const o=f.call("student","order",{quoteId:q.id,delivery:{recipient:"Khách thử",phone:"0912345678",address:"Địa chỉ thử nghiệm tại Hà Nội"}});assert.throws(()=>f.call("ops","delivery_fee",{orderId:o.id,fee:30000}),/ngân sách/);assert.equal(f.s.quotes[0].payout,45000);
});
