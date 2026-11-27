import test from "node:test";
import assert from "node:assert/strict";
import {promotionThreshold,promotionThresholds} from "../lib/promotion-threshold";
import {act,issue,tradingDemoState} from "../lib/domain";
import {launchEstimate} from "../lib/launch-estimate";
const basis={unitPrice:27550,payout:20300,cost:3000,margin:1000};
test("cheap units need a financially viable quantity, not an arbitrary basket price",()=>{
 const t=promotionThresholds(basis,9000,9000);
 assert.deepEqual(t.fixed,{qty:3,subtotal:82650});assert.deepEqual(t.percent15,t.fixed);assert.deepEqual(t.percent10,{qty:1,subtotal:27550});
 assert.equal(promotionThreshold({unitPrice:6786,payout:5000,cost:3000,margin:1000},{rate:0,amount:9000}),null);
 assert.equal(promotionThreshold({...basis,maxQty:2},{rate:0,amount:9000}),null);
});
test("preview never applies an unqualified basic voucher and gives the same threshold",()=>{
 const base={unitPrice:27550,supplierUnitPrice:20300,qty:1,rate:9000,method:"pickup" as const,distanceKm:2};
 const one=launchEstimate(base);assert.equal(one.basicEligible,false);assert.equal(one.amounts.voucherDiscount,0);assert.deepEqual(one.threshold,{qty:3,subtotal:82650});
 const three=launchEstimate({...base,qty:3});assert.equal(three.basicEligible,true);assert.equal(three.amounts.voucherDiscount,9000);assert.ok(three.amounts.total-20300*3-3000*3>=1000*3);
});
function fixture(){const now=Date.now(),s=tradingDemoState(now),u=s.users[0],l=s.listings[0];u.place={id:"own",label:"Nhà",address:"Địa chỉ thử tại Hà Nội",lat:21.1,lng:105.85,savedAt:now};Object.assign(l,{price:27550,floor:20300,cost:3000,margin:1000,stock:3});issue(s,u,now);return {now,s,u,l};}
test("server rejects low basket voucher before reserving stock or money; enough units retain contribution",()=>{
 const {now,s,u,l}=fixture(),v=s.vouchers.find(v=>v.userId===u.id&&v.amount===9000)!;
 assert.throws(()=>act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1,voucherId:v.id},now),/82\.650/);
 assert.equal(l.stock,3);assert.equal(v.state,"available");assert.equal(s.quotes.length,0);
 const q=act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:3,voucherId:v.id},now) as any;
 const snapshot=s.quotes.find(x=>x.id===q.id)!;assert.equal(snapshot.payout,60900);assert.ok(snapshot.price-snapshot.payout-snapshot.cost>=snapshot.margin);assert.equal(l.stock,0);
});
test("minimum basket also gates pickup and shipping without a basic voucher",()=>{
 const {now,s,u,l}=fixture();Object.assign(l,{price:10000,floor:5000,cost:1000,margin:1000});s.tradingRules!.minimumBasket=20000;
 const q=act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1},now) as any;
 assert.equal(q.bonusDiscount,0);assert.equal(s.quotes[0].promotion!.shippingCap,0);assert.ok(q.total>0);
});
test("zero configured margin cannot create a new break-even modern quote",()=>{
 const {now,s,u,l}=fixture();Object.assign(l,{price:10000,floor:9000,cost:1000,margin:0});
 assert.throws(()=>act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1},now),/ngân sách/);assert.equal(s.quotes.length,0);
});
