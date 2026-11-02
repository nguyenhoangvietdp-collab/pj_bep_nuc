export function saleCountdown(remainingMs:number){
 const seconds=Number.isFinite(remainingMs)?Math.max(0,Math.ceil(remainingMs/1000)):0;
 const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),rest=seconds%60;
 const pad=(n:number)=>String(n).padStart(2,"0");
 return hours?`${hours} giờ ${pad(minutes)} phút ${pad(rest)} giây`:minutes?`${minutes} phút ${pad(rest)} giây`:`${rest} giây`;
}
