"use client";
import { useEffect, useState } from "react";
import { SiteHeader, ProductHero, HowItWorks } from "../components/brand";
const labels: Record<string, string> = {
  available: "Chưa dùng",
  reserved: "Đang giữ",
  used: "Đã dùng",
  awaiting_payment: "Chờ xác nhận tiền",
  paid: "Đã nhận tiền · chờ lấy",
  picked_up: "Đã giao",
  expired: "Hết giữ hàng",
  cancelled: "Quán đã hủy",
  no_show: "Khách không đến",
  received: "Tiền đã thu",
  refunded: "Đã hoàn khách",
  refundDue: "Cần hoàn khách",
  merchantPaid: "Đã trả quán",
  merchantDue: "Còn phải trả quán",
  contribution: "Contribution sau chi phí biến đổi",
  cash: "Tiền mặt còn giữ",
  unallocated: "Chưa phân bổ (không phải lợi nhuận)",
  name: "Tên món",
  storage: "Bảo quản / hướng dẫn dùng",
  allergens: "Dị ứng",
  price: "Giá menu đã xác minh (đ/suất)",
  floor: "Khoản quán thực nhận (đ/suất)",
  cost: "Chi phí biến đổi (đ/suất)",
  margin: "Biên tối thiểu (đ/suất)",
  stock: "Tồn bán được (suất)",
  start: "Bắt đầu nhận",
  end: "Kết thúc nhận",
};
const money = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
const time = (n: number) =>
  new Date(n).toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  });
