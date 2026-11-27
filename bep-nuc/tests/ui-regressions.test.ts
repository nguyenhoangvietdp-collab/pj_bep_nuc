import test from "node:test";
import ts from "typescript";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import * as React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {ReferenceCard} from "../app/components/reference-product";
import {requestProducts} from "../lib/request-catalogue";
import PaymentSummary from "../app/components/payment-summary";

Object.assign(globalThis,{React});
// Only user-visible text is scanned (strings, templates, JSX text), so ternaries and ?. never reach the regex.
function damagedText(source:string){
 const found:string[]=[];
 (function visit(node:ts.Node){
  if(ts.isStringLiteralLike(node)||ts.isTemplateHead(node)||ts.isTemplateMiddle(node)||ts.isTemplateTail(node)||ts.isJsxText(node)){
   // Drop URL query starts such as "/checkout?product=" before looking for "?" inside a word.
   if(/\p{L}\?\p{L}/u.test(node.text.replace(/\?[\w-]+=/g,"")))found.push(node.text);
  }
  ts.forEachChild(node,visit);
 })(ts.createSourceFile("x.tsx",source,ts.ScriptTarget.Latest,false,ts.ScriptKind.TSX));
 return found;
}

test("Vietnamese corruption guard catches damaged text without flagging valid TSX",()=>{
 for(const source of ['<a>T?nh gi? khi t? l?y</a>','<button>Ch?n voucher</button>','const label="Gi?m 5%";','const t=`${n} su?t`;'])assert.equal(damagedText(source).length,1,source);
 for(const source of ['const x = ok?name:value?.name ?? "";','type Props = {name?:string};','<p>{ok?name:"Chưa có"} Mua gì?</p>','<Link href="/checkout?product=flower"/>','const u=`/login?returnTo=${path}`;'])assert.deepEqual(damagedText(source),[],source);
});

test("app TSX files contain no damaged Vietnamese or replacement characters",()=>{
 for(const file of readdirSync("app",{recursive:true,encoding:"utf8"}).filter(file=>file.endsWith(".tsx"))){
  const source=readFileSync(`app/${file}`,"utf8");
  assert.deepEqual(damagedText(source),[],file);
  assert.doesNotMatch(source,/\uFFFD|Ã[\u0080-\u00BF]|á»/u,file);
 }
});

test("reference cards stay compact with one link per destination",()=>{
 for(const product of requestProducts){
  const result=renderToStaticMarkup(React.createElement(ReferenceCard,{product}));
  const links=Array.from(result.matchAll(/<a [^>]*href="([^"]+)"/g),m=>m[1]);
  assert.deepEqual(links.filter(link=>!link.startsWith("https://")),[`/meals/${product.id}`],product.id);
  assert.ok(links.filter(link=>link.startsWith("https://")).length<=1,product.id);
  assert.equal(result.split(">Thêm vào giỏ<").length,2);
  assert.match(result,/Ảnh minh họa/);
  assert.doesNotMatch(result,/Gửi yêu cầu|Chưa gồm voucher|Địa chỉ/);
 }
});

test("a sale or lot subtotal without base discount is not labelled menu or repeated",()=>{
 const result=renderToStaticMarkup(React.createElement(PaymentSummary,{amounts:{menuTotal:100000,baseDiscount:0,voucherDiscount:9000,bonusDiscount:0,total:91000}}));
 assert.doesNotMatch(result,/Giá menu|Giảm nền 5%/);
 assert.equal((result.match(/<dt>Tiền hàng trước voucher/g)||[]).length,1);
 assert.equal((result.match(/100\.000/g)||[]).length,1);
});
