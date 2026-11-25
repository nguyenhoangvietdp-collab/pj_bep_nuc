import {money} from "../../lib/commerce";
export default function PickupBenefit({amount}:{amount?:number}){
 return <p className="pickup-benefit"><strong>{amount===0?"Xem quyền lợi tự lấy":"Tự lấy, tiết kiệm thêm"}</strong>{amount!==undefined&&amount>0&&<span>Dự tính giảm thêm <b>{money(amount)}</b></span>}</p>;
}
