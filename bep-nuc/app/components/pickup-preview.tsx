"use client";
import { useRef, useState } from "react";
import Link from "./navigation";
import { productAssets, menuDish, menuDishId } from "../../lib/product-assets";
import { money, percent } from "../../lib/commerce";
import { assumedPickup, pickupPreview } from "../../lib/pickup-preview";
import { apiFetch } from "../../lib/mvp-client";
import { replaceAppUrl } from "../../lib/app-navigation";
import type { AddressCandidate } from "../../lib/geocoding";

export default function PickupPreview({ initialDishId, browseHref = "/meals" }: { initialDishId?: string | null; browseHref?: string }) {
  const [image, setImage] = useState(menuDish(initialDishId)?.image || ""), [voucher, setVoucher] = useState(0);
  const [address, setAddress] = useState(""), [candidates, setCandidates] = useState<AddressCandidate[]>([]), [selected, setSelected] = useState<AddressCandidate>(), [confirmed, setConfirmed] = useState<AddressCandidate>();
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const searching = useRef(false);
  const item = productAssets.find(p => p.image === image);
  const result = item && confirmed && voucher ? pickupPreview(item.referencePrice, voucher, confirmed) : undefined;
  async function search() {
    if (searching.current) return;
    setError(""); setCandidates([]); setSelected(undefined); setConfirmed(undefined);
    if (address.trim().length < 6) { setError("Nhập tên đường hoặc địa danh gần nhà, kèm khu vực tại Hà Nội."); return; }
    searching.current = true; setBusy(true);
    try {
      const response = await apiFetch("/api/geocode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: address.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chưa tìm được địa chỉ.");
      if (!Array.isArray(data.candidates) || !data.candidates.length) throw new Error("Chưa tìm được địa chỉ. Hãy thử địa danh công cộng gần nhà.");
      setCandidates(data.candidates);
    } catch (e) { setError((e as Error).name === "TimeoutError" ? "Tìm địa chỉ mất quá lâu. Vui lòng thử lại." : (e as Error).message); }
    finally { searching.current = false; setBusy(false); }
  }
  return <section className="offers-page">
    <header className="customer-page-heading"><Link className="back-link" href={browseHref}>← Quay lại thực đơn</Link><h1>Ưu đãi khi tự nhận</h1><p>Chọn món và địa chỉ xuất phát để xem mức giảm ước tính.</p></header>
    <div className="offers-layout">
      <div className="offers-form">
        <section className="offer-step"><h2><span>01</span> Chọn món</h2><label htmlFor="offer-dish">Bạn muốn thử món nào?</label><select id="offer-dish" value={image} onChange={e => { setImage(e.target.value); const dish=productAssets.find(p=>p.image===e.target.value); replaceAppUrl("/offers"+(dish?"?dish="+menuDishId(dish.image):"")); }}><option value="">Chọn một món trong thực đơn</option>{productAssets.map(p => <option key={p.image} value={p.image}>{p.name} · {money(p.referencePrice)}</option>)}</select>{initialDishId && !menuDish(initialDishId) && <p className="fine">Món trong liên kết không còn phù hợp. Bạn có thể chọn món khác.</p>}</section>
        <section className="offer-step"><h2><span>02</span> Địa chỉ xuất phát</h2><p>Nhập tên đường hoặc địa danh gần nhà tại Hà Nội. Không cần cấp GPS.</p>
          <form onSubmit={e => { e.preventDefault(); void search(); }}>
            <label htmlFor="pickup-home-address">Địa chỉ của bạn</label>
            <div className="address-search"><input id="pickup-home-address" name="home-address" type="text" autoComplete="street-address" maxLength={250} required disabled={busy} value={address} aria-invalid={!!error} aria-describedby="pickup-address-privacy pickup-address-error" placeholder="Ví dụ: Tây Sơn, Đống Đa, Hà Nội" onChange={e => { setAddress(e.target.value); setCandidates([]); setSelected(undefined); setConfirmed(undefined); setError(""); }}/><button disabled={busy} className={candidates.length ? "secondary" : ""}>{busy ? "Đang tìm…" : "Tìm địa chỉ"}</button></div>
            <p className="fine" id="pickup-address-privacy">Địa chỉ được gửi tới Photon/OpenStreetMap để tìm vị trí, không lưu vào tài khoản hoặc đơn hàng.</p>
            <p id="pickup-address-error" role={error ? "alert" : undefined} className={error ? "error" : ""}>{error}</p>
          </form>
          {!!candidates.length && !confirmed && <div className="pickup-address-results"><fieldset><legend>Chọn kết quả đúng với bạn</legend>{candidates.map((candidate,i)=><label key={i}><input type="radio" name="pickup-address-result" checked={selected===candidate} onChange={()=>setSelected(candidate)}/><span>{candidate.address}<small>Vị trí gần đúng · hãy kiểm tra</small></span></label>)}</fieldset><p className="map-attribution">Photon · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></p><button disabled={!selected} onClick={()=>setConfirmed(selected)}>Dùng địa chỉ này</button></div>}
          {confirmed && <div className="confirmed-address" role="status"><b>Đã chọn địa chỉ</b><p>{confirmed.address}</p><p className="map-attribution">Photon · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></p><button className="text-button" onClick={()=>{setConfirmed(undefined);setSelected(undefined);}}>Chọn lại kết quả</button></div>}
        </section>
        <section className="offer-step"><h2><span>03</span> Chọn voucher để so giá</h2><p>Chỉ tính thử, không sử dụng voucher trong tài khoản của bạn.</p><fieldset className="offer-vouchers"><legend className="sr-only">Chọn một voucher</legend>{[0.07,0.1,0.2].map(rate=>{const preview=item&&confirmed?pickupPreview(item.referencePrice,rate,confirmed):undefined;return <label key={rate} className={voucher===rate?"is-selected":""}><input type="radio" name="offer-voucher" value={rate} checked={voucher===rate} onChange={()=>setVoucher(rate)}/><b>{percent(rate)}</b><span>{preview?money(preview.indicativeTotal):"Chọn để xem giá"}</span></label>;})}</fieldset></section>
      </div>
      <aside className="offer-summary" aria-labelledby="offer-summary-title">
        {item ? <><img className="offer-summary-image" src={item.image} alt={item.name} width="600" height="450"/><div className="offer-summary-content"><p className="offer-status">Mô phỏng · Chưa dùng thanh toán</p><h2 id="offer-summary-title">{item.name}</h2><p>Giá tham khảo một suất <b>{money(item.referencePrice)}</b></p>
          {result ? <div className="offer-result" role="status" aria-live="polite"><p className="estimate-label">Giá sau ưu đãi (ước tính)</p><strong className="offer-total">{money(result.indicativeTotal)}</strong><dl><div><dt>Giảm nền 5%</dt><dd>−{money(result.baseDiscount)}</dd></div><div><dt>Voucher {percent(voucher)}</dt><dd>−{money(result.voucherDiscount)}</dd></div><div><dt>Thưởng tự nhận tối đa</dt><dd>−{money(result.bonusDiscount)}</dd></div></dl><p>{result.distanceKm.toLocaleString("vi-VN",{maximumFractionDigits:2})} km đường chim bay · Tính thưởng tối đa 2 km.</p><p className="offer-limit">Chưa áp trần tài chính quán. Giá thực tế có thể cao hơn; không chuyển khoản theo số này.</p></div> : <p className="offer-next">{!confirmed?"Xác nhận địa chỉ xuất phát để xem thưởng tự nhận.":"Chọn một voucher để xem giá ước tính."}</p>}
          <p className="assumed-point">Điểm nhận giả định tại Đống Đa, Hà Nội. Chưa phải địa chỉ quán thật.</p><Link className="button-link secondary" href={browseHref}>Quay lại thực đơn</Link></div></> : <div className="offer-summary-content"><h2 id="offer-summary-title">Bữa bạn muốn thử</h2><p>Chọn một món để xem ảnh, giá và mức giảm tại đây.</p><p className="offer-status">Mô phỏng · Chưa dùng thanh toán</p></div>}
      </aside>
    </div>
    <details className="offer-explainer"><summary>Cách tính và thông tin địa chỉ</summary><p>Giảm nền 5%, sau đó áp voucher đã chọn và thêm 8 điểm phần trăm/km, tối đa 16 điểm phần trăm. Khoảng cách đường chim bay không phải tuyến đi bộ hay bằng chứng đã di chuyển. Điểm nhận giả định: {assumedPickup.lat}, {assumedPickup.lng}. Chưa có dữ liệu để áp trần tài chính của quán.</p><p>Địa chỉ chỉ dùng trong lượt thử hiện tại, không lưu khi rời trang. Máy chủ chỉ lưu số lượt và thời điểm gọi để giới hạn sử dụng. Photon là dịch vụ công khai của komoot, có thể gián đoạn theo <a href="https://github.com/komoot/photon#demo-server" target="_blank" rel="noreferrer">điều kiện sử dụng</a>. Không nhập tên người, số điện thoại hoặc thông tin riêng tư khác.</p></details>
  </section>;
}
