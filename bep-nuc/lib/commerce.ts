export const foodCategories = ["Cơm", "Bún/mì", "Bánh", "Đồ uống", "Món khác"];
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
  id: string;
  name: string;
  address: string;
  image?: string;
};
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
) {
  const text = normalize(query);
  return listings
    .filter((l) => {
      const shop = shops.find((s) => s.id === l.shopId);
      return (
        (!category || l.category === category) &&
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
        ? a.price - b.price || a.id.localeCompare(b.id)
        : a.end - b.end || a.id.localeCompare(b.id),
    );
}
