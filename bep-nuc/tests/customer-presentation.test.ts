import test from "node:test";
import assert from "node:assert/strict";
import * as React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import SalePrice from "../app/components/sale-price";
import PaymentSummary from "../app/components/payment-summary";
import NearDateInfo from "../app/components/near-date-info";
import NearDateFields from "../app/components/near-date-fields";
import type {NearDate} from "../lib/near-date";

// tsx executes the project's preserved JSX with the classic runtime in Node.
Object.assign(globalThis,{React});
const nearDate:NearDate={group:"drink",amount:2,unit:"chai",expiresAt:Date.parse("2099-01-01T18:00:00Z"),labelImage:"/food-images/label.png",batchCode:"LOT-123",origin:"Nhà cung cấp",sealed:true};
const html=(component:React.ComponentType<any>,props:object)=>renderToStaticMarkup(React.createElement(component,props));

test("near-date cards show Vietnam expiry date and pack size; details expose batch and label",()=>{
 const compact=html(NearDateInfo,{value:nearDate,compact:true});
 assert.match(compact,/HSD 02\/01\/2099/);
 assert.match(compact,/Mỗi đơn vị mua: 2 chai/);
 assert.doesNotMatch(compact,/LOT-123|Xem ảnh nhãn thật/);
 const detail=html(NearDateInfo,{value:nearDate});
 assert.match(detail,/LOT-123/);
 assert.match(detail,/href="\/food-images\/label.png"[^>]*>Xem ảnh nhãn thật/);
});

test("sale prices default to servings and put menu before pre-voucher and estimated total",()=>{
 const props={item:{price:19000,customerPricing:{originalUnitPrice:20000,saleUnitPrice:19000,baseDiscountPercent:5}},now:Date.now(),afterVoucher:17000,voucherName:"Cơ bản"};
 const result=html(SalePrice,props);
 assert.match(result,/\/ suất/);
 assert.doesNotMatch(result,/\/ lô/);
 assert.ok(result.indexOf("Giá menu")<result.indexOf("Giá trước voucher"));
 assert.ok(result.indexOf("Giá trước voucher")<result.indexOf("Sau voucher"));
 assert.match(html(SalePrice,{...props,item:{...props.item,lot:{kind:"goods",nearDate}}}),/\/ 2 chai/);
 assert.match(html(SalePrice,{...props,unitLabel:"hộp"}),/\/ hộp/);
});

test("payment presentation preserves pending delivery fees and labels menu and pre-voucher subtotal",()=>{
 const result=html(PaymentSummary,{amounts:{menuTotal:40000,baseDiscount:2000,voucherDiscount:1000,bonusDiscount:0,total:37000},qty:2,method:"delivery"});
 assert.ok(result.indexOf("Giá menu")<result.indexOf("Tiền hàng trước voucher"));
 assert.ok(result.indexOf("Tiền hàng trước voucher")<result.indexOf("Voucher cơ bản"));
 assert.match(result,/Chờ báo phí/);
 assert.match(result,/Tiền hàng tạm tính · chưa gồm phí giao/);
});

test("near-date form offers label upload for the lot and combo components without dropping required evidence",()=>{
 const result=html(NearDateFields,{group:"drink",unit:"combo",setGroup:()=>{},setUnit:()=>{},uploadImage:async()=>nearDate.labelImage,uploading:false});
 assert.equal((result.match(/type="file"/g)||[]).length,3);
 for(const name of ["labelImage","bundleLabel0","bundleLabel1","batchCode","expiresAt","origin"]){
  assert.match(result,new RegExp(`<input(?=[^>]*name="${name}")(?=[^>]*required)[^>]*>`));
 }
 assert.match(result,/accept="image\/jpeg,image\/png,image\/webp"/);
});
