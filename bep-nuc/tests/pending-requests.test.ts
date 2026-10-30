import test from "node:test";
import assert from "node:assert/strict";
import {createEdgeHandler} from "../lib/edge-api";
import {demoState,act} from "../lib/domain";
test("pending account may send/read own requests but cannot reserve, pay or read others",async()=>{
 const now=Date.parse("2026-10-27T18:30:00+07:00"),s=demoState(now);s.users[0].approved=false;
 s.users.push({id:"other-student",name:"Other",role:"student",approved:false});
 const handler=createEdgeHandler({config:{origin:"https://bep-nuc.pages.dev",policy:{production:true,pilotEnabled:false,bankReady:true},acceptingOrders:false,bank:{name:"Bank",account:"PRIVATE",holder:"Owner"}},now:()=>now,authenticate:async id=>({id,emailVerified:true}),transaction:async fn=>fn(s)});
 const req=async(user:string,action?:string,args:any={})=>{const res=await handler(new Request("https://api.test/pilot",{method:action?"POST":"GET",headers:{authorization:"Bearer "+user,origin:"https://bep-nuc.pages.dev","Content-Type":"application/json"},body:action?JSON.stringify({action,args:{key:crypto.randomUUID(),...args}}):undefined}));return {status:res.status,data:await res.json()};};
 const stock=s.listings[0].stock;
 assert.equal((await req("student","meal_request",{name:"Bún riêu",qty:2,rate:0.1,fulfillment:"pickup"})).status,200);
 const own=await req("student");assert.equal(own.status,200);assert.equal(own.data.user.approved,false);assert.equal(own.data.mealRequests.length,1);assert.equal(own.data.bank,undefined);assert.deepEqual(own.data.vouchers,[]);assert.equal((await req("other-student")).data.mealRequests.length,0);
 for(const action of ["quote","order","accept_meal_request","payment","approve","confirm_meal_request"]){assert.ok((await req("student",action)).status>=400);}
 assert.equal(s.listings[0].stock,stock);assert.equal(s.orders.length,0);
 assert.throws(()=>act(s,s.users[0],"order",{key:"direct-attempt"},now),/chưa được duyệt/);
});
