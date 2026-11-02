import test from "node:test";
import assert from "node:assert/strict";
import {act,tradingDemoState,issue,view,type State} from "../lib/domain";
import {requestProduct,requestUnit} from "../lib/request-catalogue";
const now=Date.parse("2026-11-02T18:30:00+07:00"),policy={production:false,pilotEnabled:false,bankReady:false};
function setup(id="flower-ly-kep-trang"){
 const s=tradingDemoState(now),p=requestProduct(id)!;s.shops[0].mock=false;s.shops[0].signed=true;s.shops[0].recurring=true;
 s.listings[1].lot={...s.listings[1].lot!,species:p.name,catalogueProductId:p.id,quantity:p.quantity as any,stems:5};
 issue(s,s.users[0],now);
 const call=(who:string,action:string,args:any={},at=now)=>act(s,s.users.find(u=>u.id===who)!,action,{key:crypto.randomUUID(),...args},at,null,policy) as any;
 const request=(rate=0)=>call("student","meal_request",{name:p.name,productId:p.id,qty:1,rate,fulfillment:"pickup"});
 const confirm=(id:string,args:any={})=>call("ops","confirm_meal_request",{requestId:id,listingId:"flowers",fee:0,sourceConfirmed:true,...args});
 return {s,p,call,request,confirm};
}
test("real flower inquiry snapshots canonical goal/units without reserving inventory or creating an order",()=>{
 const f=setup(),stock=f.s.listings[1].stock,budget=f.s.quotes.length;
 const args={key:"same-request-key",productId:f.p.id,name:"Client attempts another name",qty:2,rate:9000,fulfillment:"pickup",targetPrice:1,product:{targetPrice:1}};
 const a=f.call("student","meal_request",args);assert.deepEqual(f.call("student","meal_request",args),a);
 const r=f.s.mealRequests![0];assert.equal(r.name,"Ly kép trắng");assert.equal(r.product!.targetPrice,90300);assert.equal(requestUnit(r.product!),"5 cành");assert.equal(r.qty,2);assert.equal(r.status,"pending");
 assert.equal(f.s.listings[1].stock,stock);assert.equal(f.s.quotes.length,budget);assert.equal(f.s.orders.length,0);assert.ok(f.s.vouchers.every(v=>v.state==="available"));
 assert.throws(()=>f.call("student","meal_request",{...args,key:crypto.randomUUID(),productId:"unknown"}),/Mã sản phẩm/);
});
test("pending accounts may inquire and be rejected but cannot get a payable quote",()=>{
 const f=setup();f.s.users[0].approved=false;const r=f.request();assert.throws(()=>f.confirm(r.id),/chưa đủ điều kiện/);f.call("ops","reject_meal_request",{requestId:r.id,reason:"Chưa tìm được nguồn phù hợp"});assert.equal(f.s.mealRequests![0].status,"rejected");
});
test("ops cannot confirm a flower inquiry with a food lot, mock shop or mismatched product/quantity",()=>{
 for(const mismatch of ["food","mock","type","quantity","quality"]){
  const f=setup(),r=f.request();
  if(mismatch==="food")assert.throws(()=>f.confirm(r.id,{listingId:"meal"}),/ngành hàng/);
  if(mismatch==="mock"){f.s.shops[0].mock=true;assert.throws(()=>f.confirm(r.id),/nhà bán thật/);}
  if(mismatch==="type"){f.s.listings[1].lot!.catalogueProductId="flower-ken-hong";assert.throws(()=>f.confirm(r.id),/không khớp/);}
  if(mismatch==="quantity"){f.s.listings[1].lot!.quantity={amount:4,unit:"bông"};assert.throws(()=>f.confirm(r.id),/không khớp/);}
  if(mismatch==="quality"){f.s.listings[1].lot!.stems=undefined;assert.throws(()=>f.confirm(r.id),/chất lượng/);}
  assert.equal(f.s.orders.length,0);assert.equal(f.s.quotes.length,0);
 }
});
test("unfunded desired voucher may be replaced with no voucher only in a consented revised quote",()=>{
 const f=setup(),r=f.request(9000);f.call("student","save_place",{label:"Điểm thử",address:"Địa chỉ thử nghiệm Hà Nội",lat:21.02,lng:105.85});f.s.tradingRules!.enabled=false;
 assert.throws(()=>f.confirm(r.id),/điều kiện voucher/);
 f.confirm(r.id,{appliedRate:0});const req=f.s.mealRequests![0],q=f.s.quotes.find(x=>x.id===req.quoteId)!;
 assert.equal(req.rate,9000);assert.equal(req.appliedRate,0);assert.equal(q.price,59000);assert.equal(q.promotion!.voucher,0);assert.equal(f.s.orders.length,0);
 const exposed=(view(f.s,f.s.users[0],now) as any).mealRequests[0];assert.equal(exposed.quote.appliedRate,0);assert.ok(!("payout" in exposed.quote));
 assert.throws(()=>f.call("student","accept_meal_request",{requestId:r.id,revision:0}),/đã đổi/);
 f.s.listings[1].price=64000;f.confirm(r.id,{appliedRate:0});assert.equal(req.revision,2);assert.throws(()=>f.call("student","accept_meal_request",{requestId:r.id,revision:1}),/đã đổi/);
 const args={key:"accept-once-real-flower",requestId:r.id,revision:2};const order=f.call("student","accept_meal_request",args);assert.deepEqual(f.call("student","accept_meal_request",args),order);assert.equal(f.s.orders.length,1);assert.equal(f.s.quotes.find(x=>x.id===req.quoteId)!.price,64000);
});
test("unknown stems in a requested bunch are allowed, real bunch confirmation still requires counted stems",()=>{
 const f=setup("flower-hoa-chuong"),r=f.request();assert.equal(f.s.mealRequests![0].product!.quantity.unit,"bó");f.s.listings[1].lot!.stems=undefined;assert.throws(()=>f.confirm(r.id),/chất lượng/);f.s.listings[1].lot!.stems=7;f.confirm(r.id);assert.equal(f.s.mealRequests![0].status,"confirmed");
});
test("flower quote expiry and private request access follow the common request flow",()=>{
 const f=setup(),r=f.request();f.confirm(r.id);assert.throws(()=>f.call("student","accept_meal_request",{requestId:r.id,revision:1},now+600001),/hết hạn/);assert.equal((view(f.s,f.s.users[1],now) as any).mealRequests.length,0);
});
test("production request to verified quote to consented order uses existing pilot/payment gates",()=>{
 const f=setup();for(let i=2;i<=3;i++){f.s.shops.push({...f.s.shops[0],id:`real-test-shop-${i}`});f.s.listings.push({...f.s.listings[0],id:`real-test-lot-${i}`,shopId:`real-test-shop-${i}`});}
 const production={production:true,pilotEnabled:true,bankReady:true};
 const call=(who:string,action:string,args:any={})=>act(f.s,f.s.users.find(u=>u.id===who)!,action,{key:crypto.randomUUID(),...args},now,null,production) as any;
 const r=call("student","meal_request",{name:f.p.name,productId:f.p.id,qty:1,rate:0,fulfillment:"pickup"});assert.equal(f.s.orders.length,0);
 call("ops","confirm_meal_request",{requestId:r.id,listingId:"flowers",fee:0,appliedRate:0,sourceConfirmed:true});assert.equal(f.s.orders.length,0);const request=f.s.mealRequests![0];
 assert.throws(()=>call("student","order",{quoteId:request.quoteId}),/đồng ý báo giá/);
 call("student","accept_meal_request",{requestId:r.id,revision:request.revision});assert.equal(f.s.orders.length,1);assert.equal(f.s.orders[0].status,"awaiting_payment");assert.equal(f.s.payments.length,0);
});
