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
              (v) => v.userId === id && v.rate === 0.2,
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
              (v) => v.userId === "student" && v.rate === 0.07,
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
  await closeStore();
});
