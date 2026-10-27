import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const root=new URL("../mvp-site/out/",import.meta.url);
const html=await readFile(new URL("index.html",root),"utf8"), headers=await readFile(new URL("_headers",root),"utf8");
assert.ok(headers.includes("frame-ancestors 'none'"));assert.ok(!headers.includes("script-src 'self' 'unsafe-inline'"));
assert.ok(headers.includes("geolocation=(self)"));
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(match[1])assert.ok(headers.includes("'sha256-"+createHash("sha256").update(match[1]).digest("base64")+"'"));
async function walk(dir){for(const file of await readdir(dir,{withFileTypes:true})){const url=new URL(file.name+(file.isDirectory()?"/":""),dir);assert.ok(![".env",".env.local","bc_state","node_modules"].includes(file.name));if(file.isDirectory())await walk(url);}}
await walk(root);
assert.ok(html.includes("Bếp Núc"));
console.log("MVP static artifact: CSP hashes, site content and forbidden file checks passed.");
