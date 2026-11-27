import {promotionThreshold} from "./promotion-threshold.ts";
import {launchAssumptions} from "./launch-assumptions.ts";
import {requestPayment} from "./payment-summary.ts";
import {pickupPricing} from "./pickup-pricing.ts";

// Planning only. This result is never an order price, issued voucher or reservation.
export function launchEstimate(input:{unitPrice:number;originalUnitPrice?:number;supplierUnitPrice:number;qty:number;rate:number;method:"pickup"|"delivery";grossFee?:number}){
  const {unitPrice,originalUnitPrice,supplierUnitPrice,qty,rate,method,grossFee}=input;
  if(![unitPrice,supplierUnitPrice,qty].every(n=>Number.isSafeInteger(n)&&n>0)||qty>3||![0,.15,.1,9000].includes(rate)||grossFee!==undefined&&(!Number.isSafeInteger(grossFee)||grossFee<0||grossFee>1000000))throw Error("Dữ liệu dự tính không hợp lệ");
  const r=launchAssumptions.rules,base=unitPrice*qty,minimum=(supplierUnitPrice+launchAssumptions.cost+launchAssumptions.margin)*qty;
  const desired=requestPayment(unitPrice,qty,rate,rate===.15?r.cap15:rate===.1?r.cap10:undefined,originalUnitPrice);
  const threshold=promotionThreshold({unitPrice,payout:supplierUnitPrice,cost:launchAssumptions.cost,margin:launchAssumptions.margin,minimumBasket:r.minimumBasket},rate===0?undefined:rate===9000?{rate:0,amount:9000}:{rate,cap:rate===.15?r.cap15:r.cap10});
  const basicEligible=!!threshold&&qty>=threshold.qty&&desired.total>=minimum&&desired.voucherDiscount<=r.weeklyBudget;
  const amounts=basicEligible?desired:requestPayment(unitPrice,qty,0,undefined,originalUnitPrice);
  const room=Math.max(0,amounts.total-minimum),budget=Math.max(0,r.weeklyBudget-amounts.voucherDiscount);
  const pickup=method==="pickup"?pickupPricing(base,true,room,budget):undefined;
  amounts.bonusDiscount=pickup?.applied??0;amounts.total-=amounts.bonusDiscount;
  const shippingSupport=method==="delivery"&&grossFee!==undefined?Math.min(Math.floor(grossFee*.3),r.shippingCap,room,budget):0;
  return {amounts,basicEligible,pickup,shippingSupport,threshold};
}
