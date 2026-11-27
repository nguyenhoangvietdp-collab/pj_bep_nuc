import type {TradingRules} from "./trading.ts";

// Owner-selected planning assumptions; loading a draft never funds or publishes it.
export const launchAssumptions = {
  version: "2026-11-04",
  stock: 3,
  receivingHours: 3,
  cost: 3000,
  margin: 1000,
  rules: {
    version: 2, enabled: false, cap15: 9000, cap10: 9000,
    fixedWeekly: 4, minimumBasket: 0, weeklyBudget: 500000,
    shippingCap: 9000, stackReceiving: true, pickupBands: [],
  } satisfies TradingRules,
};

export function launchReceivingDraft(now: number) {
  const local = (at:number) => new Date(at + 7 * 3600000).toISOString().slice(0,16);
  return {start:local(now), end:local(now + launchAssumptions.receivingHours * 3600000)};
}
