"use client";
import { useRef, useState } from "react";
import { productAssets } from "../../lib/product-assets";
import { money } from "../../lib/commerce";
import { assumedPickup, pickupPreview } from "../../lib/pickup-preview";
import { apiFetch } from "../../lib/mvp-client";
import type { AddressCandidate } from "../../lib/geocoding";

export default function PickupPreview() {
  const [image, setImage] = useState(productAssets[0].image), [voucher, setVoucher] = useState(0.2);
  const [address, setAddress] = useState(""), [candidates, setCandidates] = useState<AddressCandidate[]>([]), [selected, setSelected] = useState<AddressCandidate>();
  const [error, setError] = useState(""), [busy, setBusy] = useState(false), [result, setResult] = useState<ReturnType<typeof pickupPreview>>();
  const searching = useRef(false);
  async function search() {
    if (searching.current) return;
    setError(""); setResult(undefined); setCandidates([]); setSelected(undefined);
    if (address.trim().length < 6) { setError("Nhập thêm số nhà, tên đường, phường và Hà Nội để tìm đúng vị trí."); return; }
    searching.current = true; setBusy(true);
    try {
      const response = await apiFetch("/api/geocode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address: address.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chưa tìm được địa chỉ.");
      if (!Array.isArray(data.candidates) || !data.candidates.length) throw new Error("Chưa tìm được địa chỉ. Hãy nhập cụ thể hơn.");
      setCandidates(data.candidates);
    } catch (e) { setError((e as Error).name === "TimeoutError" ? "Tìm địa chỉ mất quá lâu. Vui lòng thử lại." : (e as Error).message); }
    finally { searching.current = false; setBusy(false); }
  }
  return <section className="pickup-preview" aria-labelledby="pickup-preview-heading">
    <h2 id="pickup-preview-heading">Tự đến lấy, được giảm thêm bao nhiêu?</h2>
    <p>Nhập địa chỉ nhà để thử ưu đãi với điểm nhận giả định ở Đống Đa: thêm 8 điểm phần trăm/km, tối đa 16 điểm phần trăm.</p>
    <details><summary>Tính thử ưu đãi từ địa chỉ nhà</summary>
    <form onSubmit={e => { e.preventDefault(); void search(); }}>
      <div className="pickup-preview-fields">
        <label>Món · một suất<select disabled={busy} value={image} onChange={e => { setImage(e.target.value); setResult(undefined); }}>{productAssets.map(p => <option key={p.image} value={p.image}>{p.name} · {money(p.referencePrice)}</option>)}</select></label>
        <label>Voucher thử<select disabled={busy} value={voucher} onChange={e => { setVoucher(Number(e.target.value)); setResult(undefined); }}><option value={0.07}>7%</option><option value={0.1}>10%</option><option value={0.2}>20%</option></select></label>
      </div>
      <label className="pickup-address-label" htmlFor="pickup-home-address">Địa chỉ nhà của bạn</label>
      <input id="pickup-home-address" name="home-address" type="text" autoComplete="street-address" maxLength={250} required disabled={busy} value={address} aria-describedby="pickup-address-privacy" placeholder="Tên đường hoặc địa danh gần nhà, Hà Nội" onChange={e => { setAddress(e.target.value); setCandidates([]); setSelected(undefined); setResult(undefined); setError(""); }}/>
      <p className="fine" id="pickup-address-privacy">Khi bấm tìm, địa chỉ được gửi qua API Bếp Núc tới Photon (dữ liệu OpenStreetMap) để xác định vị trí. Bếp Núc không lưu địa chỉ vào database ở bước này; không yêu cầu GPS.</p>
      <button disabled={busy}>{busy ? "Đang tìm địa chỉ…" : "Tìm địa chỉ"}</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
    {!!candidates.length && <div className="pickup-address-results">
      <fieldset><legend>Chọn đúng địa chỉ nhà của bạn</legend>{candidates.map((candidate, i) => <label key={i}><input type="radio" name="pickup-address-result" checked={selected === candidate} onChange={() => { setSelected(candidate); setResult(undefined); }}/><span>{candidate.address}{candidate.approximate && <small>Vị trí gần đúng — hãy kiểm tra trước khi chọn.</small>}</span></label>)}</fieldset>
      <p className="map-attribution">Tìm địa chỉ: Photon · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></p>
      <button disabled={!selected} onClick={() => { if (selected) { try { setResult(pickupPreview(productAssets.find(p => p.image === image)!.referencePrice, voucher, selected)); setError(""); } catch (e) { setError((e as Error).message); } } }}>Dùng địa chỉ này và tính ưu đãi</button>
    </div>}
    {result && selected && <div className="pickup-preview-result" role="status" aria-live="polite">
      <p>Khoảng cách đường chim bay ước lượng: <b>{result.distanceKm.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} km</b> · Chỉ tính thưởng tối đa 2 km. Đây không phải tuyến đi bộ hay bằng chứng đã di chuyển.</p>
      <dl><div><dt>Giảm nền 5%</dt><dd>−{money(result.baseDiscount)}</dd></div><div><dt>Voucher đã chọn</dt><dd>−{money(result.voucherDiscount)}</dd></div><div><dt>Thưởng tự nhận tối đa · {(result.bonusRate * 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} điểm %</dt><dd>−{money(result.bonusDiscount)}</dd></div><div><dt>Giá mô phỏng một suất</dt><dd><strong>{money(result.indicativeTotal)}</strong></dd></div></dl>
      <p>Chưa áp trần tài chính của quán. Ưu đãi thực tế có thể thấp hơn; đây không phải báo giá giữ suất hoặc số tiền để chuyển khoản. Không trừ voucher của bạn.</p>
    </div>}
    <p className="fine">{assumedPickup.label}; chưa phải địa chỉ nhận hàng. Khu vực trong tên ảnh món không xác nhận điểm nhận này.</p>
    <details><summary>Thông tin sử dụng địa chỉ và dịch vụ bản đồ</summary><p>Bộ tính dùng địa chỉ chỉ để tìm vị trí và ước tính ưu đãi cho lượt thử hiện tại. Địa chỉ và kết quả không được lưu vào tài khoản hoặc đơn hàng. Máy chủ chỉ lưu số lượt gọi theo ngày để giới hạn sử dụng. Photon là dịch vụ công khai do komoot cung cấp, có thể giới hạn hoặc gián đoạn theo <a href="https://github.com/komoot/photon#demo-server" target="_blank" rel="noreferrer">điều kiện sử dụng Photon</a>. Chỉ nhập địa chỉ hoặc địa danh gần nhà; không nhập tên người, số điện thoại hoặc thông tin riêng tư khác. Không dùng kết quả thử để chuyển khoản hoặc đến nhận món.</p></details>
    </details>
  </section>;
}
