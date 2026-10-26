"use client";
export { SiteHeader } from "./site-frame";
export function ProductHero({ role }: { role: string }) {
  if (role !== "student")
    return (
      <section className="workspace-heading">
        <p className="eyebrow">
          BẾP NÚC · {role === "merchant" ? "CỬA HÀNG" : "VẬN HÀNH"}
        </p>
        <h1>
          {role === "merchant"
            ? "Từ lô dư đến bữa ngon."
            : "Rõ từng đơn. Khớp từng khoản."}
        </h1>
        <p>
          {role === "merchant"
            ? "Cập nhật tồn bán được, giao đúng đơn và theo dõi khoản quán nhận."
            : "Theo dõi tiền thực thu, hoàn tiền và đối soát đơn đã giao."}
        </p>
      </section>
    );
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">BẾP NÚC · BỮA CUỐI NGÀY TẠI HÀ NỘI</p>
        <h1>
          Bữa ngon hôm nay.
          <br />
          <em>Ít lãng phí hơn.</em>
        </h1>
        <p>
          Chọn món cuối ngày với giá dễ chịu.
          <br />
          Ghé quán nhận bữa trên đường về.
        </p>
        <div className="hero-actions">
          <a className="button-link" href="#catalogue">
            Xem bữa hôm nay
          </a>
          <a className="text-link" href="#how-it-works">
            Cách Bếp Núc hoạt động
          </a>
        </div>
      </div>
      <div className="hero-note">
        <span>MỖI TỐI TỪ</span>
        <strong>18:00</strong>
        <span>Bộ voucher 7% · 10% · 20%</span>
        <p>
          Chọn một voucher cho mỗi đơn.
          <br />
          Giá cuối được báo trước khi đặt.
        </p>
      </div>
      <div className="hero-foot">
        <span>Chọn món rõ ràng</span>
        <span>Giữ hàng 10 phút</span>
        <span>Nhận đúng khung giờ</span>
      </div>
    </section>
  );
}
export function HowItWorks() {
  return (
    <section
      className="how-section"
      id="how-it-works"
      aria-labelledby="how-heading"
    >
      <div>
        <p className="eyebrow">CÁCH NHẬN BỮA</p>
        <h2 id="how-heading">
          Ba bước.
          <br />
          Một bữa tối.
        </h2>
      </div>
      <ol className="how-steps">
        <li>
          <span>01</span>
          <h3>Chọn món & voucher</h3>
          <p>
            Xem thông tin món, chọn 1–3 suất và một voucher. Lấy vị trí để tính
            thưởng nếu bạn muốn.
          </p>
        </li>
        <li>
          <span>02</span>
          <h3>Giữ giá & chuyển khoản</h3>
          <p>
            Kiểm tra giá cuối và hạn giữ hàng. Chuyển đúng số tiền; chờ vận hành
            xác nhận.
          </p>
        </li>
        <li>
          <span>03</span>
          <h3>Ghé quán nhận bữa</h3>
          <p>
            Đến trong khung giờ hẹn, đưa mã nhận dùng một lần. Mã có sau khi
            thanh toán được xác nhận.
          </p>
        </li>
      </ol>
    </section>
  );
}
