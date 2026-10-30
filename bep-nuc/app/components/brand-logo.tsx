"use client";
import {useState} from "react";
export default function BrandLogo({className=""}:{className?:string}){const [failed,setFailed]=useState(false);return <span className={`brand-logo ${className}`}>{failed?<span>Bếp Núc</span>:<img src="/brand/bep-nuc-wordmark.png" alt="Bếp Núc" width="1774" height="887" onError={()=>setFailed(true)}/>}</span>;}
