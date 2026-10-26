"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Market from "../../app/components/market";
import Link from "../../app/components/navigation";
import { SiteHeader, SiteFooter } from "../../app/components/site-frame";
import LoadingScreen from "../../app/components/loading-screen";
import { readAppLocation } from "../../lib/app-navigation";
import { finishGoogleLogin, mvpAuth, mvpConfigured } from "../../lib/mvp-client";
import { productAssets } from "../../lib/product-assets";
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
 if(!ready)return <div className="site-frame commerce"><SiteHeader/><main id="content" tabIndex={-1}><LoadingScreen/></main><SiteFooter/></div>;
 const match=route.pathname.match(/^\/(meals|shops|orders)\/([A-Za-z0-9_-]+)$/);
 const view=match?(match[1]==="meals"?"meal":match[1]==="shops"?"shop":"order"):({"/meals":"browse","/orders":"orders","/checkout":"checkout","/login":"login"} as Record<string,string>)[route.pathname];
 const key=route.pathname+":"+user;
 if(mvpConfigured()&&route.pathname==="/internal")return <Internal key={key}/>;
 if(mvpConfigured()&&view)return <>{authError&&<p className="error" role="alert">{authError}</p>}<Market key={key} view={view} id={match?.[2]}/></>;
 return <div className="site-frame commerce"><SiteHeader/><main id="content" tabIndex={-1}><div className="market-content"><section className="home-intro"><p className="home-kicker">HÀ NỘI · TỰ NHẬN TẠI QUÁN</p><h1>Chọn bữa cuối ngày, nhận tại quán.</h1><p className="home-lead">Xem rõ món, giá cuối và khung nhận trước khi đặt. Ghé quán nhận bữa trong giờ đã chọn.</p>{authError&&<p className="error" role="alert">{authError}</p>}{mvpConfigured()?<Link className="button-link" href="/meals">Chọn bữa hôm nay</Link>:<p role="status"><b>Đang chuẩn bị mở bán.</b> Bếp Núc chưa hoàn tất kết nối dịch vụ đặt hàng. Bạn chưa thể tạo đơn hoặc thanh toán trên trang này.</p>}<p className="fine">Pilot đặt bữa dành cho sinh viên được mời và đã được duyệt.</p></section><section className="home-process"><h2>Cách nhận bữa</h2><ol><li><h3>Chọn món và kiểm tra giá</h3><p>Mỗi đơn một loại món, từ 1–3 suất. Chọn một voucher phù hợp.</p></li><li><h3>Giữ suất và chuyển khoản</h3><p>Chỉ chuyển theo số tiền và nội dung được xác nhận trong đơn. Chờ vận hành xác nhận tiền.</p></li><li><h3>Ghé quán nhận bữa</h3><p>Mã nhận xuất hiện sau khi xác nhận thanh toán. Đến đúng nơi và khung giờ của đơn.</p></li></ol></section><section className="mvp-photo-gallery" aria-label="Ảnh món do đội Bếp Núc cung cấp">{productAssets.slice(0,3).map(p=><figure key={p.image}><img src={p.image} alt={p.name} loading="lazy" width="480" height="320"/><figcaption>{p.name} · Ảnh đội cung cấp</figcaption></figure>)}</section><p className="fine">Ảnh giới thiệu không phải xác nhận món đang được bán. Catalogue chỉ hiển thị thông tin quán và lô hàng đã được duyệt.</p></div></main><SiteFooter/></div>;
}
