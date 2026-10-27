import { productAssets } from "./product-assets";
import { normalize } from "./commerce";
// Owner-approved menu and prices; availability is supplied separately by real listings.
export const launchPartner = { id: "bo-to-mai-chau-198-thai-thinh", name: "BÒ TƠ MAI CHÂU", address: "198 Thái Thịnh, Đống Đa, Hà Nội" };
export const launchMenuNames = ["Bún riêu", "Bún đậu", "Bánh dày"];
export const menuShops = [
  {...launchPartner,mock:false,menu:launchMenuNames},
  {id:"mock-nguyen-chi-thanh-8",name:"Bếp Nguyễn Chí Thanh",address:"Số 8 đường Nguyễn Chí Thanh, Hà Nội",mock:true,menu:["Cháo quẩy","Bánh khọt","Hoành thánh","Xôi cốm"]},
  {id:"mock-giai-phong-10",name:"Bếp Giải Phóng",address:"Số 10 đường Giải Phóng, Hà Nội",mock:true,menu:["Bánh rán đường","Nem nướng","Bánh xèo","Bánh bột lọc"]},
  {id:"mock-dien-bien-phu-30",name:"Bếp Điện Biên Phủ",address:"Số 30 đường Điện Biên Phủ, Hà Nội",mock:true,menu:["Nem chua rán","Nộm sứa","Nem tai"]},
];
export function filterLaunchMenu(query = "", category = "", budget = 0, sort = "end") {
  const term=normalize(query);
  const items=productAssets.flatMap(p=>{
    const shop=menuShops.find(s=>s.menu.includes(p.name));
    if(!shop || (term&&!term.split(/\s+/).every(word=>normalize(`${p.name} ${shop.name} ${shop.address}`).includes(word))) || (category&&p.category!==category) || (budget&&p.referencePrice>budget))return [];
    return [{...p,shop}];
  });
  return sort==="price"?items.sort((a,b)=>a.referencePrice-b.referencePrice):items;
}
