"use client";
import { validatePublicConfig } from "./public-config";
import { createClient } from "@supabase/supabase-js";
import { isCloudMvp, readAppLocation, safeAppPath } from "./app-navigation";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let auth:ReturnType<typeof createClient>|undefined;
export function mvpConfigured(){return validatePublicConfig(url,key);}
export function mvpAuth(){
 if(!url||!key)throw new Error("Bếp Núc chưa hoàn tất kết nối dịch vụ.");
 auth??=createClient(url,key,{auth:{flowType:"pkce",persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 return auth;
}
export async function apiFetch(path:string,init:RequestInit={}) {
 if(!isCloudMvp)return fetch(path,init);
 if(!["/api/catalogue","/api/auth","/api/pilot","/api/export"].includes(path))throw new Error("API không hợp lệ");
 const client=mvpAuth();const {data:{session}}=await client.auth.getSession();
 const headers=new Headers(init.headers);headers.set("apikey",key!);
 if(session)headers.set("Authorization","Bearer "+session.access_token);
 return fetch(url+"/functions/v1/bep-nuc/"+path.slice(5),{...init,headers,credentials:"omit",signal:init.signal??AbortSignal.timeout(12000)});
}
export async function googleLogin(returnTo?:string){
 const current=readAppLocation();const target=safeAppPath(returnTo||current.pathname+current.search);
 sessionStorage.setItem("bc-oauth-return",target==="/login"?"/meals":target);
 const redirectTo=window.location.origin+window.location.pathname;
 const {error}=await mvpAuth().auth.signInWithOAuth({provider:"google",options:{redirectTo}});
 if(error)throw new Error("Chưa mở được đăng nhập Google. Vui lòng thử lại.");
}
export async function finishGoogleLogin(){
 const params=new URLSearchParams(window.location.search);
 if(params.has("error")){window.history.replaceState(null,"",window.location.pathname+"#/login");throw new Error("Đăng nhập chưa hoàn tất. Bạn có thể thử lại bằng Google.");}
 const code=params.get("code");if(!code)return;
 const {error}=await mvpAuth().auth.exchangeCodeForSession(code);
 const target=safeAppPath(sessionStorage.getItem("bc-oauth-return"));sessionStorage.removeItem("bc-oauth-return");
 window.history.replaceState(null,"",window.location.pathname+"#"+(error?"/login":target));
 if(error)throw new Error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Hãy đăng nhập lại.");
}
export async function logoutMvp(){const {error}=await mvpAuth().auth.signOut();if(error)throw new Error("Chưa đăng xuất được. Vui lòng thử lại.");window.location.hash="/";}
