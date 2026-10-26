"use client";
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ComponentProps } from "react";
import { appHref, isCloudMvp, readAppLocation, safeAppPath } from "../../lib/app-navigation";
export function useAppRouter() {
  const router=useRouter();
  return isCloudMvp?{push:(href:string)=>{window.location.hash=safeAppPath(href);}}:router;
}
export function useAppPathname() {
  const next=usePathname(); const [path,setPath]=useState("/");
  useEffect(()=>{if(!isCloudMvp)return; const sync=()=>setPath(readAppLocation().pathname);sync();window.addEventListener("hashchange",sync);return()=>window.removeEventListener("hashchange",sync);},[]);
  return isCloudMvp?path:next;
}
export default function Link(props:ComponentProps<typeof NextLink>) {
  if(!isCloudMvp)return <NextLink {...props}/>;
  const {href,onClick,prefetch,replace,scroll,shallow,locale,onNavigate,...rest}=props;
  const target=typeof href==="string"?href:"/meals";
  return <a {...rest} href={appHref(target)} onClick={e=>{
    onClick?.(e);
    if(!e.defaultPrevented && target.startsWith("#")) {e.preventDefault();const element=document.getElementById(target.slice(1));element?.scrollIntoView();element?.focus();}
  }}/>;
}
