import ProductReferenceInfo from "./product-reference-info";
import SourcePriceReference from "./source-price-reference";
import {catalogueIllustration,catalogueIllustrations,foodPriceReferences} from "../../lib/public-catalogue";
import PickupBenefit from "./pickup-benefit";
import {cataloguePickup} from "../../lib/catalogue-pickup";
import Link from "./navigation";
import ProductCard from "./product-card";
import {AddToCartButton,BuyBox} from "./use-cart";
import {menuShops} from "../../lib/launch-menu";
import {money} from "../../lib/commerce";
import {requestPrice,requestUnit,type RequestProduct} from "../../lib/request-catalogue";
export function ReferencePrice({product:p}:{product:RequestProduct}){const sale=p.catalogueSale;return sale?<section className="sale-price catalogue-sale-price" aria-label="Giá sale danh mục"><p className="sale-original">Giá menu <del>{money(sale.originalPrice)}</del> / {requestUnit(p)}</p><div className="sale-price-main"><div><span className="sale-price-label">Giá Bếp Núc trước voucher</span><strong>{money(requestPrice(p))} <small>/ {requestUnit(p)}</small></strong></div><span className="sale-badge">Giảm {sale.discountPercent}%</span></div><p className="sale-saving">Tiết kiệm {money(sale.originalPrice-requestPrice(p))} trước voucher</p></section>:<p className="menu-preview-price">{money(requestPrice(p))} <span>Giá tham khảo / {requestUnit(p)}</span></p>;}

export function ReferenceCard({product:p}:{product:RequestProduct}){
 const sale=p.catalogueSale;
 // External price observations are information only: never struck through, never part of the maths.
 const source=foodPriceReferences.find(r=>r.productId===p.id),photo=catalogueIllustrations.find(r=>r.productId===p.id);
 return <ProductCard referenceId={p.id} href={`/meals/${p.id}`} name={p.name} spec={requestUnit(p)} price={requestPrice(p)} original={sale?.originalPrice} discount={sale?.discountPercent}
  credit={photo?.license.startsWith("CC BY-SA")?`Ảnh: ${photo.credit}, ${photo.license}`:undefined}
  note={source&&<p className="pcard-source">Giá nguồn {money(source.priceVnd)} / {source.unit} · <a href={source.sourceUrl} target="_blank" rel="noreferrer">{source.sourceName}</a></p>}
  media={<div className="food-image"><img src={catalogueIllustration(p.id,p.image)} alt={p.name} width="600" height="600" loading="lazy"/><span className="demo-image-label">Ảnh minh họa</span></div>}
  action={<AddToCartButton id={p.id} name={p.name}/>}/>;
}
export function ReferenceDetails({product:p}:{product:RequestProduct}){const shop=menuShops.find(s=>p.shopId?s.id===p.shopId:s.menu.includes(p.name));return <div className="meal-detail"><div className="meal-detail-visual"><div className="food-image"><img src={catalogueIllustration(p.id,p.image)} alt={p.name}/><span className="demo-image-label">Ảnh minh họa · Nhận theo quy cách</span></div></div><div className="meal-detail-info"><div className="help-heading"><h1>{p.name}</h1><ProductReferenceInfo id={p.id}/></div><p className="menu-availability">Gửi yêu cầu – quán xác nhận rồi báo giá</p><div className={`reference-prices${p.kind==="food"?" has-source":""}`}><ReferencePrice product={p}/><SourcePriceReference id={p.id}/></div><BuyBox id={p.id} name={p.name}/><Link className="button-link secondary-link" href={`/checkout?product=${p.id}`}>Chọn voucher & gửi yêu cầu món này</Link><PickupBenefit amount={cataloguePickup(p)}/>{shop?<p><b>{shop.name}</b><br/>{shop.address}</p>:<p className="fine">Nhà bán và nguồn hàng được xác nhận trong báo giá.</p>}<p><b>Quy cách yêu cầu:</b> {requestUnit(p)} mỗi đơn vị mua.</p><PreparationDetails product={p}/>{p.note&&<p>{p.note}</p>}{p.kind==="flowers"&&<><p>Gói giấy cơ bản để cắm nhà; không bao gồm bình hoặc thiết kế bó tặng. Không suy ra số cành từ ảnh.</p><p>Chưa có lô thực tế để xác nhận màu, tình trạng, độ tươi và cách chăm. Những thông tin này được cung cấp khi vận hành kiểm tra nguồn hàng.</p></>}<p>Gửi nhu cầu để Bếp Núc xác nhận nguồn, tổng tiền và khung nhận. Chưa giữ hàng hoặc thu tiền.</p></div></div>;}

function PreparationDetails({product}:{product:RequestProduct}){
 return product.kind==="food"?<div className="fine"><p><b>Bảo quản</b> · Quán chưa cung cấp</p><p><b>Giờ chế biến</b> · Quán chưa cung cấp</p></div>:null;
}
