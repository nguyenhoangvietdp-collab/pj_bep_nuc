export const retailLabel="Hàng gần hạn sử dụng";
export const nearDateGroups={packaged_food:"Thực phẩm đóng gói",drink:"Đồ uống",personal_care:"Chăm sóc cá nhân",household:"Đồ dùng gia đình",non_food:"Hàng phi thực phẩm khác"} as const;
export const isNonFoodGroup=(group:string)=>group!=="packaged_food"&&group!=="drink";
export type NearDateGroup=keyof typeof nearDateGroups;
export const retailUnits=["sản phẩm","gói","chai","hộp","combo"] as const;
type Unit=typeof retailUnits[number];
export type NearDateItem={name:string;group:NearDateGroup;amount:number;unit:Unit;expiresAt:number;labelImage:string};
export type NearDate={group:NearDateGroup;amount:number;unit:Unit;expiresAt:number;labelImage:string;batchCode:string;origin:string;sealed:boolean;bundleItems?:NearDateItem[];preallocated?:boolean};
const image=(s:unknown)=>typeof s==="string"&&s.length<=1000&&(/^\/food-images\/[A-Za-z0-9_.-]+\.(jpg|jpeg|png|webp)$/.test(s)||/^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/bep-nuc-lots\/[A-Za-z0-9/_\-.]+$/.test(s));
export function validNearDate(n:NearDate|undefined,now:number,end:number){
 if(!n||!Object.hasOwn(nearDateGroups,n.group)||!Number.isSafeInteger(n.amount)||n.amount<1||n.amount>100||!retailUnits.includes(n.unit)||!Number.isSafeInteger(n.expiresAt)||n.expiresAt<=now||end>n.expiresAt||!image(n.labelImage)||n.sealed!==true||![n.batchCode,n.origin].every(s=>typeof s==="string"&&s.trim().length>=3&&s.length<=300))return false;
 if(n.unit==="combo"&&(!n.bundleItems||n.bundleItems.length<2||n.preallocated!==true))return false;
 if(n.bundleItems!==undefined){
  if(n.unit!=="combo"||!Array.isArray(n.bundleItems)||n.bundleItems.length<2||n.bundleItems.length>5)return false;
  if(!n.bundleItems.every(i=>i&&typeof i.name==="string"&&i.name.trim().length>=2&&i.name.length<=100&&Object.hasOwn(nearDateGroups,i.group)&&(isNonFoodGroup(n.group)===isNonFoodGroup(i.group))&&Number.isSafeInteger(i.amount)&&i.amount>0&&i.amount<=100&&retailUnits.includes(i.unit)&&i.unit!=="combo"&&Number.isSafeInteger(i.expiresAt)&&i.expiresAt>=n.expiresAt&&image(i.labelImage)))return false;
 }
 return true;
}
export const nearDateCategory=(group:NearDateGroup)=>`${retailLabel}: ${nearDateGroups[group]}`;
export const retailCategories=[retailLabel,...Object.keys(nearDateGroups).map(g=>nearDateCategory(g as NearDateGroup))];

export function normalizeRetailCategory(value:string){
 if(value==="Cận date")return retailLabel;
 if(value.startsWith("Cận date: ")){
  const old=value.slice("Cận date: ".length);
  if(old==="Hàng phi thực phẩm")return nearDateCategory("non_food");
  const match=Object.entries(nearDateGroups).find(([,label])=>label===old);
  if(match)return nearDateCategory(match[0] as NearDateGroup);
 }
 return value;
}
