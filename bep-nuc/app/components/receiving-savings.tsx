"use client";
import {useEffect,useRef,useState} from "react";
import HelpTip from "./help-tip";
import {apiFetch} from "../../lib/mvp-client";
import {money} from "../../lib/commerce";
import type {CheckoutSelection} from "../../lib/checkout-selection";
import type {PickupPricing} from "../../lib/pickup-pricing";
import type {PaymentAmounts} from "../../lib/payment-summary";
import type {PublicTradingRules} from "../../lib/trading";

export function useReceivingPreview(listingId:string|undefined,qty:number,rate:number,placeId:string|undefined,method:string,userId?:string,checkout?:CheckoutSelection){
 const inputs=JSON.stringify([userId,listingId,qty,rate,placeId,method,checkout]),context=useRef({inputs,version:0});
 if(context.current.inputs!==inputs)context.current={inputs,version:context.current.version+1};
 const key=`${context.current.version}:${inputs}`;
 const current=useRef(key),attempted=useRef(""),inFlight=useRef(""),sequence=useRef(0);current.current=key;
 const [state,setState]=useState<{key:string;busy?:boolean;error?:string;value?:{amounts:PaymentAmounts;pickupStatus:string;validUntil:number;distance?:number|null;checkedAt?:number;pickupPricing?:PickupPricing}}>({key:""});
 const visible=state.key===key?state:undefined;
 async function calculate(){
  if(!listingId||inFlight.current===key)return;
  const requestKey=key,requestSequence=++sequence.current;attempted.current=key;inFlight.current=key;setState({key,busy:true});
  try{
   const r=await apiFetch("/api/pilot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"preview_receiving",args:{listingId,qty,rate,checkout,key:crypto.randomUUID()}}),signal:AbortSignal.timeout(12000)});
   const d=await r.json();if(!r.ok)throw Error(d.error||"Chưa tính được hỗ trợ tự lấy.");
   if(current.current===requestKey&&sequence.current===requestSequence)setState({key:requestKey,value:d});
  }catch(e){if(current.current===requestKey&&sequence.current===requestSequence)setState({key:requestKey,error:(e as Error).message});}finally{if(inFlight.current===requestKey)inFlight.current="";}
 }
 useEffect(()=>{if(!listingId||method!=="pickup")return;const timer=setTimeout(()=>{if(attempted.current!==key)void calculate();},350);return()=>clearTimeout(timer);},[key]);
 return {preview:visible?.value&&visible.value.validUntil>Date.now()?visible.value:undefined,busy:!!visible?.busy,error:visible?.error,calculate};
}
export default function ReceivingSavings({rules,hasSource=false,signedIn=false,method="pickup",committed=false,preview,busy,error,calculate}:{rules?:PublicTradingRules;hasSource?:boolean;signedIn?:boolean;method?:"pickup"|"delivery";committed?:boolean;preview?:{amounts:PaymentAmounts;pickupStatus:string;distance?:number|null;checkedAt?:number;pickupPricing?:PickupPricing};busy?:boolean;error?:string;calculate?:()=>void}){
 const [elapsed,setElapsed]=useState(0),[sound,setSound]=useState(false),audio=useRef<AudioContext|null>(null),played=useRef("");
 const active=method==="pickup"&&committed,calculated=active&&!busy&&preview?.pickupStatus==="calculated";
 const reward=calculated&&preview.amounts.bonusDiscount>0,progress=busy?Math.min(90,Math.floor(90*(1-Math.exp(-elapsed/2000)))):calculated?100:undefined;
 const rewardKey=reward?`${preview.checkedAt}:${preview.amounts.bonusDiscount}:${preview.distance}`:"";
 useEffect(()=>{if(!busy||!active)return;setElapsed(0);const start=Date.now(),timer=setInterval(()=>setElapsed(Date.now()-start),100);return()=>clearInterval(timer);},[busy,active]);
 useEffect(()=>()=>{audio.current?.close().catch(()=>{});},[]);
 useEffect(()=>{
  if(!rewardKey||!sound||!audio.current||played.current===rewardKey)return;
  played.current=rewardKey;
  try{const ctx=audio.current,start=ctx.currentTime;[1046.5,1568].forEach((frequency,i)=>{const note=ctx.createOscillator(),gain=ctx.createGain(),at=start+i*.09;note.type="sine";note.frequency.value=frequency;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.035,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+.2);note.connect(gain);gain.connect(ctx.destination);note.start(at);note.stop(at+.22);note.onended=()=>{note.disconnect();gain.disconnect();};});}catch{}
 },[rewardKey,sound]);
 const notice=method==="delivery"?"Bạn đang chọn giao hàng: voucher cơ bản vẫn giữ, voucher tự lấy không áp dụng.":!committed?"Chọn tự lấy và xác nhận cách nhận để xem khoản giảm thêm.":(rules?.enabled===false||preview?.pickupStatus==="disabled")?"Voucher tự lấy chưa được cấp ngân sách; chưa trừ thêm vào tiền hàng.":"Voucher tự lấy được cộng riêng vào voucher cơ bản.";
 return <section className="receiving-savings" aria-label="Voucher tự lấy cộng thêm" aria-busy={active&&!!busy}><div className="help-heading"><h3>Tự lấy, tiết kiệm thêm</h3><HelpTip title="Cách tính voucher tự lấy"><p>Voucher tự lấy bằng 5% giá trước voucher cơ bản.</p><p>Khoản áp dụng nằm trong ngân sách và biên còn lại, cộng riêng vào voucher cơ bản. Chuyển sang giao hàng chỉ bỏ khoản tự lấy.</p></HelpTip></div>
 <p>{notice}</p>
 {active&&progress!==undefined&&<div className="pickup-calculation"><div className="pickup-progress-caption"><span>{busy?"Đang tính ưu đãi":"Đã tính xong ưu đãi"}</span><b aria-hidden="true">{progress}%</b></div><div className="pickup-progress" role="progressbar" aria-label="Tiến trình tính voucher tự lấy" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-valuetext={busy?`${progress} phần trăm, tiến trình ước tính; đang chờ kết quả`:`100 phần trăm, đã có kết quả`}><span style={{width:`${progress}%`}}/></div>{busy&&<small>Tiến trình ước tính. Hoàn tất khi có kết quả kiểm tra.</small>}</div>}
 {reward&&<div className="pickup-reward-ticket" key={rewardKey} role="status"><div className="pickup-ticket-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><span>Tìm thấy ưu đãi tự lấy</span></div><strong>+{money(preview.amounts.bonusDiscount)}</strong><p>Voucher tự lấy dự kiến</p><small>Cộng thêm vào voucher cơ bản.<br/>Số tiền được chốt trong báo giá.</small></div>}
 {preview?.pickupPricing?.limited&&active&&<HelpTip title="Vì sao mức tự lấy được giới hạn?"><p>Theo công thức: {money(preview.pickupPricing.nominal)}. Thực áp: {money(preview.pickupPricing.applied)} — {preview.pickupPricing.limit==="funding"?"chương trình chưa có ngân sách":"đã giới hạn theo ngân sách và biên"}.</p></HelpTip>}
 {calculated&&!reward&&<p className="pickup-no-reward" role="status">Chưa có khoản cộng thêm khả dụng; voucher cơ bản vẫn giữ.</p>}
 {hasSource&&signedIn&&active&&<><button type="button" className="secondary" disabled={busy} onClick={calculate}>{busy?"Đang tính…":error?"Thử tính lại voucher tự lấy":"Tính voucher tự lấy cộng thêm"}</button><label className="pickup-sound"><input type="checkbox" checked={sound} onChange={e=>{const enabled=e.target.checked;setSound(enabled);if(enabled){try{audio.current??=new AudioContext();audio.current.resume().catch(()=>{});}catch{setSound(false);}}}}/><span>Âm “ting” khi tìm thấy ưu đãi</span></label></>}
 {error&&method==="pickup"&&<p role="alert">{error}</p>}</section>;
}
