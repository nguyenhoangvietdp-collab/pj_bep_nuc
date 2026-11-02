import test from "node:test";
import assert from "node:assert/strict";
import {requestPayment,paymentTotal} from "../lib/payment-summary";
import {lotEstimate,estimate,type Food} from "../lib/commerce";
test("selecting percentage or fixed vouchers changes the total and respects known order caps",()=>{
 assert.equal(requestPayment(100000,1,0).total,100000);
 assert.equal(requestPayment(100000,1,.15,9000).total,91000);
 assert.equal(requestPayment(100000,1,.1,9000).total,91000);
 assert.equal(requestPayment(100000,1,9000).total,91000);
 assert.equal(requestPayment(69300,2,.15,9000).voucherDiscount,9000);
 assert.equal(requestPayment(69300,2,9000).total,129600);
});
test("fixed9k cannot turn a cheap request into a free order, and flower target prices are not discounted30% twice",()=>{
 assert.equal(requestPayment(5000,1,9000).voucherDiscount,0);
 assert.equal(requestPayment(9000,1,9000).voucherDiscount,0);
 assert.equal(requestPayment(69300,1,0).total,69300);
 assert.equal(requestPayment(69300,1,9000).total,60300);
});
test("unknown shipping is distinct from free shipping and support is deducted only from a known fee",()=>{
 assert.equal(paymentTotal(91000,"delivery"),undefined);
 assert.equal(paymentTotal(91000,"delivery",0),91000);
 assert.equal(paymentTotal(91000,"delivery",30000,9000),112000);
 assert.equal(paymentTotal(91000,"pickup",30000,9000),91000);
});
test("payment totals preserve server amounts, existing food pricing and modern no-base-discount behavior",()=>{
 const lot={price:100000,pricingVersion:2} as Food;
 const q=lotEstimate(lot,1,{rate:.15,cap:9000,state:"available",day:"2026-11-02"});assert.equal(q.total,91000);assert.equal(q.baseDiscount,0);assert.equal(paymentTotal(q.total,"delivery",30000,9000),112000);
 const old=estimate(100000,.1);assert.equal(old.total,85500);assert.equal(paymentTotal(old.total,"pickup"),85500);
});
