"use client";
import {useState} from "react";
import Link from "./navigation";
import {SiteHeader,SiteFooter} from "./site-frame";
import ShopNav from "./product-directory";
import CheckoutVouchers from "./checkout-vouchers";
import FulfillmentChoice from "./fulfillment-choice";
import PaymentSummary from "./payment-summary";
import {useCart} from "./use-cart";
import {money} from "../../lib/commerce";
import {cartCount,cartMaxQty,cartTotals,pickupGroups,removeFromCart,setCartQty} from "../../lib/cart";

const vouchers=[0,.15,.1,9000];
const voucherName=(rate:number)=>rate===0?"Không dùng voucher":rate===9000?"9.000đ":`${rate*100}%`;

export default function CartPage(){
  const {lines,ready,update}=useCart();
  const [rate,setRate]=useState(0),[method,setMethod]=useState<"pickup"|"delivery">("pickup");
  const {rows,amounts,voucherLine}=cartTotals(lines,rate,method),groups=pickupGroups(rows);
  const options=vouchers.map(value=>({value:String(value),label:voucherName(value),detail:"",discount:cartTotals(lines,value,method).amounts.voucherDiscount}));
  const applied=rows.find(r=>r.line.id===voucherLine);
  return <div className="site-frame commerce commerce-cart" id="top">
    <SiteHeader/>
    <ShopNav/>
    <main id="content" tabIndex={-1}><div className="market-content">
      <h1>Giỏ hàng</h1>
      {!ready?<p role="status">Đang mở giỏ hàng…</p>:!rows.length?<section className="market-empty"><h3>Giỏ hàng đang trống</h3><p>Chọn món hoặc sản phẩm rồi bấm "Thêm vào giỏ".</p><Link className="button-link" href="/meals">Xem sản phẩm</Link></section>:
      <div className="cart-layout">
        <div className="cart-main">
          {groups.length>1&&<p className="cart-points" role="status">Giỏ này có {groups.length} điểm nhận khác nhau.</p>}
          {groups.map(group=><section className="cart-group" key={group.key} aria-label={group.name}>
            <header><h2>{group.name}</h2>{group.address&&<p>{group.address}</p>}</header>
            <ul>{group.rows.map(({line,product,amounts:a})=><li key={line.id}>
              {product.image?<img src={product.image} alt="" width="80" height="80"/>:<span className="cart-no-image">Chưa có ảnh</span>}
              <div className="cart-line-info">
                <h3><Link href={`/meals/${line.id}`}>{product.name}</Link></h3>
                <p>{product.spec} · {money(product.unitPrice)}</p>
                {product.image&&<p className="cart-credit">Ảnh minh họa{product.imageCredit&&` · ${product.imageCredit}`}</p>}
                {voucherLine===line.id&&<p className="cart-flag">Voucher −{money(a.voucherDiscount)}</p>}
                {a.bonusDiscount>0&&<p className="cart-flag">Tự lấy −{money(a.bonusDiscount)}</p>}
              </div>
              <div className="cart-stepper" role="group" aria-label={`Số lượng ${product.name}`}>
                <button type="button" className="secondary" aria-label={`Giảm số lượng ${product.name}`} disabled={line.qty<=1} onClick={()=>update(c=>setCartQty(c,line.id,line.qty-1))}>−</button>
                <output>{line.qty}</output>
                <button type="button" className="secondary" aria-label={`Tăng số lượng ${product.name}`} disabled={line.qty>=cartMaxQty} onClick={()=>update(c=>setCartQty(c,line.id,line.qty+1))}>+</button>
              </div>
              <strong className="cart-line-total">{money(a.total)}</strong>
              <button type="button" className="text-button cart-remove" aria-label={`Xóa ${product.name}`} onClick={()=>update(c=>removeFromCart(c,line.id))}>Xóa</button>
            </li>)}</ul>
          </section>)}
          <p className="fine">Mỗi sản phẩm tối đa {cartMaxQty} đơn vị mua.</p>
        </div>
        <aside className="cart-summary checkout-summary request-bill" aria-label="Hóa đơn dự tính">
          <CheckoutVouchers ready request value={String(rate)} options={options} change={v=>setRate(Number(v))}/>
          {rate!==0&&<p role="status" className="fine">{applied?`Áp vào ${applied.product.name}, món được giảm nhiều nhất.`:"Chưa có món nào trong giỏ đủ điều kiện dùng voucher này."}</p>}
          <FulfillmentChoice name="cart-method" value={method} change={setMethod}/>
          <PaymentSummary amounts={amounts} qty={cartCount(lines)} unit="đơn vị mua" method={method} mode="request" voucher={rate!==0&&!applied?`${voucherName(rate)} · chưa áp dụng`:voucherName(rate)} average={false}/>
          <p className="bill-status">Giỏ hàng đặt thử chỉ tính tiền. Chưa gửi đơn, giữ hàng hoặc thu tiền.</p>
        </aside>
      </div>}
    </div></main>
    <SiteFooter/>
  </div>;
}
