import test from "node:test";
import assert from "node:assert/strict";
import { assumedPickup, pickupPreview } from "../lib/pickup-preview";
import { estimate } from "../lib/commerce";

test("pickup estimate uses 8 percentage points/km, caps at 2km, and keeps rounding consistent", () => {
  const zero = pickupPreview(50000, 0.2, assumedPickup);
  assert.equal(zero.distanceKm, 0);
  assert.equal(zero.bonusDiscount, 0);
  assert.equal(zero.indicativeTotal, estimate(50000, 0.2).total);
  const oneKm = { lat: assumedPickup.lat + 180 / (Math.PI * 6371.0088), lng: assumedPickup.lng };
  const one = pickupPreview(50000, 0.1, oneKm);
  assert.ok(Math.abs(one.distanceKm - 1) < 1e-9);
  assert.ok(Math.abs(one.bonusRate - 0.08) < 1e-9);
  const far = pickupPreview(50000, 0.2, { lat: 22, lng: 106 });
  assert.equal(far.bonusRate, 0.16);
  assert.equal(far.indicativeTotal, 30400);
  for (const price of [5000, 30000, 50000, 100000]) for (const voucher of [0.07, 0.1, 0.2]) {
    const result = pickupPreview(price, voucher, oneKm);
    assert.equal(result.baseDiscount + result.voucherDiscount + result.bonusDiscount + result.indicativeTotal, price);
    assert.ok(result.indicativeTotal > 0 && Number.isInteger(result.indicativeTotal));
  }
});

test("pickup preview rejects invalid positions, prices and unsupported vouchers", () => {
  for (const location of [{ lat: NaN, lng: 105 }, { lat: 91, lng: 105 }, { lat: 21, lng: Infinity }, { lat: 21, lng: -181 }]) assert.throws(() => pickupPreview(30000, 0.2, location));
  assert.throws(() => pickupPreview(30000, 1, assumedPickup));
  assert.throws(() => pickupPreview(-1, 0.2, assumedPickup));
});
