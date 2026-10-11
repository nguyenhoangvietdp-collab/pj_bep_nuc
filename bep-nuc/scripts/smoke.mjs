import assert from "node:assert/strict";
const origin = process.env.APP_URL || "http://127.0.0.1:3200";
let cookie = "";
async function request(path, body) {
  const r = await fetch(origin + path, {
    method: body ? "POST" : "GET",
    headers: {
      Origin: origin,
      Cookie: cookie,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const set = r.headers.get("set-cookie");
  if (set) cookie = set.split(";")[0];
  const data = await r.json();
  assert.ok(r.ok, JSON.stringify(data));
  return data;
}
const login = (role) => request("/api/auth", { role });
const act = (action, args) =>
  request("/api/pilot", {
    action,
    args: { ...args, key: crypto.randomUUID() },
  });
await login("student");
let d = await request("/api/pilot");
assert.equal(d.demo, true, "Smoke only runs in demo");
assert.equal(d.vouchers.length, 3);
assert.ok(!JSON.stringify(d).includes('"floor"'));
const q = await act("quote", {
  listingId: "meal",
  voucherId: d.vouchers.find((v) => v.rate === 0.2).id,
  qty: 1,
});
assert.equal(q.total, 38000);
const o = await act("order", { quoteId: q.id });
await login("ops");
await act("payment", {
  orderId: o.id,
  reference: "smoke-pay-" + crypto.randomUUID(),
  amount: q.total,
  receivedAt: d.now,
});
await login("student");
d = await request("/api/pilot");
const code = d.orders.find((x) => x.id === o.id).code;
assert.ok(code);
await login("merchant");
await act("pickup", { orderId: o.id, code });
await login("ops");
await act("settle", { shopId: "shop1" });
d = await request("/api/pilot");
const t = d.settlements.find((x) => x.orderIds.includes(o.id));
assert.equal(t.amount, 32500);
await act("payout", {
  id: t.id,
  reference: "smoke-out-" + crypto.randomUUID(),
});
d = await request("/api/pilot");
assert.equal(d.ledger.merchantDue, 0);
assert.equal(d.ledger.received, 38000);
assert.equal(d.ledger.merchantPaid, 32500);
assert.equal(d.ledger.cash, 5500);
assert.equal(d.ledger.contribution, 2500);
await request("/api/export");
await login("student");
assert.equal(
  (await fetch(origin + "/api/export", { headers: { Cookie: cookie } })).status,
  403,
);
const rejected = await fetch(origin + "/api/pilot", {
  method: "POST",
  headers: {
    Origin: "https://invalid.example",
    Cookie: cookie,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    action: "order",
    args: { quoteId: q.id, key: crypto.randomUUID() },
  }),
});
assert.equal(rejected.status, 400);
console.log(
  "PASS: student → payment → merchant pickup → settlement → payout; ledger, export authorization, Origin check.",
);
