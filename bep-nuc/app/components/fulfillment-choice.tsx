"use client";
export default function FulfillmentChoice({ value, change, disabled = false, name }: { value: "pickup" | "delivery"; change: (value: "pickup" | "delivery") => void; disabled?: boolean; name: string }) {
  return <fieldset className="fulfillment-choice" disabled={disabled}><legend>Cách nhận bữa</legend>{([['pickup','Tự đến lấy','Nhận tại địa chỉ quán trong khung giờ của món.'],['delivery','Giao tận nơi','Đội Bếp Núc báo phí trước khi bạn thanh toán.']] as const).map(([method,label,description])=><label key={method} className={value===method?'is-selected':''}><input type="radio" name={name} value={method} checked={value===method} onChange={()=>change(method)}/><span><b>{label}</b><small>{description}</small></span></label>)}</fieldset>;
}
