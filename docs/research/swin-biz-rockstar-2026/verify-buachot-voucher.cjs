// Mathematical validation of the proposed policy, not a production checkout.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function quote({ original, floor, cost = 3000, minimum = 2000, base = 0.05, vouchers, distance = 0, rate = 0.08, distanceCap = 2 }) {
  if (!Array.isArray(vouchers) || vouchers.length !== 1) throw new Error('Exactly one voucher per order');
  const voucher = vouchers[0];
  if (![original, floor, cost, minimum, base, voucher, distance, rate, distanceCap].every(Number.isFinite) || original <= 0 || floor < 0 || cost < 0 || minimum < 0 || base < 0 || base >= 1 || voucher < 0 || voucher > 1 || distance < 0 || rate < 0 || distanceCap < 0) throw new Error('Invalid inputs');
  const listed = original * (1 - base);
  const cap = 1 - (floor + cost + minimum) / listed;
  if (cap < 0 || voucher > cap + 1e-12) return { eligible: false, cap };
  const requested = voucher + rate * Math.min(distance, distanceCap);
  const effective = Math.min(requested, cap, 1);
  // Round total upwards to integer VND to preserve minimum settlement/margin.
  const payment = Math.ceil(listed * (1 - effective) - 1e-8);
  return { eligible: true, listed, cap, requested, effective, payment, floor, cost, contribution: payment - floor - cost, totalDiscount: 1 - payment / original };
}

const examples = [0.07, 0.10, 0.20, 0.15].map(v => quote({ original: 100000, floor: 65000, vouchers: [v] }));
assert.deepEqual(examples.map(x => x.payment), [88350, 85500, 76000, 80750]);
assert.deepEqual(examples.map(x => x.contribution), [20350, 17500, 8000, 12750]);
const km = quote({ original: 100000, floor: 65000, vouchers: [0.07], distance: 1 });
assert.ok(Math.abs(km.effective - 0.15) < 1e-10);
const clipped = quote({ original: 100000, floor: 65000, vouchers: [0.20], distance: 1 });
assert.equal(clipped.payment, 70000);
assert.equal(clipped.contribution, 2000);
assert.ok(Math.abs(clipped.cap - 0.26315789473684215) < 1e-10);
assert.throws(() => quote({ original: 100000, floor: 65000, vouchers: [0.07, 0.10, 0.20] }));
assert.equal(quote({ original: 10000, floor: 9500, vouchers: [0.07] }).eligible, false);
assert.ok(Math.abs((1 - 0.95 * 0.93 * 0.9 * 0.8) - 0.36388) < 1e-10);
const commissionCap = 1 - 65000 / (0.9 * 95000);
assert.ok(Math.abs(commissionCap - 0.23976608187134507) < 1e-10);

let checked = 0;
let ineligible = 0;
const rows = [];
for (const original of [30000, 50000, 100000]) {
  for (const floorRatio of [0.5, 0.65, 0.8, 0.95]) {
    for (const distance of [0, 0.25, 0.5, 1, 1.5, 2, 4]) {
      for (const v of [0.07, 0.10, 0.20]) {
        const r = quote({ original, floor: original * floorRatio, vouchers: [v], distance });
        checked++;
        if (!r.eligible) { ineligible++; continue; }
        assert.ok(r.payment >= r.floor + r.cost + 2000);
        assert.ok(r.payment <= r.listed + 1e-8);
        assert.ok(r.effective + 1e-12 >= v && r.effective <= r.cap + 1e-12);
        const farther = quote({ original, floor: original * floorRatio, vouchers: [v], distance: distance + 10 });
        assert.ok(farther.payment <= r.payment);
        const atCap = quote({ original, floor: original * floorRatio, vouchers: [v], distance: 2 });
        const beyondCap = quote({ original, floor: original * floorRatio, vouchers: [v], distance: 4 });
        assert.equal(atCap.payment, beyondCap.payment);
        rows.push([original, floorRatio, v, distance, r.requested, r.effective, r.payment, r.floor, r.contribution]);
      }
    }
  }
}
assert.equal(checked, 252);
const csv = 'original_vnd,floor_ratio,base_voucher,distance_km,requested_voucher,effective_voucher,payment_vnd,merchant_net_vnd,contribution_vnd\n' + rows.map(r => r.join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'buachot-voucher-sensitivity.csv'), csv, 'utf8');
console.log(JSON.stringify({ status: 'passed', scenarios: checked, eligible: rows.length, ineligible, examples: examples.map(r => ({ payment: r.payment, contribution: r.contribution })), oneKm7: km.payment, oneKm20Clipped: clipped.payment, capPercent: clipped.cap * 100 }, null, 2));
