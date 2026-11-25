"use client";
import {useState} from "react";
import {launchEstimate} from "../../lib/launch-estimate";
import SavedPlace from "./saved-place";
import type {SavedPlace as Place} from "../../lib/trading";
import {straightLineKm} from "../../lib/pickup-pricing";
import {money} from "../../lib/commerce";
import HelpTip from "./help-tip";
import PickupPoint,{type PickupStore} from "./pickup-point";
import PaymentSummary from "./payment-summary";

export default function LaunchBenefitEstimate({unitPrice,originalUnitPrice,supplierUnitPrice,qty,rate,method,unit,origin,store,changeQuantity}:{changeQuantity?:(qty:number)=>void;origin?:Place;store?:PickupStore;unitPrice:number;originalUnitPrice?:number;supplierUnitPrice:number;qty:number;rate:number;method:"pickup"|"delivery";unit:string}){
  const [chosenStore,setChosenStore]=useState<Place>(),[fee,setFee]=useState("");
  const storeHasPoint=straightLineKm(store,store)!==null;
  const destination=storeHasPoint?store:chosenStore;
  const km=straightLineKm(origin,destination);
  const grossFee=fee.trim()!==""&&Number.isSafeInteger(Number(fee))&&Number(fee)>=0&&Number(fee)<=1000000?Number(fee):undefined;
  const estimate=launchEstimate({unitPrice,originalUnitPrice,supplierUnitPrice,qty,rate,method,distanceKm:km,grossFee});
  const voucher=rate===9000?"9.000đ":rate?`${rate*100}%`:"Không dùng voucher";
  return <section className="launch-benefit-estimate" aria-label="Tính thử quyền lợi khởi động">
    <div className="help-heading"><h3>{method==="pickup"?"Tự lấy, tiết kiệm thêm":"Quyền lợi giao hàng"}</h3><HelpTip title="Cách tính quyền lợi"><p>2 voucher 15%, 2 voucher 10% (tối đa 9.000đ/lượt) và 4 voucher 9.000đ mỗi tuần trong kịch bản khởi động.</p><p>Tự lấy cộng 8 điểm phần trăm/km, tối đa 2 km, trên giá sale trước voucher cơ bản. Dùng Haversine từ vị trí xuất phát và điểm nhận; đây là đường chim bay, không phải quãng đường lái xe.</p><p>Mức cộng thêm được giới hạn theo ngân sách và biên, giữ nguyên khoản trả tiệm. Giá cuối được chốt trong báo giá.</p></HelpTip></div>
    {method==="pickup"?<>{storeHasPoint?<PickupPoint store={store!}/>:<SavedPlace key={store?.id??"choose-store"} place={chosenStore} compact disabled={false} demo={false} allowCurrentLocation={false} initialAddress={store?.address} title={store?`Điểm nhận tại ${store.name}`:"Chọn điểm nhận của cửa hàng"} inputLabel="Địa chỉ cửa hàng để tính thử" description="Chọn đúng địa chỉ điểm nhận từ kết quả tìm kiếm. Điểm này chỉ dùng dự tính, không thay địa chỉ tiệm trên báo giá hoặc vị trí của bạn." onEditing={()=>setChosenStore(undefined)} save={async a=>{setChosenStore({...a,id:crypto.randomUUID(),savedAt:Date.now()});return true;}}/>}
    {!origin&&<p role="status">Lưu điểm xuất phát hoặc dùng vị trí hiện tại ở mục Địa chỉ & cách nhận để tính ưu đãi.</p>}
    {origin&&km===null&&<p role="status">Đã có điểm xuất phát của bạn. Chọn điểm nhận của cửa hàng để tự động tính khoảng cách.</p>}
    {km!==null&&<p className="pickup-distance">Đường chim bay: {new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(km)} km</p>}
    {km!==null&&estimate.amounts.bonusDiscount>0&&<div className="pickup-reward-ticket" key={`${km}:${estimate.amounts.bonusDiscount}`} role="status"><strong>+{money(estimate.amounts.bonusDiscount)}</strong><p><b>Giảm thêm ngoài voucher cơ bản</b> · dự tính</p>{estimate.pickup?.limited&&<HelpTip title="Vì sao mức tự lấy được giới hạn?"><p>Theo công thức: {money(estimate.pickup.nominal)}. Mức dự tính sau giới hạn: {money(estimate.pickup.applied)}.</p><p>Khoản cộng thêm phải nằm trong ngân sách và phần biên còn lại sau voucher cơ bản, chi phí và khoản trả tiệm.</p></HelpTip>}</div>}{km!==null&&estimate.amounts.bonusDiscount===0&&<p role="status">Chưa có khoản tự lấy cộng thêm theo kịch bản này; voucher cơ bản vẫn giữ.</p>}</>:<><label>Phí giao hàng dự tính (đ)<input type="number" min="0" max="1000000" step="1" inputMode="numeric" placeholder="Ví dụ: 20000" value={fee} onChange={e=>setFee(e.target.value)}/></label><HelpTip title="Cách tính hỗ trợ giao hàng"><p>Hỗ trợ 30% phí giao, tối đa 9.000đ, trong ngân sách và biên còn lại. Phí đang nhập chỉ để dự tính; phí thực tế được báo trước thanh toán.</p></HelpTip></>}
    {!estimate.basicEligible&&<div className="promotion-threshold" role="status">{estimate.threshold?<><p>Ưu đãi này áp dụng từ <b>{money(estimate.threshold.subtotal)}</b> tiền hàng · {estimate.threshold.qty} {unit}.</p>{changeQuantity&&<button type="button" className="secondary" onClick={()=>changeQuantity(estimate.threshold!.qty)}>Chọn {estimate.threshold.qty} {unit}</button>}</>:<p>Quy cách này chưa đủ điều kiện ưu đãi trong tối đa 3 {unit}. Gửi nhu cầu để được xác nhận lại giá.</p>}<HelpTip title="Vì sao có ngưỡng ưu đãi?"><p>Ngưỡng tính trên giá sale trước voucher, theo khoản trả tiệm, chi phí và đóng góp tối thiểu. Tăng số lượng chỉ được đề xuất khi phép tính đủ điều kiện; không cộng gộp hàng từ các tiệm khác.</p><p>Phần dự tính dùng chi phí đang cấu hình. Báo giá máy chủ kiểm tra lại chi phí, biên và ngân sách.</p></HelpTip></div>}
    <PaymentSummary amounts={estimate.amounts} qty={qty} unit={unit} method={method} grossFee={method==="delivery"?grossFee:undefined} shippingSupport={estimate.shippingSupport} mode="request" voucher={estimate.basicEligible?voucher:`${voucher} · chưa áp dụng`}/>
  </section>;
}
