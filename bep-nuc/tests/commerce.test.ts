import test from "node:test";
import assert from "node:assert/strict";
import {
  act,
  catalogue,
  demoState,
  issue,
  view,
  price,
  localImage,
} from "../lib/domain";
import { estimate, filterFood, normalize } from "../lib/commerce";
const now = Date.parse("2026-10-07T18:30:00+07:00");
function setup() {
  const s = demoState(now);
  issue(s, s.users[0], now);
  return s;
}
test("public catalogue excludes unapproved and production mock shops, financial and identity fields", () => {
  const s = setup();
  const c = catalogue(s, now);
  assert.equal(c.listings.length, 1);
  assert.equal(c.listings[0].category, "Cơm");
  for (const key of ["floor", "cost", "margin", "userId", "payout"])
    assert.ok(!(key in c.listings[0]));
  assert.ok(!("users" in c));
  assert.equal(catalogue(s, now, true).shops.length, 0);
  s.shops[0].approved = false;
  assert.equal(catalogue(s, now).listings.length, 0);
  s.shops[0].approved = true;
  s.listings[0].end = now;
  assert.equal(catalogue(s, now).listings.length, 0);
});
test("base and voucher estimates match backend, rounding breakdown sums exactly", () => {
  const s = setup();
  for (const p of [30000, 50000, 100000, 50001])
    for (const qty of [1, 2, 3])
      for (const v of [0.07, 0.1, 0.2]) {
        const l = { ...s.listings[0], price: p, floor: Math.floor(p * 0.55) };
        const a = estimate(p * qty, v),
          real = price(l, qty, v, null);
        assert.equal(a.total, real.price);
        assert.equal(
          a.menuTotal - a.baseDiscount - a.voucherDiscount,
          real.price,
        );
        assert.ok(real.price >= real.payout + real.cost + real.margin);
      }
  const a = estimate(100000, 0.2);
  assert.equal(a.total, 76000);
  assert.equal(a.saved, 24000);
});
test("search matches Vietnamese names and addresses; stock/time/category filters and sort", () => {
  const s = setup();
  const c = catalogue(s, now);
  const foods = [
    ...c.listings,
    {
      ...c.listings[0],
      id: "out",
      name: "Bún bò",
      category: "Bún/mì",
      price: 30000,
      stock: 0,
    },
    {
      ...c.listings[0],
      id: "future",
      name: "Bánh mì",
      category: "Bánh",
      price: 20000,
      start: now + 60000,
    },
  ];
  assert.equal(normalize("ĐỒ uống"), "do uong");
  assert.equal(
    filterFood(foods, c.shops, "com ga", "", "", true, false, "end", now)
      .length,
    1,
  );
  assert.equal(
    filterFood(foods, c.shops, "ha noi", "", "", true, false, "price", now)[0]
      .id,
    "future",
  );
  assert.equal(
    filterFood(foods, c.shops, "", "", "", true, true, "end", now).length,
    1,
  );
  assert.equal(
    filterFood(foods, c.shops, "", "Bún/mì", "", false, false, "end", now)[0]
      .id,
    "out",
  );
});
test("held quotes survive reload without private fields; release is owned, idempotent and restores once", () => {
  const s = setup();
  const user = s.users[0];
  const v = s.vouchers.find((v) => v.rate === 0.2)!;
  const call = (a: string, args: any, u = user) =>
    act(s, u, a, { key: crypto.randomUUID(), ...args }, now) as any;
  const q = call("quote", { listingId: "meal", voucherId: v.id, qty: 2 });
  const resumed = view(s, user, now).heldQuotes[0];
  assert.equal(resumed.total, 76000);
  assert.equal(
    resumed.menuTotal -
      resumed.baseDiscount -
      resumed.voucherDiscount -
      resumed.bonusDiscount,
    resumed.total,
  );
  assert.ok(!("payout" in resumed));
  assert.throws(() =>
    call("release_quote", { quoteId: q.id }, { ...user, id: "other" }),
  );
  call("release_quote", { quoteId: q.id });
  call("release_quote", { quoteId: q.id });
  assert.equal(s.listings[0].stock, 12);
  assert.equal(v.state, "available");
  assert.equal(view(s, user, now).heldQuotes.length, 0);
  const next = call("quote", { listingId: "meal", voucherId: v.id, qty: 1 });
  call("order", { quoteId: next.id });
  assert.throws(() => call("release_quote", { quoteId: next.id }));
  assert.equal(s.listings[0].stock, 11);
});
test("only local curated food images are accepted", () => {
  assert.equal(
    localImage("/food-images/demo-meal.svg"),
    "/food-images/demo-meal.svg",
  );
  for (const path of [
    "https://example.com/img.jpg",
    "/food-images/../secret.jpg",
    "//example.com/x.jpg",
    "/food-images/food.svg?x=1",
  ])
    assert.throws(() => localImage(path));
});
