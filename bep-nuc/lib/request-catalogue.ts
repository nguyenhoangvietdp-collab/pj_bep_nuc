import flowers from "./flower-catalogue.json" with {type:"json"};
import {productAssets,menuDishId} from "./product-assets.ts";
import {normalize} from "./commerce.ts";
export type RequestProduct={id:string;name:string;kind:"food"|"flowers";image:string;category:string;referencePrice:number;targetPrice?:number;quantity:{amount:number;unit:"suất"|"cành"|"bông"|"bó"};note:string};
export const requestProducts:RequestProduct[]=[
 ...productAssets.map(p=>({id:menuDishId(p.image),name:p.name,kind:"food" as const,image:p.image,category:p.category,referencePrice:p.referencePrice,quantity:{amount:1,unit:"suất" as const},note:"Khẩu phần và khả năng phục vụ cần được cửa hàng xác nhận."})),
 ...flowers.map(p=>({id:p.id,name:p.name,kind:"flowers" as const,image:p.image,category:"Hoa cắm nhà",referencePrice:p.referencePrice,targetPrice:p.price,quantity:p.quantity as RequestProduct["quantity"],note:p.note})),
];
export function requestProduct(id?:string,name?:string){return id?requestProducts.find(p=>p.id===id):requestProducts.find(p=>p.name===name);}
export const requestUnit=(p:RequestProduct)=>`${p.quantity.amount} ${p.quantity.unit}`;
export const requestPrice=(p:RequestProduct)=>p.targetPrice??p.referencePrice;
export function filterRequestFlowers(query="",budget=0,sort="end"){
 const term=normalize(query);
 return requestProducts.filter(p=>p.kind==="flowers"&&(!term||normalize(p.name).includes(term))&&(!budget||requestPrice(p)<=budget)).sort((a,b)=>sort==="price"?requestPrice(a)-requestPrice(b):0);
}
