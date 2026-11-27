"use client";
import Link from "./navigation";
import { SiteHeader, SiteFooter, FoodFriendsArt } from "./site-frame";
import HeroVideo from "./hero-video";
import BrandLogo from "./brand-logo";
import BrandGarden from "./brand-garden";
import { productAssets } from "../../lib/product-assets";

const categories = [
  { name: "Đồ ăn cuối ngày", detail: "Một bữa ngon, tiện ghé lấy.", href: "/meals", image: productAssets.find(p => p.name === "Bún riêu")!.image },
  { name: "Hoa cắm nhà", detail: "Mang một chút tươi vui về nhà.", href: "/meals?category=Hoa%20c%E1%BA%AFm%20nh%C3%A0", image: "/brand/flowers-home.webp" },
  { name: "Hàng gần hạn sử dụng", detail: "Chọn đúng nhu cầu, xem kỹ hạn dùng.", href: "/meals?category=H%C3%A0ng+g%E1%BA%A7n+h%E1%BA%A1n+s%E1%BB%AD+d%E1%BB%A5ng", image: "/brand/shop-supply.webp" },
];
const heroPoster = productAssets.find(p => p.name === "Bún riêu")!.image;

export default function CustomerHome({ configured = true, authError = "", authenticated = false, supportEmail }: { configured?: boolean; authError?: string; authenticated?: boolean; supportEmail?: string }) {
  return <div className="site-frame commerce home-page garden-home">
    <SiteHeader role={authenticated ? "student" : undefined} />
    <main id="content" tabIndex={-1}>
      <section className="home-centered-hero" style={{ "--hero-image": `url("${heroPoster}")` } as React.CSSProperties}>
        <div className="hero-background" aria-hidden="true" />
        <HeroVideo poster={heroPoster} />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-centered-content">
          <BrandLogo className="hero-wordmark" />
          <h1>Tự đến lấy,<br /><strong>tiết kiệm thêm.</strong></h1>
          <p>Giữ voucher của bạn, nhận thêm ưu đãi khi tự lấy đồ ăn, hoa hoặc hàng gần hạn sử dụng.</p>
          {authError && <p className="error" role="alert">{authError}</p>}
          {!configured && <p role="status">Bếp Núc đang chuẩn bị kết nối dịch vụ đặt hàng.</p>}
          <Link className="button-link hero-primary" href="/meals">Chọn sản phẩm</Link>
          <p className="hero-caption">Chọn vị trí để xem khoản tiết kiệm thêm khi tự lấy.</p>
        </div>
        <FoodFriendsArt className="home-hero-art" />
      </section>
      <section className="garden-categories" aria-labelledby="category-heading">
        <div className="garden-section-heading"><h2 id="category-heading">Hôm nay, bạn muốn mang gì về?</h2><Link href="/meals">Khám phá sản phẩm ↗</Link></div>
        <div className="garden-category-grid">{categories.map(category => <Link className="garden-category" href={category.href} key={category.name}>
          <div className="garden-category-image"><img src={category.image} width="640" height="420" alt="" loading="lazy" /></div>
          <div><h3>{category.name} <span aria-hidden="true">↗</span></h3><p>{category.detail}</p></div>
        </Link>)}</div>
      </section>
      <section className="garden-pickup-story" aria-labelledby="pickup-heading">
        <div className="garden-pickup-title"><h2 id="pickup-heading">Tiện ghé tiệm.<br /><em>Thêm khoản tiết kiệm.</em></h2><BrandGarden className="garden-story-pattern" /></div>
        <div className="garden-pickup-steps">
          <div><h3>Chọn sản phẩm bạn cần</h3><p>Xem tình trạng, quy cách và giờ nhận. Mỗi lô cần được cửa hàng xác nhận.</p></div>
          <div><h3>Giữ voucher, chọn tự lấy</h3><p>Voucher cơ bản và ưu đãi tự lấy được tính riêng. Chọn vị trí để xem khoản giảm dự tính.</p></div>
          <div><h3>Kiểm tra tiền phải trả</h3><p>Xem báo giá, phí giao nếu có và tổng tiền trước khi đồng ý thanh toán.</p></div>
          <Link className="button-link" href="/offers">Xem cách tính ưu đãi ↗</Link>
        </div>
      </section>
      <section className="garden-trust">
        <h2>Giá tốt, có lý do.</h2>
        <div><p>Một mẻ bánh còn lại, một phần ăn chưa bán hết, hay hoa còn đủ đẹp để cắm trong nhà. Mỗi lô cần có thông tin đúng tình trạng và khung nhận rõ ràng.</p><p>Kiểm tra thành phần, quy cách và hướng dẫn bảo quản trước khi chọn. Hàng có thể không còn mỗi tối; khả năng phục vụ được xác nhận trong báo giá.</p></div>
      </section>
    </main>
    <SiteFooter supportEmail={supportEmail} />
  </div>;
}
