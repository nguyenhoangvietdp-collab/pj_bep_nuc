"use client";
import { useState } from "react";
import { productAssets } from "../../lib/product-assets";
import { money } from "../../lib/commerce";
import { assumedPickup, pickupPreview } from "../../lib/pickup-preview";

export default function PickupPreview() {
  const [image, setImage] = useState(productAssets[0].image), [voucher, setVoucher] = useState(0.2);
  const [lat, setLat] = useState(""), [lng, setLng] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof pickupPreview>>();
  function clear() { setResult(undefined); setError(""); }
  function locate() {
    clear();
    if (!navigator.geolocation) { setError("Trình duyệt không hỗ trợ vị trí. Bạn có thể nhập tọa độ bên dưới."); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(p => { setLat(String(p.coords.latitude)); setLng(String(p.coords.longitude)); setBusy(false); }, () => { setError("Chưa lấy được vị trí. Bạn vẫn có thể tự nhập tọa độ; không cần cấp quyền."); setBusy(false); }, { timeout: 10000, maximumAge: 0, enableHighAccuracy: false });
  }
  return <section className="pickup-preview" aria-labelledby="pickup-preview-heading">
    <h2 id="pickup-preview-heading">Tự đến lấy, được giảm thêm bao nhiêu?</h2>
    <p>Thử với điểm nhận giả định ở Đống Đa: thêm 8 điểm phần trăm/km, tối đa 16 điểm phần trăm. Khoảng cách đường chim bay không phải tuyến đi bộ hay bằng chứng bạn đã di chuyển.</p>
    <details><summary>Tính thử ưu đãi theo vị trí của bạn</summary>
    <p>{assumedPickup.label}: {assumedPickup.lat}, {assumedPickup.lng}. Đây chưa phải địa chỉ nhận hàng. Khu vực trong tên ảnh món là dữ liệu riêng, không xác nhận điểm nhận này.</p>
    <form onSubmit={e => { e.preventDefault(); clear(); if (!lat.trim() || !lng.trim()) { setError("Nhập đủ vĩ độ và kinh độ, hoặc dùng vị trí hiện tại."); return; } try { const p = productAssets.find(p => p.image === image)!; setResult(pickupPreview(p.referencePrice, voucher, { lat: Number(lat), lng: Number(lng) })); } catch (e) { setError((e as Error).message); } }}>
      <div className="pickup-preview-fields">
        <label>Món · một suất<select value={image} onChange={e => { setImage(e.target.value); clear(); }}>{productAssets.map(p => <option key={p.image} value={p.image}>{p.name} · {money(p.referencePrice)}</option>)}</select></label>
        <label>Voucher thử<select value={voucher} onChange={e => { setVoucher(Number(e.target.value)); clear(); }}><option value={0.07}>7%</option><option value={0.1}>10%</option><option value={0.2}>20%</option></select></label>
      </div>
      <button type="button" className="secondary" disabled={busy} onClick={locate}>{busy ? "Đang lấy vị trí…" : "Dùng vị trí hiện tại một lần"}</button>
      <p className="fine" id="pickup-privacy">Hoặc tự nhập tọa độ của bạn bên dưới. Bộ tính chạy trên thiết bị; tọa độ không được gửi tới API, lưu vào tài khoản hay theo dõi liên tục.</p>
      <div className="pickup-preview-fields">
        <label>Vĩ độ<input type="number" step="any" min="-90" max="90" value={lat} aria-describedby="pickup-privacy" onChange={e => { setLat(e.target.value); clear(); }}/></label>
        <label>Kinh độ<input type="number" step="any" min="-180" max="180" value={lng} onChange={e => { setLng(e.target.value); clear(); }}/></label>
      </div>
      <button disabled={busy}>Tính mức giảm ước tính</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
    {result && <div className="pickup-preview-result" role="status" aria-live="polite">
      <p>Khoảng cách ước lượng: <b>{result.distanceKm.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} km</b> · Chỉ tính thưởng tối đa 2 km.</p>
      <dl><div><dt>Giảm nền 5%</dt><dd>−{money(result.baseDiscount)}</dd></div><div><dt>Voucher đã chọn</dt><dd>−{money(result.voucherDiscount)}</dd></div><div><dt>Thưởng tự nhận tối đa · {(result.bonusRate * 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} điểm %</dt><dd>−{money(result.bonusDiscount)}</dd></div><div><dt>Giá mô phỏng một suất</dt><dd><strong>{money(result.indicativeTotal)}</strong></dd></div></dl>
      <p>Chưa áp trần tài chính của quán. Ưu đãi thực tế có thể thấp hơn; đây không phải báo giá giữ suất hoặc số tiền để chuyển khoản. Không trừ voucher của bạn.</p>
    </div>}
    </details>
  </section>;
}
