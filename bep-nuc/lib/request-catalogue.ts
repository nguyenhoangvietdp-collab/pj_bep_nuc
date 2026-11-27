import {catalogueSale,type CatalogueSale} from "./catalogue-sale.ts";
import {flowerCatalogue} from "./flower-demo.ts";
import {productAssets,menuDishId} from "./product-assets.ts";
import {normalize} from "./commerce.ts";
export type RequestProduct={id:string;name:string;shopId?:string;kind:"food"|"flowers";image:string;category:string;referencePrice:number;targetPrice?:number;catalogueSale?:CatalogueSale;quantity:{amount:number;unit:"suất"|"cành"|"bông"|"bó"};note:string};
export const requestProducts:RequestProduct[]=[
 ...productAssets.map(p=>({id:menuDishId(p.image),name:p.name,kind:"food" as const,image:p.image,category:p.category,referencePrice:p.referencePrice,catalogueSale:catalogueSale(p.referencePrice,menuDishId(p.image)),quantity:{amount:1,unit:"suất" as const},note:"Khẩu phần và khả năng phục vụ cần được cửa hàng xác nhận."})),
 ...flowerCatalogue.map(p=>({id:p.id,name:p.name,shopId:p.shopId,kind:"flowers" as const,image:p.image,category:"Hoa cắm nhà",referencePrice:p.referencePrice,targetPrice:p.catalogueSale.negotiatedPrice,catalogueSale:p.catalogueSale,quantity:p.quantity,note:p.note})),
];
export function requestProduct(id?:string,name?:string){return id?requestProducts.find(p=>p.id===id):requestProducts.find(p=>p.name===name);}
export const requestUnit=(p:RequestProduct)=>`${p.quantity.amount} ${p.quantity.unit}`;
export const requestPrice=(p:RequestProduct)=>p.catalogueSale&&"salePrice" in p.catalogueSale?p.catalogueSale.salePrice:p.targetPrice??p.referencePrice;
export function filterRequestFlowers(query="",budget=0,sort="end"){
 const term=normalize(query);
 return requestProducts.filter(p=>p.kind==="flowers"&&(!term||normalize(p.name).includes(term))&&(!budget||requestPrice(p)<=budget)).sort((a,b)=>sort==="price"?requestPrice(a)-requestPrice(b):0);
}
