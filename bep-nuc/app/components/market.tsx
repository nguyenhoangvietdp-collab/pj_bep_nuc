"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LoadingScreen from "./loading-screen";
import { useRouter } from "next/navigation";
import {
  estimate,
  percent,
  browseUrl,
  displayPrice,
  supportLink,
  voucherHint,
  filterFood,
  foodCategories,
  money,
  time,
  Food,
  PublicShop,
} from "../../lib/commerce";
type Catalog = {
  now: number;
  demo: boolean;
  shops: PublicShop[];
  listings: Food[];
};
type Filters = { category: string; budget: number; shop: string; stock: boolean; receiving: boolean };
const defaultFilters: Filters = { category: "", budget: 0, shop: "", stock: true, receiving: false };
type Draft = { listingId: string; qty: number; voucherId?: string };
const states: Record<string, string> = {
  available: "Chưa dùng",
  reserved: "Đang giữ",
  used: "Đã dùng",
  awaiting_payment: "Chờ xác nhận tiền",
  paid: "Đã thanh toán · đến quán nhận",
  picked_up: "Đã nhận bữa",
  expired: "Hết hạn thanh toán",
  cancelled: "Quán đã hủy",
  no_show: "Đã quá khung nhận",
};
const safeReturn = (value: string | null) =>
  value &&
  /^\/(checkout|orders|meals|shops)(\/|\?|$)/.test(value) &&
  !value.includes("\\")
    ? value
    : "/checkout";
