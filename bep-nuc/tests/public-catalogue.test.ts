import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import references from "../lib/public-catalogue-references.json";
import {catalogueIllustration,filterRetailReferences} from "../lib/public-catalogue";
import {requestProducts,requestPrice} from "../lib/request-catalogue";
import {nearDateCategory,nearDateGroups,retailLabel} from "../lib/near-date";

test("collected illustrations have reproducible files, provenance and stable canonical product IDs",()=>{
  const ids=new Set<string>();
  for(const p of references.illustrations){
    assert.ok(!ids.has(p.productId));ids.add(p.productId);
    const canonical=requestProducts.find(x=>x.id===p.productId);assert.ok(canonical);
    assert.notEqual(canonical.image,p.image); // Existing request/order image snapshots remain available.
    assert.ok(readFileSync(new URL('../public'+canonical.image,import.meta.url)).length);
    assert.equal(catalogueIllustration(p.productId,canonical.image),p.image);
    assert.equal(createHash("sha256").update(readFileSync(new URL('../public'+p.image,import.meta.url))).digest("hex"),p.sha256);
    assert.equal(new URL(p.sourceUrl).protocol,"https:");assert.ok(p.credit&&p.license&&p.changes);
    if(p.license.startsWith("CC "))assert.ok(p.licenseUrl);
  }
  assert.equal(catalogueIllustration("unknown","/original.jpg"),"/original.jpg");
});

test("external menu observations cover the menu without overriding negotiated customer pricing",()=>{
  const foods=requestProducts.filter(p=>p.kind==="food");
  assert.deepEqual(new Set(references.foodPrices.map(p=>p.productId)),new Set(foods.map(p=>p.id)));
  const chao=foods.find(p=>p.name==="Cháo quẩy")!,source=references.foodPrices.find(p=>p.productId===chao.id)!;
  assert.equal(source.priceVnd,25000);assert.equal(chao.referencePrice,35000);assert.equal(requestPrice(chao),47500);
  for(const p of references.foodPrices){assert.ok(p.unit&&p.note&&p.priceEvidence);assert.equal(p.scope,"external_menu_reference");assert.ok(Number.isSafeInteger(p.priceVnd)&&p.priceVnd>0);}
});

test("retail reference filters respect pack prices and all five retail groups without inventing sale eligibility",()=>{
  assert.equal(filterRetailReferences("",retailLabel).length,7);
  for(const group of Object.keys(nearDateGroups))assert.ok(filterRetailReferences("",nearDateCategory(group as keyof typeof nearDateGroups)).length>0);
  assert.equal(filterRetailReferences("hao hao",retailLabel,100000).length,0); // A whole carton is not one packet.
  assert.equal(filterRetailReferences("la vie",retailLabel)[0]?.unit,"1 thùng 24 chai × 500ml");
  const sorted=filterRetailReferences("",retailLabel,0,"price");assert.ok(sorted.every((p,i)=>i===0||p.priceVnd>=sorted[i-1].priceVnd));
  for(const p of references.goods){
    assert.ok(p.priceVnd>0&&p.sourceRegularPriceVnd>=p.priceVnd&&p.sourceSku&&p.priceEvidence);
    assert.equal(new URL(p.sourceUrl).hostname,"winmart.vn");
    assert.equal(createHash("sha256").update(readFileSync(new URL('../public'+p.image,import.meta.url))).digest("hex"),p.sha256);
    for(const field of ["expiresAt","stock","saleStart","saleEnd","shopId"])assert.equal(field in p,false);
  }
  assert.ok(!references.goods.some(p=>p.sourceSku.startsWith("10018164"))); // 850g title / 800g photo was rejected.
});
