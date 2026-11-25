import test from "node:test";
import assert from "node:assert/strict";
import {cataloguePickup} from "../lib/catalogue-pickup";
import {requestProduct} from "../lib/request-catalogue";
import {storeLocations} from "../lib/store-locations";
const store=storeLocations[0],origin={id:"own",label:"Điểm của tôi",address:"Địa chỉ thử tại Hà Nội",lat:store.lat+.5*180/(Math.PI*6371),lng:store.lng,savedAt:0};
test("food card computes a pre-voucher pickup scenario from canonical points without mutation",()=>{
 const p=requestProduct("bun-rieu-f52df09d")!,before=structuredClone(p);
 assert.equal(cataloguePickup(p,origin),2442);
 assert.equal(cataloguePickup(p,origin,{lat:0,lng:0}),2442);
 assert.equal(cataloguePickup(p,{...origin,lat:store.lat+.03}),9771);
 assert.equal(cataloguePickup(p,{...origin,lat:store.lat}),0);
 assert.deepEqual(p,before);
});
test("unknown locations never invent a card saving or a food location for flowers",()=>{
 const p=requestProduct("flower-ken-hong")!;
 assert.equal(cataloguePickup(p,origin),undefined);
 assert.equal(cataloguePickup(p,undefined,store),undefined);
 assert.equal(cataloguePickup(p,origin,{lat:null,lng:null}),undefined);
 assert.equal(cataloguePickup(p,origin,store),3762);
});
