import test from "node:test";
import assert from "node:assert/strict";
import {
  act,
  demoState,
  expire,
  issue,
  ledger,
  price,
  readiness,
  view,
  day,
  evening,
} from "../lib/domain";
const now = Date.parse("2026-10-05T18:30:00+07:00");
function setup() {
  const s = demoState(now);
  issue(s, s.users[0], now);
  return s;
}
function call(
  s: ReturnType<typeof setup>,
  role: string,
  action: string,
  args: any = {},
  at = now,
  d: number | null = null,
) {
  return act(
    s,
    s.users.find((u) => u.id === role)!,
    action,
    { key: crypto.randomUUID(), ...args },
    at,
    d,
  ) as any;
}
function order(s: ReturnType<typeof setup>, rate = 0.2) {
  const v = s.vouchers.find((v) => v.rate === rate)!;
  const q = call(s, "student", "quote", {
    listingId: "meal",
    voucherId: v.id,
    qty: 1,
  });
  const o = call(s, "student", "order", { quoteId: q.id });
  return { q, o };
}
test("money rounding, voucher vs total discount and caps at 30k/50k/100k", () => {
  const s = setup(),
    l = s.listings[0];
  for (const p of [30000, 50000, 100000])
    for (const qty of [1, 2, 3])
      for (const v of [0.07, 0.1, 0.2])
        for (const d of [null, 0, 0.3, 1, 2, 20]) {
          const item = { ...l, price: p, floor: p * 0.65 };
          const max = 1 - (item.floor + item.cost + item.margin) / (0.95 * p);
          if (v > max) {
            assert.throws(() => price(item, qty, v, d));
            continue;
          }
          const q = price(item, qty, v, d);
          assert.ok(q.price >= q.payout + q.cost + q.margin);
          assert.ok(q.rate <= max + 1e-10);
          assert.equal(q.price, price(item, qty, v, d === 20 ? 2 : d).price);
        }
  assert.equal(
    price({ ...l, price: 100000, floor: 65000 }, 1, 0.2, 1).price,
    70000,
  );
  assert.equal(price(l, 1, 0.1, null).price, 42750);
  assert.notEqual(0.1, 1 - 42750 / 50000);
});
test("Vietnam issue window and exactly three vouchers", () => {
  const s = setup();
  issue(s, s.users[0], now);
  assert.equal(s.vouchers.length, 3);
  assert.equal(day(Date.parse("2026-10-05T23:30Z")), "2026-10-06");
  assert.equal(evening(Date.parse("2026-10-05T17:59:00+07:00")), false);
  assert.equal(evening(Date.parse("2026-10-05T23:59:00+07:00")), false);
});
test("last stock, reserved voucher and expired quote release", () => {
  const s = setup();
  s.listings[0].stock = 1;
  const { q } = order(s);
  assert.equal(s.listings[0].stock, 0);
  assert.throws(() =>
    call(s, "student", "quote", {
      listingId: "meal",
      voucherId: s.vouchers[0].id,
      qty: 1,
    }),
  );
  assert.throws(() =>
    call(s, "student", "quote", {
      listingId: "meal",
      voucherId: s.vouchers[2].id,
      qty: 1,
    }),
  );
  expire(s, now + 600000);
  assert.equal(s.listings[0].stock, 1);
  assert.equal(s.vouchers[2].state, "available");
  assert.throws(() =>
    call(s, "student", "order", { quoteId: q.id }, now + 600000),
  );
  expire(s, now + 700000);
  assert.equal(s.listings[0].stock, 1);
});
test("late payment never reacquires stock, duplicate bank reference rejected", () => {
  const s = setup();
  const { q, o } = order(s);
  expire(s, now + 600000);
  call(
    s,
    "ops",
    "payment",
    {
      orderId: o.id,
      amount: q.total,
      reference: "late-transfer",
      receivedAt: now + 600000,
    },
    now + 600001,
  );
  assert.equal(s.orders[0].status, "expired");
  assert.equal(s.refunds[0].amount, q.total);
  assert.equal(s.listings[0].stock, 12);
  assert.throws(() =>
    call(
      s,
      "ops",
      "payment",
      {
        orderId: o.id,
        amount: q.total,
        reference: "late-transfer",
        receivedAt: now + 600000,
      },
      now + 600002,
    ),
  );
});
test("payment idempotency, pickup one time, delivered settlement ledger", () => {
  const s = setup();
  const { q, o } = order(s);
  const args = {
    key: "same-payment-key",
    orderId: o.id,
    amount: q.total,
    reference: "bank-1",
    receivedAt: now,
  };
  call(s, "ops", "payment", args);
  call(s, "ops", "payment", args);
  assert.equal(s.payments.length, 1);
  const code = s.orders[0].code;
  assert.throws(() => call(s, "student", "pickup", { orderId: o.id, code }));
  call(s, "merchant", "pickup", { orderId: o.id, code });
  assert.throws(() => call(s, "merchant", "pickup", { orderId: o.id, code }));
  call(s, "ops", "settle", { shopId: "shop1" });
  assert.equal(s.settlements[0].amount, 32500);
  assert.throws(() => call(s, "ops", "settle", { shopId: "shop1" }));
  call(s, "ops", "payout", { id: s.settlements[0].id, reference: "payout-1" });
  assert.equal(ledger(s).cash, q.total - 32500);
  assert.equal(ledger(s).merchantDue, 0);
  assert.equal(ledger(s).contribution, q.total - 32500 - 3000);
});
test("merchant cancel restores voucher only tonight; no-show refunds without restoration", () => {
  for (const action of ["cancel", "no_show"]) {
    const s = setup();
    const { q, o } = order(s);
    call(s, "ops", "payment", {
      orderId: o.id,
      amount: q.total,
      reference: "bank-1",
      receivedAt: now,
    });
    call(
      s,
      "merchant",
      action,
      { orderId: o.id },
      action === "no_show" ? now + 4 * 3600000 : now,
    );
    assert.equal(s.refunds.length, 1);
    assert.equal(
      s.vouchers[2].state,
      action === "cancel" ? "available" : "used",
    );
    assert.throws(() => call(s, "ops", "settle", { shopId: "shop1" }));
    call(s, "ops", "refund", { id: s.refunds[0].id, reference: "refund-1" });
    assert.equal(ledger(s).cash, 0);
    assert.throws(() =>
      call(s, "ops", "refund", { id: s.refunds[0].id, reference: "refund-2" }),
    );
  }
});
test("student DTO hides terms and merchant cannot modify another shop", () => {
  const s = setup();
  order(s);
  const publicData = JSON.stringify(view(s, s.users[0], now));
  for (const key of ["floor", "payout", "margin", "cost", "audit", "payments"])
    assert.ok(!publicData.includes('"' + key + '"'));
  s.users[1].shopId = "other";
  assert.equal((view(s, s.users[1], now) as any).listings.length, 0);
  assert.throws(() => call(s, "merchant", "stock", { id: "meal", stock: 900 }));
  assert.equal(readiness(s).ready, false);
});
test("expense caps and mock partners never satisfy gate", () => {
  const s = setup();
  call(s, "ops", "expense", { bucket: "infra", amount: 400000, note: "test" });
  assert.throws(() =>
    call(s, "ops", "expense", { bucket: "infra", amount: 1, note: "over" }),
  );
  s.shops[0].signed = true;
  s.shops[0].recurring = true;
  assert.equal(readiness(s).eligibleShops, 0);
});
test("quote ends at voucher cutoff; midnight does not restore cancelled voucher", () => {
  const late = Date.parse("2026-10-05T23:58:00+07:00"),
    s = setup();
  s.listings[0].end = late + 3600000;
  const q = call(
    s,
    "student",
    "quote",
    { listingId: "meal", voucherId: s.vouchers[2].id, qty: 1 },
    late,
  );
  assert.equal(q.expires, Date.parse("2026-10-05T23:59:00+07:00"));
  const o = call(s, "student", "order", { quoteId: q.id }, late);
  call(
    s,
    "ops",
    "payment",
    {
      orderId: o.id,
      amount: q.total,
      reference: "late-good",
      receivedAt: late,
    },
    late,
  );
  call(s, "merchant", "cancel", { orderId: o.id }, late + 3 * 60000);
  assert.equal(s.vouchers[2].state, "used");
});