export default function Market({ view, id }: { view: string; id?: string }) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Catalog>(),
    [profile, setProfile] = useState<any>(),
    [user, setUser] = useState<any>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [draft, setDraft] = useState<Draft>(),
    [selected, setSelected] = useState<Food>(),
    [qty, setQty] = useState(1),
    [voucher, setVoucher] = useState(""),
    [location, setLocation] = useState(false),
    [tick, setTick] = useState(Date.now()),
    [query, setQuery] = useState(""),
    [budget, setBudget] = useState(0),
    [filtersReady, setFiltersReady] = useState(false),
    [category, setCategory] = useState(""),
    [shopFilter, setShopFilter] = useState(""),
    [stockOnly, setStockOnly] = useState(true),
    [receiving, setReceiving] = useState(false),
    [sort, setSort] = useState("end"),
    [email, setEmail] = useState(""),
    [otp, setOtp] = useState(""),
    [sent, setSent] = useState(false),
    [notice, setNotice] = useState(""),
    [loadError, setLoadError] = useState(""),
    [syncedAt, setSyncedAt] = useState(0),
    [browseHref, setBrowseHref] = useState("/meals"),
    [retryAt, setRetryAt] = useState(0),
    [supportEmail, setSupportEmail] = useState<string>(),
    [mobileFilters, setMobileFilters] = useState<Filters>(defaultFilters);
  const fetched = useRef(Date.now()),
    dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLElement | null>(null),
    seen = useRef(new Set<string>()),
    summary = useRef<HTMLElement>(null),
    mutation = useRef(false),
    loadVersion = useRef(0),
    actionError = useRef<HTMLDivElement>(null),
    filterDialog = useRef<HTMLDialogElement>(null),
    filterOpener = useRef<HTMLButtonElement>(null);
  async function load(_initial = false) {
    const version = ++loadVersion.current;
    try {
      const [c, a] = await Promise.all([
        fetch("/api/catalogue", { cache: "no-store", signal: AbortSignal.timeout(12000) }),
        fetch("/api/auth", { cache: "no-store", signal: AbortSignal.timeout(12000) }),
      ]);
      if (!c.ok || !a.ok) throw new Error("Chưa tải được trạng thái mới. Dữ liệu đang hiển thị có thể đã cũ.");
      const nextCatalog = await c.json(), received = Date.now(), auth = await a.json();
      let nextProfile;
      if (auth.user?.approved) {
        const p = await fetch("/api/pilot", { cache: "no-store", signal: AbortSignal.timeout(12000) });
        if (!p.ok) throw new Error("Chưa tải được đơn và voucher. Thử kiểm tra lại trước khi đặt.");
        nextProfile = await p.json();
      }
      if (version !== loadVersion.current) return;
      setCatalog(nextCatalog); fetched.current = received;
      setUser(auth.user); setSupportEmail(auth.supportEmail); setProfile(nextProfile); setSyncedAt(Date.now()); setLoadError("");
      try {
        const mode = auth.user?.approved && auth.user.role === "student" ? "student" : "guest";
        if (mode === "student" && sessionStorage.getItem("bc-price-mode") === "guest")
          setNotice("Giá và kết quả đã cập nhật theo voucher của bạn. Chưa gồm thưởng vị trí.");
        sessionStorage.setItem("bc-price-mode", mode);
      } catch {}
      return nextProfile;
    } catch (e) {
      if (version === loadVersion.current) setLoadError((e as Error).name === "TimeoutError" ? "Kết nối chậm. Trạng thái có thể đã cũ; hãy kiểm tra lại." : (e as Error).message);
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }
  useEffect(() => {
    load(true);
    const poll = setInterval(() => load(), 15000);
    const refresh = () => { if (document.visibilityState === "visible") load(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const t = setInterval(() => setTick(Date.now()), 1000);
    try {
      setBrowseHref(browseUrl(sessionStorage.getItem("bc-browse")));
      const raw = sessionStorage.getItem("bc-draft");
      if (raw) {
        const d = JSON.parse(raw);
        if (
          typeof d.listingId === "string" &&
          Number.isInteger(d.qty) &&
          d.qty >= 1 &&
          d.qty <= 3
        )
          { setDraft(d); if (typeof d.voucherId === "string") setVoucher(d.voucherId); }
      }
    } catch {}
    const p = new URLSearchParams(window.location.search);
    setQuery(p.get("q") || "");
    const limit = Number(p.get("budget"));
    setBudget(Number.isSafeInteger(limit) && limit > 0 ? limit : 0);
    setCategory(p.get("category") || "");
    setShopFilter(p.get("shop") || "");
    setStockOnly(p.get("stock") !== "all");
    setReceiving(p.get("receiving") === "1");
    setSort(p.get("sort") === "price" ? "price" : "end");
    setFiltersReady(true);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      loadVersion.current++;
      clearInterval(poll);
      clearInterval(t);
    };
  }, []);
  useEffect(() => {
    if (!filtersReady || (view !== "browse" && view !== "shop")) return;
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (budget) p.set("budget", String(budget));
    if (category) p.set("category", category);
    if (shopFilter) p.set("shop", shopFilter);
    if (!stockOnly) p.set("stock", "all");
    if (receiving) p.set("receiving", "1");
    if (sort !== "end") p.set("sort", sort);
    const url = browseUrl(window.location.pathname + (p.size ? "?" + p.toString() : ""));
    window.history.replaceState(null, "", url);
    setBrowseHref(url);
    try { sessionStorage.setItem("bc-browse", url); } catch {}
  }, [query, budget, filtersReady, category, shopFilter, stockOnly, receiving, sort, view]);
  useEffect(() => {
    if (!selected) return;
    setQty(1);
    dialog.current?.showModal();
    return () => {
      dialog.current?.close();
      if (opener.current?.isConnected) opener.current.focus();
    };
  }, [selected]);
  useEffect(() => {
    if (!profile?.user || profile.user.role !== "student" || !catalog) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const listingId = (e.target as HTMLElement).dataset.foodId!;
          const key = profile.user.id + ":" + listingId;
          if (e.isIntersecting && !seen.current.has(key)) {
            seen.current.add(key);
            fetch("/api/pilot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "exposure",
                args: { listingId, key: crypto.randomUUID() },
              }),
            }).catch(() => {});
          }
        });
      },
      { threshold: 0.5 },
    );
    document
      .querySelectorAll("[data-food-id]")
      .forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, [
    profile?.user?.id,
    catalog,
    query,
    category,
    shopFilter,
    stockOnly,
    receiving,
  ]);
  const now = catalog
    ? catalog.now + (catalog.demo ? 0 : tick - fetched.current)
    : tick;
  const vouchers = user?.approved && user.role === "student" ? profile?.vouchers || [] : [];
  const held = profile?.heldQuotes?.[0];
  const pendingOrder = profile?.orders?.find((o: any) => o.status === "awaiting_payment" && o.expires > now);
  useEffect(() => {
    if (held?.id && view === "checkout") {
      summary.current?.scrollIntoView({ block: "center" });
      summary.current?.focus({ preventScroll: true });
    }
  }, [held?.id, view]);
  const item =
    catalog?.listings.find(
      (l) =>
        l.id ===
        (held?.listingId || draft?.listingId || (view === "meal" ? id : "")),
    ) || profile?.listings?.find((l: Food) => l.id === held?.listingId);
  const shop = catalog?.shops.find(
    (s) => s.id === (view === "shop" ? id : item?.shopId),
  );
  const activeVoucher = profile?.vouchers?.find((v: any) => v.id === voucher && item && displayPrice(item, [v], now).rate === v.rate);
  const count = held?.qty || draft?.qty || 1;
  const amounts =
    held ||
    (item ? estimate(item.price * count, activeVoucher?.rate || 0) : undefined);
  const seconds = held
    ? Math.max(0, Math.ceil((held.expires - now) / 1000))
    : 0;
  async function act(action: string, args: any) {
    if (mutation.current) return;
    mutation.current = true; setBusy(true); setError("");
    const signature = JSON.stringify([user?.id, action, args]);
    let key = crypto.randomUUID(), definitive = false;
    try {
      try {
        const stored = JSON.parse(sessionStorage.getItem("bc-action") || "null");
        if (stored?.signature === signature && typeof stored.key === "string") key = stored.key;
        sessionStorage.setItem("bc-action", JSON.stringify({ signature, key }));
      } catch {}
      const current = await load();
      if (!current) throw new Error("Chưa tải được trạng thái mới.");
      if (action === "order") {
        const existing = current.orders?.find((o: any) => o.quoteId === args.quoteId);
        if (existing) { definitive = true; return existing; }
      }
      if (action === "quote") {
        const existing = current.heldQuotes?.find((q: any) => q.listingId === args.listingId && q.voucherId === args.voucherId && q.qty === args.qty);
        if (existing) { definitive = true; return { ok: true }; }
        if (current.heldQuotes?.length) { definitive = true; throw new Error("Bạn đang giữ một bữa khác. Kiểm tra hoặc bỏ giữ trước khi đặt lại."); }
      }
      const r = await fetch("/api/pilot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, args: { ...args, key } }), signal: AbortSignal.timeout(12000),
      });
      const d = await r.json(); definitive = true;
      if (!r.ok) throw new Error(d.error || "Thao tác chưa hoàn tất. Vui lòng kiểm tra lại.");
      await load(); return d;
    } catch (e) {
      if (!definitive) {
        const state = await load();
        if (action === "order") {
          const existing = state?.orders?.find((o: any) => o.quoteId === args.quoteId);
          if (existing) { definitive = true; return existing; }
        }
        if (action === "quote" && state?.heldQuotes?.some((q: any) => q.listingId === args.listingId && q.voucherId === args.voucherId && q.qty === args.qty)) {
          definitive = true; return { ok: true };
        }
      }
      setError(definitive ? (e as Error).message : "Chưa xác định thao tác đã hoàn tất do mất kết nối. Kiểm tra trạng thái trước khi thử lại; không chuyển thêm tiền.");
      requestAnimationFrame(() => actionError.current?.focus());
    } finally {
      if (definitive) try { sessionStorage.removeItem("bc-action"); } catch {}
      mutation.current = false; setBusy(false);
    }
  }
  function openFood(l: Food) {
    opener.current = document.activeElement as HTMLElement;
    setSelected(l);
  }
  function saveDraft(l: Food, n: number) {
    const d = { listingId: l.id, qty: n };
    setDraft(d);
    sessionStorage.setItem("bc-draft", JSON.stringify(d));
    setSelected(undefined);
    router.push("/checkout");
  }
  async function quote() {
    if (!item || !activeVoucher || mutation.current) return;
    mutation.current = true;
    let coords;
    setBusy(true);
    setError("");
    if (location)
      try {
        coords = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(
            (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
            reject,
            { timeout: 5000, enableHighAccuracy: false },
          ),
        );
      } catch {
        setNotice("Chưa lấy được vị trí. Báo giá dùng voucher gốc.");
      }
    mutation.current = false;
    await act("quote", {
      listingId: item.id,
      voucherId: activeVoucher.id,
      qty: count,
      location: coords,
    });
  }
  async function login(role?: string, resend = false) {
    if (busy || (resend && Date.now() < retryAt)) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, token: resend ? undefined : otp || undefined }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (role || (otp && !resend)) {
        await load();
        router.push(
          role === "guest"
            ? "/"
            : role && role !== "student"
              ? "/internal"
              : safeReturn(
                  new URLSearchParams(window.location.search).get("returnTo"),
                ),
        );
      } else {
        setSent(true);
        setRetryAt(Date.now() + 60000);
        setNotice("Kiểm tra email để lấy mã xác thực.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const loginHref =
    "/login?returnTo=" +
    encodeURIComponent(
      view === "orders"
        ? "/orders"
        : view === "order"
          ? `/orders/${id}`
          : "/checkout",
    );
  const currentFilters: Filters = { category, budget, shop: shopFilter, stock: stockOnly, receiving };
  function applyFilters(next: Filters) {
    setCategory(next.category); setBudget(next.budget); setShopFilter(next.shop);
    setStockOnly(next.stock); setReceiving(next.receiving);
  }
  function filterFields(values: Filters, change: (next: Filters) => void, prefix: string) {
    return <>
      <fieldset className="facet-group"><legend>Loại món</legend>
        {["", ...foodCategories].map(value => <label key={value} className="facet-option"><input type="radio" name={`${prefix}-category`} checked={values.category === value} onChange={() => change({ ...values, category: value })} /><span>{value || "Tất cả món"}</span></label>)}
      </fieldset>
      <fieldset className="facet-group"><legend>Giá mỗi suất</legend>
        <p className="facet-hint">Theo giá đang hiển thị, chưa gồm thưởng vị trí.</p>
        {[0, 30000, 40000, 50000].map(value => <label key={value} className="facet-option"><input type="radio" name={`${prefix}-budget`} checked={values.budget === value} onChange={() => change({ ...values, budget: value })} /><span>{value ? `Không quá ${money(value)}` : "Không giới hạn"}</span></label>)}
        <label className="custom-budget">Ngân sách khác (đ)<input type="number" min="0" step="1" inputMode="numeric" placeholder="Ví dụ: 35000" value={values.budget || ""} onChange={e => { const n = Number(e.target.value); if(Number.isSafeInteger(n) && n >= 0) change({ ...values, budget: n }); }} /></label>
      </fieldset>
      <fieldset className="facet-group"><legend>Giờ nhận & tình trạng</legend>
        <label className="facet-option"><input type="checkbox" checked={values.receiving} onChange={e => change({ ...values, receiving: e.target.checked })} /><span>Đang trong giờ nhận</span></label>
        <label className="facet-option"><input type="checkbox" checked={values.stock} onChange={e => change({ ...values, stock: e.target.checked })} /><span>Chỉ món còn suất</span></label>
      </fieldset>
      {view === "browse" && <fieldset className="facet-group"><legend>Quán</legend><label>Chọn quán<select value={values.shop} onChange={e => change({ ...values, shop: e.target.value })}><option value="">Tất cả quán</option>{catalog?.shops.map(shop => <option key={shop.id} value={shop.id}>{shop.name}</option>)}</select></label></fieldset>}
    </>;
  }
  function reset() {
    setQuery("");
    setBudget(0);
    setCategory("");
    setShopFilter("");
    setStockOnly(true);
    setReceiving(false);
    setSort("end");
  }
  const filterCount = Number(!!budget) + Number(!!category) + Number(!!shopFilter) + Number(receiving) + Number(!stockOnly);
  const hasFilters = !!query || filterCount > 0 || sort !== "end";
  const shown = catalog
    ? filterFood(
        catalog.listings,
        catalog.shops,
        query,
        category,
        view === "shop" ? id || "" : shopFilter,
        stockOnly,
        receiving,
        sort,
        now,
        budget,
        vouchers,
      )
    : [];
  function foodDetails(l: Food, n: number, change: (n: number) => void) {
    const s = catalog?.shops.find((s) => s.id === l.shopId);
    const displayed = displayPrice(l, vouchers, now);
    const total = displayPrice(l, vouchers, now, n);
    return (
      <div className="meal-detail">
        <div className="meal-detail-visual">
          <FoodImage l={l} />
          <details className="food-safety"><summary>Bảo quản & cách dùng</summary><p>{l.storage || "Hỏi quán trước khi đặt."}</p></details>
        </div>
        <div className="meal-detail-info">
          <div className="meal-heading">
            <h2>{l.name}</h2>
            <Link href={`/shops/${l.shopId}`}>{s?.name}</Link>
          </div>
          <section className="meal-collection" aria-label="Nơi và giờ nhận">
            <h3>Nhận tại quán</h3>
            <p className="meal-address">{s?.address || "Chưa có địa chỉ nhận"}</p>
            <p className="meal-pickup"><b>{time(l.start)}–{time(l.end)}</b> · Còn {l.stock} suất</p>
            <p className="meal-allergens"><b>Dị ứng:</b> {l.allergens || "Chưa có thông tin. Hỏi quán trước khi đặt."}</p>
          </section>
          <section className="meal-purchase" aria-label="Chọn số suất và kiểm tra giá">
            <div className="meal-price"><strong>{money(displayed.total)} <small>/ suất</small></strong><span>Giá menu {money(l.price)}</span></div>
            <p className="fine">{displayed.rate ? `Ước tính với voucher ${percent(displayed.rate)} · chưa gồm thưởng vị trí` : "Chưa áp voucher"}</p>
            <Quantity n={n} max={Math.min(3, l.stock)} disabled={false} change={change} />
            <p className="detail-total" aria-live="polite">Tổng {n} suất <strong>{money(total.total)}</strong></p>
            <button disabled={l.stock < n || now >= l.end} onClick={() => saveDraft(l, n)}>Kiểm tra bữa đã chọn</button>
            <p className="fine">Tối đa 3 suất · Tự nhận tại quán</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <main className={`commerce commerce-${view}`} id="top">
      <a className="skip-link" href="#content">
        Đến nội dung chính
      </a>
      <header className="market-header">
        <Link className="brand" href="/">
          Bếp Núc<span>NHẬN BỮA CUỐI NGÀY</span>
        </Link>
        <nav aria-label="Điều hướng mua bữa">
          <Link href="/orders">Đơn hàng</Link>
          <Link
            href={
              user
                ? user.role === "student"
                  ? "/checkout"
                  : "/internal"
                : "/login"
            }
          >
            {user ? (user.approved ? (user.role === "student" ? "Bữa đang chọn" : "Nội bộ") : "Chờ duyệt") : "Đăng nhập"}
          </Link>
        </nav>
      </header>
      {catalog?.demo && (
        <aside className="market-demo">
          DEMO · Dữ liệu và tiền giả <Link href="/login">Đổi vai trò thử</Link>
        </aside>
      )}
      <div className="market-content" id="content">
        {error && view !== "checkout" && (
          <div role="alert" className="error">
            {error}{" "}
            <button
              className="secondary"
              onClick={() => {
                setError("");
                load(true);
              }}
            >
              Thử tải lại
            </button>
          </div>
        )}
        {loadError && <div role="alert" className="error">{loadError} <button className="secondary" onClick={() => load()}>Kiểm tra lại</button></div>}
        {notice && (
          <p role="status" className="market-notice">
            {notice}
          </p>
        )}
        {loading ? (
          <LoadingScreen label={view === "orders" || view === "order" ? "Đang tải trạng thái đơn…" : view === "login" ? "Đang tải tài khoản…" : "Đang tìm bữa cho bạn…"} />
        ) : !catalog ? (
          <section className="market-empty">
            Chưa kết nối được catalogue.
          </section>
        ) : (
          <>
            {(view === "browse" || view === "shop") && (
              <>
                {view === "browse" ? (
                  <section className="market-banner">
                    <div>

                      <h1>Bữa cuối ngày, tiện đường nhận.</h1>
                      <p className="market-eligibility">
                        Tự nhận tại quán · Xem món ngay, đặt bữa dành cho sinh viên được mời và đã duyệt.
                      </p>
                    </div>
                  </section>
                ) : shop ? (
                  <section className="shop-intro">
                    <Link href="/meals">Tất cả món</Link>
                    <h1>{shop.name}</h1>
                    <p>{shop.address}</p>
                    <p>
                      Tự nhận tại quán · Xem khung nhận của từng món bên dưới.
                    </p>
                    {shop.image && <img src={shop.image} alt={shop.name} />}
                  </section>
                ) : (
                  <section className="market-empty">
                    Quán không tồn tại hoặc chưa được công bố.
                  </section>
                )}
                {pendingOrder && <aside className="resume-order"><p>Bạn có bữa đang chờ thanh toán. Nếu đã chuyển tiền, tiếp tục theo dõi đơn này.</p><Link className="button-link" href={`/orders/${pendingOrder.id}`}>Tiếp tục đơn đang chờ</Link></aside>}
                <section className="catalogue-search" aria-label="Tìm món hoặc quán">
        <form
          className="header-search" role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams(window.location.search);
            if (query) params.set("q", query); else params.delete("q");
            router.push("/meals" + (params.size ? "?" + params.toString() : ""));
          }}
        >
          <input
            aria-label="Tìm món hoặc quán"
            placeholder="Tìm món, quán, địa chỉ…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button aria-label="Tìm kiếm">Tìm</button>
        </form>
                </section>
                <div className="catalogue-layout">
                  <aside className="catalogue-sidebar" aria-label="Bộ lọc món">
                    <div className="facet-heading"><h2>Bộ lọc</h2><button className="text-button" onClick={() => applyFilters(defaultFilters)}>Xóa bộ lọc</button></div>
                    {filterFields(currentFilters, applyFilters, "desktop")}
                  </aside>
                  <section className="catalogue-results" aria-label="Kết quả tìm món">
                    <div className="catalogue-toolbar">
                      <div><h2>{query ? `Kết quả cho “${query}”` : view === "shop" ? "Thực đơn cuối ngày" : "Bữa đang có"}</h2><p role="status" aria-live="polite">{shown.length} món{stockOnly ? " còn suất" : ""}</p></div>
                      <button className="secondary mobile-filter-toggle" ref={filterOpener} onClick={() => { setMobileFilters(currentFilters); filterDialog.current?.showModal(); }}>Bộ lọc{filterCount > 0 ? ` (${filterCount})` : ""}</button>
                      <label className="catalogue-sort">Sắp xếp<select value={sort} onChange={e => setSort(e.target.value)}><option value="end">Giờ nhận kết thúc sớm</option><option value="price">Giá thấp đến cao</option></select></label>
                    </div>
                  <div className="filter-chips" role="group" aria-label="Bộ lọc đang áp dụng">
                    {query && <button className="secondary" onClick={() => setQuery("")}>Từ khóa: {query} ×</button>}
                    {!!budget && <button className="secondary" onClick={() => setBudget(0)}>Đến {money(budget)} / suất ×</button>}
                    {category && <button className="secondary" onClick={() => setCategory("")}>{category} ×</button>}
                    {shopFilter && view === "browse" && <button className="secondary" onClick={() => setShopFilter("")}>{catalog.shops.find(s => s.id === shopFilter)?.name || "Quán đã chọn"} ×</button>}
                    {receiving && <button className="secondary" onClick={() => setReceiving(false)}>Đang nhận ×</button>}
                    {!stockOnly && <button className="secondary" onClick={() => setStockOnly(true)}>Hiện cả hết suất ×</button>}
                    {sort === "price" && <button className="secondary" onClick={() => setSort("end")}>Giá tăng dần ×</button>}
                  </div>
                  {hasFilters && <button className="text-button clear-result-filters" onClick={reset}>Xóa tất cả điều kiện</button>}
                {!shown.length && (
                  <section className="market-empty">
                    <h3>
                      {catalog.listings.length
                        ? "Chưa tìm thấy món phù hợp"
                        : "Bếp chưa có lô cuối ngày"}
                    </h3>
                    <p>Không có món đáp ứng đủ điều kiện hiện tại. Bạn có thể bỏ một bộ lọc hoặc quay lại khi quán đăng món.</p>
                    {!!budget && <button className="secondary" onClick={() => setBudget(0)}>Bỏ giới hạn ngân sách</button>}
                    {receiving && <button className="secondary" onClick={() => setReceiving(false)}>Xem cả khung nhận sắp tới</button>}
                    {hasFilters && <button className="secondary" onClick={reset}>Xóa bộ lọc</button>}
                  </section>
                )}
                <section className="food-grid" aria-label="Danh sách món">
                  {shown.map((l) => { const displayed = displayPrice(l, vouchers, now); return (
                    <article
                      className="food-card"
                      data-food-id={l.id}
                      key={l.id}
                    >
                      <button
                        className="food-picture-button"
                        aria-label={`Xem ${l.name}`}
                        onClick={() => openFood(l)}
                      >
                        <FoodImage l={l} />
                      </button>
                      <div className="food-card-body">
                        <div className="food-card-description">
                          <h3><button className="plain-title" onClick={() => openFood(l)}>{l.name}</button></h3>
                          <Link className="shop-meta" href={`/shops/${l.shopId}`}>{catalog.shops.find(s => s.id === l.shopId)?.name}</Link>
                          <p className="food-address">{catalog.shops.find(s => s.id === l.shopId)?.address || "Chưa có địa chỉ nhận"}</p>
                          <p className="pickup-line"><b>Nhận {time(l.start)}–{time(l.end)}</b></p>
                          <span className="stock-label">{l.stock ? `Còn ${l.stock} suất` : "Hết suất"}</span>
                        </div>
                        <div className="food-card-purchase">
                          <div className="food-price-row"><strong className="food-price">{money(displayed.total)}</strong><span className="food-menu-price">Giá menu <s>{money(l.price)}</s></span></div>
                          <p className="price-condition">{displayed.rate ? `Với voucher ${percent(displayed.rate)} · Chưa gồm thưởng vị trí` : "Chưa áp voucher"}</p>
                          <button disabled={!l.stock || now >= l.end} onClick={() => openFood(l)}>Chọn bữa này</button>
                        </div>
                      </div>
                    </article>
                  ); })}
                </section>
                  </section>
                </div>
                <dialog className="filter-drawer" ref={filterDialog} aria-labelledby="filter-title" onCancel={() => filterOpener.current?.focus()}>
                  <header><h2 id="filter-title">Lọc món theo nhu cầu</h2><button className="secondary" onClick={() => { filterDialog.current?.close(); filterOpener.current?.focus(); }}>Đóng</button></header>
                  <div className="drawer-fields">{filterFields(mobileFilters, setMobileFilters, "mobile")}</div>
                  <footer><button className="secondary" onClick={() => setMobileFilters(defaultFilters)}>Xóa bộ lọc</button><button onClick={() => { applyFilters(mobileFilters); filterDialog.current?.close(); filterOpener.current?.focus(); }}>Xem {catalog ? filterFood(catalog.listings, catalog.shops, query, mobileFilters.category, view === "shop" ? id || "" : mobileFilters.shop, mobileFilters.stock, mobileFilters.receiving, sort, now, mobileFilters.budget, vouchers).length : 0} món</button></footer>
                </dialog>
                {view === "browse" && (
                  <section className="shop-list">
                    <h2>Khám phá các quán</h2>
                    <div>
                      {catalog.shops.map((s) => (
                        <Link
                          className="shop-card"
                          href={`/shops/${s.id}`}
                          key={s.id}
                        >
                          <h3>{s.name}</h3>
                          <p>{s.address}</p>
                          <span>Xem món & giờ nhận</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
            {view === "meal" &&
              (() => {
                const l = catalog.listings.find((l) => l.id === id);
                return (
                  <section className="standalone-meal">
                    <Link href={browseHref}>Quay lại tìm món</Link>
                    {l ? (
                      foodDetails(l, qty, setQty)
                    ) : (
                      <h1>Món đã kết thúc hoặc chưa được công bố.</h1>
                    )}
                  </section>
                );
              })()}
            {view === "checkout" && (
              <>
                <Link href={browseHref}>Tiếp tục tìm món</Link>
                <h1>Kiểm tra bữa của bạn</h1>
                <p className="checkout-stage" role="status">Bước {held ? "2/3 · Đã giữ suất, kiểm tra giá xác nhận" : "1/3 · Kiểm tra bữa và chọn voucher"}</p>
                {!item ? (
                  <section className="market-empty">
                    <h2>
                      {draft
                        ? "Món đã chọn không còn nhận đơn."
                        : "Bạn chưa chọn món."}
                    </h2>
                    <p>
                      {draft
                        ? "Chọn món khác. Giá và tồn luôn kiểm tra lại trước khi đặt."
                        : "Chọn một món để xem giá và khung nhận."}
                    </p>
                    <Link className="button-link" href="/meals">
                      Tìm món ngay
                    </Link>
                  </section>
                ) : (
                  <div className="checkout-layout">
                    <section className="checkout-main">
                      <div className="checkout-food">
                        <FoodImage l={item} />
                        <div>
                          <h2>{item.name}</h2>
                          <Link href={`/shops/${item.shopId}`}>
                            {shop?.name}
                          </Link>
                          <p>{shop?.address}</p>
                          <b>
                            Nhận {time(item.start)}–{time(item.end)}
                          </b>
                        </div>
                      </div>
                      <p className="fine">
                        Tự đến quán nhận. Không có giao hàng hoặc phí ship.
                      </p>
                      <Quantity
                        n={count}
                        max={Math.min(3, item.stock)}
                        disabled={!!held || busy}
                        change={(n) => {
                          const d = { listingId: item.id, qty: n, voucherId: activeVoucher?.id };
                          setDraft(d);
                          sessionStorage.setItem("bc-draft", JSON.stringify(d));
                        }}
                      />
                      <details className="food-safety">
                        <summary>Bảo quản & thông tin dị ứng</summary>
                        <p>{item.storage || "Chưa có hướng dẫn bảo quản. Hỏi quán trước khi đặt."}</p>
                        <p>{item.allergens || "Chưa có thông tin dị ứng. Hỏi quán trước khi đặt."}</p>
                      </details>
                      {!user ? (
                        <section className="checkout-gate">
                          <h2>Đăng nhập để dùng voucher và đặt bữa</h2>
                          <p>
                            Bếp Núc đang thử với sinh viên được mời. Xem món
                            công khai, đặt hàng sau khi được duyệt.
                          </p>
                          <Link className="button-link" href={loginHref}>
                            Đăng nhập để tiếp tục
                          </Link>
                        </section>
                      ) : !user.approved ? (
                        <section className="checkout-gate">
                          <h2>Tài khoản đang chờ duyệt</h2>
                          <p>
                            Lựa chọn đã lưu. Bạn vẫn có thể xem món trong lúc
                            chờ vận hành duyệt.
                          </p>
                          <button onClick={() => load()}>
                            Kiểm tra trạng thái duyệt
                          </button>
                          <p><Link href={browseHref}>Quay lại xem món</Link></p>
                          {supportLink(supportEmail, "") && <a href={supportLink(supportEmail, "")!}>Liên hệ về tài khoản</a>}
                        </section>
                      ) : user.role !== "student" ? (
                        <p>
                          Tài khoản quán/vận hành không đặt bữa.{" "}
                          <Link href="/internal">Vào khu vực nội bộ</Link>
                        </p>
                      ) : (
                        <>
                          <h2>Chọn một voucher</h2>
                          <fieldset className="checkout-vouchers"><legend>Chọn một voucher cho đơn này</legend>
                            {[0.07, 0.1, 0.2].map((rate) => {
                              const v = profile?.vouchers?.find(
                                (v: any) => v.rate === rate,
                              );
                              const eligible = item.eligible.includes(rate);
                              const best = displayPrice(item, vouchers, now).rate;
                              const preview = estimate(item.price * count, rate);
                              const unavailable = !v || displayPrice(item, [v], now).rate !== rate || !!held;
                              return (
                                <label key={rate} className={`voucher-option ${v && (voucher === v.id || held?.voucherId === v.id) ? "selected" : "secondary"}`}>
                                  <input type="radio" name="voucher" value={v?.id || String(rate)} disabled={unavailable || busy}
                                    checked={!!v && (voucher === v.id || held?.voucherId === v.id)}
                                    onChange={() => {
                                      if (!v) return;
                                      setVoucher(v.id);
                                      const next = { listingId: item.id, qty: count, voucherId: v.id }; setDraft(next);
                                      try { sessionStorage.setItem("bc-draft", JSON.stringify(next)); } catch {}
                                    }} />
                                  <b>{percent(rate)}</b>
                                  <span className="voucher-copy">
                                    {!unavailable && <><strong>Còn {money(preview.total)}</strong><small>Giảm thêm {money(preview.voucherDiscount)}{rate === best ? " · Gợi ý tiết kiệm nhất" : ""}</small></>}
                                    <small>{!eligible ? "Món không áp dụng" : v ? states[v.state] : "Chưa có voucher"}</small>
                                  </span>
                                </label>
                              );
                            })}
                          </fieldset>
                          <p className="fine">Bạn tự chọn một voucher. Có thể giữ voucher lớn cho bữa sau.</p>
                        </>
                      )}
                      {held && (
                        <section className="held-notice" role="status">
                          <b>
                            {seconds
                              ? `Đang giữ hàng · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
                              : "Báo giá đã hết hạn"}
                          </b>
                          <p>{held.bonusReason}</p>
                          {draft && draft.listingId !== held.listingId && (
                            <p>
                              Bạn có báo giá cũ đang giữ. Bỏ giữ hàng để tiếp
                              tục với món vừa chọn.
                            </p>
                          )}
                          <button
                            className="secondary"
                            disabled={busy}
                            onClick={async () => {
                              if (
                                await act("release_quote", { quoteId: held.id })
                              ) {
                                setVoucher("");
                                const nextDraft = draft || {
                                  listingId: item.id,
                                  qty: count,
                                };
                                setDraft(nextDraft);
                                sessionStorage.setItem(
                                  "bc-draft",
                                  JSON.stringify(nextDraft),
                                );
                              }
                            }}
                          >
                            Bỏ giữ hàng & chỉnh đơn
                          </button>
                        </section>
                      )}
                    </section>
                    <aside className="checkout-summary" ref={summary} tabIndex={-1}>
                      <h2>Tóm tắt thanh toán</h2>
                      {amounts && <details className="price-help"><summary>Chi tiết giảm giá</summary><PriceLines a={amounts} hideTotal /></details>}
                      <p className="price-type">
                        {held
                          ? "Giá xác nhận từ Bếp Núc"
                          : "Ước tính · chưa gồm thưởng tự nhận"}
                      </p>
                      <div className="checkout-action">
                        {amounts && <div className="action-total"><span>{held ? "Tổng thanh toán" : activeVoucher ? "Tổng ước tính đã chọn voucher" : "Giá trước voucher"}</span><strong>{money(amounts.total)}</strong></div>}
                        {held && <p>{seconds ? `Giữ suất còn ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "Đã hết hạn. Kiểm tra lại giá trước khi thanh toán."}</p>}
                      {user?.approved &&
                        user.role === "student" &&
                        (held ? (
                          <button
                            disabled={busy || !seconds}
                            onClick={async () => {
                              const o = await act("order", {
                                quoteId: held.id,
                              });
                              if (o) {
                                sessionStorage.removeItem("bc-draft");
                                router.push(`/orders/${o.id}`);
                              }
                            }}
                          >
                            {busy
                              ? "Đang xử lý…"
                              : "Tiếp tục thanh toán"}
                          </button>
                        ) : (
                          <button
                            disabled={
                              busy ||
                              !activeVoucher ||
                              activeVoucher.state !== "available" ||
                              item.stock < count ||
                              now >= item.end
                            }
                            onClick={quote}
                          >
                            {busy
                              ? "Đang xác nhận…"
                              : "Giữ suất với giá này"}
                          </button>
                        ))}
                        {!held && user?.approved && user.role === "student" && !activeVoucher && <p>{voucherHint(item, vouchers, now)}</p>}
                      </div>
                      {!held && !activeVoucher && displayPrice(item, vouchers, now).rate > 0 && <p className="price-suggestion">Nếu chọn voucher {percent(displayPrice(item, vouchers, now).rate)}: <strong>{money(displayPrice(item, vouchers, now, count).total)}</strong>. Bạn chưa chọn voucher.</p>}
                      {error && <div role="alert" className="error" ref={actionError} tabIndex={-1}>{error}<button className="secondary" disabled={busy} onClick={() => load()}>Kiểm tra trạng thái</button></div>}
                      {!held && user?.approved && user.role === "student" && <details className="optional-benefit"><summary>Thưởng vị trí & cách tính giá (tùy chọn)</summary>                          <details className="price-help"><summary>Cách tính giảm giá</summary><p>Giảm nền 5% trước, sau đó áp dụng một voucher. Không cộng dồn ba voucher. Giá ước tính chưa gồm thưởng vị trí; giá xác nhận được kiểm tra khi giữ suất.</p></details>
                          <label className="inline-check">
                            <input
                              type="checkbox"
                              checked={location}
                              disabled={!!held || busy}
                              onChange={(e) => setLocation(e.target.checked)}
                            />
                            Lấy vị trí một lần để tính thưởng tự nhận
                          </label>
                          <p className="fine">
                            Tuyến đi bộ là ước lượng. Không theo dõi GPS; thiếu
                            vị trí vẫn dùng voucher gốc.
                          </p>
</details>}
                      {!held && !displayPrice(item, vouchers, now).rate && <Link href={browseHref}>Quay lại tìm món khác</Link>}
                      <p className="fine">
                        Chỉ giữ tồn sau khi báo giá thành công. Thời hạn tối đa
                        10 phút.
                      </p>
                    </aside>
                  </div>
                )}
              </>
            )}
            {(view === "orders" || view === "order") && (
              <>
                <Link href="/meals">Tìm thêm món</Link>
                <p className="sync-status" role="status">{syncedAt ? `Cập nhật lúc ${new Date(syncedAt).toLocaleTimeString("vi-VN")}` : "Chưa có cập nhật"} · Xác nhận tiền thủ công <button className="secondary" onClick={() => load()}>Kiểm tra lại</button></p>
                <h1>
                  {view === "orders"
                    ? "Đơn hàng của bạn"
                    : "Theo dõi bữa của bạn"}
                </h1>
                {!user ? (
                  <section className="market-empty">
                    <p>Đăng nhập để xem đơn riêng của bạn.</p>
                    <Link className="button-link" href={loginHref}>
                      Đăng nhập
                    </Link>
                  </section>
                ) : !user.approved ? (
                  <p>Tài khoản đang chờ duyệt. Bạn vẫn xem được catalogue.</p>
                ) : user.role !== "student" ? (
                  <Link href="/internal">Xem đơn trong khu vực nội bộ</Link>
                ) : (
                  <div className="customer-orders">
                    {(profile?.orders || [])
                      .filter((o: any) => view === "orders" || o.id === id)
                      .map((o: any) => (
                        <CustomerOrder
                          key={o.id}
                          o={o}
                          data={profile}
                          detail={view === "order"}
                          now={now}
                        />
                      ))}
                    {!(profile?.orders || []).some(
                      (o: any) => view === "orders" || o.id === id,
                    ) && (
                      <section className="market-empty">
                        <h2>
                          {view === "order"
                            ? "Không tìm thấy đơn của bạn"
                            : "Chưa có đơn hàng"}
                        </h2>
                        <Link href="/meals">Chọn món cho tối nay</Link>
                      </section>
                    )}
                  </div>
                )}
              </>
            )}
            {view === "login" && (
              <section className="customer-login">
                <div>
                  <p className="eyebrow">BẾP NÚC · PILOT HÀ NỘI</p>
                  <h1>
                    Vào tài khoản,
                    <br />
                    tiếp tục chốt bữa.
                  </h1>
                  <p>
                    Lựa chọn món và số suất được giữ trên trình duyệt này. Giá
                    và tồn sẽ kiểm tra lại.
                  </p>
                  <Link href={browseHref}>Tiếp tục xem món</Link>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    login();
                  }}
                >
                  <h2>Đăng nhập bằng email</h2>
                  {catalog.demo ? (
                    <>
                      <p>DEMO: dùng vai trò thử, không gửi email thật.</p>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => login("guest")}
                      >
                        Khách chưa đăng nhập
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => login("student")}
                      >
                        Sinh viên
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => login("merchant")}
                      >
                        Quán
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => login("ops")}
                      >
                        Vận hành
                      </button>
                    </>
                  ) : (
                    <>
                      <label>
                        Email
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          readOnly={sent}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </label>
                      {sent && (
                        <label>
                          Mã xác thực
                          <input
                            required
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </label>
                      )}
                      {sent && <div className="otp-recovery"><button className="secondary" type="button" disabled={busy || tick < retryAt} onClick={() => login(undefined, true)}>{tick < retryAt ? `Gửi lại sau ${Math.ceil((retryAt - tick) / 1000)}s` : "Gửi lại mã"}</button><button className="secondary" type="button" disabled={busy} onClick={() => { setSent(false); setOtp(""); setError(""); setNotice(""); }}>Đổi email</button></div>}
                      <button disabled={busy}>
                        {busy
                          ? "Đang xử lý…"
                          : sent
                            ? "Xác thực & tiếp tục"
                            : "Gửi mã xác thực"}
                      </button>
                    </>
                  )}
                </form>
              </section>
            )}
          </>
        )}
      </div>
      <footer className="market-footer">
        <b>Bếp Núc</b>
        <p>Chọn món rõ ràng. Thanh toán được xác nhận. Nhận đúng khung giờ.</p>
        <details id="ordering-help">
          <summary>Cách đặt và nhận bữa</summary>
          <ol>
            <li>Chọn món, xem địa chỉ và khung giờ nhận.</li>
            <li>Kiểm tra giá và chọn một voucher phù hợp.</li>
            <li>Giữ hàng, xác nhận giá rồi tạo đơn.</li>
            <li>Chuyển đúng tiền và nội dung; chờ xác nhận thanh toán.</li>
            <li>Đưa mã nhận tại quán trong khung giờ của món.</li>
          </ol>
        </details>
        <details>
          <summary>Voucher hoạt động thế nào?</summary>
          <p>
            Sinh viên đã được duyệt nhận voucher 7%, 10%, 20% từ 18:00. Mỗi
            loại dùng một lần, hết hạn 23:59. Mỗi đơn dùng một voucher phù hợp
            với món; xem voucher của bạn khi kiểm tra đơn.
          </p>
          <p>Giảm nền 5% trước, sau đó áp dụng voucher. Không cộng dồn ba voucher.</p>
        </details>
        <details>
          <summary>Hủy đơn và hoàn tiền</summary>
          <p>
            Quán hủy: hoàn tiền, phục hồi voucher nếu còn trong tối. No-show
            trong pilot: hoàn tiền, voucher đã dùng không phục hồi. Chuyển khoản
            muộn cần vận hành xử lý.
          </p>
        </details>
        <p className="fine">
          Chưa có tuyến đi bộ được xác minh an toàn. Kiểm tra đường thực tế
          trước khi di chuyển.
        </p>
      </footer>
      {selected && (
        <dialog
          ref={dialog}
          className="meal-dialog"
          aria-label={`Chi tiết ${selected.name}`}
          onCancel={() => setSelected(undefined)}
          onClick={(e) => {
            if (e.target === dialog.current) setSelected(undefined);
          }}
        >
          <button
            className="dialog-close secondary"
            aria-label="Đóng chi tiết món"
            onClick={() => setSelected(undefined)}
          >
            Đóng
          </button>
          {foodDetails(selected, qty, setQty)}
          <Link className="fine" href={`/meals/${selected.id}`}>
            Mở trang chi tiết món
          </Link>
        </dialog>
      )}
    </main>
  );
}
function FoodImage({ l }: { l: Food }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [l.image]);
  return (
    <div className="food-image">
      {l.image && !failed ? (
        <img
          src={l.image}
          alt={l.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>Chưa có ảnh món</span>
      )}
      {l.image?.includes("demo-") && (
        <span className="demo-image-label">Ảnh minh họa · DEMO</span>
      )}
    </div>
  );
}
function Quantity({
  n,
  max,
  disabled,
  change,
}: {
  n: number;
  max: number;
  disabled: boolean;
  change: (n: number) => void;
}) {
  return (
    <div className="quantity-control" role="group" aria-label="Số suất">
      <b>Số suất</b>
      <button
        className="secondary"
        aria-label="Giảm số suất"
        disabled={disabled || n <= 1}
        onClick={() => change(n - 1)}
      >
        −
      </button>
      <output aria-live="polite">{n}</output>
      <button
        className="secondary"
        aria-label="Tăng số suất"
        disabled={disabled || n >= max}
        onClick={() => change(n + 1)}
      >
        +
      </button>
    </div>
  );
}
function PriceLines({ a, hideTotal = false }: { a: any; hideTotal?: boolean }) {
  return (
    <>
      <dl className="price-lines">
        <div>
          <dt>Giá menu</dt>
          <dd>{money(a.menuTotal)}</dd>
        </div>
        <div>
          <dt>Giảm nền 5%</dt>
          <dd>−{money(a.baseDiscount)}</dd>
        </div>
        <div>
          <dt>Voucher</dt>
          <dd>−{money(a.voucherDiscount)}</dd>
        </div>
        <div>
          <dt>Thưởng tự nhận</dt>
          <dd>−{money(a.bonusDiscount)}</dd>
        </div>
        {!hideTotal && <div className="total-line">
          <dt>Tổng thanh toán</dt>
          <dd>{money(a.total)}</dd>
        </div>}
      </dl>
      <p className="saved-line">Tiết kiệm {money(a.saved)}</p>
    </>
  );
}
function CustomerOrder({
  o,
  data,
  detail,
  now,
}: {
  o: any;
  data: any;
  detail: boolean;
  now: number;
}) {
  const [copied, setCopied] = useState("");
  const l = data.listings.find((l: Food) => l.id === o.listingId),
    s = data.shops.find((s: PublicShop) => s.id === o.shopId);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied("Đã sao chép.");
    } catch {
      setCopied("Không sao chép được. Hãy chọn và sao chép nội dung bên dưới.");
    }
  }
  return (
    <article className="customer-order">
      <div className="order-heading">
        <h2>{l?.name || "Đơn hàng"}</h2>
        <b>{states[o.status]}</b>
      </div>
      <p>
        {o.qty} suất · {money(o.total)} · {s?.name}
      </p>
      {!detail ? (
        <Link className="button-link" href={`/orders/${o.id}`}>
          Xem đơn & hướng dẫn nhận
        </Link>
      ) : (
        <>
          <code>{o.id}</code>
          {o.status === "paid" && o.code && <section className="pickup-code"><h3>Mã nhận của bạn</h3><code>{o.code}</code><button className="secondary" onClick={() => copy(o.code)}>Sao chép mã nhận</button><p role="status">{copied}</p><p>Đưa mã này cho quán trong giờ nhận bên dưới.</p></section>}
          {["awaiting_payment", "paid", "picked_up"].includes(o.status) && <ol className="order-progress" aria-label="Tiến trình đơn hàng">
            <li className="active" aria-current={o.status === "awaiting_payment" ? "step" : undefined}>Thanh toán & chờ xác nhận</li>
            <li
              className={
                ["paid", "picked_up"].includes(o.status) ? "active" : ""
              }
            >
              Đã thanh toán
            </li>
            <li className={o.status === "picked_up" ? "active" : ""}>
              Đã nhận bữa
            </li>
          </ol>}
          <section className="pickup-address">
            <h3>Nhận tại {s?.name}</h3>
            <p>{s?.address}</p>
            <b>
              {l
                ? `${time(l.start)}–${time(l.end)}`
                : "Xem khung nhận đã công bố"}
            </b>
          </section>
          {o.status === "awaiting_payment" && (
            <section className="bank-instructions">
              <h3>Chuyển khoản {money(o.total)}</h3>
              <p>
                Trước {time(o.expires)}.{" "}
                {o.expires <= now
                  ? "Hạn giữ đã hết. Không chuyển thêm tiền."
                  : "Vận hành xác nhận thủ công; mã nhận xuất hiện sau xác nhận."}
              </p>
              <dl>
                <dt>Ngân hàng</dt>
                <dd>{data.bank.name}</dd>
                <dt>Tài khoản</dt>
                <dd>
                  {data.bank.account}{" "}
                  <button
                    className="secondary"
                    onClick={() => copy(data.bank.account)}
                  >
                    Sao chép tài khoản
                  </button>
                </dd>
                <dt>Chủ tài khoản</dt>
                <dd>{data.bank.holder}</dd>
                <dt>Nội dung</dt>
                <dd>
                  <code>BC {o.id}</code>
                  <button
                    className="secondary"
                    onClick={() => copy("BC " + o.id)}
                  >
                    Sao chép nội dung
                  </button>
                </dd>
              </dl>
              <p className="fine">
                Chuyển khoản muộn đưa vào xử lý thủ công, không tự giữ lại suất
                đã bán.
              </p>
              <p role="status">{copied}</p>
              <p role="status">Chờ Bếp Núc kiểm tra tiền chuyển. Quay lại trang này để xem mã nhận sau khi được xác nhận. Không chuyển thêm nếu bạn đã chuyển đúng tiền.</p>
            </section>
          )}

          {o.status === "picked_up" && (
            <p>Bữa đã được giao. Mã nhận không còn dùng được.</p>
          )}
          {o.status === "expired" && (
            <p>
              Đơn hết hạn giữ. Không chuyển thêm tiền. Nếu đã chuyển, dùng kênh hỗ trợ của đội pilot để kiểm tra và xử lý hoàn tiền; suất không được tự giữ lại.
            </p>
          )}
          {["cancelled", "no_show"].includes(o.status) && (
            <p>
              {o.status === "cancelled"
                ? "Quán hủy đơn. Voucher phục hồi nếu còn trong tối."
                : "Đã quá khung nhận. Voucher đã dùng không phục hồi."}{" "}
              Tiền đã thu được hoàn trong pilot.
            </p>
          )}
          {supportLink(data.supportEmail, o.id) && <a className="button-link secondary" href={supportLink(data.supportEmail, o.id)!}>Liên hệ hỗ trợ đơn này</a>}
          {o.refund?.map((r: any, i: number) => (
            <p key={i} className="market-notice">
              {r.done ? "Đã hoàn" : "Đang chờ hoàn"} {money(r.amount)} ·{" "}
              {r.reason}
            </p>
          ))}
        </>
      )}
    </article>
  );
}
