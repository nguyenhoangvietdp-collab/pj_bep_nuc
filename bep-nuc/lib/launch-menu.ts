import { filterMenuAssets } from "./product-assets";
import { normalize } from "./commerce";
// Owner-approved menu and prices; availability is supplied separately by real listings.
export const launchPartner = { id: "bo-to-mai-chau-198-thai-thinh", name: "BÒ TƠ MAI CHÂU", address: "198 Thái Thịnh, Đống Đa, Hà Nội" };
export const launchMenuNames = ["Bún riêu", "Bún đậu", "Bánh dày"];
export function filterLaunchMenu(query = "", category = "", budget = 0, sort = "end") {
  const shopMatches = normalize(`${launchPartner.name} ${launchPartner.address}`).includes(normalize(query));
  return filterMenuAssets(shopMatches ? "" : query, category, budget, sort).filter(p=>launchMenuNames.includes(p.name));
}
