import {retailCategories,retailLabel,normalizeRetailCategory,nearDateCategory} from "./near-date.ts";
import {thresholdFor,type promotionThresholds} from "./promotion-threshold.ts";
import type {CustomerPricing} from "./catalogue-sale.ts";
import {voucherCurrent,voucherDiscount,type Lot,type VoucherValue} from "./trading.ts";
export const foodCategories = ["Cơm", "Bún/mì", "Bánh", "Đồ uống", "Món khác", "Hoa cắm nhà",...retailCategories];
export const mealCategories = foodCategories.filter(c=>c!=="Hoa cắm nhà"&&!c.startsWith(retailLabel));
export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
export const time = (n: number) =>
  new Date(n).toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  });
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
export function estimate(menuTotal: number, rate = 0) {
  const afterBase = Math.ceil(menuTotal * 0.95),
    total = Math.ceil(menuTotal * 0.95 * (1 - rate));
  return {
    menuTotal,
    baseDiscount: menuTotal - afterBase,
    voucherDiscount: afterBase - total,
    bonusDiscount: 0,
    total,
    saved: menuTotal - total,
  };
}
export type Food = {
  promotionThresholds?:ReturnType<typeof promotionThresholds>;
  saleVerified?:boolean;
  customerPricing?:CustomerPricing;
  lot?:Lot;
  pricingVersion?:number;
  eligibleFixed?:boolean;
  id: string;
  shopId: string;
  name: string;
  price: number;
  stock: number;
  start: number;
  end: number;
  storage: string;
  allergens: string;
  category: string;
  image?: string;
  eligible: number[];
};
export type PublicShop = {
  label?:string;pickupEntrance?:string;driverNotes?:string;
  lat?:number|null; lng?:number|null;
  mock?: boolean;
  story?: string;
  id: string;
  name: string;
  address: string;
  image?: string;
};
export type DisplayVoucher = VoucherValue & { id?:string; state: string; day: string };
export function lotEstimate(food:Food,qty=1,v?:DisplayVoucher){
  if(food.pricingVersion!==2)return estimate(food.price*qty,v?.rate||0);
  const threshold=thresholdFor(food.promotionThresholds,v?.amount===9000?9000:v?.rate??0);
  const base=food.price*qty,discount=threshold===undefined||threshold!==null&&qty>=threshold.qty?voucherDiscount(base,v):0,menuTotal=(food.customerPricing?.originalUnitPrice??food.price)*qty;
  return {pricingVersion:2,customerPricing:food.customerPricing,saleTotal:base,menuTotal,baseDiscount:menuTotal-base,voucherDiscount:discount,bonusDiscount:0,total:base-discount,saved:menuTotal-base+discount};
}
export function displayPrice(food: Food, vouchers: DisplayVoucher[], now: number, qty = 1) {
  if(food.pricingVersion===2){
    const available=vouchers.filter(v=>v.period==="week"&&voucherCurrent(v,now)&&v.state==="available"&&(v.amount?food.eligibleFixed:food.eligible.includes(v.rate)));
    const best=available.sort((a,b)=>voucherDiscount(food.price*qty,b)-voucherDiscount(food.price*qty,a))[0];
    return {...lotEstimate(food,qty,best),rate:best?.rate??0,voucher:best};
  }
  const local = new Date(now + 7 * 60 * 60 * 1000).toISOString();
  const rate = Number(local.slice(11, 13)) >= 18 && local.slice(11, 16) < "23:59"
    ? Math.max(0, ...vouchers.filter(v => v.state === "available" && v.day === local.slice(0, 10) && food.eligible.includes(v.rate)).map(v => v.rate))
    : 0;
  return { ...estimate(food.price * qty, rate), rate, voucher:undefined as DisplayVoucher|undefined };
}
export function voucherHint(food: Food, vouchers: DisplayVoucher[], now: number) {
  if(food.pricingVersion===2)return "Có thể mua theo giá lô không voucher. Lưu vị trí trước khi chọn ưu đãi; giá cuối được kiểm tra khi giữ lô.";
  const local = new Date(now + 7 * 3600000).toISOString();
  if (local.slice(11, 16) < "18:00") return "Voucher mở từ 18:00. Bạn có thể xem món trước.";
  if (local.slice(11, 16) >= "23:59") return "Voucher tối nay đã hết hạn. Quay lại từ 18:00 ngày mai.";
  if (!food.eligible.length) return "Món này chưa áp dụng voucher. Hãy chọn món khác.";
  const matching = vouchers.filter(v => v.day === local.slice(0, 10) && food.eligible.includes(v.rate));
  if (matching.some(v => v.state === "available")) return "Chọn một voucher còn dùng được để giữ suất.";
  if (matching.some(v => v.state === "reserved")) return "Voucher phù hợp đang giữ cho một bữa khác. Kiểm tra bữa đang giữ trước khi đặt.";
  if (matching.some(v => v.state === "used")) return "Bạn đã dùng các voucher phù hợp với món này. Hãy chọn món khác.";
  return "Chưa tải được voucher phù hợp. Thử tải lại hoặc chọn món khác.";
}
export function supportLink(email: string | undefined, orderId: string) {
  if (!email || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email)) return null;
  return `mailto:${email}?subject=${encodeURIComponent(orderId ? `Hỗ trợ đơn Bếp Núc ${orderId}` : "Hỗ trợ tài khoản Bếp Núc")}`;
}
export function filterFood(
  listings: Food[],
  shops: PublicShop[],
  query: string,
  category: string,
  shopId: string,
  stockOnly: boolean,
  receiving: boolean,
  sort: string,
  now: number,
  budget = 0,
  vouchers: DisplayVoucher[] = [],
) {
  const text = normalize(query);
  return listings
    .filter((l) => {
      const shop = shops.find((s) => s.id === l.shopId);
      return (
        l.end > now &&
        (category!=="" || l.lot?.kind!=="flowers"&&l.category!=="Hoa cắm nhà") &&
        (!budget || displayPrice(l, vouchers, now).total <= budget) &&
        (normalizeRetailCategory(category)===retailLabel?l.lot?.kind==="goods":!category?l.lot?.kind!=="flowers"&&l.lot?.kind!=="goods":normalizeRetailCategory(l.lot?.kind==="goods"&&l.lot.nearDate?nearDateCategory(l.lot.nearDate.group):l.category)===normalizeRetailCategory(category)) &&
        (!shopId || l.shopId === shopId) &&
        (!stockOnly || l.stock > 0) &&
        (!receiving || (l.start <= now && l.end > now)) &&
        normalize(
          `${l.name} ${shop?.name || ""} ${shop?.address || ""}`,
        ).includes(text)
      );
    })
    .sort((a, b) =>
      sort === "price"
        ? displayPrice(a, vouchers, now).total - displayPrice(b, vouchers, now).total || a.id.localeCompare(b.id)
        : a.end - b.end || a.id.localeCompare(b.id),
    );
}

export const percent = (rate: number) => new Intl.NumberFormat("vi-VN", { style: "percent", maximumFractionDigits: 0 }).format(rate);
export function browseUrl(value: unknown) {
  if (typeof value !== "string" || !/^\/(?:meals(?:\?|$)|\?|$|shops\/[A-Za-z0-9_-]+(?:\?|$))/.test(value) || /[\\\r\n]/.test(value)) return "/meals";
  const url = new URL(value, "https://local.invalid");
  if (url.origin !== "https://local.invalid" || !/^\/(?:meals|shops\/[A-Za-z0-9_-]+)?$/.test(url.pathname)) return "/meals";
  const allowed = ["q", "budget", "category", "shop", "stock", "receiving", "sort"];
  const params = new URLSearchParams();
  for (const key of allowed) if (url.searchParams.has(key)) params.set(key, url.searchParams.get(key)!);
  return (url.pathname === "/" ? "/meals" : url.pathname) + (params.size ? "?" + params.toString() : "");
}
