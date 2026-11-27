import test from "node:test";
import assert from "node:assert/strict";
import {filterLaunchMenu,menuShops,launchPartner} from "../lib/launch-menu";
import {productAssets} from "../lib/product-assets";
import {act,issue,demoState,readiness,catalogue} from "../lib/domain";
test("owner menu searches actual merchant name and address without accents",()=>{
 for(const query of ["BÒ TƠ MAI CHÂU","bo to","198 thai thinh"]){assert.equal(filterLaunchMenu(query).length,3);}
 assert.equal(filterLaunchMenu("dong da").length,7);
 assert.deepEqual(filterLaunchMenu("bun rieu").map(p=>p.name),["Bún riêu"]);
 assert.equal(filterLaunchMenu("khong co").length,0);
});
test("catalogue budget and sort use customer5% sale price, not the negotiated supplier price",()=>{
 assert.equal(filterLaunchMenu("bo to","",33249).length,0);
 assert.deepEqual(filterLaunchMenu("bo to","",33250).map(p=>p.name),["Bánh dày"]);
 assert.deepEqual(filterLaunchMenu("bo to","",0,"price").map(p=>p.cataloguePrice),[33250,42750,57000]);
 assert.equal(filterLaunchMenu("bo to","Bánh").length,1);
});
test("owner-confirmed real shops cover the menu without changing legacy IDs",()=>{
 const all=filterLaunchMenu(),remaining=menuShops.filter(s=>s.id!==launchPartner.id);
 assert.equal(menuShops.filter(s=>s.mock).length,0);assert.equal(all.length,14);
 assert.equal(new Set(all.map(p=>p.image)).size,productAssets.length);
 assert.equal(all.filter(p=>p.shop.id===launchPartner.id).length,3);
 assert.deepEqual(remaining.map(s=>all.filter(p=>p.shop.id===s.id).length),[4,4,3]);
 assert.deepEqual(remaining.map(s=>s.id),["mock-nguyen-chi-thanh-8","mock-giai-phong-10","mock-dien-bien-phu-30"]);
 for(const [q,count] of [["8 nguyen chi thanh",4],["10 giai phong",4],["30 dien bien phu",3]] as const){assert.equal(filterLaunchMenu(q).length,count);}
 assert.equal(filterLaunchMenu("","",4749).length,0);assert.equal(filterLaunchMenu("","",4750).length,1);
});
test("simulated partners cannot satisfy readiness or appear as live sale partners",()=>{
 const now=Date.now(),s=demoState(now);
 s.shops=menuShops.slice(1).map(({menu,...p})=>({...p,mock:true,lat:null,lng:null,approved:true,signed:true,recurring:true}));
 s.listings=s.shops.map((p,i)=>({...s.listings[0],id:`mock-${i}`,shopId:p.id}));
 assert.equal(readiness(s).ready,false);assert.equal(readiness(s).eligibleShops,0);
 assert.equal(catalogue(s,now,true).shops.length,0);assert.equal(catalogue(s,now,true).listings.length,0);
});
test("production quote refuses simulated shop even if real pilot is otherwise open",()=>{
 const now=Date.parse("2026-10-27T18:30:00+07:00"),s=demoState(now);
 const original=s.shops[0],listing=s.listings[0];
 s.shops=["real-a","real-b","real-c"].map(id=>({...original,id,mock:false,approved:true,signed:true,recurring:true}));
 s.listings=s.shops.map(p=>({...listing,id:p.id,shopId:p.id}));
 s.shops.push({...original,id:"mock",mock:true,approved:true,signed:true,recurring:true});
 s.listings.push({...listing,id:"mock-meal",shopId:"mock"});issue(s,s.users[0],now);
 assert.equal(readiness(s).ready,true);
 assert.throws(()=>act(s,s.users[0],"quote",{key:crypto.randomUUID(),listingId:"mock-meal",qty:1,voucherId:s.vouchers[0].id},now,null,{production:true,pilotEnabled:true,bankReady:true}),/Món không còn/);
});
