import {voucherDiscount} from "./trading.ts";
export type PaymentAmounts={menuTotal:number;baseDiscount:number;voucherDiscount:number;bonusDiscount:number;total:number};
export function paymentTotal(items:number,method:"pickup"|"delivery",grossFee?:number,support=0){
 return method==="delivery"&&grossFee===undefined?undefined:items+(method==="delivery"?Math.max(0,grossFee!-support):0);
}
// This is a request scenario, not an awarded voucher or payable quote.
export function requestPayment(unitPrice:number,qty:number,rate:number,cap?:number){
 const menuTotal=unitPrice*qty;
 const discount=rate===9000?(menuTotal>9000?9000:0):voucherDiscount(menuTotal,{rate,cap:cap!==undefined&&cap>0?cap:undefined});
 return {menuTotal,baseDiscount:0,voucherDiscount:discount,bonusDiscount:0,total:menuTotal-discount};
}
