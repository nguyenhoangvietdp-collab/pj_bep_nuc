import test from "node:test";
import assert from "node:assert/strict";
import {launchEstimate} from "../lib/launch-estimate";
const base={unitPrice:57000,originalUnitPrice:60000,supplierUnitPrice:42000,qty:1,rate:.1,method:"pickup" as const};
test("pending scenario adds capped pickup to basic without changing supplier payout",()=>{
 const estimate=launchEstimate(base);
 assert.equal(estimate.amounts.voucherDiscount,5700);
 assert.equal(estimate.pickup?.nominal,2850);
 assert.equal(estimate.amounts.bonusDiscount,2850);
 assert.equal(estimate.amounts.total,48450);
 assert.equal(base.supplierUnitPrice,42000);
});
test("scenario isolates shipping, caps percentage vouchers and leaves unknown fee unknown",()=>{
 const noFee=launchEstimate({...base,method:"delivery"});assert.equal(noFee.amounts.total,51300);assert.equal(noFee.amounts.bonusDiscount,0);assert.equal(noFee.shippingSupport,0);
 const shipped=launchEstimate({...base,method:"delivery",grossFee:20000});assert.equal(shipped.shippingSupport,5300);assert.equal(shipped.amounts.total+20000-shipped.shippingSupport,66000);
 const cap=launchEstimate({...base,qty:3,rate:.15});assert.equal(cap.amounts.voucherDiscount,9000);
});
test("unaffordable desired voucher is disclosed instead of producing a loss",()=>{
 const x=launchEstimate({...base,unitPrice:20000,supplierUnitPrice:16000});assert.equal(x.basicEligible,false);assert.equal(x.amounts.voucherDiscount,0);assert.equal(x.amounts.total,20000);
 assert.throws(()=>launchEstimate({...base,grossFee:-1}));assert.throws(()=>launchEstimate({...base,qty:0}));
});
