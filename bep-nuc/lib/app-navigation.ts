export const isCloudMvp = process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET === "cloudflare";
export function safeAppPath(value: unknown) {
  if(typeof value!=="string" || !value.startsWith("/") || /[\\\x00-\x1f]/.test(value))return "/meals";
  try{
    const url=new URL(value,"https://local.invalid");
    const allowed=/^\/(?:|meals(?:\/[A-Za-z0-9_-]+)?|shops\/[A-Za-z0-9_-]+|orders(?:\/[A-Za-z0-9_-]+)?|offers|checkout|login|internal)$/;
    return url.origin==="https://local.invalid"&&allowed.test(url.pathname)?url.pathname+url.search:"/meals";
  }catch{return "/meals";}
}
export function readAppLocation() {
  if (typeof window==="undefined") return {pathname:"/",search:""};
  const url=isCloudMvp?new URL(safeAppPath(window.location.hash.slice(1)||"/"),window.location.origin):new URL(window.location.href);
  return {pathname:url.pathname,search:url.search};
}
export function appHref(href:string) { return isCloudMvp && href.startsWith("/") ? "#"+safeAppPath(href):href; }
export function replaceAppUrl(href:string) { window.history.replaceState(null,"",appHref(href)); }
