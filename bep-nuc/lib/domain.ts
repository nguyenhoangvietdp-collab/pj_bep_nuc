import { randomBytes, randomUUID } from "node:crypto";
import {flowerListings,flowerShops,flowerDemoVersion} from "./flower-demo.ts";
import { defaultTradingRules, demoTradingRules, publicTradingRules, weekStart, voucherCurrent, voucherDiscount, pickupSupport, validLot, validateRules, type TradingRules, type SavedPlace, type Lot } from "./trading.ts";
export type Role = "student" | "merchant" | "ops";
export type User = {
  id: string;
  name: string;
  role: Role;
  approved: boolean;
  shopId?: string;
  place?: SavedPlace;
};
export type Shop = {
  story?: string;
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  approved: boolean;
  mock: boolean;
  signed: boolean;
  recurring: boolean;
  image?: string;
};
export type Listing = {
  approved?:boolean;
  lot?: Lot;
  id: string;
  shopId: string;
  name: string;
  price: number;
  floor: number;
  payoutShare?: 0.9;
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
  amount?: number;
  cap?: number;
  period?: "week";
  id: string;
  userId: string;
  day: string;
  rate: number;
  state: "available" | "reserved" | "used";
  quoteId?: string;
};
export type Quote = {
  promotion?: { week: string; voucher: number; pickup: number; shipping: number; shippingCap: number; stackReceiving: boolean; status: "reserved" | "used" | "released" };
  lotSnapshot?: Lot;
  placeSnapshot?: { id: string; label: string };
  fulfillment?: "pickup" | "delivery";
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
  fulfillment?: "pickup" | "delivery";
  delivery?: { recipient: string; phone: string; address: string; fee?: number; customerFee?: number; support?: number; revision: number; acceptedAt?: number; completedAt?: number; confirmation?: string };
  id: string;
  userId: string;
  quoteId: string;
  shopId: string;
  status:
    | "awaiting_delivery_fee"
    | "awaiting_payment"
    | "paid"
    | "picked_up"
    | "out_for_delivery"
    | "delivered"
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
export type MealRequest = { id:string; userId:string; name:string; qty:number; rate:number; fulfillment:"pickup"|"delivery"; delivery?:Order["delivery"]; status:"pending"|"confirmed"|"rejected"|"ordered"; revision:number; created:number; quoteId?:string; fee?:number; grossFee?:number; orderId?:string; reason?:string };
export type State = {
  flowerDemoVersion?: number;
  tradingRules?: TradingRules;
  issues?: { id:string; orderId:string; userId:string; description:string; created:number; status:"open"|"resolved"; resolution?:string }[];
  mealRequests?: MealRequest[];
  deliveryCosts?: { id: string; orderId: string; amount: number; reference: string; at: number }[];
  geocodingUsage?: { day: string; count: number; lastAt?: number };
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
  requireThat(l.payoutShare === undefined || l.payoutShare === 0.9, "Tỷ lệ thực nhận không hợp lệ");
  const p = l.price * qty,
    minimum = l.payoutShare === 0.9 ? (l.cost + l.margin) * qty * 10 : (l.floor + l.cost + l.margin) * qty,
    maxRate = 1 - minimum / (0.95 * p);
  requireThat(
    base <= maxRate + 1e-10,
    "Món không đủ ngân sách cho voucher này",
  );
  const rate = Math.min(
    base + Math.min(Math.max(distance ?? 0, 0), 2) * 0.08,
    maxRate,
  );
  const total = Math.max(minimum, Math.ceil(0.95 * p * (1 - rate)));
  return {
    price: total,
    payout: l.payoutShare === 0.9 ? total - Math.floor(total / 10) : l.floor * qty,
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
      (!o || ["awaiting_payment", "awaiting_delivery_fee"].includes(o.status))
    ) {
      q.state = "released";
      s.listings.find((l) => l.id === q.listingId)!.stock += q.qty;
      if(q.promotion)q.promotion.status="released";
      const v = s.vouchers.find((v) => v.id === q.voucherId);
      if (v?.state === "reserved") {
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
export const rulesFor = (s: State) => s.tradingRules ?? defaultTradingRules();
export const promotionUsed = (s: State, week: string, except?: string) => s.quotes.filter(q=>q.id!==except && q.promotion?.week===week && q.promotion.status!=="released").reduce((n,q)=>n+q.promotion!.voucher+q.promotion!.pickup+q.promotion!.shipping,0);
function reservePromotion(s: State, q: Quote, shipping: number) {
  if (!q.promotion) return;
  const p=q.promotion, r=rulesFor(s);
  requireThat(promotionUsed(s,p.week,q.id)+p.voucher+p.pickup+shipping<=r.weeklyBudget,"Ngân sách ưu đãi đã hết. Chọn không voucher hoặc quay lại sau.");
  requireThat(q.price-q.payout-q.cost-shipping>=q.margin,"Lô không đủ ngân sách hỗ trợ giao hàng");
  p.shipping=shipping;
}
function quoteModern(s:State,u:User,a:Record<string,any>,now:number,distance:number|null,production:boolean) {
  requireThat(!s.quotes.some(q=>q.userId===u.id&&q.state==="held"&&q.expires>now)&&!s.orders.some(o=>o.userId===u.id&&["awaiting_payment","awaiting_delivery_fee"].includes(o.status)&&s.quotes.some(q=>q.id===o.quoteId&&q.expires>now)),"Hoàn tất hoặc hủy lô đang giữ/chờ thanh toán trước khi chọn thêm");
  const l=s.listings.find(l=>l.id===a.listingId),r=rulesFor(s);
  requireThat(l && now<l.end && s.shops.some(x=>x.id===l.shopId&&x.approved&&(!production||!x.mock)),"Lô không còn nhận đơn");
  const shop=s.shops.find(x=>x.id===l.shopId)!;
  if(shop.lat===null||shop.lng===null)distance=null;
  requireThat(l.approved===true&&!!l.image&&validLot(l.lot,now,l.end,!production&&shop.mock) && l.storage.trim().length>=3 && (l.lot!.kind==="flowers" || l.allergens.trim().length>=3),"Lô chưa được duyệt hoặc chưa có đủ thông tin chất lượng");
  requireThat(l.payoutShare===undefined,"Lô mới cần khoản thực nhận cố định được tiệm đồng ý");
  requireThat(Number.isInteger(a.qty)&&a.qty>=1&&a.qty<=3&&l.stock>=a.qty,"Số lượng không hợp lệ hoặc không đủ tồn");
  requireThat(["pickup","delivery"].includes(a.fulfillment??"pickup"),"Cách nhận không hợp lệ");
  const v=a.voucherId?s.vouchers.find(v=>v.id===a.voucherId&&v.userId===u.id&&v.period==="week"&&voucherCurrent(v,now)&&v.state==="available"):undefined;
  requireThat(!a.voucherId||v,"Voucher không còn khả dụng");
  requireThat(!v||u.place,"Chọn và lưu vị trí trước khi dùng voucher");
  const base=l.price*a.qty;
  requireThat(!v||(r.enabled&&base>=r.minimumBasket&&(!v.amount||base>=v.amount)),"Lô chưa đủ điều kiện voucher");
  const discount=voucherDiscount(base,v);requireThat(!v||discount>0,"Voucher chưa được cấp mức tài trợ");
  const fulfillment=a.fulfillment??"pickup",km=fulfillment==="pickup"&&u.place?distance:null;
  const extra=fulfillment==="pickup"&&(!v||r.stackReceiving)?pickupSupport(r,km):0;
  const total=base-discount-extra, payout=l.floor*a.qty,cost=l.cost*a.qty,margin=l.margin*a.qty;
  requireThat([base,total,payout,cost,margin].every(n=>Number.isSafeInteger(n)&&n>=0),"Giá hoặc chi phí lô không hợp lệ");
  requireThat(total>0 && total-payout-cost>=margin,"Lô không đủ ngân sách cho ưu đãi này");
  const q:Quote={id:randomUUID(),userId:u.id,listingId:l.id,voucherId:v?.id??"",qty:a.qty,fulfillment,expires:Math.min(now+600000,l.end,Date.parse(weekStart(now)+"T00:00:00+07:00")+7*86400000),state:"held",price:total,payout,cost,margin,baseRate:v?.rate??0,rate:v?.rate??0,distance:km,bonusReason:extra?"Hỗ trợ theo tuyến từ điểm đã lưu; không xác nhận hành trình thực tế":km===null?"Chưa có tuyến xác nhận: không tính hỗ trợ khoảng cách":"Tuyến tham khảo; hỗ trợ theo vùng và điều kiện lô",menuTotal:base,lotSnapshot:structuredClone(l.lot!),placeSnapshot:u.place?{id:u.place.id,label:u.place.label}:undefined,promotion:{week:weekStart(now),voucher:discount,pickup:extra,shipping:0,shippingCap:r.enabled?r.shippingCap:0,stackReceiving:r.stackReceiving,status:"reserved"}};
  reservePromotion(s,q,0);s.quotes.push(q);l.stock-=a.qty;
  if(v){v.state="reserved";v.quoteId=q.id;}
  return publicQuote(s,q);
}
export function issue(s: State, user: User, now: number) {
  const r=rulesFor(s);
  if(r.version===2){
    if(user.role!=="student"||!r.enabled)return;
    const week=weekStart(now);
    for(const spec of [{rate:.15,count:2,cap:r.cap15},{rate:.1,count:2,cap:r.cap10},{rate:0,count:r.fixedWeekly,amount:9000}]){
      const existing=s.vouchers.filter(v=>v.userId===user.id&&v.period==="week"&&v.day===week&&v.rate===spec.rate&&v.amount===spec.amount).length;
      for(let n=existing;n<spec.count;n++)s.vouchers.push({id:randomUUID(),userId:user.id,day:week,period:"week",rate:spec.rate,amount:spec.amount,cap:spec.cap,state:"available"});
    }
    return;
  }
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
export function readiness(s: State, now=Date.now()) {
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
              if(rulesFor(s).version===2){requireThat(l.approved===true&&!!l.image&&validLot(l.lot,now,l.end)&&l.end>now,"Lô chưa đủ thông tin");requireThat(l.price>=l.floor+l.cost+l.margin,"Không đủ biên");}
              else price(l, 1, 0.2, null);
              return true;
            } catch {
              return false;
            }
          })(),
      ),
  );
  return { eligibleShops: shops.length, ready: shops.length >= 3 };
}
export const shopFulfilled = (o: Order) => o.status === "picked_up" || (o.fulfillment === "delivery" && o.pickupAt !== undefined);
export const customerReceived = (o: Order) => o.status === "picked_up" || o.status === "delivered";
export const orderTotal = (s: State, o: Order) => s.quotes.find(q => q.id === o.quoteId)!.price + (o.delivery?.acceptedAt !== undefined ? o.delivery.customerFee??o.delivery.fee! : 0);
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
  const delivered = s.orders.filter(shopFulfilled);
  const deliveryCostPaid = (s.deliveryCosts || []).reduce((n,c) => n+c.amount,0);
  const deliveryFeesCollected = s.orders.filter(o=>o.delivery?.acceptedAt!==undefined && s.payments.some(p=>p.orderId===o.id&&p.valid)).reduce((n,o)=>n+(o.delivery!.customerFee??o.delivery!.fee!),0);
  const merchantDue =
    delivered.reduce(
      (a, o) => a + s.quotes.find((q) => q.id === o.quoteId)!.payout,
      0,
    ) - merchantPaid;
  const contribution = delivered.reduce((a, o) => {
    const q = s.quotes.find((q) => q.id === o.quoteId)!;
    return a + s.payments.filter(p=>p.orderId===o.id).reduce((n,p)=>n+p.amount,0) - s.refunds.filter(r=>r.orderId===o.id).reduce((n,r)=>n+r.amount,0) - q.payout - q.cost;
  }, 0) - deliveryCostPaid;
  const heldCustomerFunds=s.orders.filter(o=>o.status==="paid"&&o.pickupAt===undefined).reduce((n,o)=>n+s.payments.filter(p=>p.orderId===o.id&&p.valid).reduce((v,p)=>v+p.amount,0),0);
  const deliveryReserve=s.orders.filter(o=>o.fulfillment==="delivery"&&o.pickupAt!==undefined&&!(s.deliveryCosts??[]).some(c=>c.orderId===o.id)).reduce((n,o)=>n+(o.delivery?.fee??0),0);
  return {
    received,
    refunded,
    refundDue,
    merchantPaid,
    merchantDue,
    contribution,
    deliveryFeesCollected,
    deliveryCostPaid,
    deliveryCostsUnconfirmed: s.orders.filter(o=>o.fulfillment==="delivery" && o.pickupAt!==undefined && !(s.deliveryCosts||[]).some(c=>c.orderId===o.id)).length,
    cash: received - refunded - merchantPaid - deliveryCostPaid,
    heldCustomerFunds,
    deliveryReserve,
    unallocated: received - refunded - refundDue - merchantPaid - merchantDue - deliveryCostPaid - heldCustomerFunds - deliveryReserve,
  };
}
export function view(s: State, u: User, now: number) {
  const listings = s.listings
    .filter((l) => (u.role !== "merchant" || l.shopId === u.shopId)&&(u.role!=="student"||!l.lot||l.approved===true))
    .map((l) => (u.role === "student" ? publicListing(l,rulesFor(s)) : l));
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
        code: (u.role === "student" && o.fulfillment!=="delivery") || (u.role==="ops" && o.fulfillment==="delivery") ? o.code : undefined,
        delivery: u.role==="merchant" ? undefined : o.delivery,
        listingId: q.listingId,
        qty: q.qty,
        foodTotal: q.price,
        deliveryFee: o.delivery?.customerFee??o.delivery?.fee,
        grossDeliveryFee:o.delivery?.fee,
        shippingSupport:o.delivery?.support??0,
        lotSnapshot:q.lotSnapshot,
        priceBreakdown:publicQuote(s,q),
        total: orderTotal(s,o),
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
    mealRequests: (s.mealRequests || []).filter(r=>u.role==="ops" || (u.role==="student" && r.userId===u.id)).map(r=>({...r,status:r.status==="confirmed" && (s.quotes.find(q=>q.id===r.quoteId)?.expires||0)<=now?"expired":r.status, quote:r.quoteId?(()=>{const q=s.quotes.find(q=>q.id===r.quoteId);const l=q&&s.listings.find(l=>l.id===q.listingId);const shop=l&&s.shops.find(x=>x.id===l.shopId);return q?{total:q.price,expires:q.expires,name:l?.name,address:shop?.address,start:l?.start,end:l?.end}:undefined;})():undefined})),
    now,
    listings,
    shops: s.shops.map(({ id, name, address, mock, story }) => ({ id, name, address, mock, story })),
    orders,
    tradingRules: u.role==="ops"?rulesFor(s):publicTradingRules(rulesFor(s)),
    issues:(s.issues??[]).filter(x=>u.role==="ops"||x.userId===u.id),
    vouchers: s.vouchers.filter((v) => v.userId === u.id && voucherCurrent(v,now) && (rulesFor(s).version===1||v.period==="week")),
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
          readiness: readiness(s,now),
          promotionBudget:{week:weekStart(now),reservedAndUsed:promotionUsed(s,weekStart(now)),limit:rulesFor(s).weeklyBudget},
          audit: s.audit.slice(-100),
          research: s.research,
          expenses: s.expenses,
          deliveryCosts: s.deliveryCosts || [],
          exposures: s.exposures,
          metrics: {
            delivered: s.orders.filter(customerReceived).length,
            deliveredUnits: s.orders
              .filter(customerReceived)
              .reduce(
                (n, o) => n + s.quotes.find((q) => q.id === o.quoteId)!.qty,
                0,
              ),
            repeatCustomers: s.users.filter(
              (u) =>
                s.orders.filter(
                  (o) => o.userId === u.id && customerReceived(o),
                ).length >= 2,
            ).length,
            paidRefunds: s.refunds.filter((r) => r.done).length,
            noShow: s.orders.filter((o) => o.status === "no_show").length,
            voucherMix: (rulesFor(s).version===2?[.15,.1,0]:[0.07, 0.1, 0.2]).map((rate) => ({
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
  requestConsent = false): unknown {
  requireThat(u.approved || (u.role === "student" && action === "meal_request"), "Tài khoản chưa được duyệt");
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
  if(action === "save_place") {
    requireThat(u.role==="student","Chỉ khách hàng lưu vị trí");
    requireThat(typeof a.label==="string"&&a.label.trim().length>=2&&a.label.length<=60&&typeof a.address==="string"&&a.address.trim().length>=10&&a.address.length<=250&&Number.isFinite(a.lat)&&a.lat>=20.5&&a.lat<=21.5&&Number.isFinite(a.lng)&&a.lng>=105&&a.lng<=106.3,"Chọn địa chỉ và tọa độ hợp lệ tại Hà Nội");
    requireThat(!s.quotes.some(q=>q.userId===u.id&&q.state==="held"),"Bỏ giữ lô trước khi đổi vị trí");
    u.place={id:randomUUID(),label:a.label.trim(),address:a.address.trim(),lat:a.lat,lng:a.lng,savedAt:now};
  } else if(action === "configure_trading") {
    ops(); const r=structuredClone(a.rules) as TradingRules;validateRules(r);
    requireThat(a.fundingConfirmed===true,"Xác nhận ngân sách có tiền tài trợ và tách nghĩa vụ tiệm");
    requireThat(typeof a.note==="string"&&a.note.trim().length>=5&&a.note.length<=300,"Ghi nguồn tài trợ và căn cứ cấu hình");
    requireThat(r.weeklyBudget>=promotionUsed(s,weekStart(now)),"Ngân sách không được thấp hơn ưu đãi đang giữ/đã dùng");
    s.tradingRules=r;for(const user of s.users)if(user.approved)issue(s,user,now);
  } else if(action==="report_issue") {
    const o=s.orders.find(o=>o.id===a.orderId&&o.userId===u.id);
    requireThat(u.role==="student"&&o&&["paid","out_for_delivery","picked_up","delivered"].includes(o.status),"Chỉ báo vấn đề cho đơn đã thanh toán");
    requireThat(typeof a.description==="string"&&a.description.trim().length>=5&&a.description.length<=1000,"Mô tả vấn đề từ 5–1.000 ký tự");
    const issues=s.issues??=[];requireThat(!issues.some(x=>x.orderId===o.id&&x.status==="open"),"Đơn đã có yêu cầu đang xử lý");issues.push({id:randomUUID(),orderId:o.id,userId:u.id,description:a.description.trim(),created:now,status:"open"});
  } else if(action==="resolve_issue") {
    ops();const issue=s.issues?.find(x=>x.id===a.id&&x.status==="open");requireThat(issue,"Không có yêu cầu đang mở");
    requireThat(typeof a.resolution==="string"&&a.resolution.trim().length>=5&&a.resolution.length<=1000&&typeof a.refund==="boolean","Ghi quyết định xử lý và hoàn tiền");
    const o=s.orders.find(o=>o.id===issue.orderId)!,q=s.quotes.find(q=>q.id===o.quoteId)!;
    if(a.refund){
      const paid=s.payments.filter(p=>p.orderId===o.id).reduce((n,p)=>n+p.amount,0),due=s.refunds.filter(r=>r.orderId===o.id).reduce((n,r)=>n+r.amount,0);
      requireThat(paid>due,"Không còn tiền để hoàn");s.refunds.push({id:randomUUID(),orderId:o.id,amount:paid-due,reason:a.resolution.trim(),done:false});
      if(o.pickupAt===undefined){o.status="cancelled";delete o.code;if(q.state!=="released"){s.listings.find(l=>l.id===q.listingId)!.stock+=q.qty;q.state="released";}if(q.promotion)q.promotion.status="released";}
      const v=s.vouchers.find(v=>v.id===q.voucherId);if(v&&voucherCurrent(v,now)){v.state="available";delete v.quoteId;}
    }
    issue.status="resolved";issue.resolution=a.resolution.trim();
  } else if(action === "meal_request") {
    requireThat(u.role==="student","Chỉ sinh viên gửi yêu cầu");
    requireThat(typeof a.name==="string"&&a.name.trim().length>=2&&a.name.length<=100,"Tên món không hợp lệ");
    requireThat(Number.isInteger(a.qty)&&a.qty>=1&&a.qty<=3&&(rulesFor(s).version===2?[0,.15,.1,9000]:[0.07,0.1,0.2]).includes(a.rate),"Số suất hoặc voucher không hợp lệ");
    requireThat(["pickup","delivery"].includes(a.fulfillment),"Cách nhận không hợp lệ");
    if(a.fulfillment==="delivery") requireThat(a.delivery&&typeof a.delivery.recipient==="string"&&a.delivery.recipient.trim().length>=2&&a.delivery.recipient.length<=100&&typeof a.delivery.phone==="string"&&/^(0\d{9}|\+84\d{9})$/.test(a.delivery.phone)&&typeof a.delivery.address==="string"&&a.delivery.address.length>=10&&a.delivery.address.length<=250,"Cần tên, số điện thoại và địa chỉ nhận hợp lệ");
    const list=s.mealRequests??=[];
    requireThat(list.filter(x=>x.userId===u.id&&["pending","confirmed"].includes(x.status)).length<5,"Bạn có tối đa 5 yêu cầu đang xử lý");
    const request:MealRequest={id:randomUUID(),userId:u.id,name:a.name.trim(),qty:a.qty,rate:a.rate,fulfillment:a.fulfillment,delivery:a.fulfillment==="delivery"?{recipient:a.delivery.recipient,phone:a.delivery.phone,address:a.delivery.address,revision:0}:undefined,status:"pending",revision:0,created:now};
    list.push(request);result={id:request.id};
  } else if(["confirm_meal_request","reject_meal_request","accept_meal_request"].includes(action)) {
    const request=s.mealRequests?.find(x=>x.id===a.requestId);requireThat(request,"Không có yêu cầu");
    requireThat(!["ordered","rejected"].includes(request.status),"Yêu cầu đã kết thúc");
    const student=s.users.find(x=>x.id===request.userId);requireThat(student?.approved&&student.role==="student","Tài khoản chưa đủ điều kiện");
    if(action==="accept_meal_request") {
      requireThat(u.id===request.userId&&request.status==="confirmed"&&a.revision===request.revision,"Báo giá đã đổi hoặc chưa xác nhận");
      const q=s.quotes.find(q=>q.id===request.quoteId);requireThat(q&&q.expires>now&&q.state==="held","Báo giá hết hạn");
      const o=act(s,student,"order",{key:a.key+":order",quoteId:q.id,delivery:request.delivery},now,null,policy,true) as {id:string};
      if(request.fulfillment==="delivery") {
        act(s,s.users.find(x=>x.role==="ops"&&x.approved)!,"delivery_fee",{key:a.key+":fee",orderId:o.id,fee:request.grossFee??request.fee},now,null,policy);
        act(s,student,"accept_delivery_fee",{key:a.key+":consent",orderId:o.id,revision:1},now,null,policy);
      }
      request.status="ordered";request.orderId=o.id;result=o;
    } else {
      ops();
      if(action==="confirm_meal_request") {
        requireThat(a.sourceConfirmed===true,"Xác nhận nguồn món và giờ thực hiện trước khi báo giá");
        requireThat(Number.isSafeInteger(a.fee)&&a.fee>=0&&a.fee<=1000000&&(request.fulfillment==="delivery"||a.fee===0),"Phí giao không hợp lệ");
      }
      if(request.quoteId){const old=s.quotes.find(q=>q.id===request.quoteId);if(old?.state==="held")act(s,student,"release_quote",{key:a.key+":release",quoteId:old.id},now,null,policy);}
      if(action==="reject_meal_request"){
        requireThat(typeof a.reason==="string"&&a.reason.trim().length>=3&&a.reason.length<=250,"Ghi lý do từ chối");request.status="rejected";request.reason=a.reason.trim();
      } else {
        const v=s.vouchers.find(v=>v.userId===student.id&&(request.rate===9000?v.amount===9000:v.rate===request.rate&&!v.amount)&&voucherCurrent(v,now)&&v.state==="available");requireThat(request.rate===0||v,"Voucher khách chọn không còn dùng được");
        const q=act(s,student,"quote",{key:a.key+":quote",listingId:a.listingId,voucherId:v?.id,qty:request.qty,fulfillment:request.fulfillment},now,null,policy) as {id:string};
        const internal=s.quotes.find(x=>x.id===q.id)!;
        const support=request.fulfillment==="delivery"&&internal.promotion&&(!internal.promotion.voucher||internal.promotion.stackReceiving)?Math.min(Math.floor(a.fee*.3),internal.promotion.shippingCap):0;
        reservePromotion(s,internal,support);
        request.quoteId=q.id;request.grossFee=a.fee;request.fee=a.fee-support;request.revision++;request.status="confirmed";
      }
    }
  } else if (action === "quote") {
    requireThat(
      u.role === "student" && (rulesFor(s).version===2||evening(now)),
      rulesFor(s).version===2?"Chỉ khách hàng được phép đặt lô":"Chỉ đặt từ 18:00 đến trước 23:59",
    );
    requireThat(
      !policy.production || (policy.pilotEnabled && readiness(s,now).ready && policy.bankReady),
      "Pilot thật chưa đủ điều kiện mở",
    );
    if(rulesFor(s).version===2){result=quoteModern(s,u,a,now,distance,policy.production);} else {
    const l = s.listings.find((l) => l.id === a.listingId);
    requireThat(
      l && s.shops.some(x=>x.id===l.shopId && x.approved && (!policy.production || !x.mock)) && now < l.end,
      "Món không còn nhận đơn",
    );
    const v = s.vouchers.find(
      (v) => v.id === a.voucherId && v.userId === u.id && v.day === day(now),
    );
    requireThat(v && v.state === "available", "Voucher không còn khả dụng");
    const fulfillment = a.fulfillment ?? "pickup";
    requireThat(["pickup", "delivery"].includes(fulfillment),"Cách nhận không hợp lệ");
    const quoteDistance = fulfillment === "delivery" ? null : distance;
    const p = price(l, a.qty, v.rate, quoteDistance);
    requireThat(l.stock >= a.qty, "Không đủ tồn");
    const q: Quote = {
      id: randomUUID(),
      fulfillment,
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
      distance: quoteDistance,
      menuTotal: l.price * a.qty,
      bonusReason:
        fulfillment === "delivery" ? "Giao tận nơi không áp thưởng tự nhận" : quoteDistance === null
          ? "Không xác định được tuyến; dùng voucher gốc"
          : "Ước lượng tuyến đi bộ; không chứng minh đã đi bộ",
    };
    s.quotes.push(q);
    l.stock -= a.qty;
    v.state = "reserved";
    v.quoteId = q.id;
    result = publicQuote(s, q);
    }
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
      if(q.promotion)q.promotion.status="released";
      const v = s.vouchers.find((v) => v.id === q.voucherId);
      if (v?.state === "reserved" && v.quoteId === q.id) {
        v.state = "available";
        delete v.quoteId;
      }
    }
  } else if (action === "order") {
    requireThat(requestConsent || !s.mealRequests?.some(r=>r.quoteId===a.quoteId), "Hãy đồng ý báo giá qua yêu cầu đặt món");
    requireThat(u.role === "student", "Chỉ sinh viên tạo đơn");
    const q = s.quotes.find((q) => q.id === a.quoteId && q.userId === u.id);
    requireThat(
      q && q.state === "held" && q.expires > now,
      "Báo giá hết hạn hoặc đã sử dụng",
    );
    let delivery: Order["delivery"];
    if(q.fulfillment==="delivery"){
      requireThat(a.delivery && typeof a.delivery==="object","Cần thông tin nhận hàng");
      requireThat(["recipient","phone","address"].every(k=>typeof a.delivery[k]==="string"),"Thông tin nhận hàng phải là văn bản");
      const recipient=String(a.delivery.recipient||"").trim(),phone=String(a.delivery.phone||"").replace(/[\s-]/g,""),address=String(a.delivery.address||"").trim();
      requireThat(recipient.length>=2&&recipient.length<=100&&!/[\x00-\x1f]/.test(recipient),"Tên người nhận từ 2–100 ký tự");
      requireThat(/^(0\d{9}|\+84\d{9})$/.test(phone),"Số điện thoại nhận hàng không hợp lệ");
      requireThat(address.length>=10&&address.length<=250&&!/[\x00-\x1f]/.test(address),"Nhập địa chỉ nhận đầy đủ tại Hà Nội, từ 10–250 ký tự");
      delivery={recipient,phone,address,revision:0};
    }
    q.state = "ordered";
    const l = s.listings.find((l) => l.id === q.listingId)!;
    const o: Order = {
      id: randomUUID(),
      userId: u.id,
      quoteId: q.id,
      shopId: l.shopId,
      fulfillment: q.fulfillment || "pickup",
      delivery,
      status: delivery ? "awaiting_delivery_fee" : "awaiting_payment",
      created: now,
    };
    s.orders.push(o);
    result = { id: o.id };
  } else if(action==="delivery_fee") {
    ops();const o=s.orders.find(o=>o.id===a.orderId),q=o&&s.quotes.find(q=>q.id===o.quoteId);
    requireThat(o?.delivery&&o.status==="awaiting_delivery_fee"&&q&&q.expires>now,"Đơn không còn chờ phí giao hàng");
    requireThat(Number.isSafeInteger(a.fee)&&a.fee>=0&&a.fee<=1000000,"Phí giao phải là số nguyên từ 0 đến 1.000.000đ");
    const support=q.promotion&&(!q.promotion.voucher||q.promotion.stackReceiving)?Math.min(Math.floor(a.fee*.3),q.promotion.shippingCap):0;
    reservePromotion(s,q,support);
    o.delivery.fee=a.fee;o.delivery.support=support;o.delivery.customerFee=a.fee-support;o.delivery.revision++;
  } else if(action==="accept_delivery_fee") {
    const o=s.orders.find(o=>o.id===a.orderId&&o.userId===u.id),q=o&&s.quotes.find(q=>q.id===o.quoteId);
    requireThat(u.role==="student"&&o?.delivery&&o.status==="awaiting_delivery_fee"&&q&&q.expires>now,"Đơn không còn chờ xác nhận phí");
    requireThat(o.delivery.fee!==undefined&&a.revision===o.delivery.revision,"Phí giao đã đổi hoặc chưa được báo. Hãy kiểm tra lại");
    o.delivery.acceptedAt=now;o.status="awaiting_payment";
  } else if(action==="decline_delivery_fee") {
    const o=s.orders.find(o=>o.id===a.orderId&&o.userId===u.id);
    requireThat(u.role==="student"&&o?.delivery&&o.status==="awaiting_delivery_fee","Không thể từ chối phí của đơn này");
    const q=s.quotes.find(q=>q.id===o.quoteId)!;
    o.status="cancelled";if(q.state!=="released"){s.listings.find(l=>l.id===q.listingId)!.stock+=q.qty;q.state="released";}
    if(q.promotion)q.promotion.status="released";
    const voucher=s.vouchers.find(v=>v.id===q.voucherId);if(voucher){voucher.state="available";delete voucher.quoteId;}
  } else if(action==="delivery_complete") {
    ops();const o=s.orders.find(o=>o.id===a.orderId);
    requireThat(o?.delivery&&o.status==="out_for_delivery","Đơn chưa được bàn giao hoặc đã hoàn tất");
    requireThat(typeof a.confirmation==="string"&&a.confirmation.trim().length>=3&&a.confirmation.length<=250,"Ghi căn cứ xác nhận khách đã nhận hàng");
    o.delivery.completedAt=now;o.delivery.confirmation=a.confirmation.trim();o.status="delivered";
  } else if(action==="delivery_cost") {
    ops();const o=s.orders.find(o=>o.id===a.orderId);
    requireThat(o?.delivery&&s.payments.some(p=>p.orderId===o.id&&p.valid),"Chỉ ghi chi phí giao cho đơn đã xác nhận tiền");
    requireThat(Number.isSafeInteger(a.amount)&&a.amount>=0&&a.amount<=1000000,"Chi phí giao không hợp lệ");
    requireThat(typeof a.reference==="string"&&a.reference.trim().length>=3&&a.reference.length<=128,"Cần chứng từ chi phí giao hàng");
    const costs=s.deliveryCosts||[];
    requireThat(!costs.some(c=>c.orderId===o.id||c.reference===a.reference.trim()) && !s.refunds.some(r=>r.reference===a.reference.trim()) && !s.settlements.some(t=>t.reference===a.reference.trim()),"Chi phí đơn hoặc chứng từ đã ghi nhận");
    s.deliveryCosts=[...costs,{id:randomUUID(),orderId:o.id,amount:a.amount,reference:a.reference.trim(),at:now}];
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
      a.amount === orderTotal(s,o);
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
      const v=s.vouchers.find((v) => v.id === q.voucherId);if(v && !q.promotion)v.state="used";
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
    o.status = o.fulfillment==="delivery" ? "out_for_delivery" : "picked_up";
    o.pickupAt = now;
    if(q.promotion)q.promotion.status="used";
    const v=s.vouchers.find(v=>v.id===q.voucherId);if(v)v.state="used";
    delete o.code;
  } else if (action === "cancel" || action === "no_show") {
    const o = s.orders.find((o) => o.id === a.orderId);
    requireThat(o, "Không tìm thấy đơn");
    if(u.role==="student")requireThat(action==="cancel"&&o.userId===u.id&&["awaiting_payment","awaiting_delivery_fee"].includes(o.status),"Chỉ tự hủy đơn chưa thanh toán; đơn đã trả tiền cần gửi hỗ trợ");else owned(o);
    const q = s.quotes.find((q) => q.id === o.quoteId)!,
      l = s.listings.find((l) => l.id === q.listingId)!;
    requireThat(
      o.status === "paid" ||
        (action === "cancel" && ["awaiting_payment","awaiting_delivery_fee","out_for_delivery"].includes(o.status)),
      "Đơn không thể hủy",
    );
    if (action === "no_show") requireThat(o.fulfillment!=="delivery" && now > l.end, "Chỉ đánh dấu no-show cho đơn tự nhận đã hết giờ");
    if(o.status==="out_for_delivery")ops();
    if (o.status === "paid" || o.status==="out_for_delivery")
      s.refunds.push({
        id: randomUUID(),
        orderId: o.id,
        amount: orderTotal(s,o),
        reason: action === "cancel" ? "Quán hủy" : "No-show pilot",
        done: false,
      });
    o.status = action === "cancel" ? "cancelled" : "no_show";
    delete o.code;
    if (q.state !== "released") {
      if(o.pickupAt===undefined)l.stock += q.qty;
      q.state = "released";
    }
    if(q.promotion&&o.pickupAt===undefined)q.promotion.status="released";
    const v = s.vouchers.find((v) => v.id === q.voucherId);
    if (v && action === "cancel" && voucherCurrent(v,now)) {
      v.state = "available";
      delete v.quoteId;
    } else if(v)v.state = "used";
  } else if (action === "refund") {
    ops();
    const r = s.refunds.find((r) => r.id === a.id);
    requireThat(r && !r.done, "Hoàn tiền đã xử lý hoặc không tồn tại");
    requireThat(
      typeof a.reference === "string" &&
        a.reference.trim().length >= 3 &&
        !s.refunds.some((x) => x.reference === a.reference.trim()) &&
        !s.settlements.some((x) => x.reference === a.reference.trim()) &&
        !(s.deliveryCosts||[]).some(x=>x.reference===a.reference.trim()),
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
          shopFulfilled(o) &&
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
        !s.refunds.some((x) => x.reference === a.reference.trim()) &&
        !(s.deliveryCosts||[]).some(x=>x.reference===a.reference.trim()),
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
        ((a.lat === null && a.lng === null) ||
          (Number.isFinite(a.lat) && Math.abs(a.lat) <= 90 && Number.isFinite(a.lng) && Math.abs(a.lng) <= 180)),
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
  } else if(action==="approve_listing") {
    ops();const l=s.listings.find(l=>l.id===a.id);requireThat(l?.lot&&validLot(l.lot,now,l.end)&&l.end>now,"Lô không đủ điều kiện duyệt");
    requireThat(a.confirmed===true&&[a.floor,a.cost,a.margin].every(n=>Number.isSafeInteger(n)&&n>=0)&&a.floor+a.cost+a.margin<=l.price,"Xác nhận khoản tiệm nhận, chi phí đầy đủ và biên hợp lệ");
    l.floor=a.floor;l.cost=a.cost;l.margin=a.margin;l.approved=true;
  } else if (action === "listing") {
    if(a.lot&&rulesFor(s).version===2)a.lot.checkedAt=now;
    if(rulesFor(s).version===2){requireThat(validLot(a.lot,now,a.end),"Cần đủ thông tin lô, tình trạng và bằng chứng giá");requireThat(a.payoutShare===undefined,"Lô mới cần khoản tiệm thực nhận cố định");requireThat(typeof a.storage==="string"&&a.storage.trim().length>=3&&a.storage.length<=500&&(a.lot.kind==="flowers"||typeof a.allergens==="string"&&a.allergens.trim().length>=3&&a.allergens.length<=500),"Thiếu bảo quản/dị ứng hoặc vượt500ký tự");}
    if(rulesFor(s).version===2)requireThat(typeof a.image==="string"&&a.image.length>0,"Cần ảnh đúng lô trước khi mở bán");
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
    requireThat(a.payoutShare === undefined || a.payoutShare === 0.9, "Tỷ lệ thực nhận không hợp lệ");
    requireThat(a.payoutShare !== 0.9 || a.floor === 0, "Chia doanh thu không dùng khoản thực nhận cố định");
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
      payoutShare: a.payoutShare,
      cost: a.cost,
      margin: a.margin,
      stock: a.stock,
      start: a.start,
      end: a.end,
      storage: String(a.storage).slice(0, 500),
      allergens: String(a.allergens).slice(0, 500),
      category: categories.includes(a.category) ? a.category : "Món khác",
      image: localImage(a.image),
      lot: a.lot ? structuredClone(a.lot) : undefined,
      approved:u.role==="ops",
    });
  } else throw new Error("Thao tác không hợp lệ");
  s.requests[key] = result;
  s.audit.push({
    id: randomUUID(),
    at: now,
    actor: u.id,
    action,
    detail: action==="save_place"?{placeId:u.place?.id}:["pickup","order","delivery_complete","meal_request","confirm_meal_request","accept_meal_request","reject_meal_request"].includes(action) ? { orderId: a.orderId ?? (result as any)?.id, quoteId: a.quoteId } : a,
  });
  return result;
}
export function demoState(now: number) {
  const s = empty();
  // Historical fixture for regression tests of existing quotes and orders.
  s.tradingRules={...defaultTradingRules(),version:1};
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

// Retained as the pre-catalogue fixture for regression checks of existing orders.
export function tradingDemoState(now:number){
  const s=demoState(now);s.tradingRules=demoTradingRules();
  s.listings[0].approved=true;s.listings[0].lot={kind:"food",offer:"surplus",reason:"Phần còn lại cuối phiên — lô minh họa",contents:"Một phần cơm gà và rau theo mô tả minh họa",condition:"Dữ liệu demo, không có hàng thật",checkedAt:now,referencePrice:55000,referenceEvidence:"Giá minh họa, không phải menu đã xác minh"};
  s.listings.push({id:"flowers",shopId:"shop1",name:"Hoa cắm nhà · lô minh họa",price:59000,floor:40000,cost:4000,margin:2000,stock:2,start:now-3600000,end:now+3*3600000,storage:"Cắt gốc, dùng bình sạch và thay nước. Chỉ minh họa, không cam kết số ngày tươi.",allergens:"",category:"Hoa cắm nhà",image:"/food-images/flowers-demo.svg",lot:{kind:"flowers",offer:"surplus",reason:"Hoa còn lại tại tiệm — dữ liệu demo",contents:"5 cành hoa cắm nhà minh họa; không phải bó tặng",condition:"Chưa có hoa thật để kiểm; đây là lô demo",checkedAt:now,stems:5,species:"Hoa theo lô minh họa",packaging:"Gói giấy cơ bản, không phụ kiện quà tặng"}});
  for(const l of s.listings)l.approved=true;
  return s;
}
export function seedFlowerDemo(s:State,now:number,production=false){
  if(production || s.tradingRules?.version!==2 || (s.flowerDemoVersion??0)>=flowerDemoVersion)return;
  for(const shop of flowerShops)if(!s.shops.some(x=>x.id===shop.id))s.shops.push({...shop});
  for(const lot of flowerListings(now))if(!s.listings.some(x=>x.id===lot.id))s.listings.push(lot);
  if(!s.orders.some(o=>s.quotes.find(q=>q.id===o.quoteId)?.listingId==="flowers")&&!s.quotes.some(q=>q.listingId==="flowers"))s.listings=s.listings.filter(l=>l.id!=="flowers");
  s.flowerDemoVersion=flowerDemoVersion;
}
export function modernDemoState(now:number){const s=tradingDemoState(now);seedFlowerDemo(s,now);return s;}
export const categories = ["Cơm", "Bún/mì", "Bánh", "Đồ uống", "Món khác", "Hoa cắm nhà"];
export function localImage(value: unknown): string | undefined {
  if (value === undefined || value === "") return undefined;
  requireThat(
    typeof value === "string" &&
      (/^\/food-images\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|svg)$/.test(value)||/^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/bep-nuc-lots\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(value)),
    "Ảnh phải là tài nguyên website hoặc ảnh lô trong Supabase Storage",
  );
  return value;
}
export function publicListing(l: Listing,rules=defaultTradingRules()) {
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
    lot:l.lot,
    pricingVersion:l.lot?2:1,
    eligibleFixed:!!l.lot&&rules.enabled&&l.price>9000&&l.price>=rules.minimumBasket&&l.price-9000>=l.floor+l.cost+l.margin,
    eligible: l.lot?[.15,.1].filter(rate=>{const d=Math.min(Math.floor(l.price*rate),rate===.15?rules.cap15:rules.cap10);return rules.enabled&&d>0&&l.price>=rules.minimumBasket&&l.price-d>=l.floor+l.cost+l.margin;}):[0.07, 0.1, 0.2].filter((v) => {
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
    shops: shops.map(({ id, name, address, image, mock, story }) => ({
      id,
      name,
      address,
      image,
      mock,
      story,
    })),
    listings: s.listings
      .filter((l) => !(s.flowerDemoVersion&&l.id==="flowers") && shops.some((x) => x.id === l.shopId) && l.end > now && (rulesFor(s).version!==2||l.approved===true&&!!l.image&&validLot(l.lot,now,l.end,!production&&!!shops.find(x=>x.id===l.shopId)?.mock)))
      .map(l=>publicListing(l,rulesFor(s))),
    tradingRules:publicTradingRules(rulesFor(s)),
  };
}
export function publicQuote(s: State, q: Quote) {
  const menuTotal =
    q.menuTotal ?? s.listings.find((l) => l.id === q.listingId)!.price * q.qty;
  const afterBase = Math.ceil(menuTotal * 0.95);
  const afterVoucher = Math.ceil(menuTotal * 0.95 * (1 - q.baseRate));
  if(q.promotion)return {id:q.id,fulfillment:q.fulfillment||"pickup",listingId:q.listingId,qty:q.qty,voucherId:q.voucherId,total:q.price,expires:q.expires,rate:q.rate,baseRate:q.baseRate,distance:q.distance,bonusReason:q.bonusReason,menuTotal,baseDiscount:0,voucherDiscount:q.promotion.voucher,bonusDiscount:q.promotion.pickup,saved:q.promotion.voucher+q.promotion.pickup,lotSnapshot:q.lotSnapshot,placeSnapshot:q.placeSnapshot,shippingCap:q.promotion.shippingCap,stackReceiving:q.promotion.stackReceiving,pricingVersion:2};
  return {
    id: q.id,
    fulfillment: q.fulfillment || "pickup",
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
