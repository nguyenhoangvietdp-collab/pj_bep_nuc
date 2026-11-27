import {checkoutSelection} from "../lib/checkout-selection";
import test from "node:test";
import assert from "node:assert/strict";
import {createEdgeHandler} from "../lib/edge-api";
import {tradingDemoState as modernDemoState,type State} from "../lib/domain";
const now=Date.parse("2026-11-02T18:30:00+07:00");
function setup(){
 let state=modernDemoState(now);state.shops[0]={...state.shops[0],mock:false,signed:true,recurring:true};
 for(const id of ["shop2","shop3"]){state.shops.push({...state.shops[0],id});state.listings.push({...state.listings[0],id:"meal-"+id,shopId:id});}
 let routes=0;const froms:{lat:number;lng:number}[]=[];
 const handler=createEdgeHandler({config:{origin:"https://bep.test",acceptingOrders:true,policy:{production:true,pilotEnabled:true,bankReady:true}},now:()=>now,authenticate:async token=>({id:token}),routeDistance:async from=>{routes++;froms.push(from);return 2.5;},transaction:async fn=>{const next=structuredClone(state);const result=fn(next);state=next;return result;}});
 async function send(action:string,args:any={},user="student"){const r=await handler(new Request("https://bep.test/pilot",{method:"POST",headers:{origin:"https://bep.test",authorization:"Bearer "+user,"Content-Type":"application/json"},body:JSON.stringify({action,args:{key:crypto.randomUUID(),...args}})}));return {status:r.status,body:await r.json()};}
 return {send,get:()=>state,routes:()=>routes,froms,handler};
}
test("Edge applies the fixed pickup bonus and ignores client coordinates and distance",async()=>{
 const f=setup();assert.equal((await f.send("save_place",{label:"Nhà",address:"Địa chỉ kiểm thử Hà Nội",lat:21.0485,lng:105.8542})).status,200);
 const q=await f.send("quote",{listingId:"meal",qty:1,location:{lat:0,lng:0},distance:999,checkout:checkoutSelection(f.get().users[0].place,"pickup")});assert.equal(q.status,200);assert.equal(q.body.bonusDiscount,2500);assert.equal(q.body.total,47500);assert.equal(f.routes(),0);assert.equal(q.body.pickupPricing.method,"fixed");assert.ok(q.body.distance>2);
});
test("base weekly vouchers are available before the customer saves an address",async()=>{
 const f=setup();const r=await f.handler(new Request("https://bep.test/pilot",{headers:{origin:"https://bep.test",authorization:"Bearer student"}}));const data=await r.json();assert.equal(r.status,200);assert.equal(data.user.place,undefined);assert.equal(data.vouchers.filter((v:any)=>v.rate===.15).length,2);assert.equal(data.vouchers.filter((v:any)=>v.rate===.1).length,2);assert.equal(data.vouchers.filter((v:any)=>v.amount===9000).length,4);assert.equal(f.get().quotes.length,0);
});
test("Edge rejects unapproved funding and rolls back rejected discount holds",async()=>{
 const f=setup();const first=await f.send("configure_trading",{rules:f.get().tradingRules,fundingConfirmed:false,note:"Không có vốn"},"ops");assert.equal(first.status,400);
 const before=f.get().listings[0].stock;const q=await f.send("quote",{listingId:"meal",qty:1,voucherId:"invented"});assert.equal(q.status,400);assert.equal(f.get().listings[0].stock,before);assert.equal(f.get().quotes.length,0);
});
test("Edge never returns another student's saved place or issue records",async()=>{
 const f=setup();await f.send("save_place",{label:"Nhà",address:"Địa chỉ kiểm thử Hà Nội",lat:21.0485,lng:105.8542});
 const r=await f.handler(new Request("https://bep.test/pilot",{headers:{origin:"https://bep.test",authorization:"Bearer other"}}));const d=await r.json();assert.equal(d.user.place,undefined);assert.equal(JSON.stringify(d).includes("105.8542"),false);
});

test("operator quote adds the fixed pickup voucher to base voucher even when shipping stacking is off",async()=>{
 const f=setup();f.get().listings[0].floor=30000;
 await f.send("save_place",{label:"Nhà khách",address:"Địa chỉ kiểm thử Hà Nội",lat:21.0485,lng:105.8542});
 const r=await f.send("meal_request",{name:"Nhu cầu thử nghiệm",qty:1,rate:9000,fulfillment:"pickup",checkout:checkoutSelection(f.get().users[0].place,"pickup")});assert.equal(r.status,200);
 const q=await f.send("confirm_meal_request",{requestId:r.body.id,listingId:"meal",fee:0,appliedRate:9000,sourceConfirmed:true},"ops");assert.equal(q.status,200,JSON.stringify(q.body));
 const saved=f.get().quotes[0];assert.equal(saved.promotion!.voucher,9000);assert.equal(saved.promotion!.pickup,2500);assert.equal(saved.price,38500);assert.equal(saved.payout,30000);assert.equal(f.get().tradingRules!.stackReceiving,false);assert.equal(f.routes(),0);assert.equal(saved.pickupPricingSnapshot!.nominal,2500);assert.equal(saved.pickupPricingSnapshot!.limited,false);assert.equal(f.get().orders.length,0);
});
