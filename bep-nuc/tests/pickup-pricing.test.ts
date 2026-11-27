import test from "node:test";
import assert from "node:assert/strict";
import {straightLineKm,pickupPricing} from "../lib/pickup-pricing";
import {act,tradingDemoState,issue,publicQuote} from "../lib/domain";
const now=Date.parse("2026-11-04T18:30:00+07:00");
test("Haversine uses actual coordinates, handles identical points, symmetry, poles and date line",()=>{
 const a={lat:21,lng:105.8},b={lat:21.01,lng:105.8};assert.equal(straightLineKm(a,a),0);assert.ok(Math.abs(straightLineKm(a,b)!-1.1119492664)<1e-8);assert.equal(straightLineKm(a,b),straightLineKm(b,a));assert.ok(Math.abs(straightLineKm({lat:0,lng:179.9},{lat:0,lng:-179.9})!-22.2389853)<1e-6);assert.ok(Math.abs(straightLineKm({lat:90,lng:0},{lat:-90,lng:0})!-20015.086796)<1e-5);
});
test("missing or invalid coordinates remain unknown, never silently become the origin",()=>{
 for(const p of [undefined,{lat:null,lng:105},{lat:NaN,lng:105},{lat:91,lng:105},{lat:21,lng:181}])assert.equal(straightLineKm(p,{lat:21,lng:105}),null);
});
test("pickup is exactly 5% of the pre-voucher subtotal, rounded down",()=>{
 assert.equal(pickupPricing(57000,true,57000,57000).nominal,2850);
 assert.equal(pickupPricing(61072,true,61072,61072).nominal,3053);
 assert.equal(pickupPricing(Number.MAX_SAFE_INTEGER,true,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER).nominal,Number(BigInt(Number.MAX_SAFE_INTEGER)/20n));
});
test("pickup bonus clamps to margin and remaining promotion budget",()=>{
 const p=pickupPricing(61072,true,2000,100000);assert.equal(p.applied,2000);assert.equal(p.nominal,3053);assert.equal(p.limit,"financial_limit");
 assert.equal(pickupPricing(61072,true,2000,1000).applied,1000);
 const off=pickupPricing(61072,false,2000,1000);assert.equal(off.applied,0);assert.equal(off.limit,"funding");
 assert.throws(()=>pickupPricing(-1,true,1,1),/không hợp lệ/);
});
function fixture(){const s=tradingDemoState(now),u=s.users[0],l=s.listings[0];Object.assign(l,{floor:45000,cost:3000,margin:1000,negotiatedDiscountPercent:30,price:61072});u.place={id:"saved",label:"Nhà",address:"Địa chỉ thử tại Hà Nội",lat:s.shops[0].lat!+.03,lng:s.shops[0].lng!,savedAt:now};issue(s,u,now);const voucher=s.vouchers.find(v=>v.amount===9000)!;const quote=(method="pickup")=>act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1,voucherId:voucher.id,fulfillment:method,distance:0,price:1},now,0,{production:false,pilotEnabled:false,bankReady:false}) as any;return {s,u,l,quote};}
test("modern quote adds 5% to the 9k voucher and keeps old pickup snapshots readable",()=>{
 const f=fixture(),q=f.quote();assert.equal(q.voucherDiscount,9000);assert.equal(q.bonusDiscount,3053);assert.equal(q.total,49019);assert.ok(q.distance>2);assert.equal(q.pickupPricing.nominal,3053);assert.equal(q.pickupPricing.applied,3053);assert.equal(f.s.quotes[0].payout,45000);assert.equal((q.pickupPricing as any).marginRoom,undefined);
 f.s.tradingRules!.weeklyBudget=1;f.l.floor=55000;f.u.place!.lat=21;const snapshot=publicQuote(f.s,f.s.quotes[0]);assert.equal(snapshot.total,49019);assert.equal(snapshot.pickupPricing!.applied,3053);
 const old={...f.s.quotes[0],price:49000,promotion:{...f.s.quotes[0].promotion!,pickup:3072},pickupPricingSnapshot:{method:"haversine",distanceKm:3,ratePerKm:.08,capKm:2,nominal:9771,applied:3072,limited:true,limit:"financial_limit"}} as const;
 assert.equal(publicQuote(f.s,old).total,49000);
 assert.deepEqual(publicQuote(f.s,old).pickupPricing,old.pickupPricingSnapshot);assert.equal(f.s.quotes[0].payout,45000);
});
test("remaining budget caps only the extra while insufficient basic voucher budget still rejects atomically",()=>{
 const f=fixture();f.s.tradingRules!.weeklyBudget=10000;const q=f.quote();assert.equal(q.voucherDiscount,9000);assert.equal(q.bonusDiscount,1000);assert.equal(q.total,51072);assert.equal(f.s.quotes[0].promotion!.voucher+f.s.quotes[0].promotion!.pickup,10000);
 const g=fixture(),stock=g.l.stock;g.s.tradingRules!.weeklyBudget=8999;assert.throws(()=>g.quote(),/Ngân sách/);assert.equal(g.s.quotes.length,0);assert.equal(g.l.stock,stock);assert.ok(g.s.vouchers.every(v=>v.state==="available"));
});
test("delivery never gains pickup bonus; missing store coordinates leave the pickup bonus intact",()=>{
 const f=fixture(),q=f.quote("delivery");assert.equal(q.bonusDiscount,0);assert.equal(q.total,52072);assert.equal(q.pickupPricing,undefined);const g=fixture();g.s.shops[0].lat=null;const unknown=g.quote();assert.equal(unknown.distance,null);assert.equal(unknown.bonusDiscount,3053);assert.equal(unknown.total,49019);
});
