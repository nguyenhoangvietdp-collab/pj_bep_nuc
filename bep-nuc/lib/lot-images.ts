import {createClient} from "@supabase/supabase-js";
import type {State} from "./domain.ts";
export async function receiveLotImage(req:Request,userId:string,transaction:<T>(fn:(s:State)=>T)=>Promise<T>,upload:(bytes:Uint8Array,mime:string)=>Promise<string>){
  await transaction(s=>{const u=s.users.find(u=>u.id===userId);if(!u?.approved||(u.role!=="ops"&&!(u.role==="merchant"&&s.shops.some(x=>x.id===u.shopId&&x.approved))))throw Error("Chỉ quán đã duyệt hoặc vận hành được tải ảnh");});
  const mime=req.headers.get("content-type")?.split(";")[0];
  if(!["image/jpeg","image/png","image/webp"].includes(mime??""))throw Error("Chỉ nhận ảnh JPEG, PNG hoặc WebP");
  const limit=2*1024*1024;
  if(Number(req.headers.get("content-length")??0)>limit||!req.body)throw Error("Ảnh tối đa2MB");
  const reader=req.body.getReader(),chunks:Uint8Array[]=[];let size=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Error("Ảnh tối đa2MB");}chunks.push(value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  const signature=mime==="image/jpeg"?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:mime==="image/png"?[137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v):String.fromCharCode(...bytes.slice(0,4))==="RIFF"&&String.fromCharCode(...bytes.slice(8,12))==="WEBP";
  if(size<12||!signature)throw Error("Nội dung ảnh không khớp định dạng");
  const now=Date.now(),day=new Date(now).toISOString().slice(0,10);
  await transaction(s=>{const u=s.users.find(u=>u.id===userId);if(!u?.approved||!["ops","merchant"].includes(u.role))throw Error("Quyền tải ảnh đã đổi");const today=s.audit.filter(a=>a.action==="image_upload"&&new Date(a.at).toISOString().startsWith(day));if(today.length>=100||today.filter(a=>a.actor===userId).length>=20)throw Error("Đã hết lượt tải ảnh hôm nay");s.audit.push({id:crypto.randomUUID(),at:now,actor:userId,action:"image_upload",detail:{bytes:size}});});
  return {image:await upload(bytes,mime!)};
}
export async function storeLotImage(url:string,key:string,bytes:Uint8Array,mime:string){
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)||!key)throw Error("Chưa cấu hình nơi lưu ảnh lô");
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}),name=crypto.randomUUID()+({"image/jpeg":".jpg","image/png":".png","image/webp":".webp"}[mime]??".jpg");
  const bucket=client.storage.from("bep-nuc-lots");const {error}=await bucket.upload(name,bytes,{contentType:mime,upsert:false,cacheControl:"3600"});
  if(error)throw Error("Chưa lưu được ảnh. Kiểm tra bucket và quyền máy chủ rồi thử lại.");
  return bucket.getPublicUrl(name).data.publicUrl;
}
