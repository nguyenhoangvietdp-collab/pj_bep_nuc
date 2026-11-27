import type { NearDate, NearDateGroup } from "./near-date";
import { nearDateCategory, retailLabel } from "./near-date";
import { normalize, type Food } from "./commerce";
import { saleOrderable } from "./trading";

export type NearDateTemplate = {
  id: string;
  group: NearDateGroup;
  unit: NearDate["unit"];
  title: string;
  subtitle: string;
  description: string;
  whyDiscount: string;
  storage: string;
  allergenNote?: string;
  fieldsForShop: string[];
  imageAlt: string;
  credit?: {
    author: string;
    license: string;
    licenseUrl: string;
    pageUrl: string;
  };
  suggestedItems?: string[];
};

const whyDiscount = "Hàng còn hạn nhưng gần hạn ghi trên bao bì, quán xả để không phí.";
const packagedFoodStorage = "Bảo quản theo hướng dẫn ghi trên bao bì, tránh nơi ẩm nóng và ánh nắng trực tiếp.";
const drinkStorage = "Bảo quản theo hướng dẫn ghi trên bao bì, tránh ánh nắng trực tiếp và nhiệt độ cao.";
const allergenNote = "Kiểm tra thành phần và cảnh báo dị ứng trên nhãn trước khi dùng.";

const fieldsForShop = (quantity: string): string[] => [
  "hạn sử dụng",
  "mã lô",
  "nguồn gốc/nhà sản xuất",
  "thương hiệu",
  quantity,
  "giá bán",
  "tình trạng niêm phong",
  "thành phần/dị ứng cụ thể",
  "ảnh nhãn thật",
  "chứng nhận (nếu có)",
];

