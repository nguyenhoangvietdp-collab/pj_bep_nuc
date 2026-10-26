import test from "node:test";
import assert from "node:assert/strict";
import { createEdgeHandler, type EdgeConfig } from "../lib/edge-api";
import { demoState, expire, issue, type State } from "../lib/domain";
import { validatePublicConfig } from "../lib/public-config";
import { safeAppPath } from "../lib/app-navigation";
const now=Date.parse("2026-10-27T18:30:00+07:00");
function setup(overrides:Partial<EdgeConfig>={}){
 let state=demoState(now),queue=Promise.resolve();
 state.shops[0]={...state.shops[0],mock:false,signed:true,recurring:true};
 for(const id of ["two","three"]){state.shops.push({...state.shops[0],id});state.listings.push({...state.listings[0],id:"meal-"+id,shopId:id});}
 issue(state,state.users[0],now);
 const config:EdgeConfig={origin:"https://bep-nuc.pages.dev",policy:{production:true,pilotEnabled:true,bankReady:true},bank:{name:"Test bank",account:"TEST-ONLY",holder:"Test"},acceptingOrders:true,...overrides};
 const handler=createEdgeHandler({config,now:()=>now,authenticate:async token=>state.users.some(u=>u.id===token)?{id:token}:token==="new-user"?{id:"new-user",email:"new@example.test"}:null,transaction:fn=>{
  const result=queue.then(()=>{const next=structuredClone(state);expire(next,now);const result=fn(next);state=next;return result;});queue=result.then(()=>{},()=>{});return result;
 }});
 async function request(route:string,token?:string,body?:unknown,origin:string|undefined=config.origin){
  const headers:Record<string,string>={};if(origin)headers.origin=origin;if(token)headers.authorization="Bearer "+token;
  if(body!==undefined)headers["content-type"]="application/json";
  const res=await handler(new Request("https://project.supabase.co/functions/v1/bep-nuc/"+route,{method:body===undefined?"GET":"POST",headers,body:body===undefined?undefined:JSON.stringify(body)}));
  return {status:res.status,data:await res.json(),res};
 }
 return {request,handler,getState:()=>state,setState:(value:State)=>state=value};
}
test("Edge API has anonymous catalogue, verified identity and role-scoped financial data",async()=>{
 const f=setup();const catalogue=await f.request("catalogue");assert.equal(catalogue.status,200);assert.equal(catalogue.data.demo,false);
 assert.equal(catalogue.data.pilotOpen,true);assert.ok(!("floor" in catalogue.data.listings[0]));
 assert.equal((await f.request("pilot")).status,401);assert.equal((await f.request("pilot","invalid")).status,401);
 assert.equal((await f.request("export","student")).status,403);
 const pending=await f.request("auth","new-user");assert.equal(pending.data.user.role,"student");assert.equal(pending.data.user.approved,false);
 assert.equal((await f.request("pilot","new-user")).status,403);
 const merchant=await f.request("pilot","merchant");assert.ok(merchant.data.listings.every((l:any)=>l.shopId===f.getState().users.find(u=>u.id==="merchant")!.shopId));
});
test("Edge API preserves server prices, voucher reservation, payment/pickup idempotency and export privacy",async()=>{
 const f=setup();const voucherId=f.getState().vouchers.find(v=>v.userId==="student"&&v.rate===.2)!.id;
 const quote=await f.request("pilot","student",{action:"quote",args:{listingId:"meal",qty:1,voucherId,price:1,key:"edge-quote-key"}});assert.equal(quote.status,200);assert.equal(f.getState().quotes[0].price,38000);
 const q=f.getState().quotes[0];
 const order=await f.request("pilot","student",{action:"order",args:{quoteId:q.id,key:"edge-order-key"}});assert.equal(order.status,200);
 const replay=await f.request("pilot","student",{action:"order",args:{quoteId:q.id,key:"edge-order-key"}});assert.equal(replay.data.id,order.data.id);assert.equal(f.getState().orders.length,1);
 assert.equal((await f.request("pilot","student",{action:"payment",args:{orderId:order.data.id,amount:q.price,receivedAt:now,reference:"TEST-REF",key:"edge-pay-key"}})).status,400);
 const payment={action:"payment",args:{orderId:order.data.id,amount:q.price,receivedAt:now,reference:"TEST-REF",key:"edge-pay-key"}};
 assert.equal((await f.request("pilot","ops",payment)).status,200);assert.equal((await f.request("pilot","ops",payment)).status,200);assert.equal(f.getState().payments.length,1);
 const mine=await f.request("pilot","student");const code=mine.data.orders[0].code;assert.ok(code);
 const exported=await f.request("export","ops");assert.ok(!("code" in exported.data.orders[0]));assert.ok(!("requests" in exported.data));
 const pickup={action:"pickup",args:{orderId:order.data.id,code,key:"edge-pickup-key"}};assert.equal((await f.request("pilot","merchant",pickup)).status,200);assert.equal((await f.request("pilot","merchant",pickup)).status,200);
 assert.equal(f.getState().orders[0].status,"picked_up");
});
test("Edge API never enables real ordering from missing evidence or a paused pilot",async()=>{
 const f=setup();f.getState().shops[0].signed=false;
 const voucherId=f.getState().vouchers.find(v=>v.userId==="student"&&v.rate===.2)!.id;
 assert.equal((await f.request("catalogue")).data.pilotOpen,false);
 assert.equal((await f.request("pilot","student",{action:"quote",args:{listingId:"meal",qty:1,voucherId,key:"closed-quote"}})).status,400);
 const paused=setup({acceptingOrders:false});assert.equal((await paused.request("pilot","student",{action:"quote",args:{key:"paused-quote"}})).status,409);
 assert.equal((await paused.request("pilot","ops")).status,200);
 assert.equal((await paused.request("pilot","student")).data.bank.account,"TEST-ONLY");
});
test("Edge API rejects unwanted origins and malformed writes without exposing infrastructure errors",async()=>{
 const f=setup();const denied=await f.request("pilot","ops",{},"https://other.pages.dev");assert.equal(denied.status,403);assert.equal(denied.res.headers.get("access-control-allow-origin"),null);
 const preflight=await f.handler(new Request("https://project.supabase.co/functions/v1/bep-nuc/pilot",{method:"OPTIONS",headers:{origin:"https://bep-nuc.pages.dev"}}));assert.equal(preflight.status,204);
 assert.equal((await f.request("pilot","ops",{action:"stock",args:[]})).status,400);
 const broken=createEdgeHandler({config:{origin:"https://app.pages.dev",policy:{production:true,pilotEnabled:false,bankReady:false},acceptingOrders:false},authenticate:async()=>null,transaction:async()=>{throw new Error("password=private database secret");}});
 const result=await broken(new Request("https://api.invalid/catalogue"));assert.equal(result.status,503);assert.ok(!(await result.text()).includes("private"));
});
test("Public config rejects privileged keys and navigation cannot leave the application",()=>{
 assert.equal(validatePublicConfig(undefined,undefined),false);
 assert.equal(validatePublicConfig("https://project.supabase.co","sb_publishable_test"),true);
 assert.throws(()=>validatePublicConfig("https://project.supabase.co","sb_secret_test"));
 const jwt=(role:string)=>"x."+Buffer.from(JSON.stringify({role})).toString("base64url")+".x";
 assert.throws(()=>validatePublicConfig("https://project.supabase.co",jwt("service_role")));
 assert.equal(validatePublicConfig("https://project.supabase.co",jwt("anon")),true);
 for(const path of ["//evil.test","https://evil.test","/orders/../../evil","/\\evil.test","/internal\n","//["])assert.equal(safeAppPath(path),"/meals");
 assert.equal(safeAppPath("/orders/123"),"/orders/123");
});
