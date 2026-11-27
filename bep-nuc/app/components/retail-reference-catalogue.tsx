import HelpTip from "./help-tip";
import {money} from "../../lib/commerce";
import {filterRetailReferences} from "../../lib/public-catalogue";

export default function RetailReferenceCatalogue({query,category,budget,sort}:{query:string;category:string;budget:number;sort:string}) {
  const products=filterRetailReferences(query,category,budget,sort);
  if(!products.length)return null;
  return <section className="menu-preview retail-reference-catalogue" aria-labelledby="retail-reference-heading">
    <header><div className="help-heading"><h2 id="retail-reference-heading">Sản phẩm & giá tham khảo</h2><HelpTip title="Giá và hình ảnh tham khảo"><p>Ảnh và giá được đối chiếu từ trang sản phẩm WinMart ngày 28/11/2026. Giá ở nguồn có thể thay đổi theo khu vực, thời điểm và chương trình riêng.</p><p>Đây chưa phải các lô gần hạn đã được Bếp Núc xác nhận. Cần kiểm tra nhãn hạn dùng, bao bì, nguồn hàng và giá bán trước khi mở đặt hàng. Phụ kiện hoặc quà tặng trên ảnh không được mặc định bao gồm.</p><p>Ngân sách và sắp xếp ở phần này dùng giá tham khảo của đúng quy cách, không tính voucher hay hỗ trợ tự lấy.</p></HelpTip></div><p>Tham khảo đúng quy cách. Chưa có lô được xác nhận để đặt mua.</p></header>
    <ul className="menu-preview-grid retail-reference-grid">{products.map(p=><li key={p.id} data-retail-reference-id={p.id}>
      <img className="reference-packshot" src={p.image} alt={p.name} width="600" height="450" loading="lazy"/>
      <div className="menu-preview-info"><h3>{p.name}</h3><p>{p.unit}</p><p className="menu-preview-price"><strong>{money(p.priceVnd)}</strong><span>Giá tham khảo tại {p.sourceName}</span></p><a href={p.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Xem ${p.name} trên WinMart, mở thẻ mới`}>Xem giá tại nguồn ↗</a></div>
    </li>)}</ul>
  </section>;
}
