"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  estimate,
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
type Draft = { listingId: string; qty: number };
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
    [category, setCategory] = useState(""),
    [shopFilter, setShopFilter] = useState(""),
    [stockOnly, setStockOnly] = useState(true),
    [receiving, setReceiving] = useState(false),
    [sort, setSort] = useState("end"),
    [email, setEmail] = useState(""),
    [otp, setOtp] = useState(""),
    [sent, setSent] = useState(false),
    [notice, setNotice] = useState("");
  const fetched = useRef(Date.now()),
    dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLElement | null>(null),
    seen = useRef(new Set<string>());
  async function load(initial = false) {
    try {
      const [c, a] = await Promise.all([
        fetch("/api/catalogue", { cache: "no-store" }),
        fetch("/api/auth", { cache: "no-store" }),
      ]);
      if (!c.ok) throw new Error("Chưa tải được món. Vui lòng thử lại.");
      setCatalog(await c.json());
      fetched.current = Date.now();
      const auth = await a.json();
      setUser(auth.user);
      if (auth.user?.approved) {
        const p = await fetch("/api/pilot", { cache: "no-store" });
        if (!p.ok)
          throw new Error("Chưa tải được đơn và voucher. Vui lòng thử lại.");
        setProfile(await p.json());
      } else setProfile(undefined);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      if (initial) setLoading(false);
    }
  }
  useEffect(() => {
    load(true);
    const poll = setInterval(() => load(), 15000);
    const t = setInterval(() => setTick(Date.now()), 1000);
    try {
      const raw = sessionStorage.getItem("bc-draft");
      if (raw) {
        const d = JSON.parse(raw);
        if (
          typeof d.listingId === "string" &&
          Number.isInteger(d.qty) &&
          d.qty >= 1 &&
          d.qty <= 3
        )
          setDraft(d);
      }
    } catch {}
    const p = new URLSearchParams(window.location.search);
    setQuery(p.get("q") || "");
    setCategory(p.get("category") || "");
    setShopFilter(p.get("shop") || "");
    setStockOnly(p.get("stock") !== "all");
    setReceiving(p.get("receiving") === "1");
    setSort(p.get("sort") || "end");
    return () => {
      clearInterval(poll);
      clearInterval(t);
    };
  }, []);
  useEffect(() => {
    if (view !== "browse" && view !== "shop") return;
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (category) p.set("category", category);
    if (shopFilter) p.set("shop", shopFilter);
    if (!stockOnly) p.set("stock", "all");
    if (receiving) p.set("receiving", "1");
    if (sort !== "end") p.set("sort", sort);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (p.size ? "?" + p.toString() : ""),
    );
  }, [query, category, shopFilter, stockOnly, receiving, sort, view]);
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
  const held = profile?.heldQuotes?.[0];
  const item =
    catalog?.listings.find(
      (l) =>
        l.id ===
        (held?.listingId || draft?.listingId || (view === "meal" ? id : "")),
    ) || profile?.listings?.find((l: Food) => l.id === held?.listingId);
  const shop = catalog?.shops.find(
    (s) => s.id === (view === "shop" ? id : item?.shopId),
  );
  const activeVoucher = profile?.vouchers?.find((v: any) => v.id === voucher);
  const count = held?.qty || draft?.qty || 1;
  const amounts =
    held ||
    (item ? estimate(item.price * count, activeVoucher?.rate || 0) : undefined);
  const seconds = held
    ? Math.max(0, Math.ceil((held.expires - now) / 1000))
    : 0;
  async function act(action: string, args: any) {
    if (busy) return;
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
    if (!item || !activeVoucher) return;
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
    setBusy(false);
    await act("quote", {
      listingId: item.id,
      voucherId: activeVoucher.id,
      qty: count,
      location: coords,
    });
  }
  async function login(role?: string) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, token: otp || undefined }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (role || otp) {
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
  function reset() {
    setQuery("");
    setCategory("");
    setShopFilter("");
    setStockOnly(true);
    setReceiving(false);
    setSort("end");
  }
  const extraFilters = [
    view === "browse" && shopFilter
      ? catalog?.shops.find((s) => s.id === shopFilter)?.name || "Quán đã chọn"
      : "",
    sort !== "end" ? "Giá tăng dần" : "",
    receiving ? "Đang trong giờ nhận" : "",
  ].filter(Boolean);
  const extraFilterCount = extraFilters.length + Number(!stockOnly);
  const hasFilters = !!query || !!category || extraFilterCount > 0;
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
      )
    : [];
  function foodDetails(l: Food, n: number, change: (n: number) => void) {
    const s = catalog?.shops.find((s) => s.id === l.shopId);
    return (
      <>
        <FoodImage l={l} />
        <h2>{l.name}</h2>
        <Link href={`/shops/${l.shopId}`}>{s?.name}</Link>
        <p>{s?.address}</p>
        <p>
          <b>{money(Math.ceil(l.price * 0.95))}</b> · Giá chưa áp voucher
          <br />
          <span className="fine">Giá menu {money(l.price)}</span>
        </p>
        <p>
          Nhận {time(l.start)}–{time(l.end)} · Còn {l.stock} suất
        </p>
        <div className="food-safety">
          <b>Bảo quản & cách dùng</b>
          <p>{l.storage || "Hỏi quán trước khi đặt."}</p>
          <b>Thông tin dị ứng</b>
          <p>{l.allergens || "Chưa có thông tin. Hỏi quán trước khi đặt."}</p>
        </div>
        <Quantity
          n={n}
          max={Math.min(3, l.stock)}
          disabled={false}
          change={change}
        />
        <p className="fine">
          Mỗi đơn một loại món, tối đa 3 suất. Tự đến quán nhận bữa.
        </p>
        <button
          disabled={l.stock < n || now >= l.end}
          onClick={() => saveDraft(l, n)}
        >
          Tiếp tục kiểm tra đơn
        </button>
      </>
    );
  }
  return (
    <main className="commerce" id="top">
      <a className="skip-link" href="#content">
        Đến nội dung chính
      </a>
      <header className="market-header">
        <Link className="brand" href="/">
          Bếp Núc<span>NHẬN BỮA CUỐI NGÀY</span>
        </Link>
        <Link className="market-area" href="/">
          Hà Nội · Tự nhận tại quán
        </Link>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            router.push("/?q=" + encodeURIComponent(query));
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
            {user ? (user.approved ? "Tài khoản" : "Chờ duyệt") : "Đăng nhập"}
          </Link>
        </nav>
      </header>
      {catalog?.demo && (
        <aside className="market-demo">
          DEMO · Dữ liệu và tiền giả <Link href="/login">Đổi vai trò thử</Link>
        </aside>
      )}
      <div className="market-content" id="content">
        {error && (
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
        {notice && (
          <p role="status" className="market-notice">
            {notice}
          </p>
        )}
        {loading ? (
          <section className="market-empty" role="status">
            Đang tải món và trạng thái tài khoản…
          </section>
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
                      <p className="eyebrow">BỮA CUỐI NGÀY · TỰ NHẬN</p>
                      <h1>Tối nay, ăn gì?</h1>
                      <p>Chọn bữa cuối ngày tại Hà Nội. Tự đến quán nhận.</p>
                      <p className="market-eligibility">
                        Xem món ngay. Đặt bữa dành cho sinh viên được mời và đã
                        được duyệt.
                      </p>
                    </div>
                  </section>
                ) : shop ? (
                  <section className="shop-intro">
                    <Link href="/">Tất cả món</Link>
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
                {view === "browse" && (
                  <section className="market-orientation" aria-label="Cách đặt bữa">
                    <ol className="market-steps">
                      <li>Chọn món</li>
                      <li>Kiểm tra giá & thanh toán</li>
                      <li>Nhận tại quán</li>
                    </ol>
                    <p>
                      Chuyển khoản và chờ xác nhận. Nhận theo khung giờ của món.
                    </p>
                  </section>
                )}
                <section aria-label="Tìm và lọc món" className="market-filters">
                  <div className="category-tabs">
                    <button
                      className={!category ? "selected" : "secondary"}
                      aria-pressed={!category}
                      onClick={() => setCategory("")}
                    >
                      Tất cả
                    </button>
                    {foodCategories.map((c) => (
                      <button
                        key={c}
                        className={category === c ? "selected" : "secondary"}
                        aria-pressed={category === c}
                        onClick={() => setCategory(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <details className="extra-filters">
                    <summary>
                      Bộ lọc{extraFilterCount > 0 ? ` (${extraFilterCount})` : ""}
                      <span>Quán, giá & giờ nhận</span>
                    </summary>
                    <div className="filter-row">
                      {view === "browse" && (
                        <label>
                          Quán
                          <select
                            value={shopFilter}
                            onChange={(e) => setShopFilter(e.target.value)}
                          >
                            <option value="">Tất cả quán</option>
                            {catalog.shops.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label>
                        Sắp xếp
                        <select
                          value={sort}
                          onChange={(e) => setSort(e.target.value)}
                        >
                          <option value="end">Kết thúc nhận sớm nhất</option>
                          <option value="price">Giá tăng dần</option>
                        </select>
                      </label>
                      <label className="inline-check">
                        <input
                          type="checkbox"
                          checked={stockOnly}
                          onChange={(e) => setStockOnly(e.target.checked)}
                        />
                        Còn suất
                      </label>
                      <label className="inline-check">
                        <input
                          type="checkbox"
                          checked={receiving}
                          onChange={(e) => setReceiving(e.target.checked)}
                        />
                        Đang trong giờ nhận
                      </label>
                    </div>
                  </details>
                  <div className="filter-status">
                    <p>
                      {stockOnly ? "Chỉ hiện món còn suất" : "Hiện cả món hết suất"}
                      {extraFilters.length > 0 && ` · ${extraFilters.join(" · ")}`}
                    </p>
                    {hasFilters && (
                      <button className="secondary" onClick={reset}>
                        Xóa bộ lọc
                      </button>
                    )}
                  </div>
                </section>
                <div className="results-heading">
                  <h2>
                    {view === "shop"
                      ? "Thực đơn cuối ngày"
                      : "Món dành cho tối nay"}
                  </h2>
                  <span>{shown.length} món</span>
                </div>
                {!shown.length && (
                  <section className="market-empty">
                    <h3>
                      {catalog.listings.length
                        ? "Chưa tìm thấy món phù hợp"
                        : "Bếp chưa có lô cuối ngày"}
                    </h3>
                    <p>Thử từ khóa khác hoặc quay lại khi quán đăng món.</p>
                    <button onClick={reset}>Xóa bộ lọc</button>
                  </section>
                )}
                <section className="food-grid" aria-label="Danh sách món">
                  {shown.map((l) => (
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
                        <h3>
                          <button
                            className="plain-title"
                            onClick={() => openFood(l)}
                          >
                            {l.name}
                          </button>
                        </h3>
                        <Link href={`/shops/${l.shopId}`}>
                          {catalog.shops.find((s) => s.id === l.shopId)?.name}
                        </Link>
                        <p className="food-menu-price">
                          Giá menu <s>{money(l.price)}</s>
                        </p>
                        <strong className="food-price">
                          {money(Math.ceil(l.price * 0.95))}
                        </strong>
                        <span className="fine">
                          {" "}
                          Giá chưa áp voucher
                        </span>
                        <p className="pickup-line">
                          Nhận {time(l.start)}–{time(l.end)}
                        </p>
                        <div className="food-card-bottom">
                          <span>
                            {l.stock ? `${l.stock} suất còn` : "Hết suất"}
                          </span>
                          <button
                            disabled={!l.stock || now >= l.end}
                            onClick={() => openFood(l)}
                          >
                            Chọn món
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
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
                    <Link href="/">Quay lại tìm món</Link>
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
                <Link href="/">Tiếp tục tìm món</Link>
                <h1>Kiểm tra đơn của bạn</h1>
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
                    <Link className="button-link" href="/">
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
                          const d = { listingId: item.id, qty: n };
                          setDraft(d);
                          sessionStorage.setItem("bc-draft", JSON.stringify(d));
                        }}
                      />
                      <details className="food-safety">
                        <summary>Bảo quản & thông tin dị ứng</summary>
                        <p>{item.storage}</p>
                        <p>{item.allergens}</p>
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
                        </section>
                      ) : user.role !== "student" ? (
                        <p>
                          Tài khoản quán/vận hành không đặt bữa.{" "}
                          <Link href="/internal">Vào khu vực nội bộ</Link>
                        </p>
                      ) : (
                        <>
                          <h2>Chọn một voucher</h2>
                          <div className="checkout-vouchers">
                            {[0.07, 0.1, 0.2].map((rate) => {
                              const v = profile?.vouchers?.find(
                                (v: any) => v.rate === rate,
                              );
                              const eligible = item.eligible.includes(rate);
                              const unavailable =
                                !v ||
                                v.state !== "available" ||
                                !eligible ||
                                !!held;
                              return (
                                <button
                                  key={rate}
                                  className={
                                    v &&
                                    (voucher === v.id ||
                                      held?.voucherId === v.id)
                                      ? "selected"
                                      : "secondary"
                                  }
                                  disabled={unavailable || busy}
                                  aria-pressed={
                                    !!v &&
                                    (voucher === v.id ||
                                      held?.voucherId === v.id)
                                  }
                                  onClick={() => setVoucher(v.id)}
                                >
                                  <b>{rate * 100}%</b>
                                  <span>
                                    {!eligible
                                      ? "Món không áp dụng"
                                      : v
                                        ? states[v.state]
                                        : "Có từ 18:00"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <p className="fine">
                            Giảm nền 5% trước, sau đó áp dụng voucher. Không
                            cộng dồn ba voucher.
                          </p>
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
                    <aside className="checkout-summary">
                      <h2>Tóm tắt thanh toán</h2>
                      {amounts && <PriceLines a={amounts} />}
                      <p className="price-type">
                        {held
                          ? "Giá xác nhận từ Bếp Núc"
                          : "Ước tính · chưa gồm thưởng tự nhận"}
                      </p>
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
                              : "Tạo đơn & xem chuyển khoản"}
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
                              : "Giữ hàng & xác nhận giá"}
                          </button>
                        ))}
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
                <Link href="/">Tìm thêm món</Link>
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
                        <Link href="/">Chọn món cho tối nay</Link>
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
                  <Link href="/">Tiếp tục xem món</Link>
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
function PriceLines({ a }: { a: any }) {
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
        <div className="total-line">
          <dt>Tổng thanh toán</dt>
          <dd>{money(a.total)}</dd>
        </div>
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
          <ol className="order-progress">
            <li className="active">Chờ xác nhận tiền</li>
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
          </ol>
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
            </section>
          )}
          {o.status === "paid" && o.code && (
            <section className="pickup-code">
              <h3>Mã nhận dùng một lần</h3>
              <code>{o.code}</code>
              <p>Chỉ đưa mã cho quán. Đến trong khung nhận.</p>
            </section>
          )}
          {o.status === "picked_up" && (
            <p>Bữa đã được giao. Mã nhận không còn dùng được.</p>
          )}
          {o.status === "expired" && (
            <p>
              Đơn hết hạn giữ. Nếu đã chuyển tiền, liên hệ đội vận hành pilot để
              kiểm tra và xử lý hoàn tiền.
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
