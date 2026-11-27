import test from "node:test";
import assert from "node:assert/strict";
import {act,tradingDemoState,previewReceiving} from "../lib/domain";
import {createEdgeHandler} from "../lib/edge-api";
import {checkoutSelection} from "../lib/checkout-selection";
const now=Date.parse("2026-11-03T18:30:00+07:00");
function setup(){
 const s=tradingDemoState(now),u=s.users[0],l=s.listings[0];u.approved=false;
 u.place={id:"place",label:"Nhà",address:"Địa chỉ kiểm thử tại Hà Nội",lat:21,lng:105.8,savedAt:now};
 l.floor=30000;l.cost=3000;l.margin=1000;l.price=50000;
 return {s,u,l,preview:(rate=0,distance:number|null=2.5)=>previewReceiving(s,u,{listingId:l.id,qty:1,rate},now,distance,false)};
}
test("pending account preview uses authoritative support without creating financial commitments",()=>{
 const f=setup(),before=structuredClone(f.s),p=f.preview();assert.equal(p.amounts.bonusDiscount,2500);assert.equal(p.amounts.total,47500);assert.equal(p.pickupStatus,"calculated");assert.deepEqual(f.s,before);assert.equal((p as any).id,undefined);assert.equal((p as any).payout,undefined);
 const args={key:crypto.randomUUID(),listingId:f.l.id,qty:1};
 for(const action of ["quote","order","accept_meal_request","payment"])assert.throws(()=>act(f.s,f.u,action,args,now),/chưa được duyệt/);
});
test("pickup stacks with a basic voucher and needs no coordinates",()=>{
 const f=setup();let p=f.preview(.15);assert.equal(p.amounts.voucherDiscount,7500);assert.equal(p.amounts.bonusDiscount,2500);assert.equal(p.pickupStatus,"calculated");
 p=f.preview(9000);assert.equal(p.amounts.total,38500);assert.equal(p.amounts.bonusDiscount,2500);assert.equal(p.pickupPricing!.limited,false);
 f.s.shops[0].lat=null;p=f.preview(0,null);assert.equal(p.pickupStatus,"calculated");assert.equal(p.amounts.bonusDiscount,2500);
 f.s.shops[0].lat=21.0285;f.s.tradingRules!.enabled=false;p=f.preview();assert.equal(p.pickupStatus,"disabled");assert.equal(p.amounts.total,50000);assert.throws(()=>f.preview(.15),/chưa được kích hoạt/);
});
test("preview rejects insufficient budget, margin, unavailable lots and altered prices",()=>{
 const f=setup();f.s.tradingRules!.weeklyBudget=1;assert.equal(f.preview().amounts.bonusDiscount,1);assert.equal(f.s.quotes.length,0);
 f.s.tradingRules!.weeklyBudget=500000;f.l.floor=47000;assert.throws(()=>f.preview(),/ngân sách/);f.l.floor=30000;
 f.l.stock=0;assert.throws(()=>f.preview(),/tồn/);f.l.stock=3;
 f.l.negotiatedDiscountPercent=30;assert.throws(()=>f.preview(),/giảm nền5%/);
 f.l.end=now-1;assert.throws(()=>f.preview(),/không còn/);
});
test("additive pickup voucher cannot spend merchant payout or an unfunded combined budget",()=>{
 const f=setup();f.l.floor=38000;assert.equal(f.preview(.15).amounts.bonusDiscount,500);assert.equal(f.preview(.15).amounts.total,42000);assert.equal(f.s.quotes.length,0);f.l.floor=30000;f.s.tradingRules!.weeklyBudget=8500;assert.equal(f.preview(.15).amounts.bonusDiscount,1000);assert.equal(f.preview(.15).amounts.total,41500);assert.equal(f.s.quotes.length,0);assert.equal(f.s.orders.length,0);assert.equal(f.s.vouchers.length,0);
});
test("pending customers can save their place without opening checkout permissions",()=>{
 const f=setup();act(f.s,f.u,"save_place",{key:crypto.randomUUID(),label:"Điểm mới",address:"Địa chỉ mới thử tại Hà Nội",lat:21.02,lng:105.82},now);assert.equal(f.u.place!.label,"Điểm mới");assert.equal(f.u.approved,false);assert.equal(f.s.vouchers.length,0);
});
test("Edge preview accepts pending identity during paused pilot, derives aerial distance from saved coordinates without road provider, and reserves nothing",async()=>{
 const f=setup();f.s.shops[0].mock=false;let origin:any,calls=0;
 const handler=createEdgeHandler({config:{origin:"https://test.example",policy:{production:true,pilotEnabled:false,bankReady:false},acceptingOrders:false},authenticate:async()=>({id:f.u.id}),transaction:async fn=>fn(f.s),now:()=>now,routeDistance:async from=>{origin=from;calls++;return 2.5;}});
 async function request(action:string,args:any={}){const r=await handler(new Request("https://edge/pilot",{method:"POST",headers:{origin:"https://test.example",authorization:"Bearer test"},body:JSON.stringify({action,args:{listingId:f.l.id,qty:1,rate:0,checkout:checkoutSelection(f.u.place,"pickup"),key:crypto.randomUUID(),...args}})}));return {status:r.status,data:await r.json()};}
 const p=await request("preview_receiving",{location:{lat:0,lng:0},price:1,distance:999});assert.equal(p.status,200);assert.equal(p.data.amounts.total,47500);assert.ok(p.data.distance>2&&p.data.distance<10);assert.equal(p.data.pickupPricing.method,"fixed");assert.equal(calls,0);assert.equal(f.s.quotes.length,0);assert.equal(f.s.orders.length,0);assert.equal(f.s.vouchers.length,0);assert.equal((await request("quote")).status,409);
 const get=await handler(new Request("https://edge/pilot",{headers:{authorization:"Bearer test"}}));const data=await get.json();assert.equal(data.tradingRules.weeklyBudget,undefined);assert.equal(data.tradingRules.pickupBands.length,3);
 assert.equal((await request("save_place",{label:"Điểm mới",address:"Địa chỉ mới thử tại Hà Nội",lat:21.03,lng:105.83})).status,200);assert.equal(f.u.approved,false);assert.equal(f.u.place!.label,"Điểm mới");
 f.s.shops[0].mock=true;assert.equal((await request("preview_receiving")).status,400);assert.equal(calls,0);
});
