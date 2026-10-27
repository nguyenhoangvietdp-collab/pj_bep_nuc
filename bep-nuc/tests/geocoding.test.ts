import test from "node:test";
import assert from "node:assert/strict";
import { photonGeocode, GeocodingError } from "../lib/geocoding";

test("Photon lookup makes one encoded Hanoi request without keys and preserves candidate coordinates", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async (input, init) => {
    calls++;
    const url = new URL(String(input));
    assert.equal(url.origin, "https://photon.komoot.io");
    assert.equal(url.searchParams.get("q"), "Đường A & B, Hà Nội");
    assert.equal(url.searchParams.get("limit"), "3");
    assert.equal(url.searchParams.get("bbox"), "105.65,20.8,106.1,21.3");
    assert.ok(!url.searchParams.has("key"));
    assert.ok(new Headers(init?.headers).get("User-Agent")?.includes("BepNuc"));
    return Response.json({ features: Array.from({ length: 5 }, (_, i) => ({ properties: { name: `Địa danh ${i}`, city: "Hà Nội", street: "Tây Sơn" }, geometry: { type: "Point", coordinates: [105.82, 21.01] }, extra: "never-return" })) });
  };
  const results = await photonGeocode("Đường A & B, Hà Nội", fetcher);
  assert.equal(calls, 1);
  assert.equal(results.length, 3);
  assert.equal(results[0].lng, 105.82);
  assert.equal(results[0].lat, 21.01);
  assert.equal(results[0].approximate, true);
  assert.ok(!JSON.stringify(results).includes("never-return"));
});

test("Photon failures and out-of-area results are explicit without exposing input or raw upstream errors", async () => {
  for (const data of [{ features: [] }, { error: "private-address" }, { features: [{ properties: { name: "Xa" }, geometry: { type: "Point", coordinates: [0, 0] } }] }]) {
    await assert.rejects(photonGeocode("private-address", async () => Response.json(data)), e => e instanceof GeocodingError && !e.message.includes("private-address"));
  }
  await assert.rejects(photonGeocode("private-address", async () => { throw new Error("private-address"); }), e => e instanceof GeocodingError && !e.message.includes("private-address"));
  await assert.rejects(photonGeocode("private-address", async () => new Response("private-address", {status:429})), GeocodingError);
});
