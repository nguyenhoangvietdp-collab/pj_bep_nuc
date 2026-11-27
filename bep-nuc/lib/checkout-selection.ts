import type {SavedPlace} from "./trading.ts";
export type DeliveryContact={recipient:string;phone:string;address:string};
export type CheckoutSelection={version:1;placeId:string;fulfillment:"pickup"|"delivery";delivery?:DeliveryContact};
export const cleanDelivery=(d?:Partial<DeliveryContact>):DeliveryContact=>({recipient:(d?.recipient??"").trim(),phone:(d?.phone??"").replace(/[\s-]/g,""),address:(d?.address??"").trim()});
export function receivingReady(place:SavedPlace|undefined,method:string,delivery?:Partial<DeliveryContact>){
 const d=cleanDelivery(delivery);
 return !!place&&["pickup","delivery"].includes(method)&&(method==="pickup"||d.recipient.length>=2&&d.recipient.length<=100&&/^(0\d{9}|\+84\d{9})$/.test(d.phone)&&d.address.length>=10&&d.address.length<=250&&(d.address===place.address||d.address.startsWith(place.address+", ")));
}
export function checkoutSelection(place:SavedPlace|undefined,fulfillment:"pickup"|"delivery",delivery?:Partial<DeliveryContact>):CheckoutSelection|undefined{
 if(!receivingReady(place,fulfillment,delivery))return undefined;
 return {version:1,placeId:place!.id,fulfillment,...(fulfillment==="delivery"?{delivery:cleanDelivery(delivery)}:{})};
}
export const selectionKey=(selection:CheckoutSelection|undefined)=>selection?JSON.stringify(selection):"";
export function validateCheckoutSelection(selection:unknown,place:SavedPlace|undefined,fulfillment:"pickup"|"delivery",delivery?:Partial<DeliveryContact>):CheckoutSelection{
 const expected=checkoutSelection(place,fulfillment,delivery),a=selection as CheckoutSelection|undefined;
 if(!expected||!a||a.version!==1||a.placeId!==expected.placeId||a.fulfillment!==expected.fulfillment||fulfillment==="delivery"&&selectionKey({...expected,delivery:cleanDelivery(a.delivery)})!==selectionKey(expected))throw Error("Xác nhận lại địa chỉ và cách nhận trước khi chọn voucher hoặc tiếp tục");
 return expected;
}
