import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { estimate, filterFood } from "../lib/commerce";
import { meals, shops, demoTime, rates, placeOrder, progressOrder, restoreOrders, expired, stockFor, orderTotal } from "../lib/pages-demo";
const now = Date.parse("2026-10-26T12:00:00Z");
test("Pages demo reserves stock and one voucher; retries do not duplicate or advance twice", () => {
 const first = placeOrder([], "chao-quay", 3, .2, now, "DEMO-a");
 assert.equal(stockFor(meals.find(f => f.id === "chao-quay")!, first, now), 2);
 assert.equal(orderTotal(first[0]), estimate(105000,.2).total);
 assert.equal(placeOrder(first,"chao-quay",3,.2,now,"DEMO-a"),first);
 assert.throws(() => placeOrder(first,"chao-quay",1,.2,now,"DEMO-b"));
 assert.throws(() => placeOrder(first,"chao-quay",3,.1,now,"DEMO-b"));
 assert.throws(() => placeOrder(first,"chao-quay",4,.1,now,"DEMO-b"));
 const paid=progressOrder(first,"DEMO-a",now,"awaiting_payment");
 assert.equal(paid[0].status,"paid");
 assert.equal(progressOrder(paid,"DEMO-a",now,"awaiting_payment")[0].status,"paid");
 assert.equal(progressOrder(paid,"DEMO-a",now,"paid")[0].status,"delivered");
});
test("Pages demo expiry releases stock and voucher; restore rejects malformed or unexpected data", () => {
 const first=placeOrder([],"chao-quay",3,.2,now,"DEMO-a");
 const later=now+600000;
 assert.ok(expired(first[0],later));
 assert.equal(stockFor(meals.find(f => f.id === "chao-quay")!,first,later),5);
 assert.throws(()=>progressOrder(first,"DEMO-a",later,"awaiting_payment"));
 assert.equal(placeOrder(first,"chao-quay",3,.2,later,"DEMO-b").length,2);
 assert.deepEqual(restoreOrders(JSON.stringify(first)),first);
 for(const raw of ['null','{}','garbage',JSON.stringify([{...first[0],qty:999}]),JSON.stringify([first[0],first[0]])]) assert.deepEqual(restoreOrders(raw),[]);
});
test("Pages demo uses public fixtures and displayed voucher price at budget boundaries", () => {
 for(const food of meals) for(const secret of ["floor","cost","margin","lat","lng"]) assert.ok(!(secret in food));
 const vouchers=rates.map(rate=>({rate,state:"available",day:"2026-10-26"}));
 const shown=filterFood(meals,shops,"chao quay","","",true,false,"price",demoTime,26600,vouchers);
 assert.equal(shown[0]?.id,"chao-quay");
 assert.equal(filterFood(meals,shops,"chao quay","","",true,false,"price",demoTime,26599,vouchers).length,0);
});

test("Drive catalogue contains fourteen matching local JPEG assets with versioned filenames", () => {
 assert.equal(meals.length,14);
 assert.equal(new Set(meals.map(f=>f.id)).size,14);
 assert.equal(new Set(meals.map(f=>f.image)).size,14);
 assert.equal(meals.find(f=>f.id==="banh-ran-duong")?.price,5000);
 assert.equal(meals.find(f=>f.id==="bun-rieu")?.price,45000);
 assert.equal(shops.length,3);
 let totalBytes=0;
 for(const food of meals) {
   assert.ok(shops.some(shop=>shop.id===food.shopId));
   assert.match(food.image!,/^\/food-images\/[a-z0-9-]+-[a-f0-9]{8}\.jpg$/);
   const bytes=readFileSync(new URL("../public"+food.image,import.meta.url));
   assert.equal(bytes.subarray(0,3).toString("hex"),"ffd8ff");
   assert.ok(food.image!.endsWith(createHash("sha256").update(bytes).digest("hex").slice(0,8)+".jpg"));
   totalBytes+=bytes.length;
 }
 assert.ok(totalBytes<2_000_000);
});
