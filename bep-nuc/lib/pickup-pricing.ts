type Point={lat:number|null;lng:number|null};
export function straightLineKm(from:Point|undefined,to:Point|undefined):number|null{
 if(!from||!to||![from,to].every(p=>typeof p.lat==="number"&&Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&typeof p.lng==="number"&&Number.isFinite(p.lng)&&Math.abs(p.lng)<=180))return null;
 const rad=Math.PI/180,dLat=(to.lat!-from.lat!)*rad,dLng=(to.lng!-from.lng!)*rad;
 const a=Math.sin(dLat/2)**2+Math.cos(from.lat!*rad)*Math.cos(to.lat!*rad)*Math.sin(dLng/2)**2;
 return 6371*2*Math.asin(Math.sqrt(Math.min(1,Math.max(0,a))));
}
export type PickupPricing={method:"haversine";distanceKm:number|null;ratePerKm:0.08;capKm:2;nominal:number;applied:number;limited:boolean;limit:"funding"|"financial_limit"|null};
// Q is the customer price after base5%, before the basic voucher. Floor VND; never compound the two vouchers.
export function pickupPricing(base:number,distanceKm:number|null,enabled:boolean,marginRoom:number,budgetRoom:number):PickupPricing{
 if(![base,marginRoom,budgetRoom].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error("Số tiền tính voucher tự lấy không hợp lệ");
 const km=distanceKm!==null&&Number.isFinite(distanceKm)&&distanceKm>=0?distanceKm:null;
 const nominal=km===null?0:km>=2?Number(BigInt(base)*16n/100n):Math.floor(base*(km*.08));
 const applied=enabled?Math.min(nominal,marginRoom,budgetRoom,Math.max(0,base-1)):0;
 return {method:"haversine",distanceKm:km,ratePerKm:.08,capKm:2,nominal,applied,limited:applied<nominal,limit:applied<nominal?enabled?"financial_limit":"funding":null};
}
