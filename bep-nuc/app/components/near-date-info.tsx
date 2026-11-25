import type {NearDate} from "../../lib/near-date";
import {nearDateGroups} from "../../lib/near-date";
import HelpTip from "./help-tip";
export default function NearDateInfo({value,compact=false}:{value:NearDate;compact?:boolean}){
 const date=(at:number)=>new Date(at).toLocaleString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
 return <section className="near-date-info" aria-label="Thông tin hàng gần hạn sử dụng"><div className="help-heading"><strong>Gần hạn sử dụng · {nearDateGroups[value.group]}</strong><HelpTip title="Hạn dùng và quy cách gần hạn sử dụng"><p>Hàng gần hạn sử dụng có hạn dùng theo nhãn, khác hàng còn lại cuối ngày. Hạn nhận không thay thế hạn dùng.</p><p>Mỗi đơn vị: {value.amount} {value.unit}. HSD: {date(value.expiresAt)}.</p><p>Lô: {value.batchCode}. Nguồn: {value.origin}. Bao bì nguyên vẹn.</p><a href={value.labelImage} target="_blank" rel="noreferrer">Xem ảnh nhãn và hạn dùng</a>{value.bundleItems?.map((i,index)=><p key={index}>{i.name} · {i.amount} {i.unit} · HSD {date(i.expiresAt)}</p>)}</HelpTip></div><p><b>HSD:</b> {date(value.expiresAt)}</p>{!compact&&<p>Mỗi đơn vị mua: {value.amount} {value.unit}{value.unit==="combo"?" · combo cố định cùng cửa hàng":""}.</p>}</section>;
}
