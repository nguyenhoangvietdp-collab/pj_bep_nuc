import {money} from "../../lib/commerce";
import {saleState,flowerQuantityLabel,type Lot} from "../../lib/trading";
import {saleCountdown} from "../../lib/sale-countdown";
export default function SalePrice({item,now,afterVoucher,voucherName,confirmed=false,qty=1}:{item:{price:number;lot?:Lot;saleVerified?:boolean};now:number;afterVoucher?:number;voucherName?:string;confirmed?:boolean;qty?:number}){
 const sale=saleState(item,now);if(!sale)return null;
 const unit=item.lot?.kind==="flowers"?flowerQuantityLabel(item.lot):"lô";
 return <section className="sale-price" aria-label="Giá và thời gian sale">
  <p className="sale-original">Giá thường <del>{money(sale.regular)}</del> / {unit}</p>
  <div className="sale-price-main"><div><span className="sale-price-label">{sale.status==="active"?"Giá sale":"Giá trong phiên"}</span><strong>{money(item.price)} <small>/ {unit}</small></strong></div>{sale.status==="active"&&<span className="sale-badge">Giảm {sale.percent}%</span>}</div>
  {sale.status==="active"&&<p className="sale-saving">Tiết kiệm {money(sale.saved)} trước voucher</p>}
  {sale.status==="active"&&afterVoucher!==undefined&&voucherName&&<div className="sale-after-voucher"><span>Sau voucher {voucherName} · {confirmed?"đã xác nhận":"ước tính"}</span><strong>{money(afterVoucher)} <small>/ {qty>1?`${qty} × `:""}{unit}</small></strong></div>}
  <div className="sale-schedule"><b>{sale.status==="upcoming"?"Sắp mở sale":sale.status==="ended"?"Đã kết thúc":"Đang sale"}</b>{sale.status!=="ended"&&<p className="sale-remaining" role="timer">{sale.status==="upcoming"?"Mở sau":"Còn"} {saleCountdown((sale.status==="upcoming"?sale.start:sale.end)-now)}</p>}</div>
  <p className="fine">Giá thường cùng sản phẩm, quy cách do cửa hàng xác nhận. Chưa gồm phí giao.</p>
 </section>;
}
