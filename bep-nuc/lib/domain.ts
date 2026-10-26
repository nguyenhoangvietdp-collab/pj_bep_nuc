import { randomBytes, randomUUID } from "node:crypto";
export type Role = "student" | "merchant" | "ops";
export type User = {
  id: string;
  name: string;
  role: Role;
  approved: boolean;
  shopId?: string;
};
export type Shop = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  approved: boolean;
  mock: boolean;
  signed: boolean;
  recurring: boolean;
  image?: string;
};
export type Listing = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  floor: number;
  cost: number;
  margin: number;
  stock: number;
  start: number;
  end: number;
  storage: string;
  allergens: string;
  category?: string;
  image?: string;
};
export type Voucher = {
  id: string;
  userId: string;
  day: string;
  rate: number;
  state: "available" | "reserved" | "used";
  quoteId?: string;
};
export type Quote = {
  id: string;
  userId: string;
  listingId: string;
  voucherId: string;
  qty: number;
  expires: number;
  state: "held" | "ordered" | "released";
  price: number;
  payout: number;
  cost: number;
  margin: number;
  baseRate: number;
  rate: number;
  distance: number | null;
  bonusReason: string;
  menuTotal?: number;
};
export type Order = {
  id: string;
  userId: string;
  quoteId: string;
  shopId: string;
  status:
    | "awaiting_payment"
    | "paid"
    | "picked_up"
    | "expired"
    | "cancelled"
    | "no_show";
  code?: string;
  created: number;
  pickupAt?: number;
};
export type Payment = {
  id: string;
  orderId: string;
  reference: string;
  amount: number;
  receivedAt: number;
  valid: boolean;
};
export type Refund = {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  done: boolean;
  reference?: string;
};
export type Settlement = {
  id: string;
  shopId: string;
  orderIds: string[];
  amount: number;
  paid: boolean;
  reference?: string;
};
export type State = {
  users: User[];
  shops: Shop[];
  listings: Listing[];
  vouchers: Voucher[];
  quotes: Quote[];
  orders: Order[];
  payments: Payment[];
  refunds: Refund[];
  settlements: Settlement[];
  audit: {
    id: string;
    at: number;
    actor: string;
    action: string;
    detail: unknown;
  }[];
  requests: Record<string, unknown>;
  exposures: { at: number; userId: string; listingId: string; stock: number }[];
  research: {
    id: string;
    kind: "student" | "shop";
    cluster: string;
    notes: string;
    eligible: boolean;
  }[];
  expenses: { id: string; bucket: string; amount: number; note: string }[];
};
export const empty = (): State => ({
  users: [],
  shops: [],
  listings: [],
  vouchers: [],
  quotes: [],
  orders: [],
  payments: [],
  refunds: [],
  settlements: [],
  audit: [],
  requests: {},
  exposures: [],
  research: [],
  expenses: [],
});
export const day = (now: number) =>
  new Date(now + 7 * 3600000).toISOString().slice(0, 10);
