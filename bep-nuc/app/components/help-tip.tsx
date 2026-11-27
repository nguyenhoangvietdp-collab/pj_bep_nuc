"use client";
import {useId,useRef,useState,type ReactNode} from "react";
import {createPortal} from "react-dom";

export default function HelpTip({title,children}:{title:string;children:ReactNode}){
  const [open,setOpen]=useState(false),id=useId(),opener=useRef<HTMLButtonElement|null>(null);
  return <><button ref={opener} type="button" className="help-tip" aria-label={title} aria-haspopup="dialog" onClick={()=>setOpen(true)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 8.8a2.5 2.5 0 0 1 5 .4c0 1.8-2.5 2-2.5 3.8M12 16v.2"/></svg></button>{open&&createPortal(<dialog className="pilot-disclaimer contextual-help" aria-labelledby={id} ref={node=>{if(node&&!node.open)node.showModal();}} onClose={()=>{setOpen(false);opener.current?.focus();}} onClick={e=>{if(e.target===e.currentTarget)e.currentTarget.close();}}><h2 id={id}>{title}</h2>{children}<form method="dialog"><button>Đóng</button></form></dialog>,document.body)}</>;
}
