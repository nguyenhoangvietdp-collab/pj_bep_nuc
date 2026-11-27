import test from "node:test";
import assert from "node:assert/strict";
import {validNearDate,type NearDate} from "../lib/near-date";
import {validLot} from "../lib/trading";
import {act,catalogue,issue,tradingDemoState} from "../lib/domain";
import {filterFood} from "../lib/commerce";
const now=Date.now(),expiry=now+86400000,image="/food-images/bun-rieu-f52df09d.jpg";
const data=(group:NearDate["group"]="packaged_food"):NearDate=>({group,amount:1,unit:"hộp",expiresAt:expiry,labelImage:image,batchCode:"TEST-ONLY",origin:"Nguồn kiểm thử",sealed:true});
function fixture(group:NearDate["group"]="packaged_food"){
 const s=tradingDemoState(now),l=s.listings[0],u=s.users[0];s.shops[0].mock=false;l.stock=3;l.category=`Cận date: ${group==="non_food"?"Hàng phi thực phẩm":group==="drink"?"Đồ uống":"Thực phẩm đóng gói"}`;
 l.lot={kind:"goods",offer:"near_expiry",reason:"Cận hạn theo nhãn kiểm thử",contents:"Một hộp theo quy cách kiểm thử",condition:"Bao bì nguyên vẹn kiểm thử",checkedAt:now,nearDate:data(group)};l.end=now+3600000;l.allergens=group==="non_food"?"":"Thành phần kiểm thử";
 return {s,l,u};
}
test("all three near-date groups require a future label date, provenance, intact package and pickup before expiry",()=>{
 for(const group of ["packaged_food","drink","non_food"] as const){const f=fixture(group);assert.equal(validLot(f.l.lot,now,f.l.end),true);}
 for(const bad of [{expiresAt:now},{expiresAt:NaN},{sealed:false},{labelImage:"javascript:alert(1)"},{batchCode:""},{origin:""},{group:"toString"}])assert.equal(validNearDate({...data(),...bad} as NearDate,now,now+1000),false);
 assert.equal(validNearDate(data(),now,expiry+1),false);
 assert.equal(validNearDate({...data(),labelImage:"https://test.supabase.co/storage/v1/object/public/bep-nuc-lots/owner/label.jpg"},now,now+1000),true);
 const f=fixture();f.l.lot!.kind="food";assert.equal(validLot(f.l.lot,now,f.l.end),false);
});
test("fixed combos need item-level label dates and preallocated stock; cannot mix non-food with edible products",()=>{
 const bundle:NearDate={...data(),unit:"combo",preallocated:true,bundleItems:[{name:"Hộp A",group:"packaged_food",amount:1,unit:"hộp",expiresAt:expiry,labelImage:image},{name:"Nước B",group:"drink",amount:1,unit:"chai",expiresAt:expiry+86400000,labelImage:image}]};
 assert.equal(validNearDate(bundle,now,now+1000),true);assert.equal(validNearDate({...bundle,preallocated:false},now,now+1000),false);
 assert.equal(validNearDate({...bundle,expiresAt:expiry+1},now,now+1000),false);
 assert.equal(validNearDate({...bundle,bundleItems:bundle.bundleItems!.map((i,index)=>index?{...i,group:"non_food"}:i)},now,now+1000),false);
});
test("near-date listings use common money snapshots and are separate from food and flowers",()=>{
 const {s,l,u}=fixture("non_food");
 const published=catalogue(s,now,true);assert.equal(published.listings.find(x=>x.id===l.id)!.lot!.nearDate!.group,"non_food");
 assert.equal(filterFood(published.listings,published.shops,"","Cận date","",false,false,"end",now).length,1);
 assert.equal(filterFood(published.listings,published.shops,"","Cận date: Hàng phi thực phẩm","",false,false,"end",now).length,1);
 assert.equal(filterFood(published.listings,published.shops,"","","",false,false,"end",now).some(x=>x.id===l.id),false);
 const q=act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1,fulfillment:"pickup"},now) as any;
 const snapshot=s.quotes.find(x=>x.id===q.id)!;assert.equal(snapshot.lotSnapshot!.nearDate!.batchCode,"TEST-ONLY");assert.ok(snapshot.price-snapshot.payout-snapshot.cost>=snapshot.margin);assert.ok(snapshot.expires<=expiry);
});
test("expired or unproven goods are hidden and rejected server-side, without reserving inventory",()=>{
 const {s,l,u}=fixture();l.lot!.nearDate!.sealed=false;assert.equal(catalogue(s,now,true).listings.some(x=>x.id===l.id),false);
 assert.throws(()=>act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1},now),/duyệt|chất lượng/);assert.equal(l.stock,3);assert.equal(s.quotes.length,0);
});
test("a fixed combo receives one voucher and preserves its components and supplier obligation",()=>{
 const {s,l,u}=fixture("drink");u.place={id:"at-shop",label:"Điểm thử",address:"Địa chỉ thử tại Hà Nội",lat:s.shops[0].lat!,lng:s.shops[0].lng!,savedAt:now};
 l.lot!.nearDate={...data("drink"),unit:"combo",preallocated:true,bundleItems:[{name:"Nước A",group:"drink",amount:1,unit:"chai",expiresAt:expiry,labelImage:image},{name:"Bánh B",group:"packaged_food",amount:1,unit:"gói",expiresAt:expiry,labelImage:image}]};
 issue(s,u,now);const v=s.vouchers.find(v=>v.userId===u.id&&v.amount===9000)!;
 const q=act(s,u,"quote",{key:crypto.randomUUID(),listingId:l.id,qty:1,voucherId:v.id},now) as any;
 const snapshot=s.quotes.find(x=>x.id===q.id)!;assert.equal(snapshot.promotion!.voucher,9000);assert.equal(snapshot.payout,l.floor);assert.equal(snapshot.lotSnapshot!.nearDate!.bundleItems!.length,2);assert.equal(l.stock,2);
 assert.ok(snapshot.price-snapshot.payout-snapshot.cost>=snapshot.margin);
});
test("operations cannot publish an expired near-date lot by tampering with form data",()=>{
 const {s,l}=fixture(),ops=s.users.find(u=>u.role==="ops")!,before=s.listings.length;
 const args={...structuredClone(l),key:crypto.randomUUID()};args.lot!.nearDate!.expiresAt=now-1;
 assert.throws(()=>act(s,ops,"listing",args,now),/đủ thông tin/);assert.equal(s.listings.length,before);
});
