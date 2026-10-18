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
import { percent, browseUrl, voucherHint, displayPrice, supportLink, estimate, filterFood, normalize } from "../lib/commerce";
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

test("display price, budget and sorting use only available eligible vouchers tonight", () => {
  const s = setup(), c = catalogue(s, now), l = c.listings[0];
  const vouchers = s.vouchers;
  const a = { ...l, id: "a", price: 50000, eligible: [0.2] };
  const b = { ...l, id: "b", price: 42000, eligible: [0.07] };
  assert.equal(displayPrice(a, [], now).total, 47500);
  assert.equal(displayPrice(a, vouchers, now).total, 38000);
  const filtered = filterFood([a, b], c.shops, "", "", "", true, false, "price", now, 39000, vouchers);
  assert.deepEqual(filtered.map(x => x.id), ["b", "a"]);
  assert.equal(filterFood([a], c.shops, "", "", "", true, false, "price", now, 39000).length, 0);
  assert.equal(displayPrice(a, vouchers.map(v => ({ ...v, state: "reserved" })), now).rate, 0);
  assert.equal(displayPrice(a, vouchers, now + 86400000).rate, 0);
  assert.equal(displayPrice(a, vouchers, Date.parse("2026-10-07T23:59:00+07:00")).rate, 0);
  assert.equal(displayPrice(a, vouchers, Date.parse("2026-10-07T17:59:00+07:00")).rate, 0);
  assert.equal(filterFood([{ ...a, end: now }], c.shops, "", "", "", false, false, "end", now).length, 0);
  for (const price of [30000, 50000, 100000, 50001]) {
    const displayed = displayPrice({ ...a, price }, vouchers, now);
    assert.equal(displayed.total, estimate(price, 0.2).total);
  }
  assert.equal(vouchers.find(v => v.rate === 0.2)?.state, "available");
});
test("support link requires a real-shaped mailbox and encodes order reference", () => {
  assert.equal(supportLink(undefined, "123"), null);
  assert.equal(supportLink("javascript:alert(1)", "123"), null);
  assert.equal(supportLink("a@b.com\r\nBcc:x@y.com", "123"), null);
  assert.ok(supportLink("help@example.com", "order &1")?.endsWith(encodeURIComponent("Hỗ trợ đơn Bếp Núc order &1")));
});

test("meal quantity estimate is rounded from full total and never consumes a voucher", () => {
  const s = setup(), food = { ...catalogue(s, now).listings[0], price: 50001, eligible: [0.2] };
  const before = JSON.stringify(s.vouchers);
  for (const qty of [1, 2, 3]) {
    assert.equal(displayPrice(food, s.vouchers, now, qty).total, estimate(50001 * qty, 0.2).total);
    assert.equal(displayPrice(food, [], now, qty).total, estimate(50001 * qty).total);
  }
  assert.equal(JSON.stringify(s.vouchers), before);
  const a = displayPrice(food, s.vouchers, now).total;
  assert.equal(filterFood([food], s.shops, "", "", "", true, false, "price", now, a, s.vouchers).length, 1);
  assert.equal(filterFood([food], s.shops, "", "", "", true, false, "price", now, a - 1, s.vouchers).length, 0);
});

test("voucher guidance distinguishes time, eligibility, used and reserved", () => {
  const s = setup(), food = { ...catalogue(s, now).listings[0], eligible: [0.2] };
  assert.match(voucherHint(food, s.vouchers, now), /Chọn một/);
  assert.match(voucherHint(food, [], Date.parse("2026-10-07T17:59:00+07:00")), /mở từ/);
  assert.match(voucherHint(food, s.vouchers, Date.parse("2026-10-07T23:59:00+07:00")), /hết hạn/);
  assert.match(voucherHint({ ...food, eligible: [] }, s.vouchers, now), /chưa áp dụng/);
  assert.match(voucherHint(food, s.vouchers.map(v => ({ ...v, state: "used" })), now), /đã dùng/);
  assert.match(voucherHint(food, s.vouchers.map(v => ({ ...v, state: "reserved" })), now), /đang giữ/);
});

test("percent labels are stable and return navigation stays inside catalogue", () => {
  assert.equal(percent(0.07), "7%"); assert.equal(percent(0.1), "10%"); assert.equal(percent(0.2), "20%");
  assert.equal(browseUrl("/?budget=30000&category=C%C6%A1m"), "/meals?budget=30000&category=C%C6%A1m");
  assert.equal(browseUrl("/meals?budget=40000"), "/meals?budget=40000");
  assert.equal(browseUrl("/"), "/meals");
  assert.equal(browseUrl("/shops/shop1?q=bun&evil=1"), "/shops/shop1?q=bun");
  for (const url of ["//evil.com", "https://evil.com", "/checkout", "/shops/../internal", "/\\evil.com", null]) assert.equal(browseUrl(url), "/meals");
});

test("lost quote and order responses can be replayed without reserving or ordering twice", () => {
  const s = setup(), u = s.users[0], l = s.listings[0], v = s.vouchers.find(v => v.rate === 0.2)!;
  const stock = l.stock;
  const args = { listingId: l.id, qty: 1, voucherId: v.id, key: "lost-response-quote" };
  const q: any = act(s, u, "quote", args, now);
  assert.deepEqual(act(s, u, "quote", args, now), q);
  assert.equal(l.stock, stock - 1);
  const o: any = act(s, u, "order", { quoteId: q.id, key: "lost-response-order" }, now);
  assert.deepEqual(act(s, u, "order", { quoteId: q.id, key: "lost-response-order" }, now), o);
  assert.equal(s.orders.length, 1);
  assert.equal((view(s, u, now).orders[0] as any).quoteId, q.id);
  assert.equal(l.stock, stock - 1);
});

test("old catalogue links canonicalize to meals without losing supported filters", () => {
  assert.equal(browseUrl("/?q=com&budget=30000&stock=all&receiving=1&sort=price"), "/meals?q=com&budget=30000&stock=all&receiving=1&sort=price");
  assert.equal(browseUrl("/meals?q=bun&evil=1"), "/meals?q=bun");
  assert.equal(browseUrl("/meals/../internal"), "/meals");
});
