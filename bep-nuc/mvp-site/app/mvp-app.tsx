"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Market from "../../app/components/market";
import Link from "../../app/components/navigation";
import { SiteHeader, SiteFooter } from "../../app/components/site-frame";
import LoadingScreen from "../../app/components/loading-screen";
import { readAppLocation } from "../../lib/app-navigation";
import { finishGoogleLogin, mvpAuth, mvpConfigured } from "../../lib/mvp-client";
import CustomerHome from "../../app/components/customer-home";
const Internal=dynamic(()=>import("../../app/internal/page"),{ssr:false,loading:()=> <LoadingScreen/>});
export default function MvpApp(){
 const [route,setRoute]=useState({pathname:"/",search:""}),[ready,setReady]=useState(false),[authError,setAuthError]=useState(""),[user,setUser]=useState("guest");
 useEffect(()=>{
  let alive=true;const sync=()=>setRoute(readAppLocation());window.addEventListener("hashchange",sync);
  let unsubscribe=()=>{};
  (async()=>{
   try{
    if(mvpConfigured()){
     await finishGoogleLogin();
     const client=mvpAuth();const {data}=await client.auth.getSession();if(alive)setUser(data.session?.user.id || "guest");
     const subscription=client.auth.onAuthStateChange((_event,session)=>{if(alive)setUser(session?.user.id || "guest");});
     unsubscribe=()=>subscription.data.subscription.unsubscribe();
    }
   }catch(e){if(alive)setAuthError((e as Error).message);}
   finally{if(alive){sync();setReady(true);}}
  })();return()=>{alive=false;unsubscribe();window.removeEventListener("hashchange",sync);};
 },[]);
 useEffect(()=>{
  if(!ready)return;
  const frame=requestAnimationFrame(()=>{
   document.getElementById("content")?.focus({preventScroll:true});
   window.scrollTo(0,0);
   document.title=({"/":"Bếp Núc — Bữa cuối ngày","/meals":"Chọn bữa — Bếp Núc","/offers":"Ưu đãi — Bếp Núc","/checkout":"Kiểm tra bữa — Bếp Núc","/orders":"Đơn hàng — Bếp Núc","/login":"Đăng nhập — Bếp Núc"} as Record<string,string>)[route.pathname] || "Chi tiết — Bếp Núc";
  });return()=>cancelAnimationFrame(frame);
 },[ready,route.pathname]);
 if(!ready)return <div className="site-frame commerce"><SiteHeader/><main id="content" tabIndex={-1}><LoadingScreen/></main><SiteFooter/></div>;
 const match=route.pathname.match(/^\/(meals|shops|orders)\/([A-Za-z0-9_-]+)$/);
 const view=match?(match[1]==="meals"?"meal":match[1]==="shops"?"shop":"order"):({"/meals":"browse","/offers":"offers","/orders":"orders","/checkout":"checkout","/login":"login"} as Record<string,string>)[route.pathname];
 const key=route.pathname+route.search+":"+user;
 if(mvpConfigured()&&route.pathname==="/internal")return <Internal key={key}/>;
 if(mvpConfigured()&&view)return <>{authError&&<p className="error" role="alert">{authError}</p>}<Market key={key} view={view} id={match?.[2]}/></>;
 return <CustomerHome configured={mvpConfigured()} authError={authError} authenticated={user!=="guest"}/>;
}