export const evening = (now: number) => {
  const d = new Date(now + 7 * 3600000);
  return (
    d.getUTCHours() >= 18 &&
    !(d.getUTCHours() === 23 && d.getUTCMinutes() === 59)
  );
};
export function requireThat(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(message);
}
export function price(
  l: Listing,
  qty: number,
  base: number,
  distance: number | null,
) {
  requireThat(
    Number.isInteger(qty) && qty >= 1 && qty <= 3,
    "Số lượng phải từ 1 đến 3",
  );
  const p = l.price * qty,
    minimum = (l.floor + l.cost + l.margin) * qty,
    maxRate = 1 - minimum / (0.95 * p);
  requireThat(
    base <= maxRate + 1e-10,
    "Món không đủ ngân sách cho voucher này",
  );
  const rate = Math.min(
    base + Math.min(Math.max(distance ?? 0, 0), 2) * 0.08,
    maxRate,
  );
  return {
    price: Math.max(minimum, Math.ceil(0.95 * p * (1 - rate))),
    payout: l.floor * qty,
    cost: l.cost * qty,
    margin: l.margin * qty,
    rate,
  };
}
export function expire(s: State, now: number) {
  for (const q of s.quotes) {
    const o = s.orders.find((o) => o.quoteId === q.id);
    if (
      q.state !== "released" &&
      q.expires <= now &&
      (!o || o.status === "awaiting_payment")
    ) {
      q.state = "released";
      s.listings.find((l) => l.id === q.listingId)!.stock += q.qty;
      const v = s.vouchers.find((v) => v.id === q.voucherId)!;
      if (v.state === "reserved") {
        v.state = "available";
        delete v.quoteId;
      }
      if (o) o.status = "expired";
      s.audit.push({
        id: randomUUID(),
        at: now,
        actor: "system",
        action: "expire",
        detail: { quoteId: q.id },
      });
    }
  }
}
export function issue(s: State, user: User, now: number) {
  if (user.role === "student" && evening(now))
    for (const rate of [0.07, 0.1, 0.2])
      if (
        !s.vouchers.some(
          (v) => v.userId === user.id && v.day === day(now) && v.rate === rate,
        )
      )
        s.vouchers.push({
          id: randomUUID(),
          userId: user.id,
          day: day(now),
          rate,
          state: "available",
        });
}
export function readiness(s: State) {
  const shops = s.shops.filter(
    (x) =>
      !x.mock &&
      x.approved &&
      x.signed &&
      x.recurring &&
      s.listings.some(
        (l) =>
          l.shopId === x.id &&
          (() => {
            try {
              price(l, 1, 0.2, null);
              return true;
            } catch {
              return false;
            }
          })(),
      ),
  );
  return { eligibleShops: shops.length, ready: shops.length >= 3 };
}
export function ledger(s: State) {
  const received = s.payments.reduce((a, p) => a + p.amount, 0),
    refunded = s.refunds
      .filter((r) => r.done)
      .reduce((a, r) => a + r.amount, 0),
    refundDue = s.refunds
      .filter((r) => !r.done)
      .reduce((a, r) => a + r.amount, 0),
    merchantPaid = s.settlements
      .filter((t) => t.paid)
      .reduce((a, t) => a + t.amount, 0);
  const delivered = s.orders.filter((o) => o.status === "picked_up");
  const merchantDue =
    delivered.reduce(
      (a, o) => a + s.quotes.find((q) => q.id === o.quoteId)!.payout,
      0,
    ) - merchantPaid;
  const contribution = delivered.reduce((a, o) => {
    const q = s.quotes.find((q) => q.id === o.quoteId)!;
    return a + q.price - q.payout - q.cost;
  }, 0);
  return {
    received,
    refunded,
    refundDue,
    merchantPaid,
    merchantDue,
    contribution,
    cash: received - refunded - merchantPaid,
    unallocated: received - refunded - refundDue - merchantPaid - merchantDue,
  };
}
export function view(s: State, u: User, now: number) {
  const listings = s.listings
    .filter((l) => u.role !== "merchant" || l.shopId === u.shopId)
    .map((l) => (u.role === "student" ? publicListing(l) : l));
  const orders = s.orders
    .filter(
      (o) =>
        u.role === "ops" ||
        (u.role === "merchant" ? o.shopId === u.shopId : o.userId === u.id),
    )
    .map((o) => {
      const q = s.quotes.find((q) => q.id === o.quoteId)!;
      return {
        ...o,
        code: u.role === "student" ? o.code : undefined,
        listingId: q.listingId,
        qty: q.qty,
        total: q.price,
        expires: q.expires,
        payout: u.role === "student" ? undefined : q.payout,
        refund:
          u.role === "student"
            ? s.refunds
                .filter((r) => r.orderId === o.id)
                .map(({ amount, done, reason }) => ({ amount, done, reason }))
            : undefined,
      };
    });
  return {
    user: u,
    now,
    listings,
    shops: s.shops.map(({ id, name, address }) => ({ id, name, address })),
    orders,
    vouchers: s.vouchers.filter((v) => v.userId === u.id && v.day === day(now)),
    heldQuotes:
      u.role === "student"
        ? s.quotes
            .filter(
              (q) => q.userId === u.id && q.state === "held" && q.expires > now,
            )
            .map((q) => publicQuote(s, q))
        : [],
    ...(u.role === "ops"
      ? {
          users: s.users,
          partners: s.shops,
          refunds: s.refunds,
          settlements: s.settlements,
          payments: s.payments,
          ledger: ledger(s),
          readiness: readiness(s),
          audit: s.audit.slice(-100),
          research: s.research,
          expenses: s.expenses,
          exposures: s.exposures,
          metrics: {
            delivered: s.orders.filter((o) => o.status === "picked_up").length,
            deliveredUnits: s.orders
              .filter((o) => o.status === "picked_up")
              .reduce(
                (n, o) => n + s.quotes.find((q) => q.id === o.quoteId)!.qty,
                0,
              ),
            repeatCustomers: s.users.filter(
              (u) =>
                s.orders.filter(
                  (o) => o.userId === u.id && o.status === "picked_up",
                ).length >= 2,
            ).length,
            paidRefunds: s.refunds.filter((r) => r.done).length,
            noShow: s.orders.filter((o) => o.status === "no_show").length,
            voucherMix: [0.07, 0.1, 0.2].map((rate) => ({
              rate,
              used: s.vouchers.filter(
                (v) => v.rate === rate && v.state === "used",
              ).length,
            })),
          },
        }
      : {}),
    ...(u.role === "merchant"
      ? { settlements: s.settlements.filter((t) => t.shopId === u.shopId) }
      : {}),
  };
}
export type RuntimePolicy = { production: boolean; pilotEnabled: boolean; bankReady: boolean };
export function policyFromEnv(env: Record<string, string | undefined>): RuntimePolicy {
  return { production: env.APP_MODE === "production", pilotEnabled: env.REAL_PILOT_ENABLED === "true", bankReady: !!(env.BANK_NAME && env.BANK_ACCOUNT && env.BANK_HOLDER) };
}
export function act(
  s: State,
  u: User,
  action: string,
  a: Record<string, any>,
  now: number,
  distance: number | null = null,
  policy: RuntimePolicy = policyFromEnv(typeof process === "undefined" ? {} : process.env),
): unknown {
  requireThat(u.approved, "Tài khoản chưa được duyệt");
  const key = `${u.id}:${action}:${a.key}`;
  requireThat(
    typeof a.key === "string" && a.key.length >= 8,
    "Thiếu khóa chống thao tác trùng",
  );
  if (key in s.requests) return s.requests[key];
  let result: unknown = { ok: true };
  const ops = () => requireThat(u.role === "ops", "Chỉ vận hành được phép");
  const owned = (o: Order) =>
    requireThat(
      u.role === "ops" || (u.role === "merchant" && u.shopId === o.shopId),
      "Không có quyền với đơn này",
    );
  if (action === "quote") {
    requireThat(
      u.role === "student" && evening(now),
      "Chỉ đặt từ 18:00 đến trước 23:59",
    );
    requireThat(
      !policy.production || (policy.pilotEnabled && readiness(s).ready && policy.bankReady),
      "Pilot thật chưa đủ điều kiện mở",
    );
    const l = s.listings.find((l) => l.id === a.listingId);
    requireThat(
      l && s.shops.find((x) => x.id === l.shopId)?.approved && now < l.end,
      "Món không còn nhận đơn",
    );
    const v = s.vouchers.find(
      (v) => v.id === a.voucherId && v.userId === u.id && v.day === day(now),
    );
    requireThat(v && v.state === "available", "Voucher không còn khả dụng");
    const p = price(l, a.qty, v.rate, distance);
    requireThat(l.stock >= a.qty, "Không đủ tồn");
    const q: Quote = {
      id: randomUUID(),
      userId: u.id,
      listingId: l.id,
      voucherId: v.id,
      qty: a.qty,
      expires: Math.min(
        now + 600000,
        l.end,
        Date.parse(day(now) + "T23:59:00+07:00"),
      ),
      state: "held",
      ...p,
      baseRate: v.rate,
      distance,
      menuTotal: l.price * a.qty,
      bonusReason:
        distance === null
          ? "Không xác định được tuyến; dùng voucher gốc"
          : "Ước lượng tuyến đi bộ; không chứng minh đã đi bộ",
    };
    s.quotes.push(q);
    l.stock -= a.qty;
    v.state = "reserved";
    v.quoteId = q.id;
    result = publicQuote(s, q);
  } else if (action === "release_quote") {
    requireThat(u.role === "student", "Chỉ sinh viên bỏ báo giá");
    const q = s.quotes.find((q) => q.id === a.quoteId && q.userId === u.id);
    requireThat(
      q && q.state !== "ordered" && !s.orders.some((o) => o.quoteId === q.id),
      "Không thể bỏ báo giá đã tạo đơn",
    );
    if (q.state === "held") {
      q.state = "released";
      s.listings.find((l) => l.id === q.listingId)!.stock += q.qty;
      const v = s.vouchers.find((v) => v.id === q.voucherId)!;
      if (v.state === "reserved" && v.quoteId === q.id) {
        v.state = "available";
        delete v.quoteId;
      }
    }
  } else if (action === "order") {
    requireThat(u.role === "student", "Chỉ sinh viên tạo đơn");
    const q = s.quotes.find((q) => q.id === a.quoteId && q.userId === u.id);
    requireThat(
      q && q.state === "held" && q.expires > now,
      "Báo giá hết hạn hoặc đã sử dụng",
    );
    q.state = "ordered";
    const l = s.listings.find((l) => l.id === q.listingId)!;
    const o: Order = {
      id: randomUUID(),
      userId: u.id,
      quoteId: q.id,
      shopId: l.shopId,
      status: "awaiting_payment",
      created: now,
    };
    s.orders.push(o);
    result = { id: o.id };
  } else if (action === "payment") {
    ops();
    const o = s.orders.find((o) => o.id === a.orderId);
    requireThat(o, "Không tìm thấy đơn");
    requireThat(
      typeof a.reference === "string" &&
        a.reference.trim().length >= 3 &&
        !s.payments.some((p) => p.reference === a.reference.trim()),
      "Mã giao dịch thiếu hoặc đã được ghi nhận",
    );
    requireThat(
      Number.isSafeInteger(a.amount) &&
        a.amount > 0 &&
        Number.isFinite(a.receivedAt) &&
        a.receivedAt <= now &&
        a.receivedAt >= o.created,
      "Thông tin tiền không hợp lệ",
    );
    const q = s.quotes.find((q) => q.id === o.quoteId)!;
    const valid =
      o.status === "awaiting_payment" &&
      q.expires > now &&
      a.receivedAt < q.expires &&
      a.amount === q.price;
    s.payments.push({
      id: randomUUID(),
      orderId: o.id,
      reference: a.reference.trim(),
      amount: a.amount,
      receivedAt: a.receivedAt,
      valid,
    });
    if (valid) {
      o.status = "paid";
      o.code = randomBytes(12).toString("hex");
      s.vouchers.find((v) => v.id === q.voucherId)!.state = "used";
    } else {
      s.refunds.push({
        id: randomUUID(),
        orderId: o.id,
        amount: a.amount,
        reason: "Tiền muộn, sai số tiền hoặc giao dịch thêm; kiểm tra thủ công",
        done: false,
      });
    }
  } else if (action === "pickup") {
    const o = s.orders.find((o) => o.id === a.orderId);
    requireThat(o, "Không tìm thấy đơn");
    owned(o);
    const q = s.quotes.find((q) => q.id === o.quoteId)!,
      l = s.listings.find((l) => l.id === q.listingId)!;
    requireThat(
      o.status === "paid" && o.code === a.code,
      "Mã sai hoặc đã sử dụng",
    );
    requireThat(now >= l.start && now <= l.end, "Ngoài khung nhận hàng");
    o.status = "picked_up";
    o.pickupAt = now;
    delete o.code;
  } else if (action === "cancel" || action === "no_show") {
    const o = s.orders.find((o) => o.id === a.orderId);
    requireThat(o, "Không tìm thấy đơn");
    owned(o);
    const q = s.quotes.find((q) => q.id === o.quoteId)!,
      l = s.listings.find((l) => l.id === q.listingId)!;
    requireThat(
      o.status === "paid" ||
        (action === "cancel" && o.status === "awaiting_payment"),
      "Đơn không thể hủy",
    );
    if (action === "no_show") requireThat(now > l.end, "Chưa hết khung nhận");
    if (o.status === "paid")
      s.refunds.push({
        id: randomUUID(),
        orderId: o.id,
        amount: q.price,
        reason: action === "cancel" ? "Quán hủy" : "No-show pilot",
        done: false,
      });
    o.status = action === "cancel" ? "cancelled" : "no_show";
    delete o.code;
    if (q.state !== "released") {
      l.stock += q.qty;
      q.state = "released";
    }
    const v = s.vouchers.find((v) => v.id === q.voucherId)!;
    if (action === "cancel" && v.day === day(now) && evening(now)) {
      v.state = "available";
      delete v.quoteId;
    } else v.state = "used";
  } else if (action === "refund") {
    ops();
    const r = s.refunds.find((r) => r.id === a.id);
    requireThat(r && !r.done, "Hoàn tiền đã xử lý hoặc không tồn tại");
    requireThat(
      typeof a.reference === "string" &&
        a.reference.trim().length >= 3 &&
        !s.refunds.some((x) => x.reference === a.reference.trim()) &&
        !s.settlements.some((x) => x.reference === a.reference.trim()),
      "Cần mã chuyển khoản hoàn riêng",
    );
    r.done = true;
    r.reference = a.reference.trim();
  } else if (action === "settle") {
    ops();
    requireThat(
      s.shops.some((x) => x.id === a.shopId),
      "Không tìm thấy quán",
    );
    const ids = s.orders
      .filter(
        (o) =>
          o.shopId === a.shopId &&
          o.status === "picked_up" &&
          !s.settlements.some((t) => t.orderIds.includes(o.id)),
      )
      .map((o) => o.id);
    requireThat(ids.length, "Không có đơn mới đã giao");
    const amount = ids.reduce(
      (n, id) =>
        n +
        s.quotes.find(
          (q) => q.id === s.orders.find((o) => o.id === id)!.quoteId,
        )!.payout,
      0,
    );
    s.settlements.push({
      id: randomUUID(),
      shopId: a.shopId,
      orderIds: ids,
      amount,
      paid: false,
    });
  } else if (action === "payout") {
    ops();
    const t = s.settlements.find((t) => t.id === a.id);
    requireThat(t && !t.paid, "Đợt đối soát đã trả hoặc không tồn tại");
    requireThat(
      typeof a.reference === "string" &&
        a.reference.trim().length >= 3 &&
        !s.settlements.some((x) => x.reference === a.reference.trim()) &&
        !s.refunds.some((x) => x.reference === a.reference.trim()),
      "Cần mã chuyển khoản trả quán riêng",
    );
    t.paid = true;
    t.reference = a.reference.trim();
  } else if (action === "stock") {
    const l = s.listings.find((l) => l.id === a.id);
    requireThat(
      l &&
        (u.role === "ops" || (u.role === "merchant" && u.shopId === l.shopId)),
      "Không có quyền",
    );
    requireThat(
      Number.isSafeInteger(a.stock) && a.stock >= 0,
      "Tồn phải là số nguyên không âm",
    );
    l.stock = a.stock;
  } else if (action === "approve") {
    ops();
    const target = s.users.find((x) => x.id === a.id);
    requireThat(target, "Không có tài khoản");
    target.approved = !!a.approved;
  } else if (action === "partner") {
    ops();
    requireThat(
      typeof a.name === "string" &&
        a.name.length > 1 &&
        typeof a.address === "string" &&
        Number.isFinite(a.lat) &&
        Math.abs(a.lat) <= 90 &&
        Number.isFinite(a.lng) &&
        Math.abs(a.lng) <= 180,
      "Thông tin quán không hợp lệ",
    );
    const partner: Shop = {
      id: a.id || randomUUID(),
      name: a.name,
      address: a.address,
      lat: a.lat,
      lng: a.lng,
      approved: !!a.approved,
      mock: !!a.mock,
      signed: !!a.signed,
      recurring: !!a.recurring,
      image: localImage(a.image),
    };
    const old = s.shops.find((x) => x.id === partner.id);
    if (old) {
      requireThat(
        !old.mock || partner.mock,
        "Không chuyển quán demo thành quán thật",
      );
      Object.assign(old, partner);
    } else s.shops.push(partner);
  } else if (action === "research") {
    ops();
    requireThat(
      ["student", "shop"].includes(a.kind) &&
        typeof a.cluster === "string" &&
        typeof a.notes === "string",
      "Sai khảo sát",
    );
    s.research.push({
      id: randomUUID(),
      kind: a.kind,
      cluster: a.cluster,
      notes: a.notes,
      eligible: !!a.eligible,
    });
  } else if (action === "expense") {
    ops();
    const limits: Record<string, number> = {
      infra: 400000,
      recruit: 500000,
      research: 600000,
      reserve: 500000,
    };
    requireThat(
      a.bucket in limits && Number.isSafeInteger(a.amount) && a.amount > 0,
      "Sai chi phí",
    );
    requireThat(
      s.expenses
        .filter((x) => x.bucket === a.bucket)
        .reduce((n, x) => n + x.amount, 0) +
        a.amount <=
        limits[a.bucket],
      "Vượt ngân sách mục",
    );
    s.expenses.push({
      id: randomUUID(),
      bucket: a.bucket,
      amount: a.amount,
      note: String(a.note),
    });
  } else if (action === "exposure") {
    requireThat(u.role === "student", "Chỉ ghi lượt xem sinh viên");
    const l = s.listings.find((x) => x.id === a.listingId);
    requireThat(l, "Không có món");
    s.exposures.push({
      at: now,
      userId: u.id,
      listingId: l.id,
      stock: l.stock,
    });
  } else if (action === "listing") {
    requireThat(
      u.role === "ops" || (u.role === "merchant" && u.shopId === a.shopId),
      "Không có quyền",
    );
    requireThat(
      s.shops.some((x) => x.id === a.shopId),
      "Không có quán",
    );
    for (const k of ["price", "floor", "cost", "margin", "stock"])
      requireThat(Number.isSafeInteger(a[k]) && a[k] >= 0, `Sai ${k}`);
    requireThat(
      a.price > 0 &&
        Number.isFinite(a.start) &&
        Number.isFinite(a.end) &&
        a.start < a.end &&
        a.end > now &&
        typeof a.name === "string" &&
        a.name.length > 1,
      "Thông tin lô không hợp lệ",
    );
    s.listings.push({
      id: randomUUID(),
      shopId: a.shopId,
      name: a.name.slice(0, 100),
      price: a.price,
      floor: a.floor,
      cost: a.cost,
      margin: a.margin,
      stock: a.stock,
      start: a.start,
      end: a.end,
      storage: String(a.storage).slice(0, 500),
      allergens: String(a.allergens).slice(0, 500),
      category: categories.includes(a.category) ? a.category : "Món khác",
      image: localImage(a.image),
    });
  } else throw new Error("Thao tác không hợp lệ");
  s.requests[key] = result;
  s.audit.push({
    id: randomUUID(),
    at: now,
    actor: u.id,
    action,
    detail: action === "pickup" ? { orderId: a.orderId } : a,
  });
  return result;
}
export function demoState(now: number) {
  const s = empty();
  s.users = [
    { id: "student", name: "Sinh viên thử", role: "student", approved: true },
    {
      id: "merchant",
      name: "Quán thử",
      role: "merchant",
      shopId: "shop1",
      approved: true,
    },
    { id: "ops", name: "Vận hành thử", role: "ops", approved: true },
  ];
  s.shops = [
    {
      id: "shop1",
      name: "Bếp cuối chiều · DEMO",
      address: "Cụm trường Hà Nội — dữ liệu giả",
      lat: 21.0285,
      lng: 105.8542,
      approved: true,
      mock: true,
      signed: false,
      recurring: false,
    },
  ];
  s.listings = [
    {
      id: "meal",
      shopId: "shop1",
      name: "Cơm gà & rau theo mùa",
      price: 50000,
      floor: 32500,
      cost: 3000,
      margin: 2000,
      stock: 12,
      start: now - 3600000,
      end: now + 3 * 3600000,
      storage: "Nhận tại quán; dùng ngay sau khi nhận. Dữ liệu minh họa.",
      allergens: "Có đậu nành; hỏi quán trước khi mua.",
      category: "Cơm",
      image: "/food-images/demo-meal.svg",
    },
  ];
  return s;
}

