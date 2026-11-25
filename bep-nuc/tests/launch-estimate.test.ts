import test from "node:test";
import assert from "node:assert/strict";
import {launchEstimate} from "../lib/launch-estimate";
const base={unitPrice:61072,originalUnitPrice:64286,supplierUnitPrice:45000,qty:1,rate:9000,method:"pickup" as const,distanceKm:null};
test("pending scenario adds capped pickup to basic without changing supplier payout",()=>{
 const initial=launchEstimate(base);assert.equal(initial.amounts.total,52072);assert.equal(initial.amounts.bonusDiscount,0);
 const near=launchEstimate({...base,distanceKm:.5});assert.equal(near.amounts.total,49630);assert.equal(near.amounts.bonusDiscount,2442);
 const far=launchEstimate({...base,distanceKm:3});assert.equal(far.pickup?.nominal,9771);assert.equal(far.amounts.bonusDiscount,3072);assert.equal(far.amounts.total,49000);
 assert.equal(base.supplierUnitPrice,45000);
});
test("scenario isolates shipping, caps percentage vouchers and leaves unknown fee unknown",()=>{
 const noFee=launchEstimate({...base,method:"delivery",distanceKm:2});assert.equal(noFee.amounts.total,52072);assert.equal(noFee.amounts.bonusDiscount,0);assert.equal(noFee.shippingSupport,0);
 const shipped=launchEstimate({...base,method:"delivery",grossFee:20000});assert.equal(shipped.shippingSupport,3072);assert.equal(shipped.amounts.total+20000-shipped.shippingSupport,69000);
 const cap=launchEstimate({...base,qty:3,rate:.15});assert.equal(cap.amounts.voucherDiscount,9000);
});
test("unaffordable desired voucher is disclosed instead of producing a loss",()=>{
 const x=launchEstimate({...base,unitPrice:20300,supplierUnitPrice:16000});assert.equal(x.basicEligible,false);assert.equal(x.amounts.voucherDiscount,0);assert.equal(x.amounts.total,20300);
 assert.throws(()=>launchEstimate({...base,grossFee:-1}));assert.throws(()=>launchEstimate({...base,qty:0}));
});
