import assert from "node:assert/strict";
const origin = process.env.APP_URL || "http://127.0.0.1:3200";
assert.ok(
  ["127.0.0.1", "localhost"].includes(new URL(origin).hostname),
  "Local demo only",
);
let cookie = "bc_demo=guest";
async function request(path, body, status = 200) {
  const r = await fetch(origin + path, {
    method: body ? "POST" : "GET",
    headers: {
      Origin: origin,
      Cookie: cookie,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  assert.equal(r.status, status, path);
  const set = r.headers.get("set-cookie");
  if (set) cookie = set.split(";")[0];
  return r.json();
}
const login = (role) => request("/api/auth", { role });
const act = (action, args) =>
  request("/api/pilot", {
    action,
    args: { ...args, key: crypto.randomUUID() },
  });
const c = await request("/api/catalogue");
assert.equal(c.demo, true, "Never test real money");
assert.equal(c.shops.length, 3);
assert.equal(c.listings.length, 6);
assert.ok(
  !JSON.stringify(c).match(
    /"(floor|cost|margin|payout|users|payments|audit)":/,
  ),
);
assert.equal((await request("/api/auth")).user, null);
await request("/api/pilot", undefined, 401);
for (const path of [
  "/",
  "/shops/shop1",
  "/meals/meal",
  "/checkout",
  "/login",
  "/orders",
])
  assert.equal((await fetch(origin + path)).status, 200, path);
await login("student");
let d = await request("/api/pilot");
assert.equal(d.orders.length, 0, "Use fresh market-demo database");
let q = await act("quote", {
  listingId: "meal",
  voucherId: d.vouchers.find((v) => v.rate === 0.2).id,
  qty: 2,
});
assert.equal(q.total, 76000);
d = await request("/api/pilot");
assert.equal(d.heldQuotes[0].id, q.id);
assert.equal(d.listings.find((l) => l.id === "meal").stock, 10);
await act("release_quote", { quoteId: q.id });
await act("release_quote", { quoteId: q.id });
d = await request("/api/pilot");
assert.equal(d.listings.find((l) => l.id === "meal").stock, 12);
assert.equal(d.vouchers.find((v) => v.rate === 0.2).state, "available");
q = await act("quote", {
  listingId: "meal",
  voucherId: d.vouchers.find((v) => v.rate === 0.2).id,
  qty: 1,
});
const o = await act("order", { quoteId: q.id });
await request(
  "/api/pilot",
  {
    action: "release_quote",
    args: { quoteId: q.id, key: crypto.randomUUID() },
  },
  400,
);
await login("ops");
await act("payment", {
  orderId: o.id,
  reference: "market-payment-" + crypto.randomUUID(),
  amount: q.total,
  receivedAt: c.now,
});
await login("student");
d = await request("/api/pilot");
const code = d.orders.find((x) => x.id === o.id).code;
assert.ok(code);
assert.equal((await fetch(origin + "/orders/" + o.id)).status, 200);
await login("merchant");
await act("pickup", { orderId: o.id, code });
await request(
  "/api/pilot",
  { action: "pickup", args: { orderId: o.id, code, key: crypto.randomUUID() } },
  400,
);
await login("ops");
await act("settle", { shopId: "shop1" });
d = await request("/api/pilot");
const settlement = d.settlements.find((x) => x.orderIds.includes(o.id));
assert.equal(settlement.amount, 32500);
await act("payout", {
  id: settlement.id,
  reference: "market-payout-" + crypto.randomUUID(),
});
await login("student");
d = await request("/api/pilot");
q = await act("quote", {
  listingId: "meal",
  voucherId: d.vouchers.find((v) => v.rate === 0.1).id,
  qty: 1,
});
const cancelled = await act("order", { quoteId: q.id });
await login("ops");
await act("payment", {
  orderId: cancelled.id,
  reference: "market-refund-payment-" + crypto.randomUUID(),
  amount: q.total,
  receivedAt: c.now,
});
await login("merchant");
await act("cancel", { orderId: cancelled.id });
await login("ops");
d = await request("/api/pilot");
const refund = d.refunds.find((x) => x.orderId === cancelled.id);
assert.equal(refund.amount, q.total);
await act("refund", {
  id: refund.id,
  reference: "market-refund-" + crypto.randomUUID(),
});
d = await request("/api/pilot");
assert.equal(d.ledger.received, 80750);
assert.equal(d.ledger.refunded, 42750);
assert.equal(d.ledger.merchantPaid, 32500);
assert.equal(d.ledger.merchantDue, 0);
assert.equal(d.ledger.refundDue, 0);
assert.equal(d.ledger.cash, 5500);
assert.equal(d.ledger.contribution, 2500);
assert.equal(d.ledger.unallocated, 5500);
assert.equal(
  d.ledger.received - d.ledger.refunded - d.ledger.merchantPaid - d.ledger.cash,
  0,
);
assert.equal(d.ledger.cash, 3000 + d.ledger.contribution);
await login("student");
d = await request("/api/pilot");
assert.equal(d.vouchers.find((v) => v.rate === 0.1).state, "available");
assert.equal(d.orders.find((x) => x.id === cancelled.id).refund[0].done, true);
assert.ok(!JSON.stringify(d.heldQuotes).includes("payout"));
await login("guest");
console.log(
  "PASS: public guest catalogue + routes; hold/resume/release; paid pickup once; cancellation/refund; merchant payout; exact ledger. No browser UI assertions.",
);
