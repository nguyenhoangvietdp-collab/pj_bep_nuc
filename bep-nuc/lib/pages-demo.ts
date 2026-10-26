import { estimate, type Food, type PublicShop } from "./commerce";
// Public fixtures only: never import database state or private shop terms here.
export const demoTime = Date.parse("2026-10-26T18:30:00+07:00");
export const rates = [0.07, 0.1, 0.2];
export const shops: PublicShop[] = [
  { id: "hai-ba-trung", name: "Điểm nhận Hai Bà Trưng · DEMO", address: "Hai Bà Trưng, Hà Nội · địa chỉ nhận chưa xác minh (demo)" },
  { id: "hoan-kiem", name: "Điểm nhận Hoàn Kiếm · DEMO", address: "Hoàn Kiếm, Hà Nội · địa chỉ nhận chưa xác minh (demo)" },
  { id: "dong-da", name: "Điểm nhận Đống Đa · DEMO", address: "Đống Đa, Hà Nội · địa chỉ nhận chưa xác minh (demo)" },
];
// Names, areas and reference prices follow the team's Drive filenames; stock/times are simulated.
const meal = (id: string, name: string, shopId: string, price: number, stock: number, category: string, image: string): Food => ({ id, name, shopId, price, stock, category, image, start: demoTime - 3600000, end: demoTime + 10800000, storage: "Chưa có thông tin bảo quản được quán xác nhận. Đây là lượt thử, không có món thật được bán trên website này.", allergens: "Chưa có thông tin dị ứng được xác minh. Không suy luận thành phần từ ảnh.", eligible: rates });
export const meals = [
  meal("chao-quay", "Cháo quẩy", "hai-ba-trung", 35000, 5, "Món khác", "/food-images/chao-quay-313e9637.jpg"),
  meal("banh-khot", "Bánh khọt", "hoan-kiem", 40000, 5, "Bánh", "/food-images/banh-khot-de7bcaae.jpg"),
  meal("bun-rieu", "Bún riêu", "dong-da", 45000, 5, "Bún/mì", "/food-images/bun-rieu-f52df09d.jpg"),
  meal("hoanh-thanh", "Hoành thánh", "hoan-kiem", 55000, 5, "Món khác", "/food-images/hoanh-thanh-0fa62f04.jpg"),
  meal("xoi-com", "Xôi cốm", "hai-ba-trung", 50000, 5, "Món khác", "/food-images/xoi-com-86467181.jpg"),
  meal("bun-dau", "Bún đậu", "dong-da", 60000, 5, "Bún/mì", "/food-images/bun-dau-b2c9f96e.jpg"),
  meal("banh-ran-duong", "Bánh rán đường", "hoan-kiem", 5000, 5, "Bánh", "/food-images/banh-ran-duong-fdce99b1.jpg"),
  meal("banh-day", "Bánh dày", "dong-da", 35000, 5, "Bánh", "/food-images/banh-day-dfb1ac36.jpg"),
  meal("nem-nuong", "Nem nướng", "hoan-kiem", 50000, 5, "Món khác", "/food-images/nem-nuong-1467740f.jpg"),
  meal("banh-xeo", "Bánh xèo", "hoan-kiem", 40000, 5, "Bánh", "/food-images/banh-xeo-e624253c.jpg"),
  meal("banh-bot-loc", "Bánh bột lọc", "hoan-kiem", 40000, 5, "Bánh", "/food-images/banh-bot-loc-5025307d.jpg"),
  meal("nem-chua-ran", "Nem chua rán", "dong-da", 35000, 5, "Món khác", "/food-images/nem-chua-ran-4d9beabf.jpg"),
  meal("nom-sua", "Nộm sứa", "hoan-kiem", 40000, 5, "Món khác", "/food-images/nom-sua-c5954ba2.jpg"),
  meal("nem-tai", "Nem tai", "hoan-kiem", 40000, 5, "Món khác", "/food-images/nem-tai-3690c101.jpg"),
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
