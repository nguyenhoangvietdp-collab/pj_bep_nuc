export type SavedPlace = { id: string; label: string; address: string; lat: number; lng: number; savedAt: number };
export type Lot = {
  kind: "food" | "flowers"; offer: "surplus" | "promotion";
  reason: string; contents: string; condition: string; checkedAt: number;
  referencePrice?: number; referenceEvidence?: string;
  stems?: number; species?: string; packaging?: string;
  quantity?: {amount:number;unit:"cành"|"bông"|"bó"};
};
export type TradingRules = {
  version: 1 | 2; enabled: boolean; cap15: number; cap10: number; fixedWeekly: number;
  minimumBasket: number; weeklyBudget: number; shippingCap: number;
  stackReceiving: boolean; pickupBands: { maxKm: number; amount: number }[];
};
// Financial commitments stay off until an operator records a funded policy.
export const defaultTradingRules = (): TradingRules => ({ version: 2, enabled: false, cap15: 0, cap10: 0, fixedWeekly: 0, minimumBasket: 0, weeklyBudget: 0, shippingCap: 0, stackReceiving: false, pickupBands: [] });
export const demoTradingRules = (): TradingRules => ({ version: 2, enabled: true, cap15: 9000, cap10: 9000, fixedWeekly: 4, minimumBasket: 9000, weeklyBudget: 500000, shippingCap: 9000, stackReceiving: false, pickupBands: [{maxKm:1,amount:0},{maxKm:2,amount:1000},{maxKm:3,amount:2000}] });
export type PublicTradingRules=Omit<TradingRules,"weeklyBudget">;
export function publicTradingRules(r:TradingRules):PublicTradingRules{const {weeklyBudget,...publicRules}=r;return publicRules;}
export const vietnamDay = (now: number) => new Date(now + 7 * 3600000).toISOString().slice(0,10);
export function weekStart(now: number) {
  const d = new Date(now + 7 * 3600000);
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0,10);
}
export type VoucherValue = { rate: number; amount?: number; cap?: number; period?: "week"; day?: string; state?: string };
export const voucherLabel = (v: VoucherValue) => v.amount ? `${new Intl.NumberFormat("vi-VN").format(v.amount)}đ` : `${Math.round(v.rate*100)}%`;
export function voucherDiscount(base: number, v?: VoucherValue) {
  if (!v) return 0;
  if (v.amount !== undefined) return Math.min(base, v.amount);
  return Math.min(base, Math.floor(base * v.rate), v.cap ?? Number.MAX_SAFE_INTEGER);
}
export const voucherCurrent = (v: VoucherValue, now: number) => v.day === (v.period === "week" ? weekStart(now) : vietnamDay(now));
export function flowerQuantityLabel(lot:Lot){
  return lot.quantity ? `${lot.quantity.amount} ${lot.quantity.unit}${lot.quantity.unit==="bó"&&lot.stems===undefined?" · chưa xác định số cành":""}` : `${lot.stems} cành dùng được`;
}
export function validLot(lot: Lot | undefined, now: number, end: number, allowDemoQuantity=false) {
  return !!lot && ["food","flowers"].includes(lot.kind) && ["surplus","promotion"].includes(lot.offer) &&
    (lot.quantity===undefined || !!lot.quantity && typeof lot.quantity==="object" && Number.isSafeInteger(lot.quantity.amount)&&lot.quantity.amount>0&&lot.quantity.amount<=1000&&["cành","bông","bó"].includes(lot.quantity.unit)&&(lot.quantity.unit!=="cành"||lot.stems===lot.quantity.amount)) &&
    [lot.reason,lot.contents,lot.condition].every(v => typeof v === "string" && v.trim().length >= 3 && v.length <= 1000) &&
    Number.isFinite(lot.checkedAt) && lot.checkedAt <= now && lot.checkedAt > 0 && lot.checkedAt < end &&
    (lot.referencePrice === undefined || (Number.isSafeInteger(lot.referencePrice) && lot.referencePrice > 0 && typeof lot.referenceEvidence === "string" && lot.referenceEvidence.trim().length >= 3)) &&
    (lot.kind !== "flowers" || ((Number.isSafeInteger(lot.stems) && lot.stems! > 0 || allowDemoQuantity && lot.stems===undefined && !!lot.quantity && Number.isSafeInteger(lot.quantity.amount) && lot.quantity.amount>0 && lot.quantity.amount<=1000 && ["cành","bông","bó"].includes(lot.quantity.unit)) && typeof lot.species === "string" && lot.species.trim().length >= 2 && typeof lot.packaging === "string" && lot.packaging.trim().length >= 3));
}
export function validateRules(r: TradingRules) {
  if(!r||typeof r!=="object")throw new Error("Cấu hình ưu đãi không hợp lệ");
  if (r.version !== 2 || typeof r.enabled !== "boolean" || typeof r.stackReceiving !== "boolean" ||
    ![r.cap15,r.cap10,r.minimumBasket,r.weeklyBudget,r.shippingCap,r.fixedWeekly].every(n=>Number.isSafeInteger(n)&&n>=0) ||
    r.fixedWeekly > 20 || r.weeklyBudget > 100000000 || r.cap15 > 1000000 || r.cap10 > 1000000 || r.shippingCap > 1000000 ||
    !Array.isArray(r.pickupBands) || r.pickupBands.length > 5) throw new Error("Cấu hình ưu đãi không hợp lệ");
  let lastKm = 0, lastAmount = 0;
  for (const b of r.pickupBands) {
    if (!Number.isFinite(b.maxKm) || b.maxKm <= lastKm || b.maxKm > 10 || !Number.isSafeInteger(b.amount) || b.amount < lastAmount || b.amount > 100000) throw new Error("Vùng xa cần hỗ trợ không giảm, tối đa 10km và 100.000đ");
    lastKm = b.maxKm; lastAmount = b.amount;
  }
  if (r.enabled && r.weeklyBudget <= 0) throw new Error("Cần cấp ngân sách trước khi bật ưu đãi");
  if(r.enabled&&(r.cap15<=0||r.cap10<=0||r.fixedWeekly<3))throw new Error("Cần cap15%/10% và ít nhất3lượt9k trước khi bật bộ ưu đãi");
}
export function pickupSupport(r: TradingRules, distance: number | null) {
  if (!r.enabled || distance === null || !Number.isFinite(distance) || distance < 0) return 0;
  return r.pickupBands.find(b=>distance <= b.maxKm)?.amount ?? 0;
}
