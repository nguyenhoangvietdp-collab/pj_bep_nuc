import {foodPriceReferences} from "../../lib/public-catalogue";
import {money} from "../../lib/commerce";

export default function SourcePriceReference({id}:{id:string}) {
  const reference=foodPriceReferences.find(p=>p.productId===id);
  if(!reference)return null;
  return <aside className="source-price-reference" aria-label="Giá đối chiếu từ nguồn ngoài" data-source-price-for={id}>
    <p>Giá tại nguồn đối chiếu</p>
    <div className="source-price-amount"><strong>{money(reference.priceVnd)}</strong><span>/ {reference.unit}</span></div>
    <a href={reference.sourceUrl} target="_blank" rel="noreferrer">{reference.sourceName}</a>
    <p className="source-price-scope">Quy cách tại nguồn có thể khác sản phẩm Bếp Núc.</p>
  </aside>;
}