export const categories = ["Cơm", "Bún/mì", "Bánh", "Đồ uống", "Món khác"];
export function localImage(value: unknown): string | undefined {
  if (value === undefined || value === "") return undefined;
  requireThat(
    typeof value === "string" &&
      /^\/food-images\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|svg)$/.test(value),
    "Ảnh phải là tài nguyên /food-images/ của website",
  );
  return value;
}
export function publicListing(l: Listing) {
  return {
    id: l.id,
    shopId: l.shopId,
    name: l.name,
    price: l.price,
    stock: l.stock,
    start: l.start,
    end: l.end,
    storage: l.storage,
    allergens: l.allergens,
    category: categories.includes(l.category || "") ? l.category! : "Món khác",
    image: l.image,
    eligible: [0.07, 0.1, 0.2].filter((v) => {
      try {
        price(l, 1, v, null);
        return true;
      } catch {
        return false;
      }
    }),
  };
}
export function catalogue(s: State, now: number, production = false) {
  const shops = s.shops.filter((x) => x.approved && (!production || !x.mock));
  return {
    now,
    shops: shops.map(({ id, name, address, image }) => ({
      id,
      name,
      address,
      image,
    })),
    listings: s.listings
      .filter((l) => shops.some((x) => x.id === l.shopId) && l.end > now)
      .map(publicListing),
  };
}
export function publicQuote(s: State, q: Quote) {
  const menuTotal =
    q.menuTotal ?? s.listings.find((l) => l.id === q.listingId)!.price * q.qty;
  const afterBase = Math.ceil(menuTotal * 0.95);
  const afterVoucher = Math.ceil(menuTotal * 0.95 * (1 - q.baseRate));
  return {
    id: q.id,
    listingId: q.listingId,
    qty: q.qty,
    voucherId: q.voucherId,
    total: q.price,
    expires: q.expires,
    rate: q.rate,
    baseRate: q.baseRate,
    distance: q.distance,
    bonusReason: q.bonusReason,
    menuTotal,
    baseDiscount: menuTotal - afterBase,
    voucherDiscount: afterBase - afterVoucher,
    bonusDiscount: afterVoucher - q.price,
    saved: menuTotal - q.price,
  };
}
