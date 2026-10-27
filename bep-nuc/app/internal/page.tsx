"use client";
import { useEffect, useState, useRef } from "react";
import { SiteHeader, ProductHero, HowItWorks } from "../components/brand";
import { SiteFooter } from "../components/site-frame";
import Link, { useAppRouter } from "../components/navigation";
import { apiFetch, googleLogin } from "../../lib/mvp-client";
import { isCloudMvp } from "../../lib/app-navigation";
import { productAssets } from "../../lib/product-assets";
import { launchPartner, launchMenuNames } from "../../lib/launch-menu";
const labels: Record<string, string> = {
  available: "Chưa dùng",
  reserved: "Đang giữ",
  used: "Đã dùng",
  awaiting_payment: "Chờ xác nhận tiền",
  awaiting_delivery_fee: "Chờ báo / đồng ý phí giao",
  out_for_delivery: "Đang giao tận nơi",
  delivered: "Khách đã nhận tận nơi",
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
  deliveryFeesCollected: "Phí giao đã thu",
  deliveryCostPaid: "Chi phí giao đã chi",
  deliveryCostsUnconfirmed: "Đơn chưa ghi chi phí giao",
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
  const router=useAppRouter();
  const mutation=useRef(false);
  const [data, setData] = useState<any>(),
    [error, setError] = useState(""),
    [quote, setQuote] = useState<any>(),
    [busy, setBusy] = useState(false),
    [email, setEmail] = useState(""),
    [token, setToken] = useState("");
  async function load() {
    try {
      const r = await apiFetch("/api/pilot", { cache: "no-store" });
      const d = await r.json();
      if (r.ok) setData(d);
      else setError(d.error);
    } catch {
      setError("Chưa kết nối được. Bạn có thể thử tải lại trang.");
    }
  }
  useEffect(() => {
    load();
    const t = setInterval(() => { if(document.visibilityState === "visible") load(); }, 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (data?.user.role === "student") router.push("/meals");
  }, [data?.user.role]);
  async function action(action: string, args: any) {
    if(mutation.current)return;
    mutation.current=true;
    setBusy(true);
    setError("");
    let pendingKey="";
    try {
      const signature=JSON.stringify([data?.user.id,action,args]);
      let pending:any;
      try{pending=JSON.parse(sessionStorage.getItem("bc-staff-action") || "null");}catch{}
      pendingKey=pending?.signature===signature&&typeof pending.key==="string"?pending.key:crypto.randomUUID();
      try{sessionStorage.setItem("bc-staff-action",JSON.stringify({signature,key:pendingKey}));}catch{}
      const r = await apiFetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          args: { ...args, key: pendingKey },
        }),
      });
      const d = await r.json();
      if(r.ok || (r.status>=400&&r.status<500))try{sessionStorage.removeItem("bc-staff-action");}catch{}
      if (!r.ok) throw new Error(d.error);
      await load();
      return d;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      mutation.current=false;
      setBusy(false);
    }
  }
  async function login(role?: string) {
    if(isCloudMvp){try{await googleLogin("/internal");}catch(e){setError((e as Error).message);}return;}
    const r = await apiFetch("/api/auth", {
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
      <div className="site-frame internal-frame" id="top">
        <SiteHeader />
        <main className="site-shell" id="content" tabIndex={-1}>
        <section className="login-layout">
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
            {isCloudMvp ? <><p>Đăng nhập Google để truy cập khu vực quán hoặc vận hành.</p><button type="submit">Tiếp tục với Google</button><p><Link href="/meals">Quay lại chọn bữa</Link></p></> : <>
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
            </button></>}
          </form>
        </section>
        </main>
        <SiteFooter />
      </div>
    );
  const role = data.user.role;
  return (
    <div className="site-frame internal-frame" id="top">
      <SiteHeader role={role} name={data.user.name} />
      <main className="site-shell" id="content" tabIndex={-1}>
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
                <p>Khoản quán nhận: {l.payoutShare === .9 ? "90% tiền món khách thực trả, không gồm phí giao" : `${money(l.floor)}/suất`}</p>
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
            <p>{o.fulfillment==="delivery"?"Giao tận nơi":"Tự đến lấy"}</p>
            {role==="ops" && o.delivery && <div className="delivery-contact"><p>{o.delivery.recipient} · {o.delivery.phone}</p><p>{o.delivery.address}</p><p>Tiền món {money(o.foodTotal)} · Phí giao {o.deliveryFee===undefined?"chưa báo":money(o.deliveryFee)}{o.delivery.acceptedAt!==undefined?" · Khách đã đồng ý":" · Chưa đồng ý phí"}</p></div>}
            {role==="ops" && o.status==="awaiting_delivery_fee" && <form onSubmit={e=>{e.preventDefault();action("delivery_fee",{orderId:o.id,fee:Number(new FormData(e.currentTarget).get("fee"))});}}><label>Phí giao báo khách (đ)<input name="fee" type="number" min="0" max="1000000" step="1" defaultValue={o.deliveryFee??""} required/></label><p>Hạn giữ {time(o.expires)}; phí mới cần khách đồng ý trước khi chuyển khoản.</p><button disabled={busy}>Báo phí và chờ khách xác nhận</button></form>}
            {role==="ops" && o.status==="out_for_delivery" && <form onSubmit={e=>{e.preventDefault();action("delivery_complete",{orderId:o.id,confirmation:String(new FormData(e.currentTarget).get("confirmation"))});}}><label>Căn cứ xác nhận khách nhận hàng<input name="confirmation" minLength={3} maxLength={250} placeholder="Ví dụ: khách xác nhận đã nhận qua điện thoại" required/></label><button disabled={busy}>Xác nhận khách đã nhận hàng</button></form>}
            {role==="ops" && o.fulfillment==="delivery" && data.payments?.some((p:any)=>p.orderId===o.id&&p.valid) && !data.deliveryCosts?.some((c:any)=>c.orderId===o.id) && <form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);action("delivery_cost",{orderId:o.id,amount:Number(f.get("amount")),reference:String(f.get("reference"))});}}><h4>Chi phí người giao đã thực trả</h4><label>Số tiền (đ)<input name="amount" type="number" min="0" max="1000000" step="1" required/></label><label>Mã chứng từ / xác nhận chi<input name="reference" minLength={3} maxLength={128} required/></label><button disabled={busy}>Ghi nhận khoản đã chi</button></form>}
            {o.code && (
              <>
                <p>Mã nhận dùng một lần — chỉ đưa cho quán:</p>
                <code className="pickup">{o.code}</code>
              </>
            )}
            {role === "ops" && (
              <details open={o.status==="awaiting_payment"}><summary>Ghi nhận chuyển khoản đã thực thu</summary><form
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
                  step="0.001"
                  aria-label="Thời điểm tiền thực vào ngân hàng"
                  defaultValue={new Date(
                    data.now - new Date().getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 23)}
                  required
                />
                <button disabled={busy}>Ghi nhận tiền thực thu</button>
              </form></details>
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
                <button disabled={busy}>{o.fulfillment==="delivery"?"Xác nhận quán bàn giao cho người giao":"Xác nhận đã giao"}</button>
              </form>
            )}
            {role !== "student" &&
              (["paid", "awaiting_payment","awaiting_delivery_fee"].includes(o.status) || role==="ops"&&o.status==="out_for_delivery") && (
                <button
                  className="secondary"
                  onClick={() => action("cancel", { orderId: o.id })}
                >
                  Quán hủy
                </button>
              )}
            {role !== "student" && o.status === "paid" && o.fulfillment!=="delivery" && (
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
                  {k==="contribution"&&data.ledger.deliveryCostsUnconfirmed?"Contribution tạm tính — còn thiếu chi phí giao":labels[k] || k}
                  <strong>{k==="deliveryCostsUnconfirmed"?`${v} đơn`:money(Number(v))}</strong>
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
              {isCloudMvp ? "Hạ tầng dùng gói Free, ngân sách dịch vụ 0đ. Kiểm tra hạn mức trước mỗi ca." : "Ngân sách: hạ tầng/maps 400.000đ · tuyển thử 500.000đ · khảo sát 600.000đ · dự phòng 500.000đ."}
            </p>
            <button
              onClick={async () => {
                try{
                const response=await apiFetch("/api/export");
                const exported=await response.json();
                if(!response.ok){setError(exported.error || "Chưa xuất được đối soát");return;}
                const blob = new Blob([JSON.stringify(exported, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bep-nuc-export.json";
                a.click();
                URL.revokeObjectURL(url);
                }catch{setError("Chưa xuất được đối soát. Vui lòng kiểm tra kết nối và thử lại.");}
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
      </main>
      <SiteFooter supportEmail={data.supportEmail}>
        <p>Vị trí chỉ lấy một lần nếu bạn chọn. Kiểm tra đường thực tế trước khi di chuyển. Không theo dõi GPS liên tục.</p>
        <a href="#top">Về đầu trang</a>
      </SiteFooter>
    </div>
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
  const [revenueShare, setRevenueShare] = useState(true);
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
          if (revenueShare) { a.payoutShare=.9; a.floor=0; }
          for (const k of ["start", "end"])
            a[k] = new Date(String(f.get(k))).getTime();
          submit(a);
        }}
      >
        <label>Điền nhanh từ ảnh món có sẵn<select defaultValue="" onChange={e=>{const item=productAssets.find(p=>p.image===e.target.value),form=e.currentTarget.form;if(!item||!form)return;for(const [name,value] of Object.entries({name:item.name,price:item.referencePrice,image:item.image,category:item.category})){const field=form.elements.namedItem(name) as HTMLInputElement|HTMLSelectElement|null;if(field)field.value=String(value);}}}><option value="">Chọn món để điền tên, giá và ảnh</option>{productAssets.map(p=><option key={p.image} value={p.image}>{p.name} · {money(p.referencePrice)}</option>)}</select></label>
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
        <label>Cách đối soát<select value={revenueShare ? "share" : "fixed"} onChange={e=>setRevenueShare(e.target.value==="share")}><option value="share">Quán 90% / Bếp Núc 10% tiền món thực thu</option><option value="fixed">Khoản cố định mỗi suất (hợp đồng cũ)</option></select></label>
        <p>Phí giao không chia cho quán. Phần 10% còn lại phải đủ chi phí và biên tối thiểu bạn nhập.</p>
        {["price", ...(!revenueShare ? ["floor"] : []), "cost", "margin", "stock"].map((k) => (
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
          <p>{p.address}</p>
          {p.id===launchPartner.id && <p>Thực đơn đã chọn: {productAssets.filter(item=>launchMenuNames.includes(item.name)).map(item=>`${item.name} ${money(item.referencePrice)}`).join(" · ")}. Điền số suất và giờ nhận thực tế khi đăng lô.</p>}
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
          {!p.mock && <details><summary>Đăng món cho quán này</summary><ListingForm shopId={p.id} submit={(args:any)=>submit("listing",args)}/></details>}
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
              lat: String(f.get("lat")).trim() ? Number(f.get("lat")) : null,
              lng: String(f.get("lng")).trim() ? Number(f.get("lng")) : null,
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
          />
          <input
            name="lng"
            type="number"
            step="any"
            placeholder="Kinh độ"
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
