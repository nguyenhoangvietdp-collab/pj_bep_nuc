import references from "./public-catalogue-references.json" with {type:"json"};
import {normalize} from "./commerce.ts";
import {nearDateCategory,retailLabel,type NearDateGroup} from "./near-date.ts";

// Public observations only. Never use these values for quotes, payouts or sale claims.
export const foodPriceReferences = references.foodPrices;
export const catalogueIllustrations = references.illustrations;
export const retailReferences = references.goods;
export const catalogueIllustration = (id:string, fallback:string) => catalogueIllustrations.find(p=>p.productId===id)?.image ?? fallback;
export function filterRetailReferences(query="",category=retailLabel,budget=0,sort="end") {
  const term=normalize(query);
  return retailReferences.filter(p=>(category===retailLabel||category===nearDateCategory(p.group as NearDateGroup))&&(!term||term.split(/\s+/).every(word=>normalize(`${p.name} ${p.unit}`).includes(word)))&&(!budget||p.priceVnd<=budget))
    .sort((a,b)=>sort==="price"?a.priceVnd-b.priceVnd:0);
}
