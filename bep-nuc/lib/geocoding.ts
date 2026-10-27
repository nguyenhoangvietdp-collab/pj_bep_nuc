export type AddressCandidate = { address: string; lat: number; lng: number; approximate: boolean };
export class GeocodingError extends Error { constructor(message: string, public status = 503) { super(message); } }
export async function photonGeocode(address: string, fetcher: typeof fetch = fetch): Promise<AddressCandidate[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.search = new URLSearchParams({ q: address, limit: "3", lat: "21.016", lon: "105.826", bbox: "105.65,20.8,106.1,21.3" }).toString();
  let response: Response;
  try { response = await fetcher(url, { headers: { "User-Agent": "BepNuc-Pilot/1.0 (https://pj-bep-nuc.nguyenhoangvietdp.workers.dev)", "Accept": "application/json" }, signal: AbortSignal.timeout(8000) }); }
  catch { throw new GeocodingError("Chưa kết nối được dịch vụ tìm địa chỉ. Vui lòng thử lại sau."); }
  if (!response.ok) throw new GeocodingError("Dịch vụ địa chỉ tạm thời chưa sẵn sàng. Vui lòng thử lại sau.");
  let data: any; try { data = await response.json(); } catch { throw new GeocodingError("Chưa đọc được kết quả địa chỉ."); }
  if (!Array.isArray(data?.features)) throw new GeocodingError("Chưa đọc được kết quả địa chỉ.");
  const candidates: AddressCandidate[] = [];
  for (const feature of data.features.slice(0, 3)) {
    const p = feature?.properties, coords = feature?.geometry?.coordinates;
    if (!p || feature?.geometry?.type !== "Point" || !Array.isArray(coords)) continue;
    const [lng, lat] = coords;
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 20.8 || lat > 21.3 || lng < 105.65 || lng > 106.1) continue;
    const parts = [p.name, [p.housenumber, p.street].filter(v => typeof v === "string").join(" "), p.district, p.city, p.county, p.state].filter(v => typeof v === "string" && v.trim());
    const label = [...new Set(parts)].join(", ");
    if (label) candidates.push({ address: label, lat, lng, approximate: true });
  }
  if (!candidates.length) throw new GeocodingError("Chưa tìm thấy địa chỉ tại Hà Nội. Hãy thử tên đường hoặc địa danh công cộng gần nhà.", 422);
  return candidates;
}
