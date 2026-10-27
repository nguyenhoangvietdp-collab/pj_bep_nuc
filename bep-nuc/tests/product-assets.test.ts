import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { productAssets, filterMenuAssets } from "../lib/product-assets";

test("all Drive menu images match the source manifest without inventing sale data", () => {
  const rows = readFileSync(new URL("../docs/product-image-sources.csv", import.meta.url), "utf8").trim().split(/\r?\n/).slice(1).map(line => line.split(","));
  assert.equal(productAssets.length, 14);
  assert.equal(productAssets.length, rows.length);
  assert.equal(new Set(productAssets.map(p => p.image)).size, 14);
  for (const item of productAssets) {
    const row = rows.find(r => r[5] === item.image)!;
    assert.ok(row);
    assert.equal(item.name, row[2]);
    assert.equal(item.area, row[3]);
    assert.equal(item.referencePrice, Number(row[4]));
    assert.equal(item.sourceUrl, row[1]);
    const bytes = readFileSync(new URL(`../public${item.image}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), row[6]);
    assert.ok(!("stock" in item) && !("shopId" in item) && !("eligible" in item));
  }
});

test("reference menu search and budget use the stated reference price", () => {
  assert.equal(filterMenuAssets("bun rieu")[0].name, "Bún riêu");
  assert.ok(filterMenuAssets("Đống Đa").every(p => p.area === "Đống Đa"));
  assert.equal(filterMenuAssets("", "", 5000)[0].name, "Bánh rán đường");
  assert.equal(filterMenuAssets("", "", 4999).length, 0);
  assert.ok(filterMenuAssets("", "Bánh").every(p => p.category === "Bánh"));
  const sorted = filterMenuAssets("", "", 0, "price");
  assert.ok(sorted.every((p, i) => !i || sorted[i - 1].referencePrice <= p.referencePrice));
  assert.equal(productAssets[0].name, "Cháo quẩy");
});
