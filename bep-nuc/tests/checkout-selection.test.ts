import test from "node:test";
import assert from "node:assert/strict";
import {checkoutSelection,selectionKey,receivingReady,validateCheckoutSelection} from "../lib/checkout-selection";
import {act,tradingDemoState,previewReceiving,publicQuote} from "../lib/domain";
const now=Date.parse("2026-11-03T18:30:00+07:00");
function setup(){const s=tradingDemoState(now),u=s.users[0],l=s.listings[0];u.place={id:"confirmed-place",label:"Nhà",address:"Địa chỉ kiểm thử Hà Nội",lat:21.02,lng:105.82,savedAt:now};l.floor=30000;l.cost=3000;l.margin=1000;const call=(action:string,args:any={})=>act(s,u,action,{key:crypto.randomUUID(),...args},now,null,{production:false,pilotEnabled:false,bankReady:false}) as any;return {s,u,l,call};}
test("voucher prerequisites bind receiving method and actual selected address, including delivery contact",()=>{
 const {u}=setup(),p=u.place!,contact={recipient:"Khách thử",phone:"0912 345 678",address:p.address+", phòng 2"};
 assert.equal(receivingReady(undefined,"pickup"),false);assert.equal(receivingReady(p,"delivery"),false);assert.equal(receivingReady(p,"delivery",contact),true);
 assert.equal(receivingReady(p,"delivery",{...contact,address:"Địa chỉ khác chưa chọn"}),false);
 const pick=checkoutSelection(p,"pickup")!,ship=checkoutSelection(p,"delivery",contact)!;assert.notEqual(selectionKey(pick),selectionKey(ship));assert.equal(ship.delivery!.phone,"0912345678");assert.throws(()=>validateCheckoutSelection(pick,p,"delivery",contact),/Xác nhận lại/);
});
test("production inquiry refuses missing or stale address confirmation before saving any request",()=>{
 const f=setup();f.u.approved=false;const args={name:"Nhu cầu kiểm thử",qty:1,rate:9000,fulfillment:"pickup",key:crypto.randomUUID()};const policy={production:true,pilotEnabled:false,bankReady:false};
 assert.throws(()=>act(f.s,f.u,"meal_request",args,now,null,policy),/Xác nhận lại/);assert.equal(f.s.mealRequests?.length??0,0);
 const selected=checkoutSelection(f.u.place,"pickup")!;assert.throws(()=>act(f.s,f.u,"meal_request",{...args,checkout:{...selected,placeId:"stale"}},now,null,policy),/Xác nhận lại/);
 act(f.s,f.u,"meal_request",{...args,checkout:selected},now,null,policy);assert.equal(f.s.mealRequests![0].checkoutSelection!.placeId,f.u.place!.id);assert.equal(f.s.orders.length,0);assert.equal(f.s.quotes.length,0);assert.equal(f.s.vouchers.length,0);
});
test("server never accepts a forged receiving method or shipping address in a pickup preview",()=>{
 const f=setup();f.s.shops[0].mock=false;
 assert.throws(()=>previewReceiving(f.s,f.u,{listingId:f.l.id,qty:1,rate:0},now,2.5,true),/Xác nhận lại/);
 assert.throws(()=>previewReceiving(f.s,f.u,{listingId:f.l.id,qty:1,rate:0,checkout:{...checkoutSelection(f.u.place,"pickup"),fulfillment:"delivery"}},now,2.5,true),/Xác nhận lại/);assert.equal(f.s.quotes.length,0);
});
test("changing address after an inquiry blocks its quotation before reservation",()=>{
 const f=setup(),r=f.call("meal_request",{name:"Nhu cầu kiểm thử",qty:1,rate:0,fulfillment:"pickup",checkout:checkoutSelection(f.u.place,"pickup")});
 f.u.place={...f.u.place!,id:"another-place"};const ops=f.s.users.find(x=>x.role==="ops")!;
 assert.throws(()=>act(f.s,ops,"confirm_meal_request",{key:crypto.randomUUID(),requestId:r.id,listingId:f.l.id,fee:0,sourceConfirmed:true},now),/Xác nhận lại/);assert.equal(f.s.quotes.length,0);
});
test("delivery confirmation remains snapshotted and cannot be changed while creating the order",()=>{
 const f=setup(),contact={recipient:"Khách thử",phone:"0912345678",address:f.u.place!.address};
 const q=f.call("quote",{listingId:f.l.id,qty:1,fulfillment:"delivery",delivery:contact,checkout:checkoutSelection(f.u.place,"delivery",contact)});
 assert.equal(publicQuote(f.s,f.s.quotes[0]).checkoutSelection!.delivery!.address,contact.address);
 assert.throws(()=>f.call("order",{quoteId:q.id,delivery:{...contact,address:"Địa chỉ bị sửa trái phép"}}),/Xác nhận lại/);assert.equal(f.s.orders.length,0);
 const o=f.call("order",{quoteId:q.id,delivery:contact});assert.equal(f.s.orders[0].id,o.id);assert.equal(f.s.orders[0].status,"awaiting_delivery_fee");assert.equal(f.s.payments.length,0);assert.ok(!JSON.stringify(f.s.audit).includes(contact.phone));
});

test("confirmed delivery inquiry normalizes phone formatting consistently with its snapshot",()=>{const f=setup(),delivery={recipient:"Khách thử",phone:"0912 345 678",address:f.u.place!.address};f.call("meal_request",{name:"Nhu cầu kiểm thử",qty:1,rate:0,fulfillment:"delivery",delivery,checkout:checkoutSelection(f.u.place,"delivery",delivery)});assert.equal(f.s.mealRequests![0].delivery!.phone,"0912345678");assert.equal(f.s.mealRequests![0].checkoutSelection!.delivery!.phone,"0912345678");});
