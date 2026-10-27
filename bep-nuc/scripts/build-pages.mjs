import { createHash } from "node:crypto";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const target=process.argv[2]==="mvp"?"mvp-site":"pages-site";
if(target==="mvp-site" && existsSync(path.join(root,".env.mvp.local")))process.loadEnvFile(path.join(root,".env.mvp.local"));
const base = target==="mvp-site"?"":process.env.PAGES_BASE_PATH ?? "/pj_bep_nuc";
if (base && !/^\/[A-Za-z0-9_-]+$/.test(base)) throw new Error("PAGES_BASE_PATH must be empty or /repository-name");
if(target==="mvp-site"){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(url||key){
  if(!url||!key||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))throw new Error("Invalid or incomplete public Supabase configuration");
  const anon=(()=>{try{return JSON.parse(Buffer.from(key.split(".")[1],"base64url").toString()).role==="anon";}catch{return false;}})();
  if(!key.startsWith("sb_publishable_")&&!anon)throw new Error("Only publishable/anon keys may be bundled");
 }
}
const publicDir = path.join(root, target,"public");
await mkdir(publicDir, { recursive: true });
for (const name of ["fonts", "food-images"]) await cp(path.join(root, "public", name), path.join(publicDir, name), { recursive: true });
let css = "";
for (const file of ["app/style.css", "app/commerce.css", "app/frame.css", "mvp-site/mvp.css"]) css += await readFile(path.join(root, file), "utf8") + "\n";
css = css.replaceAll('url("/fonts/', `url("${base}/fonts/`);
const stylesheet = `theme-${createHash("sha256").update(css).digest("hex").slice(0, 12)}.css`;
await writeFile(path.join(publicDir, stylesheet), css);
await writeFile(path.join(publicDir, ".nojekyll"), "");
const result = spawnSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", target], { cwd: root, stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_DEPLOYMENT_TARGET:target==="mvp-site"?"cloudflare":"landing", PAGES_BASE_PATH: base, PAGES_STYLE_HREF: `${base}/${stylesheet}` } });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
if(result.status===0&&target==="mvp-site"){
 const output=path.join(root,target,"out");
 const hashes=new Set();
 for(const file of ["index.html","404.html"]){
  const html=await readFile(path.join(output,file),"utf8");
  for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) if(match[1])hashes.add("'sha256-"+createHash("sha256").update(match[1]).digest("base64")+"'");
 }
 const api=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const connect=api?new URL(api).origin:"";
 const csp=`default-src 'self'; script-src 'self' ${[...hashes].join(" ")}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ${connect}; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`;
 if(csp.length>1800)throw new Error("CSP exceeds the static hosting header budget");
 await writeFile(path.join(output,"_headers"),`/*\n  Content-Security-Policy: ${csp}\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Permissions-Policy: geolocation=(), camera=(), microphone=()\n`);
}
