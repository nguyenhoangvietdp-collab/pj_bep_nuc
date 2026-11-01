import test from "node:test";
import assert from "node:assert/strict";
import {createEdgeHandler} from "../lib/edge-api";
import {modernDemoState,type State} from "../lib/domain";
const now=Date.parse("2026-11-02T18:30:00+07:00");
function setup(){
 let state=modernDemoState(now);state.shops[0]={...state.shops[0],mock:false,signed:true,recurring:true};
 for(const id of ["shop2","shop3"]){state.shops.push({...state.shops[0],id});state.listings.push({...state.listings[0],id:"meal-"+id,shopId:id});}
 let routes=0;const froms:{lat:number;lng:number}[]=[];
 const handler=createEdgeHandler({config:{origin:"https://bep.test",acceptingOrders:true,policy:{production:true,pilotEnabled:true,bankReady:true}},now:()=>now,authenticate:async token=>({id:token}),routeDistance:async from=>{routes++;froms.push(from);return 2.5;},transaction:async fn=>{const next=structuredClone(state);const result=fn(next);state=next;return result;}});
 async function send(action:string,args:any={},user="student"){const r=await handler(new Request("https://bep.test/pilot",{method:"POST",headers:{origin:"https://bep.test",authorization:"Bearer "+user,"Content-Type":"application/json"},body:JSON.stringify({action,args:{key:crypto.randomUUID(),...args}})}));return {status:r.status,body:await r.json()};}
 return {send,get:()=>state,routes:()=>routes,froms,handler};
}
test("Edge calculates support from stored place, ignoring client coordinates or distance",async()=>{
 const f=setup();assert.equal((await f.send("save_place",{label:"Nhà",address:"Hồ Hoàn Kiếm, Hà Nội",lat:21.0285,lng:105.8542})).status,200);
 const q=await f.send("quote",{listingId:"meal",qty:1,location:{lat:0,lng:0},distance:999});assert.equal(q.status,200);assert.equal(q.body.bonusDiscount,2000);assert.equal(q.body.total,48000);assert.equal(f.routes(),1);assert.equal(f.froms[0].lat,21.0285);
});
test("Edge rejects unapproved funding and rolls back rejected discount holds",async()=>{
 const f=setup();const first=await f.send("configure_trading",{rules:f.get().tradingRules,fundingConfirmed:false,note:"Không có vốn"},"ops");assert.equal(first.status,400);
 const before=f.get().listings[0].stock;const q=await f.send("quote",{listingId:"meal",qty:1,voucherId:"invented"});assert.equal(q.status,400);assert.equal(f.get().listings[0].stock,before);assert.equal(f.get().quotes.length,0);
});
test("Edge never returns another student's saved place or issue records",async()=>{
 const f=setup();await f.send("save_place",{label:"Nhà",address:"Hồ Hoàn Kiếm, Hà Nội",lat:21.0285,lng:105.8542});
 const r=await f.handler(new Request("https://bep.test/pilot",{headers:{origin:"https://bep.test",authorization:"Bearer other"}}));const d=await r.json();assert.equal(d.user.place,undefined);assert.equal(JSON.stringify(d).includes("105.8542"),false);
});
