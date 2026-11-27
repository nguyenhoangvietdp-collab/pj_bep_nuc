import test from "node:test";
import assert from "node:assert/strict";
import {act,catalogue,tradingDemoState} from "../lib/domain";
import {createEdgeHandler} from "../lib/edge-api";
import {checkoutSelection} from "../lib/checkout-selection";

test("every authenticated role can save their own location and preview during paused pilot",async()=>{
 for(const role of ["student","merchant","ops"] as const)for(const approved of [false,true]){
  const now=Date.now(),s=tradingDemoState(now),u=s.users.find(u=>u.role===role)!;
  u.approved=approved;s.shops[0].mock=false;
  const handler=createEdgeHandler({config:{origin:"https://test.example",policy:{production:true,pilotEnabled:false,bankReady:false},acceptingOrders:false},authenticate:async()=>({id:u.id}),transaction:async fn=>fn(s),now:()=>now});
  async function request(action:string,args:Record<string,unknown>){const r=await handler(new Request("https://edge/pilot",{method:"POST",headers:{origin:"https://test.example",authorization:"Bearer account-fixture"},body:JSON.stringify({action,args:{...args,key:crypto.randomUUID()}})}));return {status:r.status,data:await r.json()};}
  const other=structuredClone(s.users.filter(x=>x.id!==u.id));
  const saved=await request("save_place",{label:"Điểm của tôi",address:"Địa chỉ kiểm thử tại Hà Nội",lat:21.03,lng:105.85});assert.equal(saved.status,200,`${role}/${approved}`);
  assert.deepEqual(s.users.filter(x=>x.id!==u.id),other);assert.equal(u.approved,approved);
  const snapshot=structuredClone(s);
  const preview=await request("preview_receiving",{listingId:s.listings[0].id,qty:1,rate:0,checkout:checkoutSelection(u.place,"pickup"),distance:999,location:{lat:0,lng:0}});
  assert.equal(preview.status,200,`${role}/${approved}`);assert.equal(preview.data.pickupPricing.method,"fixed");assert.ok(preview.data.distance>=0&&preview.data.distance<10);
  assert.deepEqual(s,snapshot);assert.equal(s.orders.length,0);assert.equal(s.quotes.length,0);
  if(!approved)assert.throws(()=>act(s,u,"order",{key:crypto.randomUUID(),quoteId:"not-issued"},now),/chưa được duyệt/);
 }
});

test("catalogue exposes only approved public store coordinates, never account locations",()=>{
 const now=Date.now(),s=tradingDemoState(now);s.shops[0].mock=false;
 s.users[0].place={id:"private",label:"Home",address:"Private address",lat:21.1,lng:105.9,savedAt:now};
 const publicData=catalogue(s,now,true);
 assert.equal(publicData.shops[0].lat,s.shops[0].lat);assert.equal(publicData.shops[0].lng,s.shops[0].lng);
 assert.ok(!JSON.stringify(publicData).includes("Private address"));
 s.shops[0].approved=false;assert.equal(catalogue(s,now,true).shops.length,0);
});
