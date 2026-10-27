import test from "node:test";
import assert from "node:assert/strict";
import { act, demoState, issue, ledger, price, publicListing } from "../lib/domain";
const now=Date.parse("2026-10-27T18:30:00+07:00");

test("merchant gets 90% of final food receipts with conservative whole-dong rounding",()=>{
  const l={...demoState(now).listings[0],floor:0,payoutShare:.9 as const,cost:0,margin:0};
  for(const menu of [30000,35000,45000,50000,60000,100001])for(const qty of [1,2,3])for(const voucher of [.07,.1,.2]){
    const q=price({...l,price:menu},qty,voucher,null);
    assert.equal(q.payout,Math.ceil(q.price*9/10));
    assert.equal(q.price-q.payout,Math.floor(q.price/10));
  }
  assert.equal(price({...l,price:50000},1,.2,null).payout,34200);
});

test("10% platform share must cover configured cost and margin; bonus stops at that bound",()=>{
  const l={...demoState(now).listings[0],price:50000,floor:0,payoutShare:.9 as const,cost:2000,margin:1000};
  for(const qty of [1,2,3])for(const voucher of [.07,.1,.2]){
    const q=price(l,qty,voucher,2);
    assert.ok(q.price-q.payout>=q.cost+q.margin);
    assert.ok(q.rate>=voucher);
  }
  assert.throws(()=>price({...l,cost:3000,margin:2000},1,.2,null),/ngân sách/);
  assert.throws(()=>price({...l,payoutShare:.8 as any},1,.2,null),/Tỷ lệ/);
  assert.equal(price({...l,payoutShare:undefined,floor:32500,cost:3000,margin:2000},1,.2,null).payout,32500);
});

test("shipping is excluded from merchant percentage and settlement snapshots the confirmed food amount",()=>{
  const s=demoState(now); issue(s,s.users[0],now);
  Object.assign(s.listings[0],{floor:0,payoutShare:.9,cost:1000,margin:500});
  const call=(id:string,action:string,args:any)=>act(s,s.users.find(u=>u.id===id)!,action,{key:crypto.randomUUID(),...args},now) as any;
  const q=call("student","quote",{listingId:"meal",qty:1,voucherId:s.vouchers.find(v=>v.rate===.2)!.id,fulfillment:"delivery"});
  const o=call("student","order",{quoteId:q.id,delivery:{recipient:"Khách thử",phone:"0901234567",address:"Địa chỉ kiểm thử, Hà Nội"}});
  call("ops","delivery_fee",{orderId:o.id,fee:5000});
  call("student","accept_delivery_fee",{orderId:o.id,revision:s.orders[0].delivery!.revision});
  call("ops","payment",{orderId:o.id,amount:43000,receivedAt:now,reference:"SHARE-TEST"});
  call("ops","pickup",{orderId:o.id,code:s.orders[0].code});
  Object.assign(s.listings[0],{floor:100,payoutShare:undefined});
  assert.equal(ledger(s).merchantDue,34200);
  assert.equal(s.quotes[0].payout,34200);
  assert.ok(!("payoutShare" in publicListing(s.listings[0])));
});

test("partner address may be recorded without inventing coordinates",()=>{
  const s=demoState(now),ops=s.users.find(u=>u.role==="ops")!;
  const args={key:crypto.randomUUID(),name:"Quán kiểm thử",address:"Địa chỉ kiểm thử",lat:null,lng:null};
  act(s,ops,"partner",args,now);
  assert.equal(s.shops.at(-1)!.lat,null);
  assert.throws(()=>act(s,ops,"partner",{...args,key:crypto.randomUUID(),lng:105},now),/Thông tin quán/);
});
