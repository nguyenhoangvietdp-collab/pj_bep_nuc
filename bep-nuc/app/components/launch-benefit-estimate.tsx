"use client";
import {useState} from "react";
import {launchEstimate} from "../../lib/launch-estimate";
import {money} from "../../lib/commerce";
import HelpTip from "./help-tip";
import PickupPoint,{type PickupStore} from "./pickup-point";
import PaymentSummary from "./payment-summary";

export default function LaunchBenefitEstimate({unitPrice,originalUnitPrice,supplierUnitPrice,qty,rate,method,unit,store,changeQuantity}:{changeQuantity?:(qty:number)=>void;store?:PickupStore;unitPrice:number;originalUnitPrice?:number;supplierUnitPrice:number;qty:number;rate:number;method:"pickup"|"delivery";unit:string}){
  const [fee,setFee]=useState("");
  const grossFee=fee.trim()!==""&&Number.isSafeInteger(Number(fee))&&Number(fee)>=0&&Number(fee)<=1000000?Number(fee):undefined;
  const estimate=launchEstimate({unitPrice,originalUnitPrice,supplierUnitPrice,qty,rate,method,grossFee});
  const voucher=rate===9000?"9.000đ":rate?`${rate*100}%`:"Không dùng voucher";
  return <section className="launch-benefit-estimate" aria-label="Tính thử quyền lợi khởi động">
    <div className="help-heading"><h3>{method==="pickup"?"Tự lấy, tiết kiệm thêm":"Quyền lợi giao hàng"}</h3><HelpTip title="Cách tính quyền lợi"><p>2 voucher 15%, 2 voucher 10% (tối đa 9.000đ/lượt) và 4 voucher 9.000đ mỗi tuần trong kịch bản khởi động.</p><p>Khi chọn tự lấy, bạn được giảm thêm 5% trên giá trước voucher cơ bản.</p><p>Mức cộng thêm được giới hạn theo ngân sách và biên, giữ nguyên khoản trả tiệm. Giá cuối được chốt trong báo giá.</p></HelpTip></div>
    {method==="pickup"?<>{store&&<PickupPoint store={store}/>}
    {estimate.amounts.bonusDiscount>0&&<div className="pickup-reward-ticket" role="status"><strong>+{money(estimate.amounts.bonusDiscount)}</strong><p><b>Giảm thêm ngoài voucher cơ bản</b> · dự tính</p>{estimate.pickup?.limited&&<HelpTip title="Vì sao mức tự lấy được giới hạn?"><p>Theo công thức: {money(estimate.pickup.nominal)}. Mức dự tính sau giới hạn: {money(estimate.pickup.applied)}.</p><p>Khoản cộng thêm phải nằm trong ngân sách và phần biên còn lại sau voucher cơ bản, chi phí và khoản trả tiệm.</p></HelpTip>}</div>}{estimate.amounts.bonusDiscount===0&&<p role="status">Chưa có khoản tự lấy cộng thêm theo kịch bản này; voucher cơ bản vẫn giữ.</p>}</>:<><label>Phí giao hàng dự tính (đ)<input type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="Ví dụ: 20000" value={fee} onChange={e=>setFee(e.target.value)}/></label><HelpTip title="Cách tính hỗ trợ giao hàng"><p>Hỗ trợ 30% phí giao, tối đa 9.000đ, trong ngân sách và biên còn lại. Phí đang nhập chỉ để dự tính; phí thực tế được báo trước thanh toán.</p></HelpTip></>}
    {rate!==0&&!estimate.basicEligible&&<div className="promotion-threshold" role="status">{estimate.threshold?<><p>Ưu đãi này áp dụng từ <b>{money(estimate.threshold.subtotal)}</b> tiền hàng · {estimate.threshold.qty} {unit}.</p>{changeQuantity&&<button type="button" className="secondary" onClick={()=>changeQuantity(estimate.threshold!.qty)}>Chọn {estimate.threshold.qty} {unit}</button>}</>:<p>Quy cách này chưa đủ điều kiện ưu đãi trong tối đa 3 {unit}. Gửi nhu cầu để được xác nhận lại giá.</p>}<HelpTip title="Vì sao có ngưỡng ưu đãi?"><p>Ngưỡng tính trên giá sale trước voucher, theo khoản trả tiệm, chi phí và đóng góp tối thiểu. Tăng số lượng chỉ được đề xuất khi phép tính đủ điều kiện; không cộng gộp hàng từ các tiệm khác.</p><p>Phần dự tính dùng chi phí đang cấu hình. Báo giá máy chủ kiểm tra lại chi phí, biên và ngân sách.</p></HelpTip></div>}
    <PaymentSummary amounts={estimate.amounts} qty={qty} unit={unit} method={method} grossFee={method==="delivery"?grossFee:undefined} shippingSupport={estimate.shippingSupport} mode="request" voucher={rate===0||estimate.basicEligible?voucher:`${voucher} · chưa áp dụng`}/>
  </section>;
}
