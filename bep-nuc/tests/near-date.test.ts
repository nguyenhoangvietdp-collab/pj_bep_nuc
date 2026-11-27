import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validNearDate,nearDateGroups,nearDateCategory,retailLabel,retailUnits,type NearDate} from "../lib/near-date";
import {nearDateTemplates,nearDateTemplateFormValues,visibleNearDateTemplates} from "../lib/near-date-templates";
import {nearDateFromForm} from "../app/components/near-date-fields";
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
test("all 16 near-date templates have valid catalogue data",()=>{
 const ids=new Set(nearDateTemplates.map(template=>template.id));
 assert.equal(nearDateTemplates.length,16);
 assert.equal(ids.size,16);
 for(const template of nearDateTemplates){
  assert.ok(Object.hasOwn(nearDateGroups,template.group),template.id);
  assert.ok(retailUnits.includes(template.unit),template.id);
  assert.ok(template.title.length<=40,template.id);
  assert.ok(template.subtitle.length<=70,template.id);
  assert.ok(template.description.length<=160,template.id);
  for(const id of template.suggestedItems??[])assert.ok(ids.has(id),id);
 }
});
test("near-date image credits match SOURCES.csv and placeholders have no credit",()=>{
 const csv=readFileSync(new URL("../public/near-date-illustrations/SOURCES.csv",import.meta.url),"utf8");
 const sources=new Map(csv.trim().split(/\r?\n/).slice(1).map(row=>{
  const [id,file,pageUrl,,author,license,licenseUrl]=row.slice(1,-1).split('\",\"');
  return [id,{file,credit:{author,license,licenseUrl,pageUrl}}] as const;
 }));
 assert.equal(sources.size,nearDateTemplates.length);
 for(const template of nearDateTemplates){
  const source=sources.get(template.id);
  assert.ok(source,template.id);
  if(source.file){
   assert.equal(source.file,`${template.id}.jpg`,template.id);
   assert.ok(Object.values(source.credit).every(Boolean),template.id);
   assert.deepEqual(template.credit,source.credit,template.id);
  }else{
   assert.equal(template.credit,undefined,template.id);
  }
 }
 for(const id of ["nd-ngu-coc-yen-mach","nd-khan-giay-giay-uot","nd-pin-tieu-vi"]){
  const credit=nearDateTemplates.find(template=>template.id===id)?.credit;
  assert.ok(credit?.author&&credit.licenseUrl,id);
  assert.match(credit.license,/^CC BY-SA (3\.0|4\.0)$/,id);
 }
});
test("templates are browsable but cannot be quoted or reserve stock",()=>{
 const {s,l,u}=fixture();
 const template=nearDateTemplates[0];
 assert.equal(visibleNearDateTemplates([],retailLabel,"",now).length,16);
 assert.deepEqual(visibleNearDateTemplates([],nearDateCategory(template.group),"mi an lien",now),[template]);
 assert.throws(()=>act(s,u,"quote",{key:crypto.randomUUID(),listingId:template.id,qty:1},now),/Lô không còn nhận đơn/);
 assert.equal(s.quotes.length,0);
 assert.equal(l.stock,3);
 l.name=template.title.toUpperCase();
 assert.ok(!visibleNearDateTemplates(catalogue(s,now).listings,retailLabel,"",now).includes(template));
 l.stock=0;
 assert.ok(visibleNearDateTemplates(catalogue(s,now).listings,retailLabel,"",now).includes(template));
});
test("applying a near-date template leaves lot evidence and price required",()=>{
 const {s,l}=fixture();
 const ops=s.users.find(u=>u.role==="ops")!;
 const template=nearDateTemplates[0];
 const {name,contents,storage,group,unit}=nearDateTemplateFormValues(template);
 assert.deepEqual({name,contents,storage,group,unit},{name:template.title,contents:template.description,storage:template.storage,group:template.group,unit:template.unit});
 const form=new FormData();
 for(const [key,value] of Object.entries({retailGroup:group,retailUnit:unit,retailAmount:"1",expiresAt:"2099-01-01T12:00",batchCode:"TEST-ONLY",origin:"Nguồn kiểm thử",labelImage:image,sealed:"on",price:String(l.price)})){
  form.set(key,value);
 }
 const args=(data:FormData)=>({...structuredClone(l),name,storage,price:Number(data.get("price")),lot:{...l.lot!,contents,nearDate:nearDateFromForm(data)},key:crypto.randomUUID()});
 const before=s.listings.length;
 for(const field of ["expiresAt","batchCode","origin","labelImage","sealed","price"]){
  const incomplete=new FormData();
  for(const [key,value] of form)if(key!==field)incomplete.set(key,value);
  assert.throws(()=>act(s,ops,"listing",args(incomplete),now),field==="price"?/Thông tin lô không hợp lệ/:/Cần đủ thông tin lô/,field);
  assert.equal(s.listings.length,before,field);
 }
 act(s,ops,"listing",args(form),now);
 assert.equal(s.listings.length,before+1);
});
