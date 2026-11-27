import test from "node:test";
import assert from "node:assert/strict";
import {cataloguePickup} from "../lib/catalogue-pickup";
import {requestProduct} from "../lib/request-catalogue";

test("food and flower catalogue previews use 5% before the basic voucher",()=>{
 const food=requestProduct(undefined,"Bún đậu")!,before=structuredClone(food);
 assert.equal(cataloguePickup(food),2850);
 assert.deepEqual(food,before);
 assert.equal(cataloguePickup(requestProduct("flower-ken-hong")!),4702);
});
