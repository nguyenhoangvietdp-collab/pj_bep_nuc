"use client";
import Link from "./navigation";
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
        { href: "/orders", label: "Đơn hàng" },
        { href: role && role !== "student" ? "/internal" : "/login", label: role && role !== "student" ? "Nội bộ" : "Tài khoản" },
      ];
  return <>
    <Link className="skip-link" href="#content">Đến nội dung chính</Link>
    <header className="frame-header"><div className="frame-header-inner">
      <Link className="frame-brand" href="/" aria-label="Bếp Núc — trang chủ">Bếp Núc</Link>
      <nav aria-label="Điều hướng chính">{links.map(link => {
        const active = !link.href.startsWith("#") && (path === link.href || path.startsWith(link.href + "/") || link.href === "/meals" && (path.startsWith("/shops/") || path === "/checkout"));
        return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>{link.label}</Link>;
      })}</nav>
      {isCloudMvp && role && <button className="secondary" onClick={() => logoutMvp().catch(() => window.location.hash="/login")}>Đăng xuất</button>}
      {name && <span className="frame-account">{name}<small>{role === "merchant" ? "Cửa hàng" : role === "ops" ? "Vận hành" : approved === false ? "Chờ duyệt" : "Sinh viên"}</small></span>}
    </div></header>
  </>;
}
export function SiteFooter({ children, supportEmail }: { children?: ReactNode; supportEmail?: string }) {
  const support = supportLink(supportEmail, "");
  return <footer className="frame-footer"><div className="frame-footer-inner">
    <div className="frame-footer-heading"><Link className="frame-brand" href="/">Bếp Núc</Link>
      <nav aria-label="Điều hướng cuối trang"><Link href="/meals">Chọn bữa</Link><Link href="/orders">Đơn hàng</Link>{support && <a href={support}>Liên hệ hỗ trợ</a>}</nav>
    </div>
    <p>Bữa cuối ngày tại Hà Nội. Tự nhận tại quán, thanh toán được xác nhận thủ công.</p>
    {children && <div className="frame-footer-help">{children}</div>}
  </div></footer>;
}
