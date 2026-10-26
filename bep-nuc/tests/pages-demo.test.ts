import test from "node:test";
import assert from "node:assert/strict";
import { estimate, filterFood } from "../lib/commerce";
import { meals, shops, demoTime, rates, placeOrder, progressOrder, restoreOrders, expired, stockFor, orderTotal } from "../lib/pages-demo";
const now = Date.parse("2026-10-26T12:00:00Z");
test("Pages demo reserves stock and one voucher; retries do not duplicate or advance twice", () => {
 const first = placeOrder([], "bread", 3, .2, now, "DEMO-a");
 assert.equal(stockFor(meals[2], first, now), 2);
 assert.equal(orderTotal(first[0]), estimate(90000,.2).total);
 assert.equal(placeOrder(first,"bread",3,.2,now,"DEMO-a"),first);
 assert.throws(() => placeOrder(first,"bread",1,.2,now,"DEMO-b"));
 assert.throws(() => placeOrder(first,"bread",3,.1,now,"DEMO-b"));
 assert.throws(() => placeOrder(first,"bread",4,.1,now,"DEMO-b"));
 const paid=progressOrder(first,"DEMO-a",now,"awaiting_payment");
 assert.equal(paid[0].status,"paid");
 assert.equal(progressOrder(paid,"DEMO-a",now,"awaiting_payment")[0].status,"paid");
 assert.equal(progressOrder(paid,"DEMO-a",now,"paid")[0].status,"delivered");
});
test("Pages demo expiry releases stock and voucher; restore rejects malformed or unexpected data", () => {
 const first=placeOrder([],"bread",3,.2,now,"DEMO-a");
 const later=now+600000;
 assert.ok(expired(first[0],later));
 assert.equal(stockFor(meals[2],first,later),5);
 assert.throws(()=>progressOrder(first,"DEMO-a",later,"awaiting_payment"));
 assert.equal(placeOrder(first,"bread",3,.2,later,"DEMO-b").length,2);
 assert.deepEqual(restoreOrders(JSON.stringify(first)),first);
 for(const raw of ['null','{}','garbage',JSON.stringify([{...first[0],qty:999}]),JSON.stringify([first[0],first[0]])]) assert.deepEqual(restoreOrders(raw),[]);
});
test("Pages demo uses public fixtures and displayed voucher price at budget boundaries", () => {
 for(const food of meals) for(const secret of ["floor","cost","margin","lat","lng"]) assert.ok(!(secret in food));
 const vouchers=rates.map(rate=>({rate,state:"available",day:"2026-10-26"}));
 const shown=filterFood(meals,shops,"banh mi","","",true,false,"price",demoTime,22800,vouchers);
 assert.equal(shown[0]?.id,"bread");
 assert.equal(filterFood(meals,shops,"banh mi","","",true,false,"price",demoTime,22799,vouchers).length,0);
});
