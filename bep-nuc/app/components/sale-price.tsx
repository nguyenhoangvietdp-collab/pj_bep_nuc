import {money} from "../../lib/commerce";
import {saleState,flowerQuantityLabel,type Lot} from "../../lib/trading";
const stamp=(n:number)=>new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(n);
export default function SalePrice({item,now,afterVoucher,voucherName,confirmed=false,qty=1}:{item:{price:number;lot?:Lot;saleVerified?:boolean};now:number;afterVoucher?:number;voucherName?:string;confirmed?:boolean;qty?:number}){
 const sale=saleState(item,now);if(!sale)return null;
 const unit=item.lot?.kind==="flowers"?flowerQuantityLabel(item.lot):"lô";
 return <section className="sale-price" aria-label="Giá và thời gian sale">
  <p className="sale-original">Giá thường <del>{money(sale.regular)}</del> / {unit}</p>
  <div className="sale-price-main"><div><span className="sale-price-label">{sale.status==="active"?"Giá sale":"Giá trong phiên"}</span><strong>{money(item.price)} <small>/ {unit}</small></strong></div>{sale.status==="active"&&<span className="sale-badge">Giảm {sale.percent}%</span>}</div>
  {sale.status==="active"&&<p className="sale-saving">Tiết kiệm {money(sale.saved)} trước voucher</p>}
  {sale.status==="active"&&afterVoucher!==undefined&&voucherName&&<div className="sale-after-voucher"><span>Sau voucher {voucherName} · {confirmed?"đã xác nhận":"ước tính"}</span><strong>{money(afterVoucher)} <small>/ {qty>1?`${qty} × `:""}{unit}</small></strong></div>}
  <div className="sale-schedule"><b>{sale.status==="upcoming"?"Sắp mở sale":sale.status==="ended"?"Đã kết thúc":"Đang sale"}</b><p className="sale-window">Giờ sale: <time dateTime={new Date(sale.start).toISOString()}>{stamp(sale.start)}</time> → <time dateTime={new Date(sale.end).toISOString()}>{stamp(sale.end)}</time> · giờ Việt Nam</p>{sale.status==="active"&&sale.end-now<3600000&&<p className="sale-remaining" role="timer">Còn {Math.ceil((sale.end-now)/60000)} phút</p>}</div>
  <p className="fine">Giá thường cùng sản phẩm, quy cách do cửa hàng xác nhận ngày {stamp(sale.confirmedAt)}. Chưa gồm phí giao.</p>
 </section>;
}
