"use client";
export default function FulfillmentChoice({ value, change, disabled = false, name }: { value: "pickup" | "delivery"; change: (value: "pickup" | "delivery") => void; disabled?: boolean; name: string }) {
  return <fieldset className="fulfillment-choice" disabled={disabled}><legend>Cách nhận hàng</legend>{([['pickup','Tự đến lấy','Xem tuyến từ điểm đã lưu và đến đúng khung nhận của lô.'],['delivery','Giao tận nơi','Xem phí, hỗ trợ đủ điều kiện và tổng tiền trước khi thanh toán.']] as const).map(([method,label,description])=><label key={method} className={value===method?'is-selected':''}><input type="radio" name={name} value={method} checked={value===method} onChange={()=>change(method)}/><span><b>{label}</b><small>{description}</small></span></label>)}</fieldset>;
}
