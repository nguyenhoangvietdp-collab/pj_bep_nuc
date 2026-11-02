import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {flowerCatalogue,flowerListings,flowerShops,pendingFlowerMatches} from "../lib/flower-demo";
import {modernDemoState,tradingDemoState,seedFlowerDemo,catalogue,act,issue,orderTotal,ledger,type State} from "../lib/domain";
import {validLot,flowerQuantityLabel} from "../lib/trading";
import {createEdgeHandler} from "../lib/edge-api";
import {newFlowerSession,reserveFlower,progressFlower,flowerStock,flowerVoucherRemaining,flowerQuoteError,restoreFlowerSession,flowerDemoPrice} from "../lib/flower-pages-demo";

const now=Date.parse("2026-11-02T18:30:00+07:00");
function call(s:State,who:string,action:string,args:any={},at=now){return act(s,s.users.find(u=>u.id===who)!,action,{key:crypto.randomUUID(),...args},at,3,{production:false,pilotEnabled:false,bankReady:false}) as any;}
test("reviewed catalogue has twelve unique local images, exact prices and no pending variants",()=>{
  assert.equal(flowerCatalogue.length,12);assert.equal(new Set(flowerCatalogue.map(x=>x.id)).size,12);
  assert.equal(new Set(flowerCatalogue.map(x=>x.image)).size,12);
  let bytes=0;
  for(const p of flowerCatalogue){assert.equal(p.price,p.referencePrice*7/10);assert.ok(flowerShops.some(s=>s.id===p.shopId));assert.match(p.sourceSha256,/^[a-f0-9]{64}$/);const image=readFileSync(new URL("../public"+p.image,import.meta.url));assert.equal(image.subarray(0,4).toString(),"RIFF");bytes+=image.length;}
  assert.ok(bytes<1_500_000);assert.ok(pendingFlowerMatches.some(x=>x.name.includes("Fairy Kiss")));assert.ok(!flowerCatalogue.some(x=>/Sofia|Fairy Kiss|CTC|Phi yến/.test(x.name)));
  assert.equal(flowerCatalogue.find(x=>x.id==="flower-huong-duong")!.price,20300);
});
test("bunch and bloom units never invent stems; only trusted demo validation accepts uncounted units",()=>{
  const lots=flowerListings(now);
  for(const l of lots){assert.equal(l.stock,3);assert.equal(l.start,now);assert.equal(l.end,now+10800000);assert.equal(l.floor,Math.floor(l.price*.6));assert.ok(validLot(l.lot,now,l.end,true));}
  const bunch=lots.find(x=>x.id==="flower-hoa-chuong")!;assert.equal(bunch.lot.stems,undefined);assert.match(flowerQuantityLabel(bunch.lot),/1 bó.*chưa xác định/);assert.equal(validLot(bunch.lot,now,bunch.end),false);
  const blooms=lots.find(x=>x.id==="flower-chuoi-dieu")!;assert.equal(blooms.lot.stems,undefined);assert.equal(flowerQuantityLabel(blooms.lot),"30 bông");assert.equal(validLot({...blooms.lot,stems:0},now,blooms.end,true),false);
  assert.equal(validLot({...bunch.lot,quantity:null} as any,now,bunch.end,true),false);
});
test("Edge does not call route provider or consume route quota for coordinate-free flower shops",async()=>{
  let s=modernDemoState(now),calls=0;s.users[0].place={id:"place-demo",label:"Nhà minh họa",address:"Hà Nội minh họa",lat:21,lng:105,savedAt:now};
  const handler=createEdgeHandler({config:{origin:"https://bep.test",acceptingOrders:true,policy:{production:false,pilotEnabled:false,bankReady:false}},now:()=>now,authenticate:async()=>({id:"student"}),routeDistance:async()=>{calls++;return 3;},transaction:async fn=>{const next=structuredClone(s);const result=fn(next);s=next;return result;}});
  const r=await handler(new Request("https://bep.test/pilot",{method:"POST",headers:{origin:"https://bep.test",authorization:"Bearer student","Content-Type":"application/json"},body:JSON.stringify({action:"quote",args:{key:crypto.randomUUID(),listingId:"flower-hoa-chuong",qty:1}})}));
  assert.equal(r.status,200);assert.equal(calls,0);assert.equal(s.audit.filter(x=>x.action==="route_request").length,0);assert.equal((await r.json()).bonusDiscount,0);
});
test("seed is versioned/idempotent, preserves active generic orders and never runs for production",()=>{
  const s=tradingDemoState(now);issue(s,s.users[0],now);const q=call(s,"student","quote",{listingId:"flowers",qty:1});
  const snapshot=structuredClone(q);seedFlowerDemo(s,now);const count=s.listings.length;seedFlowerDemo(s,now+999);assert.equal(s.listings.length,count);assert.deepEqual(s.quotes[0].lotSnapshot,snapshot.lotSnapshot);assert.ok(s.listings.some(x=>x.id==="flowers"));assert.equal(catalogue(s,now).listings.filter(x=>x.lot?.kind==="flowers").length,12);
  const live=tradingDemoState(now),original=structuredClone(live);seedFlowerDemo(live,now,true);assert.deepEqual(live,original);
  const legacy=tradingDemoState(now);legacy.tradingRules!.version=1;const before=structuredClone(legacy);seedFlowerDemo(legacy,now);assert.deepEqual(legacy,before);
});
test("flower shops are fictional, have no coordinates and do not appear in production catalogue",()=>{
  const s=modernDemoState(now);assert.equal(catalogue(s,now).listings.length,13);assert.equal(catalogue(s,now,true).listings.length,0);
  for(const shop of flowerShops){assert.equal(shop.lat,null);assert.equal(shop.lng,null);assert.equal(shop.mock,true);assert.match(shop.address,/hồ sơ sáng tạo/);}
  assert.ok(!catalogue(s,now).listings.some(l=>"floor" in l||"cost" in l));
  const q=call(s,"student","quote",{listingId:"flower-hoa-chuong",qty:1});assert.equal(q.total,34300);assert.equal(q.distance,null);assert.equal(q.bonusDiscount,0);
});
test("modern flower payment, handover and claim retain merchant liability after refund",()=>{
  const s=modernDemoState(now),q=call(s,"student","quote",{listingId:"flower-hoa-chuong",qty:1});
  const o=call(s,"student","order",{quoteId:q.id});const stored=s.orders.find(x=>x.id===o.id)!;
  call(s,"ops","payment",{orderId:o.id,reference:"flower-payment",amount:orderTotal(s,stored),receivedAt:now});call(s,"ops","pickup",{orderId:o.id,code:stored.code});
  call(s,"student","report_issue",{orderId:o.id,description:"Hoa nhận khác thông tin mô phỏng"});call(s,"ops","resolve_issue",{id:s.issues![0].id,refund:true,resolution:"Hoàn tiền DEMO sau nhận"});
  assert.equal(ledger(s).merchantDue,20580);assert.equal(s.refunds[0].amount,34300);
});
test("Pages uses exact shared base prices; fixed voucher is refused for low-margin sunflower",()=>{
  const s={...newFlowerSession(now),place:"Vị trí giả định"};assert.equal(flowerDemoPrice("flower-huong-duong",1,"none").total,20300);
  assert.match(flowerQuoteError(s,"flower-huong-duong",1,"9k",now),/biên/);assert.equal(flowerQuoteError(s,"flower-huong-duong",1,"10",now),"");
  assert.match(flowerQuoteError({...s,place:""},"flower-ken-hong",1,"15",now),/vị trí/);
});
test("Pages stock/budget/voucher reservation is idempotent and restored at expiry or cancellation",()=>{
  const s={...newFlowerSession(now),place:"Vị trí giả định"},a=reserveFlower(s,"flower-ken-hong",2,"15",now,"FLOWER-a");
  assert.equal(flowerStock(a,"flower-ken-hong",now),1);assert.equal(flowerVoucherRemaining(a,"15",now),1);assert.equal(reserveFlower(a,"flower-ken-hong",2,"15",now,"FLOWER-a"),a);
  assert.match(flowerQuoteError(a,"flower-ken-hong",1,"none",now),/Hoàn tất/);assert.equal(flowerStock(a,"flower-ken-hong",now+600000),3);assert.equal(flowerVoucherRemaining(a,"15",now+600000),2);
  const b=progressFlower(a,"FLOWER-a","cancel",now);assert.equal(flowerStock(b,"flower-ken-hong",now),3);
});
test("Pages weekly limits, closing time and budget are checked without hidden discounts",()=>{
  let s={...newFlowerSession(now),place:"Vị trí giả định"};
  for(let i=0;i<2;i++){s=reserveFlower(s,"flower-ken-hong",1,"15",now,`FLOWER-${i}`);s=progressFlower(s,`FLOWER-${i}`,"pay",now);s=progressFlower(s,`FLOWER-${i}`,"receive",now);}
  assert.match(flowerQuoteError(s,"flower-ly-kep-trang",1,"15",now),/hết lượt/);
  assert.match(flowerQuoteError(s,"flower-ken-hong",1,"none",now+10800000),/khung nhận/);
  const exhausted={...newFlowerSession(now),place:"Vị trí giả định",orders:Array.from({length:56},(_,i)=>({...s.orders[0],id:`FLOWER-budget-${i}`,voucher:"9k" as const,discount:9000,productId:"flower-ly-kep-trang"}))};
  assert.match(flowerQuoteError(exhausted,"flower-ly-kep-hong",1,"10",now),/Ngân sách/);
});
test("Pages claims/refunds keep handover payout and consumed voucher, prevent duplicate refunds",()=>{
  let s={...newFlowerSession(now),place:"Vị trí giả định"};s=reserveFlower(s,"flower-ken-hong",1,"9k",now,"FLOWER-a");s=progressFlower(s,"FLOWER-a","pay",now);s=progressFlower(s,"FLOWER-a","receive",now);s=progressFlower(s,"FLOWER-a","issue",now,"Sai lượng hoa mô phỏng");s=progressFlower(s,"FLOWER-a","refund",now);
  assert.equal(s.orders[0].payout,41580);assert.equal(s.orders[0].total,60300);assert.equal(flowerStock(s,"flower-ken-hong",now),2);assert.equal(flowerVoucherRemaining(s,"9k",now),3);assert.throws(()=>progressFlower(s,"FLOWER-a","refund",now));assert.deepEqual(restoreFlowerSession(JSON.stringify(s),now),s);
});
test("Pages restore rejects malformed data and new Vietnam week restores quotas",()=>{
  const s=reserveFlower(newFlowerSession(now),"flower-ken-hong",1,"none",now,"FLOWER-a");
  for(const raw of ['null','{}','bad',JSON.stringify({...s,orders:[{...s.orders[0],total:1}]}),JSON.stringify({...s,orders:[s.orders[0],s.orders[0]]})])assert.deepEqual(restoreFlowerSession(raw,now),newFlowerSession(now));
  const sunday=Date.parse("2026-11-08T23:59:00+07:00"),a=reserveFlower({...newFlowerSession(sunday),place:"Vị trí giả định"},"flower-ken-hong",1,"15",sunday,"FLOWER-week");assert.equal(a.orders[0].expires,sunday+60000);assert.equal(flowerVoucherRemaining(a,"15",sunday+60000),2);
});
