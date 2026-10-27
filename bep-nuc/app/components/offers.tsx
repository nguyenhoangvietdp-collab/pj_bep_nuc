"use client";
import { useEffect, useState } from "react";
import Link from "./navigation";
import FulfillmentChoice from "./fulfillment-choice";
import { displayPrice, money, percent, time, type Food, type PublicShop, type DisplayVoucher } from "../../lib/commerce";

export default function Offers({ listings, shops, vouchers, now, browseHref }: { listings: Food[]; shops: PublicShop[]; vouchers: DisplayVoucher[]; now: number; browseHref: string }) {
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  useEffect(() => { if (sessionStorage.getItem("bc-fulfillment") === "delivery") setMethod("delivery"); }, []);
  const available = listings.filter(l => l.stock > 0 && l.end > now && l.eligible.length > 0);
  return <section className="offers-page">
    <header className="customer-page-heading"><Link className="back-link" href={browseHref}>← Quay lại thực đơn</Link><h1>Ưu đãi cho bữa của bạn</h1><p>Xem giá theo voucher còn dùng được. Giá cuối cùng được xác nhận khi giữ suất.</p></header>
    <div className="offers-layout"><div className="offers-form">
      <section className="offer-step"><FulfillmentChoice name="offer-fulfillment" value={method} change={value => { setMethod(value); sessionStorage.setItem("bc-fulfillment", value); }}/><p>{method === "delivery" ? "Nhập địa chỉ khi kiểm tra bữa. Bạn đồng ý phí giao và tổng tiền trước khi chuyển khoản." : "Địa chỉ quán và giờ nhận có trên từng món. Thưởng di chuyển hiện chưa áp dụng; tổng tiền chưa có khoản thưởng này."}</p></section>
      <section className="offer-step"><h2>Ba voucher mỗi tối</h2><div className="offer-vouchers">{[.07,.1,.2].map(rate => <div key={rate}><b>{percent(rate)}</b><p>Một lần mỗi tối</p></div>)}</div><p>Sinh viên đã duyệt nhận voucher lúc 18:00, hết hạn 23:59 giờ Việt Nam. Mỗi đơn chọn một voucher; không cộng dồn. Voucher đủ điều kiện được hiển thị khi kiểm tra bữa.</p></section>
      <section className="offer-step"><h2>Món có ưu đãi</h2>{available.length ? available.map(l => { const value=displayPrice(l,vouchers,now), shop=shops.find(s=>s.id===l.shopId); return <article className="offer-live-meal" key={l.id}>{l.image && <img src={l.image} alt={l.name} width="600" height="450" loading="lazy"/>}<div><h3>{l.name}</h3><strong className="food-price">{money(value.total)} / suất</strong><p>{value.rate ? `Với voucher ${percent(value.rate)}` : "Chưa áp voucher"} · Chưa gồm thưởng di chuyển hoặc phí giao</p><p>{shop?.name} · {shop?.address || "Chưa có địa chỉ nhận"}</p><p>Nhận {time(l.start)}–{time(l.end)} · Còn {l.stock} suất</p><Link className="button-link" href={`/meals/${l.id}`}>Chọn bữa này</Link></div></article>; }) : <div className="market-empty"><p>Chưa có món đủ điều kiện mở bán lúc này.</p><p>Bạn có thể quay lại thực đơn để kiểm tra đợt bán tiếp theo.</p><Link className="button-link secondary" href={browseHref}>Xem thực đơn</Link></div>}</section>
    </div><aside className="offer-summary"><div className="offer-summary-content"><h2>Biết rõ trước khi trả tiền</h2><ol><li>Chọn món, số suất và cách nhận.</li><li>Chọn voucher còn dùng được rồi giữ suất.</li><li>Kiểm tra tổng xác nhận. Đơn giao hàng cần bạn đồng ý phí giao trước.</li><li>Chuyển khoản đúng nội dung và theo dõi xác nhận trong đơn hàng.</li></ol><Link className="button-link secondary" href="/orders">Xem đơn hàng</Link></div></aside></div>
  </section>;
}
