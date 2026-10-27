import test from "node:test";
import assert from "node:assert/strict";
import { act, demoState, expire, issue, ledger, view } from "../lib/domain";
const now=Date.parse("2026-10-27T18:30:00+07:00");
const contact={recipient:"Người thử",phone:"0901234567",address:"Địa chỉ kiểm thử, Đống Đa, Hà Nội"};
function setup(){const s=demoState(now);issue(s,s.users[0],now);const call=(role:string,action:string,args:any={},at=now,distance:number|null=null)=>act(s,s.users.find(u=>u.id===role)!,action,{key:crypto.randomUUID(),...args},at,distance) as any;const quote=()=>call("student","quote",{listingId:"meal",voucherId:s.vouchers.find(v=>v.rate===0.2)!.id,qty:1,fulfillment:"delivery"},now,2);const order=()=>{const q=quote(),o=call("student","order",{quoteId:q.id,delivery:contact});return {q,o};};return {s,call,quote,order};}
test("shipping needs valid contact, ignores pickup distance and waits for explicit current fee consent",()=>{
 const f=setup(),q=f.quote();assert.equal(q.rate,0.2);assert.equal(q.bonusDiscount,0);assert.equal(q.fulfillment,"delivery");
 assert.throws(()=>f.call("student","order",{quoteId:q.id}),/thông tin nhận/);
 assert.throws(()=>f.call("student","order",{quoteId:q.id,delivery:{...contact,phone:"bad"}}),/điện thoại/);
 const o=f.call("student","order",{quoteId:q.id,delivery:contact});
 assert.equal(f.s.orders[0].status,"awaiting_delivery_fee");
 assert.throws(()=>f.call("student","accept_delivery_fee",{orderId:o.id,revision:0}),/chưa được báo/);
 assert.throws(()=>f.call("merchant","delivery_fee",{orderId:o.id,fee:10000}),/vận hành/);
 f.call("ops","delivery_fee",{orderId:o.id,fee:10000});f.call("ops","delivery_fee",{orderId:o.id,fee:12000});
 assert.throws(()=>f.call("student","accept_delivery_fee",{orderId:o.id,revision:1}),/đã đổi/);
 f.call("student","accept_delivery_fee",{orderId:o.id,revision:2});
 assert.equal(view(f.s,f.s.users[0],now).orders[0].total,q.total+12000);
 assert.throws(()=>f.call("ops","delivery_fee",{orderId:o.id,fee:20000}),/không còn chờ/);
 assert.ok(!JSON.stringify(f.s.audit).includes(contact.address));
 assert.ok(!JSON.stringify(view(f.s,f.s.users.find(u=>u.id==="merchant")!,now)).includes(contact.phone));
});
test("early transfer is refundable, acceptance never turns an earlier wrong payment into valid money",()=>{
 const f=setup(),{q,o}=f.order();
 f.call("ops","payment",{orderId:o.id,reference:"EARLY",amount:q.total,receivedAt:now});
 assert.equal(f.s.payments[0].valid,false);assert.equal(f.s.orders[0].status,"awaiting_delivery_fee");assert.equal(f.s.refunds[0].amount,q.total);
 f.call("ops","delivery_fee",{orderId:o.id,fee:10000});f.call("student","accept_delivery_fee",{orderId:o.id,revision:1});
 f.call("ops","payment",{orderId:o.id,reference:"WRONG",amount:q.total,receivedAt:now});assert.equal(f.s.orders[0].status,"awaiting_payment");
 f.call("ops","payment",{orderId:o.id,reference:"RIGHT",amount:q.total+10000,receivedAt:now});assert.equal(f.s.orders[0].status,"paid");
});
test("shipping handoff, completion, carrier expense and merchant settlement are separately accounted and idempotent",()=>{
 const f=setup(),{q,o}=f.order();f.call("ops","delivery_fee",{orderId:o.id,fee:10000});f.call("student","accept_delivery_fee",{orderId:o.id,revision:1});f.call("ops","payment",{orderId:o.id,reference:"SHIP-PAY",amount:q.total+10000,receivedAt:now});
 assert.equal(view(f.s,f.s.users[0],now).orders[0].code,undefined);
 const code=f.s.orders[0].code!;assert.equal(view(f.s,f.s.users.find(u=>u.id==="ops")!,now).orders[0].code,code);
 assert.throws(()=>f.call("ops","delivery_complete",{orderId:o.id,confirmation:"Khách nhận"}),/chưa được bàn giao/);
 const handoffKey=crypto.randomUUID();f.call("merchant","pickup",{orderId:o.id,code,key:handoffKey});f.call("merchant","pickup",{orderId:o.id,code,key:handoffKey});
 assert.equal(f.s.orders[0].status,"out_for_delivery");assert.equal(ledger(f.s).merchantDue,32500);assert.equal(ledger(f.s).deliveryCostsUnconfirmed,1);
 assert.throws(()=>f.call("merchant","delivery_complete",{orderId:o.id,confirmation:"Khách nhận"}),/vận hành/);
 f.call("ops","delivery_complete",{orderId:o.id,confirmation:"Khách xác nhận đã nhận"});
 assert.equal(f.s.orders[0].status,"delivered");
 const costKey=crypto.randomUUID();f.call("ops","delivery_cost",{orderId:o.id,amount:9000,reference:"CARRIER-PAID",key:costKey});f.call("ops","delivery_cost",{orderId:o.id,amount:9000,reference:"CARRIER-PAID",key:costKey});
 assert.equal(f.s.deliveryCosts!.length,1);assert.throws(()=>f.call("ops","delivery_cost",{orderId:o.id,amount:9000,reference:"CARRIER-AGAIN"}),/đã ghi nhận/);
 const l=ledger(f.s);assert.equal(l.received,48000);assert.equal(l.deliveryFeesCollected,10000);assert.equal(l.deliveryCostPaid,9000);assert.equal(l.contribution,3500);assert.equal(l.cash,39000);assert.equal(l.deliveryCostsUnconfirmed,0);
 f.call("ops","settle",{shopId:"shop1"});assert.equal(f.s.settlements[0].amount,32500);
});
test("declined or expired shipping restores only the held stock and voucher",()=>{
 for(const kind of ["decline","expire"]){const f=setup(),{o}=f.order();const before=f.s.listings[0].stock;if(kind==="decline")f.call("student","decline_delivery_fee",{orderId:o.id});else expire(f.s,now+600001);assert.equal(f.s.listings[0].stock,before+1);assert.equal(f.s.vouchers.find(v=>v.rate===0.2)!.state,"available");assert.equal(f.s.refunds.length,0);assert.throws(()=>f.call("student","accept_delivery_fee",{orderId:o.id,revision:0},now+600001));}
});
test("cancel after courier handoff refunds food plus accepted fee without restocking or removing merchant liability",()=>{
 const f=setup(),{q,o}=f.order();f.call("ops","delivery_fee",{orderId:o.id,fee:10000});f.call("student","accept_delivery_fee",{orderId:o.id,revision:1});f.call("ops","payment",{orderId:o.id,reference:"PAY-CANCEL",amount:q.total+10000,receivedAt:now});f.call("merchant","pickup",{orderId:o.id,code:f.s.orders[0].code});const stock=f.s.listings[0].stock;
 assert.throws(()=>f.call("merchant","cancel",{orderId:o.id}),/vận hành/);f.call("ops","cancel",{orderId:o.id});assert.equal(f.s.refunds[0].amount,q.total+10000);assert.equal(f.s.listings[0].stock,stock);assert.equal(ledger(f.s).merchantDue,32500);assert.equal(ledger(f.s).contribution,-35500);
});
test("prepaid carrier cost remains visible when a paid delivery is cancelled before handoff",()=>{
 const f=setup(),{q,o}=f.order();
 assert.throws(()=>f.call("ops","delivery_cost",{orderId:o.id,amount:9000,reference:"PREPAID"}),/xác nhận tiền/);
 f.call("ops","delivery_fee",{orderId:o.id,fee:10000});f.call("student","accept_delivery_fee",{orderId:o.id,revision:1});f.call("ops","payment",{orderId:o.id,reference:"PREPAY-RECEIVED",amount:q.total+10000,receivedAt:now});
 f.call("ops","delivery_cost",{orderId:o.id,amount:9000,reference:"PREPAID"});f.call("ops","cancel",{orderId:o.id});
 assert.equal(ledger(f.s).merchantDue,0);assert.equal(ledger(f.s).deliveryCostPaid,9000);assert.equal(ledger(f.s).contribution,-9000);assert.equal(f.s.refunds[0].amount,48000);
 assert.throws(()=>f.call("ops","refund",{id:f.s.refunds[0].id,reference:"PREPAID"}),/mã chuyển khoản/);
});
