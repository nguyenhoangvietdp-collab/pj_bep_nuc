import HelpTip from "./help-tip";
import {money} from "../../lib/commerce";
import {catalogueIllustrations,foodPriceReferences} from "../../lib/public-catalogue";

export default function ProductReferenceInfo({id}:{id:string}) {
  const price=foodPriceReferences.find(p=>p.productId===id),photo=catalogueIllustrations.find(p=>p.productId===id);
  if(!price&&!photo)return null;
  return <HelpTip title="Nguồn ảnh & giá đối chiếu">
    {price&&<><p><b>{price.sourceProductName}</b><br/>{money(price.priceVnd)} / {price.unit} tại <a href={price.sourceUrl} target="_blank" rel="noreferrer">{price.sourceName}</a>.</p><p>Kiểm tra ngày {price.checkedOn.split("-").reverse().join("/")}. {price.note}</p><p>Đây là giá công khai của nguồn đối chiếu, không phải báo giá Bếp Núc. Không dùng giá này làm căn cứ tự tăng giá gốc hoặc tính ưu đãi.</p></>}
    {photo&&<p>Ảnh minh họa: <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.credit}</a>. Nhận theo quy cách đã xác nhận, không theo lượng trong ảnh.{photo.licenseUrl&&<> Giấy phép <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>; đã thu nhỏ và chuyển WebP.</>}</p>}
  </HelpTip>;
}
