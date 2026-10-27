export async function walking(
  origin: unknown,
  destination: { lat: number | null; lng: number | null },
): Promise<number | null> {
  if (
    destination.lat === null || destination.lng === null ||
    !process.env.GOOGLE_ROUTES_API_KEY ||
    !origin ||
    typeof origin !== "object"
  )
    return null;
  const { lat, lng } = origin as { lat: number; lng: number };
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  )
    return null;
  try {
    const r = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_ROUTES_API_KEY,
          "X-Goog-FieldMask": "routes.distanceMeters",
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: lat, longitude: lng } } },
          destination: {
            location: {
              latLng: { latitude: destination.lat, longitude: destination.lng },
            },
          },
          travelMode: "WALK",
          units: "METRIC",
        }),
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      },
    );
    if (!r.ok) return null;
    const data = await r.json();
    const meters = data.routes?.[0]?.distanceMeters;
    return typeof meters === "number" && meters >= 0 ? meters / 1000 : null;
  } catch {
    return null;
  }
}
