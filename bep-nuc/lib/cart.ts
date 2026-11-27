// Simulated cart: browser only. Nothing here creates an order, reserves stock or takes money.
import {requestProduct,requestPrice,requestUnit} from "./request-catalogue.ts";
import {nearDateTemplates,nearDateBasis} from "./near-date-templates.ts";
import {menuShops} from "./launch-menu.ts";
import {catalogueIllustration,catalogueIllustrations} from "./public-catalogue.ts";
import {launchEstimate} from "./launch-estimate.ts";
import {launchAssumptions} from "./launch-assumptions.ts";
import {requestPayment,type PaymentAmounts} from "./payment-summary.ts";

export const cartKey="bn-cart-v1";
export const cartMaxQty=3;
export type CartLine={id:string;qty:number};
export type CartProduct={id:string;name:string;spec:string;image:string;imageCredit?:string;unitPrice:number;originalUnitPrice?:number;supplierUnitPrice?:number;shop?:{id:string;name:string;address:string};nearDate:boolean};

export function cartProduct(id:string):CartProduct|undefined{
  const template=nearDateTemplates.find(t=>t.id===id);
  if(template)return {id,name:template.title,spec:template.spec,image:template.credit?`/near-date-illustrations/${id}.jpg`:"",imageCredit:template.credit?.license.startsWith("CC BY-SA")?`Ảnh: ${template.credit.author}, ${template.credit.license}`:undefined,...nearDateBasis(template),nearDate:true};
  const product=requestProduct(id||" ");
  if(!product)return undefined;
  const sale=product.catalogueSale,shop=menuShops.find(s=>product.shopId?s.id===product.shopId:s.menu.includes(product.name));
  const photo=catalogueIllustrations.find(p=>p.productId===id);
  return {id,name:product.name,spec:requestUnit(product),image:catalogueIllustration(id,product.image),imageCredit:photo?.license.startsWith("CC BY-SA")?`Ảnh: ${photo.credit}, ${photo.license}`:undefined,unitPrice:requestPrice(product),originalUnitPrice:sale?.originalPrice,supplierUnitPrice:sale&&"negotiatedPrice" in sale?sale.negotiatedPrice:undefined,shop:shop&&{id:shop.id,name:shop.name,address:shop.address},nearDate:false};
}

const clampQty=(qty:number)=>Math.min(cartMaxQty,Math.max(1,Math.trunc(qty)));

// Stored data is untrusted: unknown ids, bad quantities and duplicates are dropped.
export function parseCart(raw:string|null):CartLine[]{
  let data:unknown;
  try{data=JSON.parse(raw??"[]");}catch{return [];}
  if(!Array.isArray(data))return [];
  const seen=new Set<string>();
  return data.flatMap((line:any)=>{
    if(!line||typeof line.id!=="string"||!Number.isInteger(line.qty)||line.qty<1||seen.has(line.id)||!cartProduct(line.id))return [];
    seen.add(line.id);
    return [{id:line.id,qty:clampQty(line.qty)}];
  });
}

export function addToCart(lines:CartLine[],id:string,qty=1):CartLine[]{
  if(!cartProduct(id))return lines;
  return lines.some(l=>l.id===id)?lines.map(l=>l.id===id?{id,qty:clampQty(l.qty+qty)}:l):[...lines,{id,qty:clampQty(qty)}];
}
export const setCartQty=(lines:CartLine[],id:string,qty:number)=>lines.map(l=>l.id===id?{id,qty:clampQty(qty)}:l);
export const removeFromCart=(lines:CartLine[],id:string)=>lines.filter(l=>l.id!==id);
export const cartCount=(lines:CartLine[])=>lines.reduce((sum,l)=>sum+l.qty,0);

// Same inputs as the single-product checkout. No payout for the supplier means no voucher and no reward.
// Delivery fee is unknown in the cart, so no shipping support is estimated.
function lineAmounts(product:CartProduct,qty:number,rate:number,method:"pickup"|"delivery"){
  if(!product.supplierUnitPrice)return {eligible:false,amounts:requestPayment(product.unitPrice,qty,0,undefined,product.originalUnitPrice)};
  const estimate=launchEstimate({unitPrice:product.unitPrice,originalUnitPrice:product.originalUnitPrice,supplierUnitPrice:product.supplierUnitPrice,qty,rate,method});
  return {eligible:estimate.basicEligible,amounts:estimate.amounts};
}

export function cartTotals(lines:CartLine[],rate:number,method:"pickup"|"delivery"){
  const rows=lines.flatMap(line=>{
    const product=cartProduct(line.id);
    return product?[{line,product,amounts:lineAmounts(product,line.qty,0,method).amounts as PaymentAmounts}]:[];
  });
  // One voucher per cart: use it on the line where it lowers the cart total the most.
  let voucherLine:string|undefined,best=0,bestAmounts:PaymentAmounts|undefined;
  if(rate)for(const row of rows){
    const result=lineAmounts(row.product,row.line.qty,rate,method),saving=row.amounts.total-result.amounts.total;
    if(result.eligible&&result.amounts.voucherDiscount>0&&saving>best){best=saving;voucherLine=row.line.id;bestAmounts=result.amounts;}
  }
  let budget:number=launchAssumptions.rules.weeklyBudget-(bestAmounts?.voucherDiscount??0);
  const priced=rows.map(row=>{
    const source=row.line.id===voucherLine?bestAmounts!:row.amounts;
    const bonus=Math.min(source.bonusDiscount,Math.max(0,budget));
    budget-=bonus;
    return {...row,amounts:{...source,bonusDiscount:bonus,total:source.total+source.bonusDiscount-bonus}};
  });
  const sum=(key:"menuTotal"|"baseDiscount"|"voucherDiscount"|"bonusDiscount"|"total")=>priced.reduce((total,row)=>total+row.amounts[key],0);
  const amounts:PaymentAmounts={menuTotal:sum("menuTotal"),baseDiscount:sum("baseDiscount"),voucherDiscount:sum("voucherDiscount"),bonusDiscount:sum("bonusDiscount"),total:sum("total")};
  return {rows:priced,amounts,voucherLine};
}

// Lines grouped by pickup point; near-date samples are not tied to any named shop.
export function pickupGroups<T extends {product:CartProduct}>(rows:T[]){
  const groups=new Map<string,{key:string;name:string;address:string;rows:T[]}>();
  for(const row of rows){
    const shop=row.product.shop,key=shop?.id??(row.product.nearDate?"near-date":"unassigned");
    const group=groups.get(key)??{key,name:shop?.name??(row.product.nearDate?"Điểm bán mô phỏng · hàng gần hạn":"Nguồn hàng được xác nhận sau"),address:shop?.address??"",rows:[]};
    group.rows.push(row);groups.set(key,group);
  }
  return [...groups.values()];
}
