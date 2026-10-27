import { estimate } from "./commerce";

// Assumed point only; never used as a merchant address or a transaction quote.
export const assumedPickup = { lat: 21.016, lng: 105.826, label: "Điểm giả định tại Đống Đa, Hà Nội" };
export function pickupPreview(menuPrice: number, voucher: number, location: { lat: number; lng: number }) {
  if (!Number.isSafeInteger(menuPrice) || menuPrice <= 0 || ![0.07, 0.1, 0.2].includes(voucher)) throw new Error("Món hoặc voucher không hợp lệ.");
  if (!location || !Number.isFinite(location.lat) || !Number.isFinite(location.lng) || Math.abs(location.lat) > 90 || Math.abs(location.lng) > 180) throw new Error("Vĩ độ phải từ −90 đến 90, kinh độ từ −180 đến 180.");
  const rad = (n: number) => n * Math.PI / 180;
  const a = Math.sin(rad(location.lat - assumedPickup.lat) / 2) ** 2 + Math.cos(rad(location.lat)) * Math.cos(rad(assumedPickup.lat)) * Math.sin(rad(location.lng - assumedPickup.lng) / 2) ** 2;
  const distanceKm = 6371.0088 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
  const bonusRate = Math.min(distanceKm, 2) * 0.08;
  const before = estimate(menuPrice, voucher), after = estimate(menuPrice, voucher + bonusRate);
  return { distanceKm, bonusRate, baseDiscount: before.baseDiscount, voucherDiscount: before.voucherDiscount, bonusDiscount: before.total - after.total, indicativeTotal: after.total };
}
