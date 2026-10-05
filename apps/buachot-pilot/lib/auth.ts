import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { demo, transaction } from "./store";
export async function client() {
  const jar = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Chưa cấu hình Supabase");
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (items) => {
        for (const { name, value, options } of items)
          jar.set(name, value, options);
      },
    },
  });
}
export async function identity() {
  const jar = await cookies();
  if (demo()) {
    const host = new URL(process.env.APP_URL || "http://127.0.0.1:3200")
      .hostname;
    if (!["127.0.0.1", "localhost"].includes(host))
      throw new Error("Demo chỉ chạy trên localhost");
    return jar.get("bc_demo")?.value || "student";
  }
  const auth = await client();
  const { data, error } = await auth.auth.getUser();
  if (error || !data.user) throw new Error("Cần đăng nhập");
  const id = data.user.id;
  await transaction((s) => {
    if (!s.users.some((u) => u.id === id))
      s.users.push({
        id,
        name: data.user!.email || id,
        role: "student",
        approved: false,
      });
  });
  return id;
}
