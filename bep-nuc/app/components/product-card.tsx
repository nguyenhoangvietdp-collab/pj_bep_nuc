import type {ReactNode} from "react";
import Link from "./navigation";
import {money} from "../../lib/commerce";

// One card for reference dishes, near-date templates and real lots: image, discount, name, spec, price, action.
export default function ProductCard({href,name,spec,price,original,discount,media,action,credit,note,foodId,referenceId}:{
  href:string;name:string;spec:string;price:number;original?:number;discount?:number;media:ReactNode;action:ReactNode;credit?:string;note?:ReactNode;foodId?:string;referenceId?:string;
}){
  return <article className="pcard" data-food-id={foodId} data-reference-id={referenceId}>
    <div className="pcard-media">{media}{!!discount&&<span className="pcard-badge">-{discount}%</span>}</div>
    {/* The name link stretches over the image, so the card has one detail tab stop. */}
    <h3 className="pcard-name"><Link href={href}>{name}</Link></h3>
    <p className="pcard-spec">{spec}</p>
    <p className="pcard-price"><strong>{money(price)}</strong>{!!original&&original>price&&<del><span className="visually-hidden">Giá gốc </span>{money(original)}</del>}</p>
    {note}
    <div className="pcard-action">{action}</div>
    {credit&&<p className="pcard-credit">{credit}</p>}
  </article>;
}