export const nearDateTemplates: NearDateTemplate[] = [
  {
    id: "nd-mi-an-lien",
    group: "packaged_food",
    unit: "gói",
    title: "Mì ăn liền đóng gói",
    subtitle: "Bữa ăn tiện lợi cho nhu cầu dùng sớm với mức giá tiết kiệm",
    description: "Mì ăn liền dạng gói tiện lợi, dễ chuẩn bị cho bữa ăn nhanh hoặc dự trữ ngắn ngày. Phù hợp với khách cần mua dùng sớm với chi phí tiết kiệm.",
    whyDiscount,
    storage: packagedFoodStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("khối lượng tịnh"),
    imageAlt: "Ảnh minh họa bát mì cạnh gói mì ăn liền",
    credit: {
      author: "Jeff Siepman",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      pageUrl: "https://unsplash.com/photos/3ZLDdR7x52w",
    },
  },
  {
    id: "nd-banh-mi-bong-lan",
    group: "packaged_food",
    unit: "gói",
    title: "Bánh mì, bông lan đóng gói",
    subtitle: "Bánh mềm tiện dùng cho bữa phụ hoặc ăn nhẹ hằng ngày",
    description: "Bánh mì hoặc bông lan đóng gói sẵn, tiện mang theo cho bữa sáng nhẹ hoặc giờ nghỉ. Phù hợp với khách mua dùng ngay với mức giá ưu đãi.",
    whyDiscount,
    storage: packagedFoodStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("khối lượng tịnh"),
    imageAlt: "Ảnh minh họa bánh mì tròn trong túi nylon trong suốt",
    credit: {
      author: "Amanda Lim",
      license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      pageUrl: "https://www.pexels.com/photo/9673514/",
    },
  },
  {
    id: "nd-xuc-xich-an-lien",
    group: "packaged_food",
    unit: "gói",
    title: "Xúc xích ăn liền đóng gói",
    subtitle: "Món ăn vặt hoặc ăn kèm tiện lợi, dễ mang theo bên mình",
    description: "Xúc xích ăn liền đóng gói nhỏ gọn, dùng nhanh cho bữa phụ hoặc kết hợp cùng món khác. Lựa chọn hợp lý cho khách mua dùng sớm.",
    whyDiscount,
    storage: packagedFoodStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("khối lượng tịnh"),
    imageAlt: "Ảnh minh họa ô giữ chỗ cho mẫu xúc xích ăn liền",
  },
  {
    id: "nd-ngu-coc-yen-mach",
    group: "packaged_food",
    unit: "gói",
    title: "Ngũ cốc, yến mạch đóng gói",
    subtitle: "Lựa chọn gọn nhẹ cho bữa sáng hoặc bữa phụ hằng ngày",
    description: "Ngũ cốc hoặc yến mạch đóng gói tiện pha chế và sử dụng nhanh tại nhà hay văn phòng. Thích hợp cho khách có kế hoạch dùng sớm trong tuần.",
    whyDiscount,
    storage: packagedFoodStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("khối lượng tịnh"),
    imageAlt: "Ảnh minh họa yến mạch cán trong thau trên nền xanh",
    credit: {
      author: "Gaurav Dhwaj Khadka",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      pageUrl: "https://commons.wikimedia.org/wiki/File:Rolled_Oats.jpg",
    },
  },
  {
    id: "nd-sua-tuoi-hop",
    group: "drink",
    unit: "hộp",
    title: "Sữa tươi đóng hộp",
    subtitle: "Thức uống quen thuộc, tiện dùng cho cá nhân hoặc gia đình",
    description: "Sữa tươi đóng hộp tiện mang theo hoặc dùng trực tiếp cho bữa sáng và bữa phụ. Phù hợp với khách muốn mua sử dụng sớm với giá tiết kiệm.",
    whyDiscount,
    storage: drinkStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("dung tích thực"),
    imageAlt: "Ảnh minh họa hộp sữa nằm ngang trong cảnh mô hình thu nhỏ",
    credit: {
      author: "Karl Gerber",
      license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      pageUrl: "https://www.pexels.com/photo/5956212/",
    },
  },
  {
    id: "nd-tra-dong-chai",
    group: "drink",
    unit: "chai",
    title: "Trà đóng chai",
    subtitle: "Thức uống giải khát tiện mang theo khi đi học, đi làm",
    description: "Trà đóng chai pha sẵn gọn nhẹ, tiện giải khát ngay trong ngày hoặc khi di chuyển. Phù hợp với khách mua dùng sớm để tối ưu chi phí.",
    whyDiscount,
    storage: drinkStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("dung tích thực"),
    imageAlt: "Ảnh minh họa ô giữ chỗ cho mẫu trà đóng chai",
  },
  {
    id: "nd-sua-hat-dau-nanh-hop",
    group: "drink",
    unit: "hộp",
    title: "Sữa hạt, đậu nành đóng hộp",
    subtitle: "Thức uống thực vật đóng hộp tiện lợi cho nhu cầu hằng ngày",
    description: "Sữa hạt hoặc sữa đậu nành đóng hộp tiện dùng nhanh tại nhà, nơi làm việc hoặc khi ra ngoài. Dành cho khách mua sử dụng sớm với giá tốt.",
    whyDiscount,
    storage: drinkStorage,
    allergenNote,
    fieldsForShop: fieldsForShop("dung tích thực"),
    imageAlt: "Ảnh minh họa ô giữ chỗ cho mẫu sữa hạt, đậu nành đóng hộp",
  },
  {
    id: "nd-sua-rua-mat-tuyp",
    group: "personal_care",
    unit: "sản phẩm",
    title: "Sữa rửa mặt dạng tuýp",
    subtitle: "Sản phẩm làm sạch da mặt hằng ngày, tiện mang theo khi đi xa",
    description: "Sữa rửa mặt dạng tuýp gọn nhẹ cho bước chăm sóc da cơ bản mỗi ngày. Phù hợp với khách cần dùng ngay trong thời gian ngắn với mức giá tiết kiệm.",
    whyDiscount,
    storage: "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và đậy kín sau khi dùng.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "dung tích hoặc khối lượng",
      "giá bán",
      "tình trạng niêm phong",
      "thành phần/lưu ý kích ứng",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa tuýp mỹ phẩm trắng không nhãn",
    credit: {
      author: "Volker Thimm",
      license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      pageUrl: "https://www.pexels.com/photo/19080517/",
    },
  },
  {
    id: "nd-kem-danh-rang-tuyp",
    group: "personal_care",
    unit: "sản phẩm",
    title: "Kem đánh răng dạng tuýp",
    subtitle: "Đồ dùng vệ sinh răng miệng thiết yếu cho cả gia đình",
    description: "Kem đánh răng dạng tuýp quen thuộc cho sinh hoạt hằng ngày, dễ dùng và dễ bảo quản. Lựa chọn tiết kiệm cho khách mua sử dụng liên tục.",
    whyDiscount,
    storage: "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và đậy kín sau khi dùng.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "khối lượng tịnh",
      "giá bán",
      "tình trạng niêm phong",
      "thành phần/lưu ý kích ứng",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa tuýp trắng không nhãn cạnh bàn chải tre trên nền gỗ",
    credit: {
      author: "kaboompics (Karola G)",
      license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      pageUrl: "https://www.pexels.com/photo/4465126/",
    },
  },
  {
    id: "nd-dau-goi-sua-tam-chai",
    group: "personal_care",
    unit: "chai",
    title: "Dầu gội, sữa tắm đóng chai",
    subtitle: "Sản phẩm chăm sóc cá nhân dùng hằng ngày với giá tiết kiệm",
    description: "Dầu gội hoặc sữa tắm đóng chai dùng trong sinh hoạt cá nhân và gia đình. Phù hợp với khách có nhu cầu sử dụng thường xuyên trong thời gian gần.",
    whyDiscount,
    storage: "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và đậy kín sau khi dùng.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "dung tích thực",
      "giá bán",
      "tình trạng niêm phong",
      "thành phần/lưu ý kích ứng",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa chai trắng không nhãn có nắp đen",
    credit: {
      author: "Mich Graphics",
      license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      pageUrl: "https://www.pexels.com/photo/15369086/",
    },
  },
  {
    id: "nd-nuoc-giat-xa-tui",
    group: "household",
    unit: "sản phẩm",
    title: "Nước giặt, nước xả dạng túi",
    subtitle: "Sản phẩm giặt giũ tiện dụng cho nhu cầu sinh hoạt gia đình",
    description: "Nước giặt hoặc nước xả dạng túi gọn nhẹ, thuận tiện cho việc giặt giũ hằng ngày tại nhà. Phù hợp để mua dùng sớm với chi phí hợp lý.",
    whyDiscount,
    storage: "Đóng kín sau khi dùng, để nơi khô thoáng, tránh nắng trực tiếp và xa tầm tay trẻ em.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "dung tích hoặc khối lượng",
      "giá bán",
      "tình trạng niêm phong",
      "thành phần/lưu ý an toàn",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa chai nước giặt trắng không nhãn (ảnh dựng)",
    credit: {
      author: "Sufyan (blenderdesigner)",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      pageUrl: "https://unsplash.com/photos/9wCOqpBJRHI",
    },
  },
  {
    id: "nd-nuoc-rua-chen-chai",
    group: "household",
    unit: "chai",
    title: "Nước rửa chén đóng chai",
    subtitle: "Đồ dùng nhà bếp thiết yếu, phù hợp mua sử dụng hằng ngày",
    description: "Nước rửa chén đóng chai phục vụ nhu cầu làm sạch dụng cụ bếp trong gia đình. Lựa chọn tiết kiệm cho khách mua dùng ngay.",
    whyDiscount,
    storage: "Đóng kín sau khi dùng, để nơi khô thoáng, tránh nắng trực tiếp và xa tầm tay trẻ em.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "dung tích hoặc khối lượng",
      "giá bán",
      "tình trạng niêm phong",
      "thành phần/lưu ý an toàn",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa chai có vòi bơm màu trắng, không nhãn, trên nền sáng",
    credit: {
      author: "Sincerely Media",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      pageUrl: "https://unsplash.com/photos/LtGwgq7r_mc",
    },
  },
  {
    id: "nd-khan-giay-giay-uot",
    group: "household",
    unit: "hộp",
    title: "Khăn giấy, giấy ướt đóng hộp",
    subtitle: "Vật dụng sinh hoạt tiện lợi cho bàn ăn, phòng khách hoặc mang theo",
    description: "Khăn giấy hoặc giấy ướt tiện dùng trong sinh hoạt hằng ngày tại nhà hay văn phòng. Thích hợp mua dùng sớm với mức giá tiết kiệm.",
    whyDiscount,
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và tránh nơi ẩm mốc.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "quy cách số tờ",
      "giá bán",
      "tình trạng niêm phong",
      "thành phần/lưu ý sử dụng",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa hộp khăn giấy rút có họa tiết môi đỏ",
    credit: {
      author: "Captain MarcusL",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      pageUrl: "https://commons.wikimedia.org/wiki/File:A_tissue_box.jpg",
    },
  },
  {
    id: "nd-pin-tieu-vi",
    group: "non_food",
    unit: "sản phẩm",
    title: "Pin tiểu đóng vỉ",
    subtitle: "Nguồn pin dự phòng tiện lợi cho các thiết bị gia dụng nhỏ",
    description: "Pin tiểu đóng vỉ dùng cho các thiết bị điện tử gia dụng phù hợp theo thông số trên bao bì. Thuận tiện để thay thế sớm tại nhà với chi phí hợp lý.",
    whyDiscount,
    storage: "Bảo quản nơi khô ráo, thoáng mát, tránh nhiệt độ cao, ẩm ướt và để xa tầm tay trẻ em.",
    fieldsForShop: [
      "hạn sử dụng",
      "mã lô",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu",
      "thông số loại pin và số viên",
      "giá bán",
      "tình trạng niêm phong",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa bốn viên pin tiểu trên giấy kẻ ô",
    credit: {
      author: "Dmitry G",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      pageUrl: "https://commons.wikimedia.org/wiki/File:Brandless_AA_batteries.JPG",
    },
  },
  {
    id: "nd-combo-bua-sang-nhanh",
    group: "packaged_food",
    unit: "combo",
    title: "Combo bữa sáng nhanh",
    subtitle: "Gồm bánh mì hoặc bông lan, xúc xích và sữa tươi đóng hộp",
    description: "Bộ ba gồm bánh mì hoặc bông lan, xúc xích ăn liền và sữa tươi đóng hộp cho bữa sáng gọn nhẹ. Tiện mua một lần để dùng sớm với giá tiết kiệm.",
    whyDiscount,
    storage: "Bảo quản từng món theo hướng dẫn ghi trên bao bì, tránh nơi ẩm nóng và ánh nắng trực tiếp.",
    allergenNote,
    fieldsForShop: [
      "hạn sử dụng từng món",
      "mã lô từng món",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu từng món",
      "khối lượng và dung tích",
      "giá combo",
      "tình trạng niêm phong",
      "thành phần/dị ứng cụ thể",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa đĩa bánh mì, xúc xích và trứng",
    credit: {
      author: "Helen Brudna",
      license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      pageUrl: "https://www.pexels.com/photo/32795472/",
    },
    suggestedItems: ["nd-banh-mi-bong-lan", "nd-xuc-xich-an-lien", "nd-sua-tuoi-hop"],
  },
  {
    id: "nd-combo-ve-sinh-ca-nhan",
    group: "personal_care",
    unit: "combo",
    title: "Combo vệ sinh cá nhân",
    subtitle: "Gồm sữa rửa mặt, kem đánh răng và dầu gội hoặc sữa tắm",
    description: "Bộ sản phẩm thiết yếu gồm sữa rửa mặt, kem đánh răng và dầu gội hoặc sữa tắm cho sinh hoạt hằng ngày. Tiện sắm đủ một lượt với chi phí tiết kiệm.",
    whyDiscount,
    storage: "Để các sản phẩm ở nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và đậy kín sau khi dùng.",
    fieldsForShop: [
      "hạn sử dụng từng món",
      "mã lô từng món",
      "nguồn gốc/nhà sản xuất",
      "thương hiệu từng món",
      "dung tích và khối lượng",
      "giá combo",
      "tình trạng niêm phong",
      "thành phần/lưu ý kích ứng",
      "ảnh nhãn thật",
      "chứng nhận (nếu có)",
    ],
    imageAlt: "Ảnh minh họa ô giữ chỗ cho mẫu combo vệ sinh cá nhân",
    suggestedItems: ["nd-sua-rua-mat-tuyp", "nd-kem-danh-rang-tuyp", "nd-dau-goi-sua-tam-chai"],
  },
];

export function visibleNearDateTemplates(listings: Food[], category: string, query: string, now: number) {
  const search = normalize(query);
  return nearDateTemplates.filter(template =>
    (category === retailLabel || category === nearDateCategory(template.group)) &&
    normalize(template.title).includes(search) &&
    !listings.some(lot => lot.lot?.nearDate?.group === template.group &&
      normalize(lot.name) === normalize(template.title) &&
      lot.stock > 0 && lot.end > now && saleOrderable(lot, now)),
  );
}

export function nearDateTemplateFormValues(template: NearDateTemplate) {
  return {
    name: template.title,
    contents: template.description,
    storage: template.storage,
    group: template.group,
    unit: template.unit,
  };
}
