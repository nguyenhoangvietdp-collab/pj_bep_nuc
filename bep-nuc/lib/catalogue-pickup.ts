import type {RequestProduct} from "./request-catalogue.ts";
import {launchEstimate} from "./launch-estimate.ts";

// Catalogue scenario before choosing a basic voucher; checkout recalculates the combination.
export function cataloguePickup(product:RequestProduct){
 const pricing=product.catalogueSale;
 if(!pricing||!("negotiatedPrice" in pricing))return undefined;
 return launchEstimate({unitPrice:pricing.salePrice,originalUnitPrice:pricing.originalPrice,supplierUnitPrice:pricing.negotiatedPrice,qty:1,rate:0,method:"pickup"}).amounts.bonusDiscount;
}
