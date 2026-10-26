import Link from "next/link";
import { SiteHeader, SiteFooter } from "./components/site-frame";
import { redirect } from "next/navigation";
import { browseUrl } from "../lib/commerce";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const search = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["q", "budget", "category", "shop", "stock", "receiving", "sort"]) {
    const value = search[key];
    if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value);
  }
  if (params.size) redirect(browseUrl("/?" + params.toString()));
  return (
    <div className="site-frame commerce home-page">
      <SiteHeader />
      <main id="content">
      <div className="home-content" id="home-content">
        <section className="home-hero">
          <div className="home-intro">
            <p className="home-kicker">HÀ NỘI · TỰ NHẬN TẠI QUÁN</p>
            <h1>Chọn bữa cuối ngày, nhận tại quán.</h1>
            <p className="home-lead">Tìm bữa hợp túi tiền, xem rõ món và ghé quán nhận trong khung giờ đã chọn.</p>
            <Link className="button-link home-primary" href="/meals">Chọn bữa hôm nay <span aria-hidden="true">↗</span></Link>
            <p className="home-eligibility">Xem món không cần đăng nhập. Pilot đặt bữa dành cho sinh viên được mời và đã duyệt.</p>
          </div>

        </section>
        <section className="home-process" id="how-to-pickup" aria-labelledby="home-how-title">
          <div className="home-section-heading"><h2 id="home-how-title">Cách nhận bữa</h2></div>
          <ol>
            <li><span className="home-step-number" aria-hidden="true">01</span><h3>Chọn bữa phù hợp</h3><p>Xem giá, địa chỉ và khung giờ. Chọn một loại món, từ 1–3 suất mỗi đơn.</p></li>
            <li><span className="home-step-number" aria-hidden="true">02</span><h3>Kiểm tra và thanh toán</h3><p>Chọn một voucher, xác nhận giá và giữ suất. Chuyển khoản rồi chờ Bếp Núc xác nhận.</p></li>
            <li><span className="home-step-number" aria-hidden="true">03</span><h3>Ghé quán nhận bữa</h3><p>Sau xác nhận tiền, đưa mã nhận cho quán đúng khung giờ. Bếp Núc chưa có giao hàng.</p></li>
          </ol>
        </section>
        <details className="home-pilot-note"><summary>Voucher và lưu ý trước khi đặt</summary><p>Voucher phát từ 18:00, hết hạn 23:59 theo giờ Việt Nam. Giá cuối được kiểm tra khi giữ suất. Xem bảo quản, dị ứng và giờ nhận trước khi đặt.</p></details>
      </div>
      </main>
      <SiteFooter supportEmail={process.env.SUPPORT_EMAIL} />
    </div>
  );
}
