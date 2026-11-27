import type {PickupPricing} from "./pickup-pricing.ts";
import {voucherDiscount} from "./trading.ts";
export type PaymentAmounts={pickupPricing?:PickupPricing;menuTotal:number;baseDiscount:number;voucherDiscount:number;bonusDiscount:number;total:number};
export function paymentTotal(items:number,method:"pickup"|"delivery",grossFee?:number,support=0){
 return method==="delivery"&&grossFee===undefined?undefined:items+(method==="delivery"?Math.max(0,grossFee!-support):0);
}
// This is a request scenario, not an awarded voucher or payable quote.
export function requestPayment(unitPrice:number,qty:number,rate:number,cap?:number,originalUnitPrice?:number){
 const base=unitPrice*qty,menuTotal=(originalUnitPrice??unitPrice)*qty;
 const discount=rate===9000?(base>9000?9000:0):voucherDiscount(base,{rate,cap:cap!==undefined&&cap>0?cap:undefined});
 return {menuTotal,baseDiscount:menuTotal-base,voucherDiscount:discount,bonusDiscount:0,total:base-discount};
}
