"use client";
import { useEffect, useRef, useState } from "react";
import { estimate, filterFood, foodCategories, money, percent, time, type Food } from "../../lib/commerce";
import { available, demoTime, expired, meals, orderTotal, placeOrder, progressOrder, rates, restoreOrders, shops, stockFor, type DemoOrder } from "../../lib/pages-demo";
const base = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "";
const storageKey = "bep-nuc-pages-demo-v1";
type Screen = "home" | "meals" | "checkout" | "orders";
export default function Demo() {
  const [screen, setScreen] = useState<Screen>("home");
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState(0);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("end");
  const [selected, setSelected] = useState<Food>();
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const intent = useRef("");
  useEffect(() => {
    try { setOrders(restoreOrders(localStorage.getItem(storageKey))); } catch { setMessage("Không lưu được dữ liệu trên thiết bị. Bản demo vẫn dùng được trong phiên này."); }
    const readHash = () => {
      const next = location.hash.slice(1);
      setScreen(next === "meals" || next === "orders" ? next : "home");
    };
    readHash(); setNow(Date.now()); setReady(true);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    window.addEventListener("hashchange", readHash);
    return () => { clearInterval(timer); window.removeEventListener("hashchange", readHash); };
  }, []);
  function save(next: DemoOrder[]) {
    setOrders(next); setNow(Date.now());
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setMessage("Thiết bị không lưu được đơn demo. Không đóng trang nếu muốn thử tiếp."); }
  }
  function go(next: Screen) {
    setScreen(next);
    if (next !== "checkout") history.replaceState(null, "", "#" + next);
    document.getElementById("content")?.focus();
  }
  function open(food: Food) {
    opener.current = document.activeElement as HTMLElement;
    setSelected(food); setQty(1); setRate(null); intent.current = crypto.randomUUID();
    dialog.current?.showModal();
  }
  function close() { dialog.current?.close(); opener.current?.focus(); }
  const used = available(orders, now).map(o => o.rate);
  const vouchers = rates.filter(r => !used.includes(r)).map(r => ({ rate: r, state: "available", day: "2026-10-26" }));
  const listings = meals.map(f => ({ ...f, stock: Math.max(0, stockFor(f, orders, now)) }));
  const shown = filterFood(listings, shops, query, category, "", true, false, sort, demoTime, budget, vouchers);
  const unit = (food: Food) => estimate(food.price).total;
  const filters = <>
    <label>Tìm món, quán, địa chỉ<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ví dụ: bánh mì" /></label>
    <label>Ngân sách mỗi suất<select value={budget} onChange={e => setBudget(Number(e.target.value))}><option value={0}>Mọi mức giá</option><option value={30000}>Đến 30.000 đ</option><option value={40000}>Đến 40.000 đ</option><option value={50000}>Đến 50.000 đ</option></select></label>
    <label>Loại món<select value={category} onChange={e => setCategory(e.target.value)}><option value="">Tất cả món</option>{foodCategories.map(c => <option key={c}>{c}</option>)}</select></label>
    <button className="secondary" onClick={() => { setQuery(""); setBudget(0); setCategory(""); }}>Xóa bộ lọc</button>
  </>;
  return <div className="site-frame commerce pages-demo">
    <a className="skip-link" href="#content">Đến nội dung chính</a>
    <header className="frame-header"><div className="frame-header-inner"><a className="frame-brand" href="#home" onClick={() => go("home")}>Bếp Núc</a><nav aria-label="Điều hướng chính"><a href="#meals" aria-current={screen === "meals" || screen === "checkout" ? "page" : undefined} onClick={() => go("meals")}>Chọn bữa</a><a href="#orders" aria-current={screen === "orders" ? "page" : undefined} onClick={() => go("orders")}>Đơn thử ({orders.length})</a></nav></div></header>
    <main id="content" tabIndex={-1}>
      <aside className="pages-demo-notice"><strong>DEMO CÔNG KHAI · KHÔNG CHUYỂN TIỀN</strong><span>Món, địa chỉ, tồn và đơn đều giả. Dữ liệu chỉ lưu trên trình duyệt của bạn.</span></aside>
      <div className="market-content">
      {message && <p className="market-notice" role="status">{message} <button className="secondary" onClick={() => setMessage("")}>Đóng thông báo</button></p>}
      {!ready ? <p role="status">Đang tải bản demo…</p> : <>
      {screen === "home" && <section className="home-intro"><p className="home-kicker">HÀ NỘI · TỰ NHẬN TẠI QUÁN</p><h1>Chọn bữa cuối ngày, nhận tại quán.</h1><p className="home-lead">Thử tìm bữa hợp túi tiền, chọn voucher và khám phá hành trình nhận bữa.</p><button onClick={() => go("meals")}>Thử chọn bữa hôm nay</button><p className="fine">Không đăng nhập, không lấy vị trí, không nhận tiền thật.</p><section className="home-process"><h2>Ba bước để thử</h2><ol><li><h3>Chọn bữa phù hợp</h3><p>Lọc theo món và ngân sách, xem giá và giờ nhận minh họa.</p></li><li><h3>Thử giữ suất</h3><p>Chọn 1–3 suất và một voucher. Mọi khoản tiền đều mô phỏng.</p></li><li><h3>Thử nhận bữa</h3><p>Tự mô phỏng xác nhận thanh toán và nhận hàng để xem các trạng thái.</p></li></ol></section></section>}
      {screen === "meals" && <><h1>Bữa đang có</h1><p className="fine">Giá ước tính theo voucher demo còn dùng được; chưa có thưởng vị trí. Khung giờ là một tối minh họa lúc 18:30.</p><div className="catalogue-layout"><aside className="catalogue-sidebar" aria-label="Bộ lọc món"><details className="pages-filters" open><summary>Bộ lọc</summary><div>{filters}</div></details></aside><section className="catalogue-results" aria-label="Kết quả tìm món"><div className="catalogue-toolbar"><p role="status">{shown.length} món còn suất demo</p><label>Sắp xếp<select value={sort} onChange={e => setSort(e.target.value)}><option value="end">Giờ nhận kết thúc sớm</option><option value="price">Giá thấp đến cao</option></select></label></div>{!shown.length && <p>Không có món phù hợp. Hãy bỏ một bộ lọc hoặc bắt đầu lại lượt demo nếu đã hết suất.</p>}<div className="food-grid">{shown.map(food => {
        const best = Math.max(0, ...vouchers.map(v => v.rate));
        return <article className="food-card" key={food.id}><button className="food-picture-button" onClick={() => open(food)} aria-label={`Xem ${food.name}`}><img src={base + food.image} alt={`Ảnh minh họa ${food.name}`} /></button><div className="food-card-body"><div className="food-card-description"><h2 className="pages-food-name">{food.name}</h2><p className="shop-meta">{shops.find(s => s.id === food.shopId)?.name}</p><p className="food-address">{shops.find(s => s.id === food.shopId)?.address}</p><p className="pickup-line">Nhận {time(food.start)}–{time(food.end)}</p><p className="stock-label">Còn {food.stock} suất · Ảnh minh họa</p></div><div className="food-card-purchase"><strong className="food-price">{money(estimate(food.price, best).total)}</strong><span className="fine">/ suất · {best ? `với voucher ${percent(best)}` : "chưa áp voucher"}</span><s className="fine">Giá menu {money(food.price)}</s><button onClick={() => open(food)}>Chọn bữa này</button></div></div></article>;
      })}</div></section></div></>}
      {screen === "checkout" && selected && <section className="pages-checkout"><button className="secondary" onClick={() => go("meals")}>Quay lại chọn món</button><h1>Kiểm tra bữa thử</h1><h2>{selected.name} · {qty} suất</h2><p>{shops.find(s => s.id === selected.shopId)?.address}</p><p>Nhận {time(selected.start)}–{time(selected.end)} · Tự nhận tại quán</p><p>Giá trước voucher: {money(estimate(selected.price * qty).total)}</p><fieldset><legend>Chọn một voucher demo</legend>{rates.map(r => <label className="pages-voucher" key={r}><input type="radio" name="voucher" checked={rate === r} disabled={used.includes(r)} onChange={() => setRate(r)} /><span><b>{percent(r)}</b> · giảm {money(estimate(selected.price * qty, r).voucherDiscount)} · tổng {money(estimate(selected.price * qty, r).total)}{used.includes(r) ? " · Đã dùng / đang giữ" : r === Math.max(...rates.filter(v => !used.includes(v))) ? " · Tiết kiệm nhất cho đơn này" : ""}</span></label>)}</fieldset>{rates.every(r => used.includes(r)) && <p>Chưa có voucher dùng được. Xem đơn đang giữ hoặc bắt đầu lại lượt demo.</p>}<p className="pages-total">Tổng tiền giả: <strong>{money(estimate(selected.price * qty, rate || 0).total)}</strong></p><button disabled={rate === null} onClick={() => { try { const next = placeOrder(orders, selected.id, qty, rate!, Date.now(), "DEMO-" + intent.current); save(next); go("orders"); } catch (error) { setMessage((error as Error).message); } }}>Giữ suất và tạo đơn thử</button><p className="fine">Giữ suất demo 10 phút; chưa phải đơn hàng thật. Website không cung cấp tài khoản ngân hàng.</p></section>}
      {screen === "orders" && <section className="pages-orders"><h1>Đơn thử của bạn</h1>{!orders.length && <><p>Bạn chưa tạo đơn demo.</p><button onClick={() => go("meals")}>Chọn bữa để thử</button></>}{orders.map(order => <article className="pages-order" key={order.id}><h2>{meals.find(f => f.id === order.foodId)?.name} · {order.qty} suất</h2><p className="fine">{order.id}</p><p>Tổng tiền giả: <strong>{money(orderTotal(order))}</strong></p><p><b>{expired(order, now) ? "Hết hạn giữ suất demo" : order.status === "awaiting_payment" ? "Chờ xác nhận tiền giả" : order.status === "paid" ? "Đã xác nhận tiền giả · Có thể thử nhận bữa" : "Đã nhận bữa mô phỏng"}</b></p>{order.status === "awaiting_payment" && !expired(order, now) && <p>Còn {Math.max(0, Math.ceil((order.created + 600000 - now) / 1000))} giây giữ suất. Không chuyển khoản.</p>}{order.status === "paid" && <><p>Mã nhận minh họa: <strong>DEMO-{order.id.slice(-6).toUpperCase()}</strong></p><p>{shops.find(s => s.id === meals.find(f => f.id === order.foodId)?.shopId)?.address} · Nhận 17:30–21:30 (minh họa)</p></>}{!expired(order, now) && order.status !== "delivered" && <button onClick={() => { try { save(progressOrder(orders, order.id, Date.now(), order.status)); } catch (error) { setMessage((error as Error).message); } }}>{order.status === "awaiting_payment" ? "Mô phỏng xác nhận thanh toán" : "Mô phỏng nhận bữa"}</button>}{expired(order, now) && <button className="secondary" onClick={() => go("meals")}>Chọn lại bữa</button>}</article>)}</section>}
      </>}
      </div>
    </main>
    <footer className="frame-footer"><div className="frame-footer-inner"><div className="frame-footer-heading"><a className="frame-brand" href="#home" onClick={() => go("home")}>Bếp Núc</a><nav aria-label="Điều hướng cuối trang"><a href="#meals" onClick={() => go("meals")}>Chọn bữa</a><a href="#orders" onClick={() => go("orders")}>Đơn thử</a></nav></div><p>Bản trình diễn công khai. Không có giao dịch, quán hay mã nhận hàng thật.</p><button className="secondary" disabled={!ready} onClick={() => { save([]); setRate(null); setSelected(undefined); setMessage("Đã xóa đơn và khôi phục voucher, tồn demo trên thiết bị này."); go("home"); }}>Bắt đầu lại lượt demo</button></div></footer>
    <dialog className="meal-dialog" ref={dialog} aria-labelledby="demo-meal-title" onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }}><button className="dialog-close secondary" onClick={close}>Đóng</button>{selected && <div className="meal-detail"><div className="meal-detail-visual"><div className="food-image"><img src={base + selected.image} alt={`Ảnh minh họa ${selected.name}`} /><span className="demo-image-label">Ảnh minh họa · DEMO</span></div></div><div className="meal-detail-info"><h2 id="demo-meal-title">{selected.name}</h2><p>Giá mỗi suất trước voucher: <b>{money(unit(selected))}</b></p><section className="meal-collection"><h3>Nơi và giờ nhận (minh họa)</h3><p>{shops.find(s => s.id === selected.shopId)?.address}</p><p>Nhận {time(selected.start)}–{time(selected.end)}</p><p>{selected.allergens}</p></section><details><summary>Bảo quản và cách dùng</summary><p>{selected.storage}</p></details><div className="meal-purchase"><label>Số suất<select value={qty} onChange={e => setQty(Number(e.target.value))}>{[1,2,3].filter(n => n <= stockFor(selected, orders, now)).map(n => <option key={n}>{n}</option>)}</select></label><p>Tổng trước voucher: <b>{money(estimate(selected.price * qty).total)}</b></p><button onClick={() => { close(); go("checkout"); }}>Kiểm tra bữa đã chọn</button></div></div></div>}</dialog>
  </div>;
}
