import test from "node:test";
import assert from "node:assert/strict";
import {receiveLotImage} from "../lib/lot-images";
import {modernDemoState} from "../lib/domain";
test("lot image uploads require approved staff and reject spoofed file types",async()=>{
 const s=modernDemoState(Date.now());let calls=0;const transaction=async<T>(fn:(state:typeof s)=>T)=>fn(s),upload=async()=>{calls++;return "https://example.supabase.co/storage/v1/object/public/bep-nuc-lots/00000000-0000-4000-8000-000000000000.png";};
 const valid=()=>new Request("https://test/image",{method:"POST",headers:{"Content-Type":"image/png"},body:new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0,0])});
 await assert.rejects(receiveLotImage(valid(),"student",transaction,upload),/đã duyệt/);
 await assert.rejects(receiveLotImage(new Request("https://test/image",{method:"POST",headers:{"Content-Type":"image/png"},body:"<svg>untrusted</svg>"}),"ops",transaction,upload),/định dạng/);
 await assert.rejects(receiveLotImage(new Request("https://test/image",{method:"POST",headers:{"Content-Type":"image/svg+xml"},body:"<svg/>"}),"ops",transaction,upload),/JPEG/);
 const result=await receiveLotImage(valid(),"ops",transaction,upload);assert.ok(result.image.endsWith(".png"));assert.equal(calls,1);assert.equal(s.audit.filter(x=>x.action==="image_upload").length,1);
});
test("lot photo limits reject oversized images and cap staff upload attempts",async()=>{
 const s=modernDemoState(Date.now()),transaction=async<T>(fn:(state:typeof s)=>T)=>fn(s);let uploaded=false;
 const make=(bytes:Uint8Array)=>new Request("https://test/image",{method:"POST",headers:{"Content-Type":"image/jpeg"},body:new Uint8Array(bytes).buffer});
 await assert.rejects(receiveLotImage(make(new Uint8Array(2*1024*1024+1)),"ops",transaction,async()=>{uploaded=true;return "unused";}),/2MB/);assert.equal(uploaded,false);
 for(let i=0;i<20;i++)s.audit.push({id:String(i),at:Date.now(),actor:"ops",action:"image_upload",detail:{}});
 const jpg=new Uint8Array(20);jpg.set([255,216,255]);await assert.rejects(receiveLotImage(make(jpg),"ops",transaction,async()=>{uploaded=true;return "unused";}),/hôm nay/);assert.equal(uploaded,false);
});
