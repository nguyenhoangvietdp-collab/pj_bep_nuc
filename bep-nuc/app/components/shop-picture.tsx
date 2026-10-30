"use client";
import {useState} from "react";
const ids=["bo-to-mai-chau-198-thai-thinh","mock-nguyen-chi-thanh-8","mock-giai-phong-10","mock-dien-bien-phu-30"];
export default function ShopPicture({shopId,name,image}:{shopId:string;name:string;image?:string}){const [failed,setFailed]=useState(false);const index=ids.indexOf(shopId);const src=image || (index>=0?`/shop-images/hanoi-eatery-${index+1}.jpg`:undefined);return <figure className="shop-picture">{src&&!failed?<img src={src} alt={image?`Không gian ${name}`:"Không gian hàng ăn Hà Nội — ảnh minh hoạ"} width="960" height="540" loading="lazy" onError={()=>setFailed(true)}/>:<div className="shop-photo-fallback">{name}</div>}{!image&&<figcaption>Ảnh minh hoạ</figcaption>}</figure>;}
