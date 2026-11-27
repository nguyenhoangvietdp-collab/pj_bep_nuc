import test from "node:test";
import assert from "node:assert/strict";
import {act,tradingDemoState,issue,publicQuote,publicListing,view} from "../lib/domain";
import {legacyNegotiatedPricing} from "../lib/catalogue-sale";
import {requestPayment} from "../lib/payment-summary";
const now=Date.parse("2026-11-03T18:30:00+07:00");
function setup(rate=30){const s=tradingDemoState(now),u=s.users[0],l=s.listings[0];l.floor=45000;l.cost=3000;l.margin=1000;l.negotiatedDiscountPercent=rate as 30|35;l.price=legacyNegotiatedPricing(l.floor,rate).salePrice;u.place={id:"qa",label:"Nhà",address:"Địa chỉ kiểm thử Hà Nội",lat:s.shops[0].lat!,lng:s.shops[0].lng!,savedAt:now};issue(s,u,now);const call=(who:string,action:string,args:any={},at=now)=>act(s,s.users.find(x=>x.id===who)!,action,{key:crypto.randomUUID(),...args},at,null,{production:false,pilotEnabled:false,bankReady:false}) as any;const quote=(rate=0)=>call("student","quote",{listingId:l.id,qty:1,voucherId:rate===0?undefined:s.vouchers.find(v=>rate===9000?v.amount===9000:v.rate===rate&&!v.amount)!.id});return {s,u,l,call,quote};}
test("voucher uses5%-discounted customer price, fixed merchant payout and private contract terms",()=>{
 for(const [rate,total,discount] of [[0,58019,0],[.15,49019,9000],[.1,51912,6107],[9000,49019,9000]]){const f=setup(),q=f.quote(rate);assert.equal(q.menuTotal,64286);assert.equal(q.saleTotal,61072);assert.equal(q.baseDiscount,3214);assert.equal(q.voucherDiscount,discount);assert.equal(q.total,total);assert.equal(f.s.quotes[0].payout,45000);assert.ok(total-45000-3000>=1000);assert.equal((q as any).payout,undefined);assert.equal((q.customerPricing as any).negotiatedPrice,undefined);const pub=publicListing(f.l);assert.equal((pub as any).floor,undefined);assert.equal((pub as any).negotiatedDiscountPercent,undefined);assert.equal(pub.customerPricing!.saleUnitPrice,61072);}
});
test("request preview displays original less5% then voucher, without another markdown",()=>{
 assert.deepEqual(requestPayment(61072,1,.15,9000,64286),{menuTotal:64286,baseDiscount:3214,voucherDiscount:9000,bonusDiscount:0,total:52072});
 const two=requestPayment(61072,2,.15,9000,64286);assert.equal(two.total,113144);assert.equal(two.baseDiscount,6428);assert.equal(two.voucherDiscount,9000);
});
test("insufficient net contribution still blocks vouchers and does not consume stock or budget",()=>{const f=setup();f.l.cost=12000;const stock=f.l.stock;assert.throws(()=>f.quote(9000),/ngân sách/);assert.equal(f.s.quotes.length,0);assert.equal(f.l.stock,stock);assert.ok(f.s.vouchers.every(v=>v.state==="available"));});
test("merchant food and flower lots use the menu price, and approval validates both derived amounts",()=>{
 for(const [kind,rate,floor] of [["food",30,42000],["flowers",35,39000]] as const){
  const f=setup(),lot=kind==="food"?f.l:f.s.listings[1];
  const args={...lot,lot:{...lot.lot!,referencePrice:60000,referenceEvidence:"Giá menu do tiệm xác nhận"},negotiatedConfirmed:true,negotiatedDiscountPercent:rate,price:57000,floor};
  assert.throws(()=>f.call("merchant","listing",{...args,price:floor}),/khớp giá menu/);
  assert.throws(()=>f.call("merchant","listing",{...args,floor:floor+1}),/khớp giá menu/);
  assert.throws(()=>f.call("merchant","listing",{...args,lot:{...args.lot,referencePrice:undefined}}),/Giá menu/);
  assert.throws(()=>f.call("merchant","listing",{...args,negotiatedConfirmed:false}),/đàm phán/);
  assert.throws(()=>f.call("merchant","listing",{...args,cost:20000}),/không đủ/);
  f.call("merchant","listing",args);
  const created=f.s.listings.at(-1)!;
  assert.equal(created.approved,false);assert.equal(created.price,57000);assert.equal(created.floor,floor);
  const approval={id:created.id,referencePrice:60000,negotiatedDiscountPercent:35,price:57000,floor:39000,cost:3000,margin:1000,confirmed:true};
  assert.throws(()=>f.call("ops","approve_listing",{...approval,price:56999}),/khớp giá menu/);
  assert.throws(()=>f.call("ops","approve_listing",{...approval,floor:39001}),/khớp giá menu/);
  assert.equal(created.approved,false);assert.equal(created.floor,floor);
  f.call("ops","approve_listing",approval);
  const q=f.call("student","quote",{listingId:created.id,qty:1});
  assert.deepEqual(q.customerPricing,{version:3,originalUnitPrice:60000,saleUnitPrice:57000,baseDiscountPercent:5});
  assert.deepEqual(publicListing(created).customerPricing,q.customerPricing);
  assert.equal(q.bonusDiscount,2850);assert.equal(q.total,54150);assert.equal(f.s.quotes[0].payout,39000);
 }
});
test("legacy quotes and orders retain original amounts after a lot is approved with a menu price",()=>{
 const f=setup(),q=f.quote(9000),o=f.call("student","order",{quoteId:q.id});
 f.call("ops","approve_listing",{id:f.l.id,referencePrice:60000,negotiatedDiscountPercent:30,price:57000,floor:42000,cost:3000,margin:1000,confirmed:true});
 assert.equal(f.l.menuPrice,60000);assert.equal(f.l.floor,42000);
 const saved=publicQuote(f.s,f.s.quotes[0]);assert.equal(saved.total,49019);assert.equal(saved.menuTotal,64286);assert.equal(saved.saleTotal,61072);assert.equal(saved.customerPricing?.version,undefined);assert.equal(f.s.quotes[0].payout,45000);assert.equal(view(f.s,f.u,now).orders.find(x=>x.id===o.id)!.total,49019);
});
test("negotiated35% is internal and legacy modern lots do not get a new5% automatically",()=>{
 const f=setup(35),p=legacyNegotiatedPricing(45000,35),q=f.quote();assert.equal(q.total,p.salePrice-Math.floor(p.salePrice*.05));assert.equal(q.baseDiscount,p.originalPrice-p.salePrice);
 const g=setup();delete g.l.negotiatedDiscountPercent;g.l.price=50000;const old=g.quote();assert.equal(old.total,49000);assert.equal(old.baseDiscount,0);assert.equal(old.customerPricing,undefined);
});

test("delivery subsidy cannot consume the negotiated payout or minimum contribution",()=>{
 const f=setup();f.s.tradingRules!.stackReceiving=true;const q=f.call("student","quote",{listingId:f.l.id,qty:1,voucherId:f.s.vouchers.find(v=>v.amount===9000)!.id,fulfillment:"delivery"});const o=f.call("student","order",{quoteId:q.id,delivery:{recipient:"Khách thử",phone:"0912345678",address:"Địa chỉ thử nghiệm tại Hà Nội"}});assert.throws(()=>f.call("ops","delivery_fee",{orderId:o.id,fee:30000}),/ngân sách/);assert.equal(f.s.quotes[0].payout,45000);
});
