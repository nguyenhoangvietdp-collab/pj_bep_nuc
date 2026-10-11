import { transaction } from "../lib/store";
const [id, role, shopId] = process.argv.slice(2);
if (!id || !["ops", "merchant"].includes(role))
  throw new Error(
    "Usage: npm run db:staff -- SUPABASE_USER_ID ops|merchant [SHOP_ID]",
  );
await transaction((s) => {
  if (role === "merchant" && !s.shops.some((x) => x.id === shopId))
    throw new Error("Shop does not exist");
  const existing = s.users.find((x) => x.id === id);
  const user = {
    id,
    name: id,
    role: role as "ops" | "merchant",
    approved: true,
    shopId: role === "merchant" ? shopId : undefined,
  };
  if (existing) Object.assign(existing, user);
  else s.users.push(user);
  s.audit.push({
    id: crypto.randomUUID(),
    at: Date.now(),
    actor: "bootstrap-cli",
    action: "staff",
    detail: { id, role, shopId },
  });
});
console.log("Staff assigned. Restart session to inspect role.");
process.exit(0);
