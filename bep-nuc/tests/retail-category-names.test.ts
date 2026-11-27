import test from "node:test";
import assert from "node:assert/strict";
import {nearDateGroups,nearDateCategory,normalizeRetailCategory,retailCategories,retailLabel,validNearDate,type NearDate} from "../lib/near-date";
import {act,tradingDemoState} from "../lib/domain";

test("customer names are explicit while legacy category URLs stay compatible",()=>{
 assert.equal(retailLabel,"Hàng gần hạn sử dụng");assert.equal(retailCategories.length,6);
 assert.deepEqual(Object.values(nearDateGroups),["Thực phẩm đóng gói","Đồ uống","Chăm sóc cá nhân","Đồ dùng gia đình","Hàng phi thực phẩm khác"]);
 assert.ok(retailCategories.every(s=>!s.includes("date")));
 assert.equal(normalizeRetailCategory("Cận date"),retailLabel);
 assert.equal(normalizeRetailCategory("Cận date: Hàng phi thực phẩm"),nearDateCategory("non_food"));
 assert.equal(normalizeRetailCategory("Cận date: Đồ uống"),nearDateCategory("drink"));
 assert.equal(normalizeRetailCategory("Hoa cắm nhà"),"Hoa cắm nhà");
});
test("personal-care and household lots are non-food, retaining expiry and cross-food combo guards",()=>{
 for(const group of ["personal_care","household"] as const){
  const now=Date.now(),s=tradingDemoState(now),l=s.listings[0],u=s.users[0];s.shops[0].mock=false;l.allergens="";
  const n:NearDate={group,amount:1,unit:"chai",expiresAt:now+86400000,labelImage:"/food-images/test.jpg",batchCode:"TEST",origin:"Nguồn kiểm thử",sealed:true};
  l.lot={kind:"goods",offer:"near_expiry",reason:"Hạn dùng theo nhãn",contents:"Một chai theo quy cách",condition:"Bao bì nguyên vẹn",checkedAt:now,nearDate:n};
  const quote=act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1},now) as any;assert.ok(quote.total>0);
  const mixed:NearDate={...n,unit:"combo",preallocated:true,bundleItems:[{name:"Hàng phi thực phẩm",group,amount:1,unit:"chai",expiresAt:n.expiresAt,labelImage:n.labelImage},{name:"Đồ uống",group:"drink",amount:1,unit:"chai",expiresAt:n.expiresAt,labelImage:n.labelImage}]};
  assert.equal(validNearDate(mixed,now,now+1000),false);
 }
});
