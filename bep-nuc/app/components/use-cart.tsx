"use client";
import {useEffect,useState} from "react";
import {addToCart,cartKey,cartMaxQty,parseCart,type CartLine} from "../../lib/cart";

const changed="bn-cart-change";
let memory:string|null=null; // used when the browser blocks storage
function read(){try{return parseCart(localStorage.getItem(cartKey));}catch{return parseCart(memory);}}

export function useCart(){
  const [lines,setLines]=useState<CartLine[]>([]),[ready,setReady]=useState(false);
  useEffect(()=>{
    const sync=()=>setLines(read());
    sync();setReady(true);
    window.addEventListener(changed,sync);window.addEventListener("storage",sync);
    return()=>{window.removeEventListener(changed,sync);window.removeEventListener("storage",sync);};
  },[]);
  const update=(next:(current:CartLine[])=>CartLine[])=>{
    memory=JSON.stringify(next(read()));
    try{localStorage.setItem(cartKey,memory);}catch{}
    window.dispatchEvent(new Event(changed));
  };
  return {lines,ready,update};
}

export function AddToCartButton({id,name,qty=1}:{id:string;name:string;qty?:number}){
  const {lines,update}=useCart(),[added,setAdded]=useState(false);
  const inCart=lines.find(l=>l.id===id)?.qty??0,full=inCart>=cartMaxQty;
  useEffect(()=>{if(!added)return;const timer=setTimeout(()=>setAdded(false),1600);return()=>clearTimeout(timer);},[added]);
  return <button type="button" className="add-to-cart" disabled={full} aria-label={`Thêm ${name} vào giỏ`} onClick={()=>{update(current=>addToCart(current,id,qty));setAdded(true);}}>
    <span aria-live="polite">{full?`Đủ ${cartMaxQty} trong giỏ`:added?"✓ Đã thêm":inCart?`Thêm nữa (${inCart})`:"Thêm vào giỏ"}</span>
  </button>;
}

// Quantity + add button for detail pages.
export function BuyBox({id,name}:{id:string;name:string}){
  const [qty,setQty]=useState(1);
  return <div className="buy-box">
    <label>Số lượng<select value={qty} onChange={e=>setQty(Number(e.target.value))}>{Array.from({length:cartMaxQty},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}</option>)}</select></label>
    <AddToCartButton id={id} name={name} qty={qty}/>
    <a className="text-button" href={typeof window!=="undefined"&&process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET==="cloudflare"?"#/cart":"/cart"}>Xem giỏ hàng</a>
  </div>;
}
