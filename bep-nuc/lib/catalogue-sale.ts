import policy from "./catalogue-sale-policy.json" with {type:"json"};
export type LegacyCatalogueSale={originalPrice:number;discountPercent:30|35;source:"owner_policy"};
export type CustomerPricing={originalUnitPrice:number;saleUnitPrice:number;baseDiscountPercent:5};
export type NegotiatedCatalogueSale={version:2;originalPrice:number;discountPercent:5;negotiatedPrice:number;negotiatedDiscountPercent:30|35;salePrice:number;source:"owner_policy"};
export type CatalogueSale=LegacyCatalogueSale|NegotiatedCatalogueSale;
export function negotiatedPricing(negotiatedPrice:number,rate:number):NegotiatedCatalogueSale{
 if(!Number.isSafeInteger(negotiatedPrice)||negotiatedPrice<=0||![30,35].includes(rate))throw Error("Giá đàm phán hoặc mức giảm không hợp lệ");
 const divisor=BigInt(100-rate),original= (BigInt(negotiatedPrice)*100n+divisor-1n)/divisor;
 const originalPrice=Number(original),salePrice=Number((original*95n+99n)/100n);
 if(!Number.isSafeInteger(originalPrice)||!Number.isSafeInteger(salePrice))throw Error("Giá vượt giới hạn");
 return {version:2,originalPrice,discountPercent:5,negotiatedPrice,negotiatedDiscountPercent:rate as 30|35,salePrice,source:"owner_policy"};
}
export function customerPricingOf(p:NegotiatedCatalogueSale):CustomerPricing{return {originalUnitPrice:p.originalPrice,saleUnitPrice:p.salePrice,baseDiscountPercent:5};}
export function catalogueSale(negotiatedPrice:number,id:string){
 return negotiatedPricing(negotiatedPrice,(policy.productNegotiatedDiscounts as Record<string,number>)[id]??policy.defaultNegotiatedDiscountPercent);
}
