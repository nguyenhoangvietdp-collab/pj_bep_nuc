import rawCatalogue from "./flower-catalogue.json" with {type:"json"};
import {catalogueSale,type MenuCatalogueSale} from "./catalogue-sale.ts";
import type {Lot} from "./trading.ts";

export const flowerDemoVersion = 1;
export type FlowerQuantity = {amount:number;unit:"cành"|"bông"|"bó"};
export type FlowerCatalogueItem = {
  id:string;name:string;shopId:string;quantity:FlowerQuantity;referencePrice:number;price:number;legacyPrice:number;catalogueSale:MenuCatalogueSale;
  image:string;sourceFile:string;sourceSha256:string;note:string;identification:string;
};
export const flowerCatalogue:FlowerCatalogueItem[] = rawCatalogue.map(item=>{
  const sale=catalogueSale(item.referencePrice,item.id);
  return {...item,quantity:item.quantity as FlowerQuantity,price:sale.salePrice,legacyPrice:item.price,catalogueSale:sale};
});
export const flowerShops = [
  {id:"flower-a-flower",name:"À Flower & More",address:"Khu vực Cầu Giấy, Hà Nội · hồ sơ sáng tạo, không phải điểm nhận thật",story:"Một góc hoa nhẹ màu, gọn gàng để bạn tự cắm ở nhà. Phong cách tối giản, lấy cảm hứng từ bảng màu pastel. Hồ sơ sáng tạo cho DEMO.",lat:null,lng:null,approved:true,mock:true,signed:false,recurring:false},
  {id:"flower-khuc-ban-chieu",name:"Khúc Ban Chiều Florist",address:"Khu vực Hoàn Kiếm, Hà Nội · hồ sơ sáng tạo, không phải điểm nhận thật",story:"Một chút sắc hoa cho buổi chiều chậm lại. Cảm hứng cổ điển và những màu hoa có chiều sâu; gói cơ bản để mang về tự cắm. Hồ sơ sáng tạo cho DEMO.",lat:null,lng:null,approved:true,mock:true,signed:false,recurring:false},
];
export const flowerImageCaption="Ảnh tham khảo, lượng nhận theo quy cách";
export const flowerAssumptions="DEMO: khoản tiệm nhận theo mức giảm đàm phán trên giá menu; chi phí 3.000đ và đóng góp tối thiểu 1.000đ/đơn vị.";
export const flowerCare="Cắt lại gốc bằng dụng cụ sạch, dùng bình sạch và thay nước. Chưa kiểm tra hàng thật, không cam kết số ngày tươi. Không bao gồm bình hoặc thiết kế bó tặng.";
export function flowerLot(item:FlowerCatalogueItem,now:number):Lot {
  return {kind:"flowers",offer:"promotion",reason:"Giá DEMO giảm nền 5% từ giá menu theo bảng giá được cung cấp.",contents:`${item.quantity.amount} ${item.quantity.unit}${item.note?`; ${item.note}`:""}. Gói giấy cơ bản, không bình và phụ kiện quà tặng.`,condition:"DEMO — chưa có hàng thật được kiểm tra. Ảnh chỉ hỗ trợ nhận diện nhóm/màu, không xác nhận lượng nhận hoặc độ tươi hiện tại.",checkedAt:now,referencePrice:item.referencePrice,referenceEvidence:"Bảng giá do người dùng cung cấp ngày 02/11/2026; chưa xác minh độc lập. Chỉ dùng mô phỏng đúng quy cách.",species:item.name,packaging:"Gói giấy cơ bản, không thiết kế bó tặng",quantity:item.quantity,...(item.quantity.unit==="cành"?{stems:item.quantity.amount}:{})};
}
export function flowerListings(now:number){
  return flowerCatalogue.map(item=>({id:item.id,name:item.name,shopId:item.shopId,price:item.price,floor:item.catalogueSale.negotiatedPrice,menuPrice:item.referencePrice,negotiatedDiscountPercent:item.catalogueSale.negotiatedDiscountPercent,cost:3000,margin:1000,stock:3,start:now,end:now+3*3600000,approved:true,category:"Hoa cắm nhà",image:item.image,storage:flowerCare,allergens:"",lot:flowerLot(item,now)}));
}
export const pendingFlowerMatches = [
  {name:"Tuyết mai",reason:"Ảnh cành/nụ chưa đủ rõ để chốt tên."},
  {name:"CTC mix màu",reason:"Chưa xác nhận ý nghĩa viết tắt và quy cách biến thể 1/5 bông."},
  {name:"Phi yến",reason:"Ảnh ứng viên có dáng gần stock; chưa xác nhận tên hàng."},
  {name:"Hoàng kim",reason:"Chưa đủ căn cứ ghép đúng ảnh."},
  {name:"Lan tường, đồng tiền nhí, bí ngô",reason:"Chưa có ảnh khớp đủ rõ; không dùng đạo cụ bí ngô trong ảnh bình hoa làm ảnh sản phẩm."},
  {name:"Phăng hồng dâu, hồng cam, phăng chùm 500gr",reason:"Chưa phân biệt biến thể màu và quy cách khối lượng."},
  {name:"Hồng lạc thần, Sofia, sao hồng, Fairy Kiss, HC chiết xạ, HC Plume",reason:"Ảnh hồng chưa xác minh được giống thương mại; dòng Plume bị cắt ở quy cách cuối."},
];
