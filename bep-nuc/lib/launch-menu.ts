import {catalogueSale} from "./catalogue-sale";
import { productAssets,menuDishId } from "./product-assets";
import { normalize } from "./commerce";
import {storeLocations} from "./store-locations";
// Keep legacy IDs and labels; display the owner-supplied storefront names.
export const menuShops=storeLocations.map(s=>({...s,mock:false}));
export const launchPartner=menuShops[0];
export const launchMenuNames=launchPartner.menu;
export function filterLaunchMenu(query = "", category = "", budget = 0, sort = "end") {
  const term=normalize(query);
  const items=productAssets.flatMap(p=>{
    const shop=menuShops.find(s=>s.menu.includes(p.name));
    const cataloguePrice=catalogueSale(p.referencePrice,menuDishId(p.image)).salePrice;
    if(!shop || (term&&!term.split(/\s+/).every(word=>normalize(`${p.name} ${shop.label} ${shop.name} ${shop.address}`).includes(word))) || (category&&p.category!==category) || (budget&&cataloguePrice>budget))return [];
    return [{...p,shop,cataloguePrice}];
  });
  return sort==="price"?items.sort((a,b)=>a.cataloguePrice-b.cataloguePrice):items;
}
