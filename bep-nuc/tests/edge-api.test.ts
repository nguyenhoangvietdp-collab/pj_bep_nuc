import test from "node:test";
import assert from "node:assert/strict";
import { createEdgeHandler, type EdgeConfig, type EdgeDependencies } from "../lib/edge-api";
import { demoState, expire, issue, type State } from "../lib/domain";
import { validatePublicConfig } from "../lib/public-config";
import { safeAppPath } from "../lib/app-navigation";
const now=Date.parse("2026-10-27T18:30:00+07:00");
test("absent or blank bootstrap configuration never grants operator access",async()=>{
 for(const bootstrapOpsEmail of [undefined,""," "]){
  const s=demoState(now);s.users=s.users.filter(u=>u.role!=="ops");
  const handler=createEdgeHandler({config:{origin:"https://bep-nuc.pages.dev",policy:{production:true,pilotEnabled:false,bankReady:false},acceptingOrders:false,bootstrapOpsEmail},authenticate:async()=>({id:"verified-without-email",emailVerified:true}),transaction:async fn=>fn(s),now:()=>now});
  const response=await handler(new Request("https://test/auth",{headers:{authorization:"Bearer test"}}));
  assert.equal((await response.json()).user.role,"student");
  assert.equal(s.audit.filter(a=>a.action==="bootstrap_ops").length,0);
 }
});
test("initial operator bootstrap requires verified configured email and cannot override an existing operator",async()=>{
 const s=demoState(now); s.users=s.users.filter(u=>u.role!=="ops");
 const handler=createEdgeHandler({config:{origin:"https://bep-nuc.pages.dev",policy:{production:true,pilotEnabled:false,bankReady:false},acceptingOrders:false,bootstrapOpsEmail:"owner@example.test"},authenticate:async token=>({id:token,email:token==="other"?"other@example.test":"owner@example.test",emailVerified:token!=="unverified"}),transaction:async fn=>fn(s),now:()=>now});
 async function auth(token:string){const r=await handler(new Request("https://test/auth",{headers:{authorization:`Bearer ${token}`}}));return (await r.json()).user;}
 assert.equal((await auth("unverified")).role,"student");
 assert.equal((await auth("other")).role,"student");
 assert.equal((await auth("owner")).role,"ops");
 assert.equal((await auth("owner")).approved,true);
 assert.equal((await auth("another-id")).role,"student");
 assert.equal(s.audit.filter(a=>a.action==="bootstrap_ops").length,1);
});
function setup(overrides:Partial<EdgeConfig>={},geocode?:EdgeDependencies["geocode"],clock=()=>now){
 let state=demoState(now),queue=Promise.resolve();
 state.shops[0]={...state.shops[0],mock:false,signed:true,recurring:true};
 for(const id of ["two","three"]){state.shops.push({...state.shops[0],id});state.listings.push({...state.listings[0],id:"meal-"+id,shopId:id});}
 issue(state,state.users[0],now);
 const config:EdgeConfig={origin:"https://bep-nuc.pages.dev",policy:{production:true,pilotEnabled:true,bankReady:true},bank:{name:"Test bank",account:"TEST-ONLY",holder:"Test"},acceptingOrders:true,...overrides};
 const handler=createEdgeHandler({config,geocode,now:clock,authenticate:async token=>state.users.some(u=>u.id===token)?{id:token}:token==="new-user"?{id:"new-user",email:"new@example.test"}:null,transaction:fn=>{
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
 assert.equal((await paused.request("pilot","student")).data.bank,undefined);
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

test("address lookup has a durable shared daily cap and stores no address or coordinates", async () => {
 let calls=0;
 let tick=now; const f=setup({},async () => { calls++; return [{address:"Địa chỉ được chọn",lat:21.01,lng:105.82,approximate:true}]; },()=>tick);
 const results=[]; for(let i=0;i<25;i++){tick+=1500;results.push(await f.request("geocode",undefined,{address:"Nhà riêng không lưu"}));}
 assert.equal(results.filter(r=>r.status===200).length,20);
 assert.equal(results.filter(r=>r.status===429).length,5);
 assert.equal(calls,20);
 assert.equal(f.getState().geocodingUsage?.count,20);
 assert.ok(!JSON.stringify(f.getState()).includes("Nhà riêng không lưu"));
 f.getState().geocodingUsage={day:"2026-10-26",count:20};
 assert.equal((await f.request("geocode",undefined,{address:"Nhà riêng không lưu"})).status,200);
 assert.equal(f.getState().geocodingUsage?.count,1);
});

test("address lookup refuses absent configuration, unwanted origins and malformed requests before billing",async()=>{
 assert.equal((await setup().request("geocode",undefined,{address:"Địa chỉ nhà riêng"})).status,503);
 let calls=0;
 const f=setup({},async()=>{calls++; throw new Error("secret-upstream-error");});
 assert.equal((await f.request("geocode",undefined,{address:"abc"})).status,400);
 assert.equal((await f.request("geocode",undefined,{address:"Địa chỉ nhà riêng"},"https://evil.test")).status,403);
 assert.equal((await f.handler(new Request("https://test/geocode",{method:"POST",body:JSON.stringify({address:"Địa chỉ nhà riêng"})}))).status,403);
 assert.equal((await f.request("geocode",undefined,{address:"a".repeat(3000)})).status,413);
 assert.equal(calls,0);
 const failed=await f.request("geocode",undefined,{address:"Địa chỉ nhà riêng"});
 assert.equal(failed.status,503);assert.ok(!JSON.stringify(failed.data).includes("secret-upstream-error"));
 assert.equal(f.getState().geocodingUsage?.count,1);
});

test("simultaneous address lookups cannot bypass the shared cooldown", async()=>{
 let calls=0;
 const f=setup({},async()=>{calls++;return [{address:"Tây Sơn",lat:21.01,lng:105.82,approximate:true}];});
 const responses=await Promise.all(Array.from({length:10},()=>f.request("geocode",undefined,{address:"Đường Tây Sơn Hà Nội"})));
 assert.equal(responses.filter(r=>r.status===200).length,1);
 assert.equal(responses.filter(r=>r.status===429).length,9);
 assert.equal(calls,1);
});

test("shipping API keeps contacts private and rejects stale or other-customer fee consent",async()=>{
 const f=setup();
 f.getState().users.push({id:"another-student",name:"Another",role:"student",approved:true});
 const voucher=f.getState().vouchers.find(v=>v.userId==="student"&&v.rate===0.2)!;
 const send=(token:string,action:string,args:any)=>f.request("pilot",token,{action,args:{...args,key:crypto.randomUUID()}});
 const quoted=await send("student","quote",{listingId:"meal",voucherId:voucher.id,qty:1,fulfillment:"delivery",location:{lat:0,lng:0}});assert.equal(quoted.status,200);assert.equal(quoted.data.bonusDiscount,0);
 const created=await send("student","order",{quoteId:quoted.data.id,delivery:{recipient:"Test Receiver",phone:"0901234567",address:"PRIVATE ADDRESS HANOI"}});assert.equal(created.status,200);
 assert.equal((await send("merchant","delivery_fee",{orderId:created.data.id,fee:10000})).status,400);
 await send("ops","delivery_fee",{orderId:created.data.id,fee:10000});
 assert.equal((await send("another-student","accept_delivery_fee",{orderId:created.data.id,revision:1})).status,400);
 await Promise.all([send("ops","delivery_fee",{orderId:created.data.id,fee:12000}),send("student","accept_delivery_fee",{orderId:created.data.id,revision:1})]);
 const order=f.getState().orders[0];
 assert.ok(order.status==="awaiting_delivery_fee" || order.delivery?.fee===10000);
 if(order.status==="awaiting_delivery_fee")assert.equal((await send("student","accept_delivery_fee",{orderId:order.id,revision:order.delivery!.revision})).status,200);
 const student=(await f.request("pilot","student")).data;
 assert.equal(student.orders[0].total,student.orders[0].foodTotal+student.orders[0].deliveryFee);
 assert.ok(!JSON.stringify((await f.request("pilot","merchant")).data).includes("PRIVATE ADDRESS HANOI"));
 assert.ok(!JSON.stringify((await f.request("pilot","another-student")).data).includes("PRIVATE ADDRESS HANOI"));
 assert.ok(!JSON.stringify(f.getState().audit).includes("PRIVATE ADDRESS HANOI"));
});
