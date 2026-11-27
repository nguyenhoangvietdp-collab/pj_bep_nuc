import HelpTip from "./help-tip";
import type {CustomerPricing} from "../../lib/catalogue-sale";
import {money} from "../../lib/commerce";
import {saleState,flowerQuantityLabel,type Lot} from "../../lib/trading";
import {saleCountdown} from "../../lib/sale-countdown";
export default function SalePrice({item,now,afterVoucher,voucherName,confirmed=false,qty=1,unitLabel}:{item:{price:number;lot?:Lot;saleVerified?:boolean;customerPricing?:CustomerPricing};now:number;afterVoucher?:number;voucherName?:string;confirmed?:boolean;qty?:number;unitLabel?:string}){
 const sale=saleState(item,now),pricing=item.customerPricing;if(!sale&&!pricing)return null;
 const regular=pricing?.originalUnitPrice??sale!.regular,percent=pricing?.baseDiscountPercent??sale!.percent,active=!sale||sale.status==="active";
 const unit=unitLabel??(item.lot?.kind==="flowers"?flowerQuantityLabel(item.lot):"lô");
 return <section className="sale-price" aria-label="Giá và thời gian sale">
  <div className="help-heading"><p className="sale-original">Giá thường <del>{money(regular)}</del> / {unit}</p><HelpTip title="Cách tính giá sản phẩm"><p>Giá sale {money(item.price)}; giá thường {money(regular)} cho cùng quy cách. Tiết kiệm {money(regular-item.price)} trước voucher và phí giao.</p><p>Phần trăm giảm hiển thị riêng với voucher và hỗ trợ nhận hàng. Lịch sale chỉ đếm ngược khi có thời hạn đã xác nhận.</p></HelpTip></div>
  <div className="sale-price-main"><div><span className="sale-price-label">{active?"Giá sale":"Giá trong phiên"}</span><strong>{money(item.price)} <small>/ {unit}</small></strong></div>{active&&<span className="sale-badge">Giảm {percent}%</span>}</div>
  {active&&<p className="sale-saving">Tiết kiệm {money(regular-item.price)} trước voucher</p>}
  {active&&afterVoucher!==undefined&&voucherName&&<div className="sale-after-voucher"><span>Sau voucher {voucherName} · {confirmed?"đã xác nhận":"ước tính"}</span><strong>{money(afterVoucher)} <small>/ {qty>1?`${qty} × `:""}{unit}</small></strong></div>}
  {sale&&<div className="sale-schedule"><b>{sale.status==="upcoming"?"Sắp mở sale":sale.status==="ended"?"Đã kết thúc":"Đang sale"}</b>{sale.status!=="ended"&&<p className="sale-remaining" role="timer">{sale.status==="upcoming"?"Mở sau":"Còn"} {saleCountdown((sale.status==="upcoming"?sale.start:sale.end)-now)}</p>}</div>}
 </section>;
}
