import CustomerHome from "./components/customer-home";

import { redirect } from "next/navigation";
import { browseUrl } from "../lib/commerce";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const search = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["q", "budget", "category", "shop", "stock", "receiving", "sort"]) {
    const value = search[key];
    if (value !== undefined) params.set(key, Array.isArray(value) ? value[0] : value);
  }
  if (params.size) redirect(browseUrl("/?" + params.toString()));
  return <CustomerHome supportEmail={process.env.SUPPORT_EMAIL}/>;
}
