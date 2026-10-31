"use client";
import {useEffect,useRef,useState} from "react";
export default function HeroVideo({poster}:{poster:string}) {
 const video=useRef<HTMLVideoElement>(null);
 const [playing,setPlaying]=useState(false);
 const [available,setAvailable]=useState(true);
 useEffect(()=>{
  const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
  const sync=()=>{if(preference.matches)video.current?.pause();else void video.current?.play().catch(()=>{});};
  sync();preference.addEventListener("change",sync);
  return ()=>preference.removeEventListener("change",sync);
 },[]);
 return <>{available&&<video ref={video} className="hero-video" data-playing={playing} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true" tabIndex={-1} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setAvailable(false)}><source src="/brand/hero-meal.mp4" type="video/mp4" onError={()=>setAvailable(false)}/></video>}<div className="hero-edge-blur" aria-hidden="true"/>{available&&<button type="button" className="hero-video-toggle" onClick={()=>{if(playing)video.current?.pause();else void video.current?.play().catch(()=>{});}}>{playing?"Dừng video nền":"Phát video nền"}</button>}</>;
}

