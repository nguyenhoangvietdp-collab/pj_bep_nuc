import test from "node:test";
import assert from "node:assert/strict";
import {act,demoState,issue,view} from "../lib/domain";
const now=Date.parse("2026-10-27T18:30:00+07:00");
const policy={production:false,pilotEnabled:false,bankReady:false};
function setup(){const s=demoState(now);issue(s,s.users[0],now);const call=(role:string,action:string,args:any={},at=now)=>act(s,s.users.find(u=>u.id===role)!,action,{key:crypto.randomUUID(),...args},at,null,policy) as any;return {s,call};}
test("request does not reserve stock or spend voucher; consent creates one order",()=>{
 const {s,call}=setup(),stock=s.listings[0].stock;
 const a={key:"request-idempotent",name:"Món tham khảo",qty:1,rate:0.2,fulfillment:"pickup"};const request=call("student","meal_request",a);
 assert.deepEqual(call("student","meal_request",a),request);assert.equal(s.mealRequests!.length,1);assert.equal(s.listings[0].stock,stock);assert.equal(s.orders.length,0);
 assert.throws(()=>call("student","accept_meal_request",{requestId:request.id,revision:0}),/chưa xác nhận/);
 assert.throws(()=>call("merchant","confirm_meal_request",{requestId:request.id}),/vận hành/);
 call("ops","confirm_meal_request",{requestId:request.id,listingId:"meal",fee:0,sourceConfirmed:true});
 const r=s.mealRequests![0];assert.throws(()=>call("student","order",{quoteId:r.quoteId}),/đồng ý báo giá/);assert.equal(r.status,"confirmed");assert.equal(s.orders.length,0);
 assert.throws(()=>call("student","accept_meal_request",{requestId:r.id,revision:0}),/đã đổi/);
 const args={key:"accept-idempotent",requestId:r.id,revision:r.revision};const o=call("student","accept_meal_request",args);assert.deepEqual(call("student","accept_meal_request",args),o);assert.equal(s.orders.length,1);assert.equal(s.orders[0].status,"awaiting_payment");
});
test("delivery consent includes fee; rejection releases reservation and private data stays private",()=>{
 const {s,call}=setup();const req=call("student","meal_request",{name:"Bữa",qty:1,rate:0.2,fulfillment:"delivery",delivery:{recipient:"Khách thử",phone:"0901234567",address:"Địa chỉ thử nghiệm Hà Nội"}});
 assert.equal((view(s,s.users.find(u=>u.role==="merchant")!,now) as any).mealRequests.length,0);
 assert.ok(!JSON.stringify(s.audit).includes("Địa chỉ thử nghiệm"));
 call("ops","confirm_meal_request",{requestId:req.id,listingId:"meal",fee:15000,sourceConfirmed:true});
 const r=s.mealRequests![0];call("student","accept_meal_request",{requestId:r.id,revision:r.revision});assert.equal(s.orders[0].delivery!.fee,15000);assert.equal(s.orders[0].status,"awaiting_payment");
 const f=setup(),x=f.call("student","meal_request",{name:"Bữa",qty:1,rate:0.2,fulfillment:"pickup"});f.call("ops","confirm_meal_request",{requestId:x.id,listingId:"meal",fee:0,sourceConfirmed:true});
 assert.throws(()=>f.call("student","accept_meal_request",{requestId:x.id,revision:1},now+11*60000),/hết hạn/);
 f.call("ops","reject_meal_request",{requestId:x.id,reason:"Quán không còn món"});assert.equal(f.s.mealRequests![0].status,"rejected");assert.equal(f.s.quotes[0].state,"released");
});
