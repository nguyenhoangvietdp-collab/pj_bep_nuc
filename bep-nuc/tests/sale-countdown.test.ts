import test from "node:test";
import assert from "node:assert/strict";
import {saleCountdown} from "../lib/sale-countdown";
test("sale countdown displays hours, minutes and seconds without dates or timezones",()=>{
 assert.equal(saleCountdown((2*3600+15*60+8)*1000),"2 giờ 15 phút 08 giây");
 assert.equal(saleCountdown(3600000),"1 giờ 00 phút 00 giây");
 assert.equal(saleCountdown(60000),"1 phút 00 giây");
 assert.equal(saleCountdown(59000),"59 giây");
 assert.equal(saleCountdown(1001),"2 giây");
 assert.equal(saleCountdown(0),"0 giây");
 assert.equal(saleCountdown(-1000),"0 giây");
 assert.equal(saleCountdown(NaN),"0 giây");
});
