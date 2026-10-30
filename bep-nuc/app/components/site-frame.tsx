"use client";
import Link from "./navigation";
import BrandLogo from "./brand-logo";
import PilotDisclaimer from "./pilot-disclaimer";
import { useAppPathname as usePathname } from "./navigation";
import { isCloudMvp } from "../../lib/app-navigation";
import { logoutMvp } from "../../lib/mvp-client";
import type { ReactNode } from "react";
import { supportLink } from "../../lib/commerce";

type HeaderProps = { role?: string; name?: string; approved?: boolean };
export function SiteHeader({ role, name, approved }: HeaderProps) {
  const path = usePathname();
  const internal = path === "/internal";
  const links = internal && role
    ? [
        { href: role === "merchant" ? "#inventory" : role === "ops" ? "#operations" : "#catalogue", label: role === "merchant" ? "Lô hàng" : role === "ops" ? "Đối soát" : "Bữa hôm nay" },
        ...(role === "student" ? [{ href: "#vouchers", label: "Voucher" }] : []),
        { href: "#orders", label: "Đơn hàng" },
        { href: "#how-it-works", label: "Cách nhận bữa" },
      ]
    : [
        { href: "/meals", label: "Chọn bữa" },
        { href: "/offers", label: "Ưu đãi" },
        { href: "/orders", label: "Đơn hàng" },
      ];
  return <>
    <Link className="skip-link" href="#content">Đến nội dung chính</Link>
    <header className="frame-header"><div className="frame-header-inner">
      <Link className="frame-brand" href="/" aria-label="Bếp Núc — trang chủ"><BrandLogo/></Link>
      <nav aria-label="Điều hướng chính">{links.map(link => {
        const active = !link.href.startsWith("#") && (path === link.href || path.startsWith(link.href + "/") || link.href === "/meals" && (path.startsWith("/shops/") || path === "/checkout"));
        return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>{link.label}</Link>;
      })}</nav>
      <div className="frame-account-actions">
        <Link className="frame-account-link" href={role && role !== "student" ? "/internal" : "/login"}>{role ? "Tài khoản" : "Đăng nhập"}</Link>
        {name && <span className="frame-account" title={name}>{approved === false ? "Chờ duyệt" : role === "merchant" ? "Cửa hàng" : role === "ops" ? "Vận hành" : "Sinh viên"}</span>}
        {isCloudMvp && role && <button className="text-button" onClick={() => logoutMvp().catch(() => window.location.hash="/login")}>Đăng xuất</button>}
      </div>
    </div></header>
  </>;
}
export function SiteFooter({ children, supportEmail }: { children?: ReactNode; supportEmail?: string }) {
  const support = supportLink(supportEmail, "");
  const path=usePathname();
  return <footer className="frame-footer commerce-footer"><div className="footer-columns">
    <section><h2>Chăm sóc khách hàng</h2>{children || <details><summary>Cách đặt món và theo dõi đơn</summary><p>Chọn món, gửi yêu cầu và kiểm tra báo giá trước khi thanh toán. Theo dõi xử lý trong Đơn hàng.</p></details>}{support&&<a href={support}>Liên hệ hỗ trợ</a>}</section>
    <nav aria-label="Về Bếp Núc"><h2>Về Bếp Núc</h2><Link href="/">Giới thiệu Bếp Núc</Link><Link href="/meals">Chọn bữa</Link><Link href="/offers">Ưu đãi</Link><Link href="/orders">Đơn hàng của bạn</Link></nav>
    <section><h2>Thanh toán</h2><p>Chuyển khoản ngân hàng</p><p>Chỉ chuyển tiền sau khi món, thời gian nhận/giao và tổng tiền đã được xác nhận, đồng ý.</p><p>Vận hành xác nhận thanh toán thủ công.</p></section>
    <section><h2>Nhận hàng</h2><p>Tự đến lấy tại quán</p><p>Hoặc giao tận nơi do đội Bếp Núc điều phối. Phí giao được báo trước khi thanh toán.</p><Link href="/orders">Theo dõi yêu cầu & đơn hàng</Link></section>
  </div><div className="footer-bottom"><Link className="frame-brand footer-logo" href="/" aria-label="Bếp Núc — trang chủ"><BrandLogo/></Link><p>Sản phẩm đang trong giai đoạn thử nghiệm, chưa thương mại hoá.</p><PilotDisclaimer autoOpen={isCloudMvp && /^\/(meals|shops|checkout|offers)(\/|$)/.test(path)}/><details><summary>Nguồn ảnh minh hoạ quán</summary><p>Ảnh không mô tả mặt tiền của quán được ghi tên. Xem tác giả, giấy phép và thay đổi trong <a href="/shop-images/credits.html">nguồn ảnh</a>.</p></details></div></footer>;
}
