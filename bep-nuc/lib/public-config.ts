export function validatePublicConfig(url:string|undefined,key:string|undefined){
 if(!url&&!key)return false;
 if(!url||!key)throw new Error("Cần điền cả Supabase URL và publishable/anon key, hoặc để trống cả hai.");
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url))throw new Error("Supabase URL công khai không hợp lệ.");
 if(key.startsWith("sb_secret_"))throw new Error("Không được đưa secret key vào giao diện công khai.");
 if(key.startsWith("sb_publishable_"))return true;
 try{
  const payload=JSON.parse(atob(key.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
  if(payload.role==="anon")return true;
 }catch{}
 throw new Error("Chỉ dùng publishable key hoặc legacy anon key cho giao diện.");
}
