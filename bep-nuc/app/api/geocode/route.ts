import { createEdgeHandler } from "../../../lib/edge-api";
import { photonGeocode } from "../../../lib/geocoding";
import { transaction } from "../../../lib/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createEdgeHandler({ config: { origin: new URL(process.env.APP_URL || "http://127.0.0.1:3200").origin, policy: { production: false, pilotEnabled: false, bankReady: false }, acceptingOrders: false }, transaction, authenticate: async () => null, geocode: photonGeocode });
