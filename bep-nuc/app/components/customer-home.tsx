"use client";
import Link from "./navigation";
import {SiteHeader,SiteFooter} from "./site-frame";
import BrandLogo from "./brand-logo";
import {productAssets} from "../../lib/product-assets";
const background=productAssets.find(p=>p.name==="Bún riêu")!.image;
export default function CustomerHome({configured=true,authError="",authenticated=false,supportEmail}:{configured?:boolean;authError?:string;authenticated?:boolean;supportEmail?:string}){
 return <div className="site-frame commerce home-page"><SiteHeader role={authenticated?"student":undefined}/><main id="content" tabIndex={-1}><section className="home-centered-hero" style={{"--hero-image":`url("${background}")`} as React.CSSProperties}><div className="hero-background" aria-hidden="true"/><div className="hero-lower-blur" aria-hidden="true"/><div className="hero-shade" aria-hidden="true"/><div className="hero-centered-content"><BrandLogo className="hero-wordmark"/><h1>Bữa cuối ngày,<br/>hợp túi tiền.</h1><p>Tìm bữa bạn thích, kiểm tra giá rồi chọn tự đến lấy hoặc giao tận nơi.</p>{authError&&<p className="error" role="alert">{authError}</p>}{configured?<Link className="button-link hero-primary" href="/meals">Chọn bữa ngay</Link>:<p role="status">Bếp Núc đang chuẩn bị kết nối dịch vụ đặt hàng.</p>}<p className="hero-caption">Xem món không cần đăng nhập. Thanh toán sau khi tài khoản và báo giá được xác nhận.</p></div></section></main><SiteFooter supportEmail={supportEmail}/></div>;
}
