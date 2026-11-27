import test from "node:test";
import assert from "node:assert/strict";
import {storeLocations,locatedStore} from "../lib/store-locations";
import {filterLaunchMenu} from "../lib/launch-menu";
import {catalogue,previewReceiving,tradingDemoState} from "../lib/domain";

test("four owner-supplied storefronts retain labels, exact coordinates and pickup instructions",()=>{
 assert.deepEqual(storeLocations.map(s=>[s.name,s.lat,s.lng]),[
  ["Bò Tơ Mai Châu - Thái Thịnh",21.01185,105.81692],
  ["Cơm Niêu Singapore Kombo",21.02641,105.81155],
  ["Phở Thìn Lò Đúc - Giải Phóng",20.99982,105.84135],
  ["Highlands Coffee & Bánh Mì",21.03362,105.83981],
 ]);
 assert.equal(new Set(storeLocations.map(s=>s.id)).size,4);
 assert.ok(storeLocations.every(s=>s.pickupEntrance.length>10));
 assert.equal(storeLocations[3].driverNotes,undefined);
 assert.equal(filterLaunchMenu("bep nguyen chi thanh").length,4);
 assert.equal(filterLaunchMenu("kombo").length,4);
 assert.equal(filterLaunchMenu("highlands").length,3);
 const unknown={id:"unlisted",name:"Own shop",lat:null,lng:null};assert.equal(locatedStore(unknown),unknown);
});

test("catalogue and new quotes use the same canonical store point without rewriting stored snapshots",()=>{
 const now=Date.now(),s=tradingDemoState(now),store=storeLocations[0],shop=s.shops[0],listing=s.listings[0],u=s.users[0];
 Object.assign(shop,{id:store.id,mock:false,lat:0,lng:0});listing.shopId=store.id;
 u.place={id:"at-store",label:"Điểm thử",address:"Địa chỉ thử tại Hà Nội",lat:store.lat,lng:store.lng,savedAt:now};
 const saved=structuredClone(s),published=catalogue(s,now,true).shops[0];
 assert.equal(published.name,store.name);assert.equal(published.lat,store.lat);assert.equal(published.pickupEntrance,store.pickupEntrance);
 const p=previewReceiving(s,u,{listingId:listing.id,qty:1,rate:0},now,999,false);
 assert.equal(p.distance,0);assert.equal(p.amounts.bonusDiscount,0);assert.deepEqual(s,saved);
});
