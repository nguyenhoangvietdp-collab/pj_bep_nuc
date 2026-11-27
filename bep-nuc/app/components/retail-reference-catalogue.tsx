import HelpTip from "./help-tip";
import {money} from "../../lib/commerce";
import {filterRetailReferences} from "../../lib/public-catalogue";
const displayNames:Record<string,string>={
  "reference-winmart-10638822":"Nước rửa chén Sunlight chanh",
  "reference-winmart-10007893":"Mì Hảo Hảo tôm chua cay",
  "reference-winmart-10011640":"Nước khoáng La Vie",
  "reference-winmart-10327515":"Bánh quế Oreo socola",
  "reference-winmart-10020513":"Khăn giấy Watersilk",
  "reference-winmart-10027650":"Pin Energizer Max AA",
  "reference-winmart-10324916":"Kem đánh răng P/S than hoạt tính",
};

export default function RetailReferenceCatalogue({query,category,budget,sort}:{query:string;category:string;budget:number;sort:string}) {
  const products=filterRetailReferences(query,category,budget,sort);
  if(!products.length)return null;
  return <section className="menu-preview retail-reference-catalogue" aria-labelledby="retail-reference-heading">
    <header><div className="help-heading"><h2 id="retail-reference-heading">Sản phẩm & giá tham khảo</h2><HelpTip title="Giá và hình ảnh tham khảo"><p>Ảnh và giá được đối chiếu từ trang sản phẩm WinMart ngày 28/11/2026. Giá ở nguồn có thể thay đổi theo khu vực, thời điểm và chương trình riêng.</p><p>Đây chưa phải các lô gần hạn đã được Bếp Núc xác nhận. Cần kiểm tra nhãn hạn dùng, bao bì, nguồn hàng và giá bán trước khi mở đặt hàng. Phụ kiện hoặc quà tặng trên ảnh không được mặc định bao gồm.</p><p>Ngân sách và sắp xếp ở phần này dùng giá tham khảo của đúng quy cách, không tính voucher hay hỗ trợ tự lấy.</p></HelpTip></div><p>{products.length} lựa chọn để đối chiếu giá. Đặt mua khi có lô được xác nhận.</p></header>
    <ul className="menu-preview-grid retail-reference-grid">{products.map(p=><li key={p.id} data-retail-reference-id={p.id}>
      <img className="reference-packshot" src={p.image} alt={p.name} width="600" height="450" loading="lazy"/>
      <div className="menu-preview-info"><h3>{displayNames[p.id]??p.name}</h3><p className="retail-purchase-unit">{p.unit}</p><div className="retail-reference-price"><span>Giá tại {p.sourceName}</span><strong>{money(p.priceVnd)}</strong><small>Giá tham khảo cho đúng quy cách trên</small></div><a className="retail-source-link" href={p.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Xem ${p.name} trên WinMart, mở thẻ mới`}>Xem thông tin nguồn ↗</a></div>
    </li>)}</ul>
  </section>;
}