export default function Page() {
  const [data, setData] = useState<any>(),
    [error, setError] = useState(""),
    [quote, setQuote] = useState<any>(),
    [busy, setBusy] = useState(false),
    [email, setEmail] = useState(""),
    [token, setToken] = useState("");
  async function load() {
    try {
      const r = await fetch("/api/pilot", { cache: "no-store" });
      const d = await r.json();
      if (r.ok) setData(d);
      else setError(d.error);
    } catch {
      setError("Chưa kết nối được. Bạn có thể thử tải lại trang.");
    }
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (data?.user.role === "student") window.location.replace("/");
  }, [data?.user.role]);
  async function action(action: string, args: any) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          args: { ...args, key: crypto.randomUUID() },
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      await load();
      return d;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function login(role?: string) {
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email, token: token || undefined }),
    });
    const d = await r.json();
    if (!r.ok) setError(d.error);
    else {
      setError(
        role ? "" : token ? "Đã xác thực" : "Kiểm tra email để lấy mã OTP",
      );
      setQuote(undefined);
      await load();
    }
  }
  async function getQuote(l: any, v: any, qty: number, loc: boolean) {
    let location;
    if (loc) {
      try {
        location = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(
            (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
            reject,
            { timeout: 5000, enableHighAccuracy: false },
          ),
        );
      } catch {
        /* base voucher still works */
      }
    }
    const q = await action("quote", {
      listingId: l.id,
      voucherId: v.id,
      qty,
      location,
    });
    if (q) setQuote(q);
  }
  if (!data)
    return (
      <main className="site-shell" id="top">
        <SiteHeader />
        <section className="login-layout" id="content">
          <div>
            <p className="eyebrow">BẾP NÚC · HÀ NỘI</p>
            <h1>
              Một bữa ngon.
              <br />
              Một lựa chọn có ý nghĩa.
            </h1>
            <p>
              Đăng nhập bằng email để xem món cuối ngày và bộ voucher của bạn.
            </p>
          </div>
          <form
            className="panel login-panel"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <h2>Vào Bếp Núc</h2>
            <p role="status">{error || "Đang kiểm tra phiên đăng nhập…"}</p>
            <label htmlFor="login-email">Email của bạn</label>
            <input
              id="login-email"
              aria-label="Email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="login-otp">Mã xác thực trong email</label>
            <input
              id="login-otp"
              aria-label="OTP"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Mã OTP"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button type="submit">
              {token ? "Xác thực & vào Bếp Núc" : "Gửi mã xác thực"}
            </button>
          </form>
        </section>
      </main>
    );
  const role = data.user.role;
  return (
    <main className="site-shell" id="top">
      <SiteHeader role={role} name={data.user.name} />
      {data.demo && (
        <aside className="demo">
          <span>MÔ PHỎNG · Không chuyển tiền thật</span>
          <div className="role-switch" aria-label="Vai trò mô phỏng">
            <button
              aria-pressed={role === "student"}
              onClick={() => login("student")}
            >
              Sinh viên
            </button>
            <button
              aria-pressed={role === "merchant"}
              onClick={() => login("merchant")}
            >
              Quán
            </button>
            <button aria-pressed={role === "ops"} onClick={() => login("ops")}>
              Vận hành
            </button>
          </div>
        </aside>
      )}
      <ProductHero role={role} />
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {!data.user.approved && <p>Tài khoản đang chờ vận hành duyệt.</p>}
      {role === "student" && (
        <>
          <section
            id="vouchers"
            className="wallet-section"
            aria-labelledby="wallet-heading"
          >
            <div>
              <p className="eyebrow">BỘ VOUCHER CỦA BẠN</p>
              <h2 id="wallet-heading">Mỗi tối, ba lựa chọn.</h2>
              <p>
                Có từ 18:00. Mỗi loại dùng một lần, mỗi đơn chọn một voucher.
                Hết hạn 23:59.
              </p>
            </div>
            <div className="voucher-wallet">
              {[0.07, 0.1, 0.2].map((rate) => {
                const v = data.vouchers.find((v: any) => v.rate === rate);
                return (
                  <div
                    className={`voucher-ticket ${v?.state === "available" ? "is-available" : ""}`}
                    key={rate}
                  >
                    <strong>
                      {Math.round(rate * 100)}
                      <span>%</span>
                    </strong>
                    <span>{v ? labels[v.state] : "Có từ 18:00"}</span>
                  </div>
                );
              })}
            </div>
          </section>
          <section
            id="catalogue"
            className="catalogue-section"
            aria-labelledby="catalogue-heading"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">BỮA CUỐI NGÀY · NHẬN TẠI QUÁN</p>
                <h2 id="catalogue-heading">Tối nay, ăn gì?</h2>
              </div>
              <p>
                Giảm nền 5%, cộng một voucher.
                <br />
                Thưởng tự nhận được tính khi báo giá.
              </p>
            </div>
            {!data.listings.length && (
              <div className="empty-state">
                <h3>Bếp chưa có món mới.</h3>
                <p>
                  Quay lại khi quán đăng lô cuối ngày. Bộ voucher của bạn vẫn
                  theo thời hạn trong tối.
                </p>
              </div>
            )}
            <div className="grid meal-grid">
              {data.listings.map((l: any, index: number) => (
                <Meal
                  key={l.id}
                  l={l}
                  index={index}
                  shop={data.shops.find((s: any) => s.id === l.shopId)}
                  now={data.now}
                  vouchers={data.vouchers}
                  busy={busy}
                  quote={getQuote}
                />
              ))}
            </div>
            {quote && (
              <section className="panel quote-panel" aria-live="polite">
                <p className="eyebrow">GIÁ ĐƯỢC XÁC NHẬN</p>
                <h2>Báo giá đã giữ hàng</h2>
                <strong className="price">{money(quote.total)}</strong>
                <p>
                  Tiết kiệm {money(quote.saved)} · Voucher gốc{" "}
                  {Math.round(quote.baseRate * 100)}% · Voucher sau thưởng{" "}
                  {(quote.rate * 100).toFixed(2)}%
                </p>
                <p>
                  {quote.bonusReason} · Hết giữ lúc {time(quote.expires)}
                </p>
                <button
                  disabled={busy}
                  onClick={async () => {
                    if (await action("order", { quoteId: quote.id }))
                      setQuote(undefined);
                  }}
                >
                  Tạo đơn & xem chuyển khoản
                </button>
              </section>
            )}
          </section>
        </>
      )}
      {role === "merchant" && (
        <>
          <h2 id="inventory">Lô hàng & tồn bán được</h2>
          <div className="grid">
            {data.listings.map((l: any) => (
              <section className="panel" key={l.id}>
                <h3>{l.name}</h3>
                <p>Khoản quán nhận: {money(l.floor)}/suất</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    action("stock", {
                      id: l.id,
                      stock: Number(new FormData(e.currentTarget).get("stock")),
                    });
                  }}
                >
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={l.stock}
                    aria-label="Tồn bán được"
                  />
                  <button disabled={busy}>Cập nhật tồn bán được</button>
                </form>
              </section>
            ))}
          </div>
          <ListingForm
            shopId={data.user.shopId}
            submit={(a: any) => action("listing", a)}
          />
        </>
      )}
      <div className="section-heading" id="orders">
        <div>
          <p className="eyebrow">TỪ ĐẶT BỮA ĐẾN NHẬN HÀNG</p>
          <h2>Đơn hàng {role === "student" ? "của bạn" : ""}</h2>
        </div>
        <span className="section-count">{data.orders.length} đơn</span>
      </div>
      {!data.orders.length && (
        <div className="empty-state">
          <h3>Chưa có đơn hàng.</h3>
          <p>
            {role === "student"
              ? "Chọn một món và voucher để bắt đầu."
              : "Đơn mới sẽ hiển thị tại đây để theo dõi và xử lý."}
          </p>
        </div>
      )}
      <div className="grid order-grid">
        {data.orders.map((o: any) => (
          <section className="panel" key={o.id}>
            <h3>
              {data.listings.find((l: any) => l.id === o.listingId)?.name ||
                "Đơn hàng"}
            </h3>
            <code className="order-id">{o.id}</code>
            <p>
              {o.qty} suất · {money(o.total)} ·{" "}
              <b className={`order-status status-${o.status}`}>
                {labels[o.status]}
              </b>
            </p>
            {role === "student" && o.status === "awaiting_payment" && (
              <>
                <p>
                  Chuyển đúng {money(o.total)} trước {time(o.expires)}.
                </p>
                <p>
                  {data.bank.name} · {data.bank.account} · {data.bank.holder}
                </p>
                <p>
                  Nội dung: BC {o.id}. Vận hành sẽ xác nhận; chuyển muộn cần xử
                  lý thủ công.
                </p>
              </>
            )}
            {o.code && (
              <>
                <p>Mã nhận dùng một lần — chỉ đưa cho quán:</p>
                <code className="pickup">{o.code}</code>
              </>
            )}
            {role === "ops" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  action("payment", {
                    orderId: o.id,
                    reference: f.get("reference"),
                    amount: Number(f.get("amount")),
                    receivedAt: new Date(String(f.get("at"))).getTime(),
                  });
                }}
              >
                <input
                  name="reference"
                  placeholder="Mã giao dịch ngân hàng"
                  required
                />
                <input
                  name="amount"
                  type="number"
                  defaultValue={o.total}
                  required
                />
                <input
                  name="at"
                  type="datetime-local"
                  defaultValue={new Date(
                    data.now - new Date().getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)}
                  required
                />
                <button disabled={busy}>Ghi nhận tiền thực thu</button>
              </form>
            )}
            {role !== "student" && o.status === "paid" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  action("pickup", {
                    orderId: o.id,
                    code: new FormData(e.currentTarget).get("code"),
                  });
                }}
              >
                <input name="code" placeholder="Mã nhận từ khách" required />
                <button disabled={busy}>Xác nhận đã giao</button>
              </form>
            )}
            {role !== "student" &&
              ["paid", "awaiting_payment"].includes(o.status) && (
                <button
                  className="secondary"
                  onClick={() => action("cancel", { orderId: o.id })}
                >
                  Quán hủy
                </button>
              )}
            {role !== "student" && o.status === "paid" && (
              <button
                className="secondary"
                onClick={() => action("no_show", { orderId: o.id })}
              >
                Khách không đến sau khung nhận
              </button>
            )}
          </section>
        ))}
      </div>
      {role === "ops" && (
        <>
          <section className="panel" id="operations">
            <h2>Sổ tiền & điều kiện mở</h2>
            <div className="grid">
              {Object.entries(data.ledger).map(([k, v]) => (
                <div key={k}>
                  {labels[k] || k}
                  <strong>{money(Number(v))}</strong>
                </div>
              ))}
            </div>
            <p>
              Quán thật đủ điều kiện: {data.readiness.eligibleShops}/3 ·{" "}
              {data.readiness.ready
                ? "Đủ gate đối tác"
                : "Chưa được mở pilot thật"}
            </p>
            <p>
              Ngân sách: hạ tầng/maps 400.000đ · tuyển thử 500.000đ · khảo sát
              600.000đ · dự phòng 500.000đ.
            </p>
            <button
              onClick={async () => {
                const exported = await fetch("/api/export").then((r) =>
                  r.json(),
                );
                const blob = new Blob([JSON.stringify(exported, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bep-nuc-export.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Xuất dữ liệu vận hành
            </button>
          </section>
          <h2>Duyệt sinh viên</h2>
          {data.users.map((u: any) => (
            <p key={u.id}>
              {u.name} · {u.role} · {u.approved ? "Đã duyệt" : "Chờ duyệt"}{" "}
              <button
                onClick={() =>
                  action("approve", { id: u.id, approved: !u.approved })
                }
              >
                Đổi duyệt
              </button>
            </p>
          ))}
          <h2>Hoàn tiền thủ công</h2>
          {data.refunds.map((r: any) => (
            <section className="panel" key={r.id}>
              {money(r.amount)} · {r.reason} · {r.done ? "Đã hoàn" : "Cần hoàn"}
              {!r.done && (
                <RefForm
                  submit={(reference) =>
                    action("refund", { id: r.id, reference })
                  }
                />
              )}
            </section>
          ))}
          <h2>Đối soát</h2>
          {data.shops.map((s: any) => (
            <button
              key={s.id}
              onClick={() => action("settle", { shopId: s.id })}
            >
              Lập đợt: {s.name}
            </button>
          ))}
        </>
      )}
      {role !== "student" && (
        <>
          {data.settlements?.map((s: any) => (
            <section className="panel" key={s.id}>
              <p>
                {s.shopId} · {s.orderIds.length} đơn đã giao · {money(s.amount)}{" "}
                · {s.paid ? "Đã trả" : "Chưa trả"}
              </p>
              {role === "ops" && !s.paid && (
                <RefForm
                  submit={(reference) =>
                    action("payout", { id: s.id, reference })
                  }
                />
              )}
            </section>
          ))}
        </>
      )}
      {role === "ops" && <OperationsForms data={data} submit={action} />}
      <HowItWorks />
      <footer className="site-footer">
        <div className="footer-brand">
          Bếp Núc<span>Mỗi bữa ăn, thêm một lựa chọn.</span>
        </div>
        <div>
          <p>
            Vị trí chỉ lấy một lần nếu bạn chọn. Tuyến đi bộ Google có thể thiếu
            lối đi an toàn; kiểm tra thực tế trước khi di chuyển. Không theo dõi
            GPS liên tục.
          </p>
          <a href="#top">Về đầu trang</a>
        </div>
      </footer>
    </main>
  );
}
function Meal({ l, vouchers, busy, quote, shop, index, now }: any) {
  const [vid, setVid] = useState(""),
    [qty, setQty] = useState(1),
    [loc, setLoc] = useState(false);
  const chosen = vouchers.find((v: any) => v.id === vid);
  const unavailable = !l.stock || now >= l.end;
  const estimate = chosen
    ? Math.ceil(l.price * qty * 0.95 * (1 - chosen.rate))
    : null;
  return (
    <article className="panel meal">
      <div className="meal-masthead">
        <span className="eyebrow">LÔ CUỐI NGÀY</span>
        <span className="meal-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="meal-body">
        <div className="meal-meta">
          <span>
            {unavailable ? "Đã hết lượt nhận" : `${l.stock} suất còn lại`}
          </span>
          <span>
            {time(l.start)}–{time(l.end)}
          </span>
        </div>
        <h3>{l.name}</h3>
        <p className="shop-name">
          {shop?.name || "Nhận tại cửa hàng"}
          <span>{shop?.address}</span>
        </p>
        <div className="menu-price">
          <span>Giá menu / suất</span>
          <strong>{money(l.price)}</strong>
        </div>
        <details className="meal-details">
          <summary>Bảo quản & thông tin dị ứng</summary>
          <p>{l.storage}</p>
          <p>Dị ứng: {l.allergens}</p>
        </details>
        <div className="meal-controls">
          <label>
            Voucher
            <select value={vid} onChange={(e) => setVid(e.target.value)}>
              <option value="">Chọn voucher</option>
              {vouchers.map((v: any) => (
                <option
                  key={v.id}
                  value={v.id}
                  disabled={
                    v.state !== "available" || !l.eligible.includes(v.rate)
                  }
                >
                  {Math.round(v.rate * 100)}% · {labels[v.state]}{" "}
                  {!l.eligible.includes(v.rate)
                    ? "— món không đủ ngân sách"
                    : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            Số suất
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            >
              {[1, 2, 3].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        {estimate !== null && (
          <div className="price-preview" aria-live="polite">
            <span>Ước tính với voucher gốc</span>
            <strong>{money(estimate)}</strong>
            <small>
              Chưa tính thưởng tự nhận. Giá cuối được xác nhận ở bước báo giá.
            </small>
          </div>
        )}
        <label className="check">
          <input
            type="checkbox"
            checked={loc}
            onChange={(e) => setLoc(e.target.checked)}
          />
          Lấy vị trí một lần để tính thưởng tuyến đi bộ
        </label>
        <button
          disabled={
            busy || !vid || unavailable || chosen?.state !== "available"
          }
          onClick={() =>
            quote(
              l,
              vouchers.find((v: any) => v.id === vid),
              qty,
              loc,
            )
          }
        >
          {unavailable
            ? "Món đã hết lượt nhận"
            : busy
              ? "Đang xử lý…"
              : "Báo giá & giữ 10 phút"}
        </button>
      </div>
    </article>
  );
}
function RefForm({ submit }: { submit: (r: string) => unknown }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(String(new FormData(e.currentTarget).get("reference")));
      }}
    >
      <input
        name="reference"
        placeholder="Mã chuyển tiền đã thực hiện"
        required
      />
      <button>Xác nhận đã chuyển</button>
    </form>
  );
}
function ListingForm({ shopId, submit }: any) {
  return (
    <section className="panel">
      <h2>Đăng lô dư</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const a: any = { shopId };
          for (const k of ["name", "storage", "allergens", "category", "image"])
            a[k] = f.get(k);
          for (const k of ["price", "floor", "cost", "margin", "stock"])
            a[k] = Number(f.get(k));
          for (const k of ["start", "end"])
            a[k] = new Date(String(f.get(k))).getTime();
          submit(a);
        }}
      >
        {["name", "storage", "allergens"].map((k) => (
          <label key={k}>
            {labels[k]}
            <input name={k} required />
          </label>
        ))}
        <label>
          Loại món
          <select name="category">
            {["Cơm", "Bún/mì", "Bánh", "Đồ uống", "Món khác"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Ảnh có sẵn trong website (tùy chọn)
          <input name="image" placeholder="/food-images/ten-mon.jpg" />
        </label>
        {["price", "floor", "cost", "margin", "stock"].map((k) => (
          <label key={k}>
            {labels[k]}
            <input name={k} type="number" min="0" required />
          </label>
        ))}
        {["start", "end"].map((k) => (
          <label key={k}>
            {labels[k]}
            <input name={k} type="datetime-local" required />
          </label>
        ))}
        <button>Đăng lô</button>
      </form>
    </section>
  );
}
function OperationsForms({ data, submit }: any) {
  return (
    <>
      <h2>Hồ sơ đối tác</h2>
      <p>
        Chỉ đánh dấu ký/nguồn dư sau khi có bằng chứng ngoài ứng dụng. Không
        chuyển quán DEMO thành quán thật.
      </p>
      {data.partners.map((p: any) => (
        <section className="panel" key={p.id}>
          <b>{p.name}</b>
          <p>
            {p.id} · {p.mock ? "Dữ liệu giả" : "Quán thật"} · ký:{" "}
            {String(p.signed)} · nguồn dư lặp lại: {String(p.recurring)}
          </p>
          {!p.mock && (
            <button
              onClick={() =>
                submit("partner", {
                  ...p,
                  approved: true,
                  signed: true,
                  recurring: true,
                })
              }
            >
              Đã xác minh hồ sơ, duyệt đối tác
            </button>
          )}
        </section>
      ))}
      <section className="panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            submit("partner", {
              name: f.get("name"),
              address: f.get("address"),
              lat: Number(f.get("lat")),
              lng: Number(f.get("lng")),
              approved: false,
              signed: false,
              recurring: false,
              mock: false,
            });
          }}
        >
          <h3>Thêm quán chờ thẩm định</h3>
          <input name="name" placeholder="Tên quán" required />
          <input name="address" placeholder="Địa chỉ" required />
          <input
            name="lat"
            type="number"
            step="any"
            placeholder="Vĩ độ"
            required
          />
          <input
            name="lng"
            type="number"
            step="any"
            placeholder="Kinh độ"
            required
          />
          <button>Thêm quán</button>
        </form>
      </section>
      <h2>Khảo sát thực địa ({data.research.length} bản ghi)</h2>
      <section className="panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            submit("research", {
              kind: f.get("kind"),
              cluster: f.get("cluster"),
              notes: f.get("notes"),
              eligible: f.get("eligible") === "on",
            });
          }}
        >
          <select name="kind">
            <option value="student">Sinh viên</option>
            <option value="shop">Quán</option>
          </select>
          <input name="cluster" placeholder="Cụm trường" required />
          <input
            name="notes"
            placeholder="Kết quả & liên kết bằng chứng được phép lưu"
            required
          />
          <label>
            <input name="eligible" type="checkbox" />
            Đủ điều kiện / đăng ký thử
          </label>
          <button>Lưu kết quả thực địa</button>
        </form>
      </section>
      <h2>
        Chi phí (
        {money(data.expenses.reduce((n: number, x: any) => n + x.amount, 0))}
        /2.000.000đ)
      </h2>
      <section className="panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            submit("expense", {
              bucket: f.get("bucket"),
              amount: Number(f.get("amount")),
              note: f.get("note"),
            });
          }}
        >
          <select name="bucket">
            <option value="infra">Hạ tầng / Maps</option>
            <option value="recruit">Tuyển thử / vật liệu</option>
            <option value="research">Khảo sát / di chuyển</option>
            <option value="reserve">Dự phòng vận hành</option>
          </select>
          <input
            name="amount"
            type="number"
            min="1"
            placeholder="Số tiền"
            required
          />
          <input name="note" placeholder="Mục đích / chứng từ" required />
          <button>Ghi chi phí</button>
        </form>
      </section>
    </>
  );
}
