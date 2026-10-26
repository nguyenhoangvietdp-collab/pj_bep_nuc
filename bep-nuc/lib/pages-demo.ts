import { estimate, type Food, type PublicShop } from "./commerce";
// Public fixtures only: never import database state or private shop terms here.
export const demoTime = Date.parse("2026-10-26T18:30:00+07:00");
export const rates = [0.07, 0.1, 0.2];
export const shops: PublicShop[] = [
  { id: "rice-shop", name: "Bếp chiều · DEMO", address: "Khu trường Hà Nội · địa chỉ minh họa" },
  { id: "noodle-shop", name: "Bún nhà · DEMO", address: "Khu trường Hà Nội · địa chỉ minh họa" },
  { id: "bread-shop", name: "Tiệm bánh chiều · DEMO", address: "Khu trường Hà Nội · địa chỉ minh họa" },
];
const meal = (id: string, name: string, shopId: string, price: number, stock: number, category: string, image: string): Food => ({ id, name, shopId, price, stock, category, image, start: demoTime - 3600000, end: demoTime + 10800000, storage: "Dữ liệu minh họa. Dùng ngay sau khi nhận; chưa có món thật được bán trên website này.", allergens: "Thông tin dị ứng chỉ minh họa; món thật cần được quán xác nhận.", eligible: rates });
export const meals = [
  meal("rice", "Cơm rau & đậu phụ", "rice-shop", 40000, 8, "Cơm", "/food-images/demo-meal.svg"),
  meal("noodle", "Bún bò cuối chiều", "noodle-shop", 45000, 7, "Bún/mì", "/food-images/demo-noodle.svg"),
  meal("bread", "Bánh mì trứng", "bread-shop", 30000, 5, "Bánh", "/food-images/demo-bread.svg"),
  meal("cake", "Bánh cuối ngày", "bread-shop", 35000, 0, "Bánh", "/food-images/demo-bread.svg"),
];
export type DemoOrder = { id: string; foodId: string; qty: number; rate: number; created: number; status: "awaiting_payment" | "paid" | "delivered" };
export function expired(order: DemoOrder, now: number) { return order.status === "awaiting_payment" && now >= order.created + 600000; }
export function available(orders: DemoOrder[], now: number) { return orders.filter(o => !expired(o, now)); }
export function stockFor(food: Food, orders: DemoOrder[], now: number) { return food.stock - available(orders, now).filter(o => o.foodId === food.id).reduce((sum, o) => sum + o.qty, 0); }
export function placeOrder(orders: DemoOrder[], foodId: string, qty: number, rate: number, now: number, id: string): DemoOrder[] {
  const duplicate = orders.find(o => o.id === id);
  if (duplicate) {
    if (duplicate.foodId !== foodId || duplicate.qty !== qty || duplicate.rate !== rate) throw new Error("Mã thử đã được dùng cho bữa khác.");
    return orders;
  }
  const food = meals.find(f => f.id === foodId);
  if (!food || !Number.isInteger(qty) || qty < 1 || qty > 3 || !food.eligible.includes(rate)) throw new Error("Kiểm tra món, số suất và voucher.");
  if (stockFor(food, orders, now) < qty) throw new Error("Không còn đủ suất demo. Hãy chọn lại món.");
  if (available(orders, now).some(o => o.rate === rate)) throw new Error("Voucher đã dùng hoặc đang giữ cho đơn demo khác.");
  return [{ id, foodId, qty, rate, created: now, status: "awaiting_payment" }, ...orders];
}
export function progressOrder(orders: DemoOrder[], id: string, now: number, expected: DemoOrder["status"]): DemoOrder[] {
  return orders.map(o => {
    if (o.id !== id || o.status !== expected) return o;
    if (expired(o, now)) throw new Error("Đơn demo hết hạn giữ 10 phút. Chọn lại bữa để thử tiếp.");
    return { ...o, status: o.status === "awaiting_payment" ? "paid" : "delivered" };
  });
}
export function restoreOrders(raw: string | null): DemoOrder[] {
  try {
    const value: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(value) || value.length > 100) return [];
    const valid: DemoOrder[] = [];
    for (const item of value) {
      if (!item || typeof item.id !== "string" || !/^DEMO-[a-z0-9-]{1,50}$/i.test(item.id) || valid.some(o => o.id === item.id) || typeof item.foodId !== "string" || !meals.some(f => f.id === item.foodId) || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 3 || !rates.includes(item.rate) || !Number.isFinite(item.created) || item.created <= 0 || !["awaiting_payment", "paid", "delivered"].includes(item.status)) return [];
      valid.push({ id: item.id, foodId: item.foodId, qty: item.qty, rate: item.rate, created: item.created, status: item.status });
    }
    return valid;
  } catch { return []; }
}
export function orderTotal(order: DemoOrder) { return estimate(meals.find(f => f.id === order.foodId)!.price * order.qty, order.rate).total; }
