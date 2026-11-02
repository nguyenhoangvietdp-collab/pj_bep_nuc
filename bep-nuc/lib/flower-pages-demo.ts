import {flowerCatalogue,flowerDemoVersion} from "./flower-demo";
import {voucherDiscount,weekStart} from "./trading";

export type FlowerVoucher="none"|"15"|"10"|"9k";
export type FlowerDemoOrder={id:string;productId:string;qty:number;voucher:FlowerVoucher;week:string;created:number;expires:number;total:number;discount:number;payout:number;status:"held"|"paid"|"received"|"issue"|"refunded"|"cancelled";receivedAt?:number;issue?:string};
export type FlowerDemoSession={version:number;startedAt:number;place:string;orders:FlowerDemoOrder[]};
export const flowerDemoBudget=500000;
export const flowerVoucherLimits={none:Infinity,"15":2,"10":2,"9k":4};
export function newFlowerSession(now:number):FlowerDemoSession{return {version:flowerDemoVersion,startedAt:now,place:"",orders:[]};}
export function flowerOrderExpired(o:FlowerDemoOrder,now:number){return o.status==="held"&&now>=o.expires;}
export function flowerCommitted(o:FlowerDemoOrder,now:number){return !flowerOrderExpired(o,now)&&o.status!=="cancelled"&&(o.status!=="refunded"||!!o.receivedAt);}
export function flowerStock(s:FlowerDemoSession,id:string,now:number){return 3-s.orders.filter(o=>o.productId===id&&flowerCommitted(o,now)).reduce((n,o)=>n+o.qty,0);}
export function flowerVoucherRemaining(s:FlowerDemoSession,voucher:FlowerVoucher,now:number){return flowerVoucherLimits[voucher]-s.orders.filter(o=>o.voucher===voucher&&o.week===weekStart(now)&&flowerCommitted(o,now)).length;}
export function flowerDemoPrice(id:string,qty:number,voucher:FlowerVoucher){
  const item=flowerCatalogue.find(x=>x.id===id);
  if(!item||!Number.isSafeInteger(qty)||qty<1||qty>3||!Object.hasOwn(flowerVoucherLimits,voucher))throw Error("Kiểm tra sản phẩm, số lượng và voucher.");
  const base=item.price*qty;
  const discount=voucherDiscount(base,voucher==="none"?undefined:voucher==="9k"?{rate:0,amount:9000}:{rate:voucher==="15"?.15:.1,cap:9000});
  return {base,discount,total:base-discount,payout:Math.floor(item.price*60/100)*qty,cost:3000*qty,minimumMargin:1000*qty};
}
export function flowerQuoteError(s:FlowerDemoSession,id:string,qty:number,voucher:FlowerVoucher,now:number){
  try{
    const p=flowerDemoPrice(id,qty,voucher);
    if(now<s.startedAt||now>=s.startedAt+10800000)return "Lô DEMO đã hết khung nhận. Bắt đầu lượt mới để thử tiếp.";
    if(s.orders.some(o=>!flowerOrderExpired(o,now)&&["held","paid"].includes(o.status)))return "Hoàn tất hoặc hủy đơn đang giữ trước khi chọn tiếp.";
    if(voucher!=="none"&&s.place.trim().length<3)return "Lưu vị trí minh họa trước khi chọn voucher.";
    if(flowerStock(s,id,now)<qty)return "Không còn đủ tồn mô phỏng.";
    if(flowerVoucherRemaining(s,voucher,now)<=0)return "Đã hết lượt voucher trong tuần Việt Nam.";
    if(p.total<p.payout+p.cost+p.minimumMargin)return "Lô chưa đủ biên cho voucher này. Chọn không voucher hoặc voucher khác.";
    const used=s.orders.filter(o=>o.week===weekStart(now)&&flowerCommitted(o,now)).reduce((n,o)=>n+o.discount,0);
    if(used+p.discount>flowerDemoBudget)return "Ngân sách DEMO tuần này đã hết.";
    return "";
  }catch(e){return (e as Error).message;}
}
export function reserveFlower(s:FlowerDemoSession,id:string,qty:number,voucher:FlowerVoucher,now:number,orderId:string):FlowerDemoSession{
  const duplicate=s.orders.find(o=>o.id===orderId);
  if(duplicate){if(duplicate.productId!==id||duplicate.qty!==qty||duplicate.voucher!==voucher)throw Error("Mã thử đã dùng cho lựa chọn khác.");return s;}
  const error=flowerQuoteError(s,id,qty,voucher,now);if(error)throw Error(error);
  const p=flowerDemoPrice(id,qty,voucher),boundary=Date.parse(weekStart(now)+"T00:00:00+07:00")+7*86400000;
  return {...s,orders:[{id:orderId,productId:id,qty,voucher,week:weekStart(now),created:now,expires:Math.min(now+600000,s.startedAt+10800000,boundary),total:p.total,discount:p.discount,payout:p.payout,status:"held"},...s.orders]};
}
export function progressFlower(s:FlowerDemoSession,id:string,action:"pay"|"receive"|"cancel"|"issue"|"refund",now:number,description=""):FlowerDemoSession{
  const o=s.orders.find(o=>o.id===id);if(!o)throw Error("Không có đơn DEMO này.");
  if(flowerOrderExpired(o,now))throw Error("Đã hết 10 phút giữ lô; tồn và voucher được giải phóng.");
  let next:FlowerDemoOrder={...o};
  if(action==="pay"&&o.status==="held")next.status="paid";
  else if(action==="receive"&&o.status==="paid"){
    if(now>=s.startedAt+10800000)throw Error("Đã hết khung nhận; gửi phản ánh để mô phỏng hoàn tiền.");
    next={...next,status:"received",receivedAt:now};
  }else if(action==="cancel"&&o.status==="held")next.status="cancelled";
  else if(action==="issue"&&["paid","received"].includes(o.status)&&description.trim().length>=5)next={...next,status:"issue",issue:description.trim().slice(0,1000)};
  else if(action==="refund"&&o.status==="issue")next.status="refunded";
  else throw Error("Thao tác không phù hợp trạng thái đơn hoặc phản ánh cần ít nhất 5 ký tự.");
  return {...s,orders:s.orders.map(x=>x.id===id?next:x)};
}
export function restoreFlowerSession(raw:string|null,now:number):FlowerDemoSession{
  try{
    const s=JSON.parse(raw||"null") as FlowerDemoSession;
    if(!s||s.version!==flowerDemoVersion||!Number.isFinite(s.startedAt)||s.startedAt<=0||s.startedAt>now||typeof s.place!=="string"||s.place.length>150||!Array.isArray(s.orders)||s.orders.length>100)return newFlowerSession(now);
    const seen=new Set<string>();
    for(const o of s.orders){
      const p=flowerDemoPrice(o.productId,o.qty,o.voucher);
      if(typeof o.id!=="string"||!/^FLOWER-[a-z0-9-]{1,60}$/i.test(o.id)||seen.has(o.id)||!Number.isFinite(o.created)||o.created<s.startedAt||o.created>now||o.week!==weekStart(o.created)||!Number.isFinite(o.expires)||o.expires<=o.created||o.expires>o.created+600000||o.expires>s.startedAt+10800000||o.total!==p.total||o.discount!==p.discount||o.payout!==p.payout||!["held","paid","received","issue","refunded","cancelled"].includes(o.status)||(o.status==="received"&&!o.receivedAt)||(o.receivedAt!==undefined&&(!Number.isFinite(o.receivedAt)||o.receivedAt<o.created||o.receivedAt>now)))return newFlowerSession(now);
      seen.add(o.id);
    }
    return s;
  }catch{return newFlowerSession(now);}
}
