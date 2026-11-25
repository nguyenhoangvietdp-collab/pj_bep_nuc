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
test("existing8pp/km formula caps at2km and floors the VND discount on sale price before basic voucher",()=>{
 for(const [km,nominal] of [[0,0],[.5,4000],[1,8000],[2,16000],[100,16000]])assert.equal(pickupPricing(100000,km,true,100000,100000).nominal,nominal);
 assert.equal(pickupPricing(61072,2,true,100000,100000).nominal,9771);assert.equal(pickupPricing(61072,.5,true,100000,100000).nominal,2442);assert.equal(pickupPricing(Number.MAX_SAFE_INTEGER,2,true,Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER).nominal,Number(BigInt(Number.MAX_SAFE_INTEGER)*16n/100n));
});
test("pickup bonus clamps to margin or remaining promotion budget without reducing merchant commitment",()=>{
 const p=pickupPricing(61072,2,true,3072,100000);assert.equal(p.applied,3072);assert.equal(p.nominal,9771);assert.equal(p.limit,"financial_limit");assert.equal(pickupPricing(61072,2,true,3072,1000).applied,1000);const off=pickupPricing(61072,2,false,3072,1000);assert.equal(off.nominal,9771);assert.equal(off.applied,0);assert.equal(off.limit,"funding");assert.equal(pickupPricing(61072,null,true,3072,1000).applied,0);assert.throws(()=>pickupPricing(-1,1,true,1,1),/không hợp lệ/);
});
function fixture(){const s=tradingDemoState(now),u=s.users[0],l=s.listings[0];Object.assign(l,{floor:45000,cost:3000,margin:1000,negotiatedDiscountPercent:30,price:61072});u.place={id:"saved",label:"Nhà",address:"Địa chỉ thử tại Hà Nội",lat:s.shops[0].lat!+.03,lng:s.shops[0].lng!,savedAt:now};issue(s,u,now);const voucher=s.vouchers.find(v=>v.amount===9000)!;const quote=(method="pickup")=>act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1,voucherId:voucher.id,fulfillment:method,distance:0,price:1},now,0,{production:false,pilotEnabled:false,bankReady:false}) as any;return {s,u,l,quote};}
test("modern quote derives aerial distance internally, adds to9k, fixes payout and snapshots the clamped amount",()=>{
 const f=fixture(),q=f.quote();assert.equal(q.voucherDiscount,9000);assert.equal(q.bonusDiscount,3072);assert.equal(q.total,49000);assert.ok(q.distance>2);assert.equal(q.pickupPricing.nominal,9771);assert.equal(q.pickupPricing.applied,3072);assert.equal(f.s.quotes[0].payout,45000);assert.equal((q.pickupPricing as any).marginRoom,undefined);
 f.s.tradingRules!.weeklyBudget=1;f.l.floor=55000;f.u.place!.lat=21;const snapshot=publicQuote(f.s,f.s.quotes[0]);assert.equal(snapshot.total,49000);assert.equal(snapshot.pickupPricing!.applied,3072);assert.equal(f.s.quotes[0].payout,45000);
});
test("remaining budget caps only the extra while insufficient basic voucher budget still rejects atomically",()=>{
 const f=fixture();f.s.tradingRules!.weeklyBudget=10000;const q=f.quote();assert.equal(q.voucherDiscount,9000);assert.equal(q.bonusDiscount,1000);assert.equal(q.total,51072);assert.equal(f.s.quotes[0].promotion!.voucher+f.s.quotes[0].promotion!.pickup,10000);
 const g=fixture(),stock=g.l.stock;g.s.tradingRules!.weeklyBudget=8999;assert.throws(()=>g.quote(),/Ngân sách/);assert.equal(g.s.quotes.length,0);assert.equal(g.l.stock,stock);assert.ok(g.s.vouchers.every(v=>v.state==="available"));
});
test("delivery never gains pickup bonus; missing store coordinates cannot be replaced by a supplied distance",()=>{
 const f=fixture(),q=f.quote("delivery");assert.equal(q.bonusDiscount,0);assert.equal(q.total,52072);assert.equal(q.pickupPricing,undefined);const g=fixture();g.s.shops[0].lat=null;const unknown=g.quote();assert.equal(unknown.distance,null);assert.equal(unknown.bonusDiscount,0);assert.equal(unknown.total,52072);
});
