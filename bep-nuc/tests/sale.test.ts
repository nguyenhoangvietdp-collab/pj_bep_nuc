import test from "node:test";
import assert from "node:assert/strict";
import {act,tradingDemoState,catalogue,view} from "../lib/domain";
import {requestProduct} from "../lib/request-catalogue";
import {hasSale,validSale,saleState} from "../lib/trading";
const now=Date.parse("2026-11-02T18:30:00+07:00");
function setup(kind="food"){
 const s=tradingDemoState(now),l=s.listings[kind==="food"?0:1];s.shops[0].mock=false;
 l.price=69300;l.lot={...l.lot!,checkedAt:now-3600000,referenceKind:"store_regular",referencePrice:99000,referenceEvidence:"Private invoice / seller confirmation for identical contents",referenceConfirmedAt:now-3600000,saleStart:now-300000,saleEnd:now+300000};
 const call=(who:string,action:string,args:any={},at=now)=>act(s,s.users.find(x=>x.id===who)!,action,{key:crypto.randomUUID(),...args},at,null,{production:false,pilotEnabled:false,bankReady:false}) as any;
 const quote=(at=now,args:any={})=>call("student","quote",{listingId:l.id,qty:1,...args},at);
 return {s,l,call,quote};
}
test("food and flower sale prices use confirmed comparable regular price, floor percentages, and no voucher in saving",()=>{
 for(const kind of ["food","flowers"]){const f=setup(kind);let item=catalogue(f.s,now).listings.find(x=>x.id===f.l.id)!;assert.equal(item.saleVerified,true);assert.equal(saleState(item,now)!.percent,30);assert.equal(saleState(item,now)!.saved,29700);f.l.lot!.referencePrice=100000;item=catalogue(f.s,now).listings.find(x=>x.id===f.l.id)!;assert.equal(saleState(item,now)!.percent,30);assert.equal(saleState({...item,saleVerified:false},now),null);assert.equal(saleState({...item,price:1.5},now),null);}
 const f=setup();delete f.l.lot!.referenceKind;delete f.l.lot!.referenceConfirmedAt;delete f.l.lot!.saleStart;delete f.l.lot!.saleEnd;assert.equal(hasSale(f.l.lot),false);assert.equal(saleState(catalogue(f.s,now).listings[0],now),null);assert.equal(f.quote().total,69300);
});
test("clock boundaries distinguish upcoming, active and ended and cannot be bypassed by browser prices",()=>{
 for(const offset of [-300001,-300000,299999,300000]){const f=setup(),at=now+offset,item=catalogue(f.s,at).listings.find(x=>x.id===f.l.id)!;const status=offset< -300000?"upcoming":offset>=300000?"ended":"active";assert.equal(saleState(item,at)!.status,status);if(status==="active")assert.equal(f.quote(at,{price:1,saleEnd:at+999999}).total,69300);else {assert.throws(()=>f.quote(at,{price:1,saleStart:at-1,saleEnd:at+999999}),/Sale/);assert.equal(f.s.quotes.length,0);assert.equal(f.s.orders.length,0);}}
});
test("invalid price evidence, dates, unapproved or mock sources never issue sale quotes",()=>{
 for(const change of ["evidence","price","kind","future","window","missing","unapproved","mock"]){const f=setup();if(change==="evidence")f.l.lot!.referenceEvidence="";if(change==="price")f.l.lot!.referencePrice=f.l.price;if(change==="kind")f.l.lot!.referenceKind="other" as any;if(change==="future")f.l.lot!.referenceConfirmedAt=now+1;if(change==="window")f.l.lot!.saleEnd=f.l.end+1;if(change==="missing")delete f.l.lot!.saleStart;if(change==="unapproved")f.l.approved=false;if(change==="mock")f.s.shops[0].mock=true;assert.throws(()=>f.quote());assert.equal(f.s.quotes.length,0);}
});
test("sale quote expires no later than sale end and preserves accepted order price and payout snapshots",()=>{
 const f=setup(),q=f.quote(),internal=f.s.quotes[0];assert.equal(q.expires,now+300000);assert.equal(q.menuTotal,69300);assert.equal(q.baseDiscount,0);const payout=internal.payout;
 const o=f.call("student","order",{quoteId:q.id});f.l.price=80000;f.l.floor=50000;f.l.lot!.referencePrice=120000;assert.equal(internal.price,69300);assert.equal(internal.payout,payout);assert.equal(internal.lotSnapshot!.referencePrice,99000);const order=view(f.s,f.s.users[0],now).orders.find(x=>x.id===o.id)!;assert.equal(order.total,69300);
 const g=setup(),held=g.quote();assert.throws(()=>g.call("student","order",{quoteId:held.id},held.expires),/hết hạn/);assert.equal(g.s.orders.length,0);
});
test("private evidence stays in operator data; public catalogue, quote and order expose only a source summary",()=>{
 const f=setup(),evidence=f.l.lot!.referenceEvidence!;assert.ok(!JSON.stringify(catalogue(f.s,now)).includes(evidence));const q=f.quote();assert.ok(!JSON.stringify(q).includes(evidence));f.call("student","order",{quoteId:q.id});assert.ok(!JSON.stringify(view(f.s,f.s.users[0],now)).includes(evidence));assert.ok(JSON.stringify(view(f.s,f.s.users.find(x=>x.role==="ops")!,now)).includes(evidence));
});
test("listing requires explicit comparable-price confirmation and server stamps confirmation time",()=>{
 const f=setup(),args={...f.l,lot:{...f.l.lot},saleConfirmed:true};delete (args as any).id;args.lot.referenceConfirmedAt=1;f.call("merchant","listing",args);const created=f.s.listings.at(-1)!;assert.equal(created.lot!.referenceConfirmedAt,now);assert.equal(created.approved,false);assert.equal(catalogue(f.s,now).listings.some(l=>l.id===created.id),false);
 assert.throws(()=>f.call("ops","listing",{...args,saleConfirmed:false}),/xác nhận/);assert.throws(()=>f.call("ops","listing",{...args,lot:{...args.lot,referencePrice:100}}),/không hợp lệ/);assert.throws(()=>f.call("ops","listing",{...args,lot:{...args.lot,saleEnd:now-1}}),/không hợp lệ/);
 f.call("ops","approve_listing",{id:created.id,floor:created.floor,cost:created.cost,margin:created.margin,confirmed:true});assert.equal(catalogue(f.s,now).listings.find(l=>l.id===created.id)!.saleVerified,true);
});
test("sale and collection windows stay separate and inventory remains authoritative",()=>{
 const f=setup();f.l.start=now+600000;assert.ok(validSale(f.l.lot,f.l.price,now,f.l.end));const q=f.quote();assert.equal(q.expires,now+300000);assert.equal(q.total,69300);const g=setup();g.l.stock=0;assert.throws(()=>g.quote(),/tồn/);
});

test("flower inquiry quotes use actual sale snapshot, expire at sale end and still need explicit customer consent",()=>{
 const f=setup("flowers"),p=requestProduct("flower-ly-kep-trang")!;Object.assign(f.l.lot!,{species:p.name,catalogueProductId:p.id,quantity:p.quantity});
 const r=f.call("student","meal_request",{name:p.name,productId:p.id,qty:1,rate:0,fulfillment:"pickup"});assert.equal(f.s.quotes.length,0);
 f.call("ops","confirm_meal_request",{requestId:r.id,listingId:f.l.id,fee:0,appliedRate:0,sourceConfirmed:true});const req=view(f.s,f.s.users[0],now).mealRequests[0];assert.equal(req.quote!.unitPrice,69300);assert.equal(req.quote!.priceBreakdown.total,69300);assert.equal(req.quote!.saleVerified,true);assert.equal(req.quote!.expires,now+300000);assert.equal(f.s.orders.length,0);
 assert.throws(()=>f.call("student","accept_meal_request",{requestId:r.id,revision:0}),/đã đổi/);f.call("student","accept_meal_request",{requestId:r.id,revision:1});assert.equal(f.s.orders[0].status,"awaiting_payment");assert.equal(f.s.payments.length,0);
});
