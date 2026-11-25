import type {RequestProduct} from "./request-catalogue.ts";
import type {SavedPlace} from "./trading.ts";
import {storeLocations} from "./store-locations.ts";
import {straightLineKm} from "./pickup-pricing.ts";
import {launchEstimate} from "./launch-estimate.ts";

// Catalogue scenario before choosing a basic voucher; checkout recalculates the combination.
export function cataloguePickup(product:RequestProduct,origin?:SavedPlace,store?:{lat?:number|null;lng?:number|null}){
 const pricing=product.catalogueSale;
 const point=product.kind==="food"?storeLocations.find(s=>s.menu.includes(product.name))??store:store;
 const distanceKm=straightLineKm(origin,point?{lat:point.lat??null,lng:point.lng??null}:undefined);
 if(distanceKm===null||!pricing||!("negotiatedPrice" in pricing))return undefined;
 return launchEstimate({unitPrice:pricing.salePrice,originalUnitPrice:pricing.originalPrice,supplierUnitPrice:pricing.negotiatedPrice,qty:1,rate:0,method:"pickup",distanceKm}).amounts.bonusDiscount;
}
