import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { transaction, clock, closeStore } from "../lib/store";
import { act, issue } from "../lib/domain";
// Never let the local fixture test use a database URL inherited from an operator shell.
process.env.DATABASE_URL = "";
test("PostgreSQL transactions serialize last-stock race and rollback failed mutation", async () => {
  process.env.APP_MODE = "demo";
  process.env.DEMO_NOW = "2026-10-05T18:30:00+07:00";
  process.env.PGLITE_DIR = await mkdtemp(join(tmpdir(), "buachot-test-"));
  await transaction((s) => {
    s.listings[0].stock = 1;
    issue(s, s.users[0], clock());
    s.users.push({
      id: "second",
      name: "Second",
      role: "student",
      approved: true,
    });
    issue(s, s.users[3], clock());
    for(const u of s.users.filter(u=>u.role==="student"))u.place={id:"place-"+u.id,label:"Điểm thử",address:"Hồ Hoàn Kiếm, Hà Nội",lat:21.0285,lng:105.8542,savedAt:clock()};
  });
  const results = await Promise.allSettled(
    ["student", "second"].map((id) =>
      transaction((s) =>
        act(
          s,
          s.users.find((u) => u.id === id)!,
          "quote",
          {
            listingId: "meal",
            qty: 1,
            voucherId: s.vouchers.find(
              (v) => v.userId === id && v.rate === 0.15,
            )!.id,
            key: "race-key-" + id,
          },
          clock(),
        ),
      ),
    ),
  );
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(await transaction((s) => s.listings[0].stock), 0);
  await transaction((s) => {
    for(const q of s.quotes.filter(q=>q.state==="held"))act(s,s.users.find(u=>u.id===q.userId)!,"release_quote",{key:"release-before-voucher-race-"+q.id,quoteId:q.id},clock());
    s.listings[0].stock = 2;
  });
  const voucherRace = await Promise.allSettled(
    [1, 2].map((n) =>
      transaction((s) =>
        act(
          s,
          s.users[0],
          "quote",
          {
            listingId: "meal",
            qty: 1,
            voucherId: s.vouchers.find(
              (v) => v.userId === "student" && v.rate === 0.1,
            )!.id,
            key: "same-voucher-race-" + n,
          },
          clock(),
        ),
      ),
    ),
  );
  assert.equal(voucherRace.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(await transaction((s) => s.listings[0].stock), 1);
  await assert.rejects(
    transaction((s) => {
      s.listings[0].stock = 999;
      throw new Error("rollback");
    }),
  );
  assert.equal(await transaction((s) => s.listings[0].stock), 1);
  await transaction(s=>{for(const q of s.quotes.filter(q=>q.state==="held"))act(s,s.users.find(u=>u.id===q.userId)!,"release_quote",{quoteId:q.id,key:"release-budget-test-"+q.id},clock());s.listings[0].stock=8;s.tradingRules!.weeklyBudget=7500;});
  const budgetRace=await Promise.allSettled(["student","second"].map(id=>transaction(s=>act(s,s.users.find(u=>u.id===id)!,"quote",{listingId:"meal",qty:1,voucherId:s.vouchers.find(v=>v.userId===id&&v.rate===.15&&v.state==="available")!.id,key:"weekly-budget-race-"+id},clock()))));
  assert.equal(budgetRace.filter(r=>r.status==="fulfilled").length,1);
  assert.equal(await transaction(s=>s.listings[0].stock),7);
  await closeStore();
});
