"use client";
import {useState} from "react";
import CheckoutVouchers from "./checkout-vouchers";
import FulfillmentChoice from "./fulfillment-choice";
import LaunchBenefitEstimate from "./launch-benefit-estimate";
import {money} from "../../lib/commerce";
import {requestPayment} from "../../lib/payment-summary";
import {launchAssumptions} from "../../lib/launch-assumptions";
import {nearDatePricing,nearDateBasis,nearDateExpiry,type NearDateTemplate} from "../../lib/near-date-templates";

export function NearDatePrice({template:t,now}:{template:NearDateTemplate;now:number}){
 const sale=nearDatePricing(t);
 return <div className="sale-price"><p className="sale-original">Giá niêm yết <del>{money(t.listPrice)}</del> / {t.unit}</p><div className="sale-price-main"><div><span className="sale-price-label">Giá trước voucher</span><strong>{money(sale.salePrice)} <small>/ {t.unit}</small></strong></div><span className="sale-badge">Giảm {sale.discountPercent}%</span></div><p><b>Quy cách:</b> {t.spec}</p><p><b>HSD {nearDateExpiry(t,now)}</b></p></div>;
}

// Chỉ tính ở trình duyệt: mẫu không phải lô thật nên không gửi lên máy chủ.
export function NearDateCheckout({template:t,now}:{template:NearDateTemplate;now:number}){
 const [qty,setQty]=useState(1),[rate,setRate]=useState(0),[method,setMethod]=useState<"pickup"|"delivery">("pickup");
 const price=nearDateBasis(t),basis={...price,qty,method},{cap15,cap10}=launchAssumptions.rules;
 const options=[0,.15,.1,9000].map(v=>({value:String(v),label:v===0?"Không dùng voucher":v===9000?"9.000đ":`${v*100}%`,detail:"",discount:requestPayment(price.unitPrice,qty,v,v===.15?cap15:v===.1?cap10:undefined,price.originalUnitPrice).voucherDiscount}));
 return <div className="checkout-layout request-checkout-layout"><div className="checkout-main">
  <section className="checkout-item">{t.credit&&<img src={`/near-date-illustrations/${t.id}.jpg`} alt={t.imageAlt} width="112" height="112"/>}<div><h3>{t.title}</h3>{t.credit&&<p className="fine">Ảnh minh họa{t.credit.license.startsWith("CC BY-SA")&&` · Ảnh: ${t.credit.author}, ${t.credit.license}`}</p>}<NearDatePrice template={t} now={now}/></div></section>
  <label className="checkout-quantity">Số đơn vị mua<select value={qty} onChange={e=>setQty(Number(e.target.value))}>{[1,2,3].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
  <FulfillmentChoice name="near-date-method" value={method} change={setMethod}/>
 </div><aside className="checkout-summary request-bill" aria-label="Hóa đơn dự tính">
  <CheckoutVouchers ready request value={String(rate)} options={options} change={v=>setRate(Number(v))}/>
  <LaunchBenefitEstimate {...basis} rate={rate} unit="đơn vị mua" changeQuantity={setQty} canRequest={false}/>
  <p className="bill-status">Đặt thử chỉ tính tiền. Chưa gửi đơn, giữ hàng hoặc thu tiền.</p>
 </aside></div>;
}
