"use client";
import {useEffect,useRef,useState} from "react";
import {flowerCatalogue,flowerShops,flowerLot,flowerCare,flowerImageCaption,flowerAssumptions} from "../../lib/flower-demo";
import {flowerQuantityLabel} from "../../lib/trading";
import {money,time,normalize} from "../../lib/commerce";
import {newFlowerSession,restoreFlowerSession,flowerStock,flowerVoucherRemaining,flowerDemoPrice,flowerQuoteError,reserveFlower,progressFlower,flowerOrderExpired,type FlowerDemoSession,type FlowerVoucher} from "../../lib/flower-pages-demo";

const key="bep-nuc-flowers-demo-v1";
const statusLabels={held:"Đang giữ",paid:"Đã thanh toán mô phỏng",received:"Đã nhận mô phỏng",issue:"Đã gửi phản ánh",refunded:"Đã hoàn tiền mô phỏng",cancelled:"Đã hủy"};
export default function FlowerShowcase({base="",compact=false,query="",budget=0,sort="end"}:{base?:string;compact?:boolean;query?:string;budget?:number;sort?:string}){
  const [session,setSession]=useState<FlowerDemoSession>();
  const [now,setNow]=useState(0),[shopId,setShopId]=useState(""),[selected,setSelected]=useState(""),[qty,setQty]=useState(1),[voucher,setVoucher]=useState<FlowerVoucher>("none"),[place,setPlace]=useState(""),[message,setMessage]=useState("");
  const checkout=useRef<HTMLElement>(null),intent=useRef("");
  useEffect(()=>{
    const at=Date.now();setNow(at);
    try{const s=restoreFlowerSession(localStorage.getItem(key),at);setSession(s);setPlace(s.place);localStorage.setItem(key,JSON.stringify(s));}catch{setSession(newFlowerSession(at));setMessage("Không lưu được trên thiết bị; DEMO vẫn hoạt động trong phiên này.");}
    const timer=setInterval(()=>setNow(Date.now()),1000);return ()=>clearInterval(timer);
  },[]);
  function save(s:FlowerDemoSession){setSession(s);try{localStorage.setItem(key,JSON.stringify(s));}catch{setMessage("Chưa lưu được trên thiết bị. Giữ trang mở để thử tiếp.");}}
  function perform(fn:()=>FlowerDemoSession){try{save(fn());setMessage("Đã cập nhật giao dịch mô phỏng. Không có tiền thật được thu.");}catch(e){setMessage((e as Error).message);}}
  const item=flowerCatalogue.find(x=>x.id===selected),shop=flowerShops.find(x=>x.id===item?.shopId);
  const preview=item?flowerDemoPrice(item.id,qty,voucher):undefined;
  const options:FlowerVoucher[]=["none","15","10","9k"];
  const visible=flowerCatalogue.filter(p=>(!shopId||p.shopId===shopId)&&(!budget||p.price<=budget)&&normalize(`${p.name} ${flowerShops.find(s=>s.id===p.shopId)?.name||""} ${flowerShops.find(s=>s.id===p.shopId)?.address||""}`).includes(normalize(query))).sort((a,b)=>sort==="price"?a.price-b.price:0);
  return <section id="flowers" className={`flower-showcase ${compact?"flower-showcase-embedded":""}`} aria-label="Danh mục hoa cắm nhà DEMO">
    {!compact&&<><h2 id="flower-title">Một góc nhà, một chút hoa.</h2>
    <p className="home-lead">Chọn hoa để tự cắm, xem đúng quy cách và thử đặt hàng.</p></>}
    <aside className="demo-disclosure"><strong>DEMO · KHÔNG CHUYỂN TIỀN</strong><p>Hai tiệm là hồ sơ sáng tạo. Ảnh tham khảo; tồn kho, voucher và giao dịch đều mô phỏng. Giá DEMO bằng 70% bảng tham chiếu bạn cung cấp, chưa phải giá thị trường đã xác minh.</p></aside>
    {compact?<details className="flower-shop-details"><summary>Về hai tiệm minh họa</summary>{flowerShops.map(s=><article key={s.id}><h3>{s.name}</h3><p>{s.story}</p><p className="fine">{s.address}</p></article>)}</details>:<div className="flower-shop-stories">{flowerShops.map(s=><article key={s.id}><h3>{s.name}</h3><p>{s.story}</p><p className="fine">{s.address}</p></article>)}</div>}
    <label>Chọn tiệm minh họa<select value={shopId} onChange={e=>setShopId(e.target.value)}><option value="">Cả hai tiệm</option>{flowerShops.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    {message&&<p className="market-notice" role="status">{message}</p>}
    {!session?<p role="status">Đang mở danh mục DEMO…</p>:<>
      <p className="fine">Khung nhận giả lập {time(session.startedAt)}–{time(session.startedAt+10800000)} · 3 đơn vị tồn ban đầu/mục. Không có địa điểm hoặc chỉ đường thật.</p>
      <p role="status">{visible.length} lựa chọn hoa{!visible.length?" · Hãy bỏ bớt điều kiện tìm kiếm hoặc ngân sách.":""}</p>
      <div className="food-grid">{visible.map(p=><article className="food-card" key={p.id}>
        <div className="food-image flower-image"><img src={base+p.image} alt={p.name} loading="lazy" width="600" height="600"/><span className="demo-image-label">Ảnh tham khảo · DEMO</span></div>
        <div className="food-card-body"><h3>{p.name}</h3><p>{flowerQuantityLabel(flowerLot(p,session.startedAt))}</p><p>{flowerShops.find(s=>s.id===p.shopId)?.name}</p><p className="flower-price"><strong>{money(p.price)}</strong> / đơn vị mua</p><p className="fine">Tham chiếu được cung cấp: {money(p.referencePrice)} · giảm mô phỏng 30%</p><p className="fine">{flowerImageCaption}. Không kèm bình hoặc bó tặng.</p><button disabled={flowerStock(session,p.id,now)<1||now>=session.startedAt+10800000} onClick={()=>{setSelected(p.id);setQty(1);setVoucher("none");intent.current="FLOWER-"+crypto.randomUUID();requestAnimationFrame(()=>{checkout.current?.scrollIntoView({behavior:"auto",block:"start"});checkout.current?.focus();});}}>Xem & đặt DEMO</button></div>
      </article>)}</div>
      {item&&<section className="flower-checkout" tabIndex={-1} ref={checkout} aria-label="Đặt hoa mô phỏng">
        <h3>{item.name} · đặt DEMO</h3><p><b>{shop?.name}</b> · hồ sơ sáng tạo</p><p>{flowerLot(item,session.startedAt).contents}</p><p>{item.note}</p><p className="fine">{flowerImageCaption}. Chưa kiểm tra tình trạng hàng thật.</p>
        <details><summary>Chăm hoa và gói cơ bản</summary><p>{flowerCare}</p></details>
        <label>Số đơn vị mua<select value={qty} onChange={e=>{setQty(Number(e.target.value));setVoucher("none");intent.current="FLOWER-"+crypto.randomUUID();}}>{[1,2,3].map(n=><option key={n}>{n}</option>)}</select></label>
        <p>Mỗi đơn vị: {item.quantity.amount} {item.quantity.unit}. Tồn mô phỏng còn {flowerStock(session,item.id,now)}.</p>
        <form onSubmit={e=>{e.preventDefault();if(place.trim().length<3){setMessage("Nhập vị trí minh họa ít nhất 3 ký tự.");return;}save({...session,place:place.trim()});}}><label>Vị trí minh họa để thử voucher<input value={place} onChange={e=>setPlace(e.target.value)} minLength={3} maxLength={150} placeholder="Ví dụ: Cầu Giấy — vị trí giả định" required/></label><button className="secondary">Lưu vị trí DEMO</button><p className="fine">Chỉ lưu trên thiết bị, không lấy GPS, không tính khoảng cách hoặc hỗ trợ đi lại.</p></form>
        <fieldset><legend>Voucher theo tuần Việt Nam · không cộng dồn</legend>{options.map(v=>{
          const error=flowerQuoteError(session,item.id,qty,v,now);return <label className="flower-voucher" key={v}><input type="radio" name="flower-voucher" value={v} checked={voucher===v} disabled={!!error} onChange={()=>{setVoucher(v);intent.current="FLOWER-"+crypto.randomUUID();}}/>{v==="none"?"Không dùng voucher":v==="9k"?"Giảm cố định 9.000đ":`Giảm ${v}% · tối đa 9.000đ`}{v!=="none"&&<small> · còn {Math.max(0,flowerVoucherRemaining(session,v,now))} lượt</small>}{error&&<small> — {error}</small>}</label>;
        })}</fieldset>
        <p aria-live="polite">Giá lô {money(preview!.base)} − voucher {money(preview!.discount)} = <b>{money(preview!.total)}</b>. Không có phí giao hoặc thưởng khoảng cách trong lượt thử này.</p>
        <button disabled={!!flowerQuoteError(session,item.id,qty,voucher,now)} onClick={()=>perform(()=>reserveFlower(session,item.id,qty,voucher,Date.now(),intent.current))}>Giữ hoa DEMO trong 10 phút</button>
      </section>}
      {!!session.orders.length&&<section className="flower-orders"><h3>Đơn hoa mô phỏng</h3>{session.orders.map(o=><article key={o.id}><h4>{flowerCatalogue.find(p=>p.id===o.productId)?.name} × {o.qty}</h4><p>{flowerOrderExpired(o,now)?"Hết hạn giữ · đã trả tồn và voucher":statusLabels[o.status]} · {money(o.total)}</p><p className="fine">{o.id}</p><div className="flower-order-actions">
        {o.status==="held"&&!flowerOrderExpired(o,now)&&<><button onClick={()=>perform(()=>progressFlower(session,o.id,"pay",Date.now()))}>Mô phỏng thanh toán</button><button className="secondary" onClick={()=>perform(()=>progressFlower(session,o.id,"cancel",Date.now()))}>Hủy giữ hoa</button></>}
        {o.status==="paid"&&<button onClick={()=>perform(()=>progressFlower(session,o.id,"receive",Date.now()))}>Mô phỏng nhận hoa</button>}
        {["paid","received"].includes(o.status)&&<form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);perform(()=>progressFlower(session,o.id,"issue",Date.now(),String(f.get("issue"))));}}><label>Phản ánh mô phỏng<input name="issue" minLength={5} maxLength={1000} required placeholder="Ví dụ: Lượng hoa khác mô tả"/></label><button className="secondary">Gửi phản ánh DEMO</button></form>}
        {o.status==="issue"&&<><p>{o.issue}</p><button onClick={()=>perform(()=>progressFlower(session,o.id,"refund",Date.now()))}>Mô phỏng vận hành hoàn tiền</button></>}
        {o.status==="refunded"&&<p>Đã mô phỏng hoàn {money(o.total)}; khoản phải trả tiệm {money(o.receivedAt?o.payout:0)}{o.receivedAt?" vẫn giữ do đã bàn giao":" do chưa bàn giao"}.</p>}
      </div></article>)}</section>}
      <details className="flower-assumptions"><summary>Giả định vận hành của DEMO</summary><p>{flowerAssumptions}</p><p>Ngân sách ưu đãi 500.000đ/tuần; mỗi tuần 2 lượt 15%, 2 lượt 10%, 4 lượt 9.000đ. Đây là mô phỏng trên một trình duyệt, không xác thực tài khoản hoặc giao dịch ngân hàng.</p></details>
      <button className="secondary" onClick={()=>{const s=newFlowerSession(Date.now());save(s);setPlace("");setSelected("");setVoucher("none");setMessage("Đã bắt đầu lượt mới, khôi phục tồn và voucher DEMO trên thiết bị này.");}}>Bắt đầu lại lượt thử hoa</button>
    </>}
  </section>;
}
