"use client";
import {useRef} from "react";
import {appHref} from "../../lib/app-navigation";
import {useAppPathname} from "./navigation";
import {departments,departmentOf,directoryHref} from "../../lib/directory";
import {cartCount} from "../../lib/cart";
import {useCart} from "./use-cart";

// Plain anchors: a hash change (static site) or a page load (Next) both make Market re-read its filters.
export function DirectoryTree({category,all=false,counts,onNavigate}:{category?:string;all?:boolean;counts?:(value:string)=>number;onNavigate?:()=>void}){
  const open=category===undefined?undefined:category||all?departmentOf(category).key:undefined;
  return <ul className="directory-tree">{departments.map(department=>{
    const expanded=category===undefined||open===department.key;
    const current=open===department.key&&category===department.value;
    return <li key={department.key}>
      <a className="directory-department" href={appHref(directoryHref(department.value))} aria-current={current?"page":undefined} onClick={onNavigate}>
        {department.label}{counts&&<span>{counts(department.value)}</span>}
      </a>
      {expanded&&!!department.children.length&&<ul>{department.children.map(child=><li key={child.value}>
        <a href={appHref(directoryHref(child.value))} aria-current={category===child.value?"page":undefined} onClick={onNavigate}>{child.label}{counts&&<span>{counts(child.value)}</span>}</a>
      </li>)}</ul>}
    </li>;
  })}</ul>;
}

export function Breadcrumb({category,name}:{category:string;name?:string}){
  const department=departmentOf(category),child=department.children.find(c=>c.value===category);
  const trail=[{label:"Sản phẩm",href:"/meals"},{label:department.label,href:directoryHref(department.value)},...(child?[{label:child.label,href:directoryHref(child.value)}]:[]),...(name?[{label:name,href:""}]:[])];
  return <nav className="breadcrumb" aria-label="Đường dẫn"><ol>{trail.map((item,index)=><li key={item.label}>
    {index===trail.length-1?<span aria-current="page">{item.label}</span>:<a href={appHref(item.href)}>{item.label}</a>}
  </li>)}</ol></nav>;
}

export function SubcategoryPills({category,all}:{category:string;all:boolean}){
  const department=departmentOf(category);
  if(!department.children.length)return null;
  return <nav className="subcategory-pills" aria-label={`Danh mục con ${department.label}`}>
    {[{value:department.value,label:"Tất cả"},...department.children].map(item=><a key={item.value} href={appHref(directoryHref(item.value))} aria-current={category===item.value&&(all||!!category)?"page":undefined}>{item.label}</a>)}
  </nav>;
}

// Rendered by the buying pages themselves, never by the shared header.
export default function ShopNav(){
  const path=useAppPathname();
  const dialog=useRef<HTMLDialogElement>(null);
  const count=cartCount(useCart().lines);
  const cartLink=<a className="cart-link" href={appHref("/cart")} aria-current={path==="/cart"?"page":undefined}>Giỏ hàng <span className="cart-count">{count}</span></a>;
  const openDirectory=()=>dialog.current?.showModal();
  const close=()=>dialog.current?.close();
  return <>
    <div className="shop-bar"><div><button type="button" onClick={openDirectory} aria-haspopup="dialog"><span aria-hidden="true">☰</span> Danh mục sản phẩm</button>{cartLink}</div></div>
    <dialog className="directory-dialog" ref={dialog} aria-labelledby="directory-title" onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div>
        <header><h2 id="directory-title">Danh mục sản phẩm</h2><button type="button" className="secondary" onClick={close}>Đóng</button></header>
        <DirectoryTree onNavigate={close}/>
      </div>
    </dialog>
    <nav className="shop-tabbar" aria-label="Điều hướng mua sắm">
      <a href={appHref("/meals")} aria-current={path==="/meals"?"page":undefined}>Sản phẩm</a>
      <button type="button" onClick={openDirectory} aria-haspopup="dialog">Danh mục</button>
      {cartLink}
      <a href={appHref("/orders")} aria-current={path.startsWith("/orders")?"page":undefined}>Đơn hàng</a>
    </nav>
  </>;
}
