"use client";
import {useEffect,useRef} from "react";
import {useAppRouter} from "./navigation";
export default function PilotDisclaimer({autoOpen=false}:{autoOpen?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),automatic=useRef(false),router=useAppRouter();
 useEffect(()=>{if(!autoOpen)return;let accepted=false;try{accepted=sessionStorage.getItem("bc-disclaimer-v1")==="yes";}catch{}if(!accepted&&!dialog.current?.open){automatic.current=true;dialog.current?.showModal();}},[autoOpen]);
 const close=()=>{dialog.current?.close();if(automatic.current)document.getElementById("content")?.focus();else opener.current?.focus();};
 const back=()=>{const wasAutomatic=automatic.current;close();if(wasAutomatic)router.push("/");};
 return <><button type="button" className="text-button trial-information" onClick={e=>{automatic.current=false;opener.current=e.currentTarget;dialog.current?.showModal();}}>Thông tin thử nghiệm</button><dialog ref={dialog} className="pilot-disclaimer" aria-labelledby="disclaimer-title" onCancel={e=>{e.preventDefault();back();}}><h2 id="disclaimer-title">Bếp Núc đang trong giai đoạn thử nghiệm</h2><p>sản phẩm này là sản phẩm chưa thương mại hoá, các bạn vui lòng chờ thông báo mới nhất từ chúng mình nhé!</p><p>Chưa mở nhận đơn thanh toán trực tiếp từ thực đơn tham khảo. Bạn vẫn có thể gửi yêu cầu đặt món. Thực đơn và giá đang được xác nhận với cửa hàng. Chỉ chuyển khoản sau khi Bếp Núc xác nhận có món, thời gian nhận/giao và tổng tiền.</p><button onClick={()=>{try{sessionStorage.setItem("bc-disclaimer-v1","yes");}catch{}close();}}>Đã hiểu, xem thực đơn</button><button className="secondary" onClick={back}>Quay lại</button></dialog></>;
}
