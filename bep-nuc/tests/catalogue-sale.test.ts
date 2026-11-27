import test from "node:test";
import assert from "node:assert/strict";
import policy from "../lib/catalogue-sale-policy.json";
import {catalogueSale,legacyNegotiatedPricing} from "../lib/catalogue-sale";
import {requestProducts,requestPrice,requestProduct} from "../lib/request-catalogue";
test("the food menu price is the original; customer and merchant prices use separate rates",()=>{
 const menu=requestProduct(undefined,"Bún đậu")!;
 assert.deepEqual(menu.catalogueSale,{version:3,originalPrice:60000,salePrice:57000,discountPercent:5,negotiatedPrice:42000,negotiatedDiscountPercent:30,source:"owner_policy"});
 assert.equal(requestPrice(menu),57000);
 const bun=legacyNegotiatedPricing(45000,30);assert.equal(bun.originalPrice,64286);assert.equal(bun.salePrice,61072);assert.equal(bun.discountPercent,5);assert.equal(bun.negotiatedPrice,45000);
 assert.equal(catalogueSale(101,"meal").salePrice,96);
 assert.equal(catalogueSale(101,"meal").negotiatedPrice,70);
 for(const p of requestProducts){assert.equal(p.catalogueSale!.discountPercent,5);assert.equal(requestPrice(p),Math.ceil(p.catalogueSale!.originalPrice*.95));}
 const flower=requestProduct("flower-ken-hong")!;assert.equal(requestPrice(flower),94050);assert.equal(flower.catalogueSale!.originalPrice,99000);
});
test("negotiated35% has separate customer5% and leaves old snapshots readable",()=>{
 const overrides=policy.productNegotiatedDiscounts as Record<string,number>;overrides["store-product"]=35;
 try{const p=catalogueSale(35000,"store-product");assert.equal(p.originalPrice,35000);assert.equal(p.salePrice,33250);assert.equal(p.negotiatedPrice,22750);assert.equal(p.negotiatedDiscountPercent,35);assert.equal(p.discountPercent,5);}finally{delete overrides["store-product"];}
 const old={...requestProduct("flower-ken-hong")!,catalogueSale:{originalPrice:99000,discountPercent:30,source:"owner_policy"}} as any;assert.equal(requestPrice(old),69300);
 const v2={...requestProduct(undefined,"Bún đậu")!,catalogueSale:legacyNegotiatedPricing(60000,30)};
 assert.equal(requestPrice(v2),81430);
 assert.throws(()=>catalogueSale(0,"bad"));assert.throws(()=>catalogueSale(12.5,"bad"));assert.throws(()=>legacyNegotiatedPricing(45000,20));
});
