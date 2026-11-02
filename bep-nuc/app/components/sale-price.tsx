import {money} from "../../lib/commerce";
import {saleState,flowerQuantityLabel,type Lot} from "../../lib/trading";
const stamp=(n:number)=>new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(n);
export default function SalePrice({item,now}:{item:{price:number;lot?:Lot;saleVerified?:boolean};now:number}){
 const sale=saleState(item,now);if(!sale)return null;
 const unit=item.lot?.kind==="flowers"?flowerQuantityLabel(item.lot):"lô";
 return <section className="sale-price" aria-label="Giá và thời gian sale"><div className="sale-price-main"><strong>{money(item.price)} <small>/ {unit}</small></strong>{sale.status==="active"&&<span className="sale-badge">Giảm {sale.percent}%</span>}</div><p><del>{money(sale.regular)}</del>{sale.status==="active"&&<> · Tiết kiệm {money(sale.saved)}</>}</p><p className="sale-window"><b>{sale.status==="upcoming"?"Sắp mở sale":sale.status==="ended"?"Đã kết thúc":"Đang sale"}</b> · Sale từ {stamp(sale.start)} đến {stamp(sale.end)}</p>{sale.status==="active"&&sale.end-now<3600000&&<p className="sale-remaining" role="timer">Còn {Math.ceil((sale.end-now)/60000)} phút</p>}<p className="fine">Giá thường cùng sản phẩm, quy cách do cửa hàng xác nhận ngày {stamp(sale.confirmedAt)}. Chưa gồm voucher và phí giao.</p></section>;
}
