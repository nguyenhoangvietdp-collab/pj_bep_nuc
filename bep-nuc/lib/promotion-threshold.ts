import {voucherDiscount,type VoucherValue} from "./trading.ts";
export type PromotionThreshold={qty:number;subtotal:number};
export type PromotionBasis={unitPrice:number;payout:number;cost:number;margin:number;minimumBasket?:number;maxQty?:number};
// Costs and required contribution are per sale unit, just like the quote engine.
export function promotionThreshold(b:PromotionBasis,voucher?:VoucherValue,extraRoom=false):PromotionThreshold|null{
 const max=Math.min(3,b.maxQty??3),minimum=b.minimumBasket??0;
 if(![b.unitPrice,b.payout,b.cost,b.margin,minimum,max].every(n=>Number.isSafeInteger(n)&&n>=0)||b.unitPrice<=0)throw Error("Cơ sở ngưỡng ưu đãi không hợp lệ");
 for(let qty=1;qty<=max;qty++){
  const subtotal=b.unitPrice*qty,discount=voucherDiscount(subtotal,voucher);
  if(subtotal<minimum||voucher&&discount<=0)continue;
  if(subtotal-discount>0&&subtotal-discount>=(b.payout+b.cost+Math.max(1,b.margin))*qty+(extraRoom?1:0))return {qty,subtotal};
 }
 return null;
}
export function promotionThresholds(b:PromotionBasis,cap15:number,cap10:number){
 return {percent15:promotionThreshold(b,{rate:.15,cap:cap15}),percent10:promotionThreshold(b,{rate:.1,cap:cap10}),fixed:promotionThreshold(b,{rate:0,amount:9000}),pickup:promotionThreshold(b,undefined,true)};
}
export function thresholdFor(thresholds:ReturnType<typeof promotionThresholds>|undefined,rate:number){
 return rate===9000?thresholds?.fixed:rate===.15?thresholds?.percent15:rate===.1?thresholds?.percent10:undefined;
}
