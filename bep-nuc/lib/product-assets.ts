import { normalize } from "./commerce";
// Team-provided menu references; these are not stock or approved partner listings.
export const productAssets = [
  {
    "name": "Cháo quẩy",
    "image": "/food-images/chao-quay-313e9637.jpg",
    "area": "Hai Bà Trưng",
    "referencePrice": 35000,
    "category": "Món khác",
    "sourceUrl": "https://docs.google.com/images/d/1CByqDlMrQBoWDwD14tPalI_s82Q_bA_yFiO04NPaQbk/edit"
  },
  {
    "name": "Bánh khọt",
    "image": "/food-images/banh-khot-de7bcaae.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 40000,
    "category": "Bánh",
    "sourceUrl": "https://docs.google.com/images/d/17kKd5_Bck9Dir1Hw_rvbmtIES0V2axrJ7OcDu-SekLI/edit"
  },
  {
    "name": "Bún riêu",
    "image": "/food-images/bun-rieu-f52df09d.jpg",
    "area": "Đống Đa",
    "referencePrice": 45000,
    "category": "Bún/mì",
    "sourceUrl": "https://docs.google.com/images/d/1SELuvHgHd2fwXax34_1pYCCd58DHSytCmpXhdXLUofQ/edit"
  },
  {
    "name": "Hoành thánh",
    "image": "/food-images/hoanh-thanh-0fa62f04.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 55000,
    "category": "Bún/mì",
    "sourceUrl": "https://docs.google.com/images/d/1IbnzWIOujbohMuD8MznbnnMKwT9t6o7Z9KbDv_iJ3ok/edit"
  },
  {
    "name": "Xôi cốm",
    "image": "/food-images/xoi-com-86467181.jpg",
    "area": "Hai Bà Trưng",
    "referencePrice": 50000,
    "category": "Món khác",
    "sourceUrl": "https://docs.google.com/images/d/1qRscOxbi3AGBu7npmBsOsdS0_wiYF3LQyCnCvWQ_8MQ/edit"
  },
  {
    "name": "Bún đậu",
    "image": "/food-images/bun-dau-b2c9f96e.jpg",
    "area": "Đống Đa",
    "referencePrice": 60000,
    "category": "Bún/mì",
    "sourceUrl": "https://docs.google.com/images/d/1sXMOl52DbgFqWWJTT1HRbR_Do5hrXxFvtHSofS0T8Dk/edit"
  },
  {
    "name": "Bánh rán đường",
    "image": "/food-images/banh-ran-duong-fdce99b1.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 5000,
    "category": "Bánh",
    "sourceUrl": "https://docs.google.com/images/d/1w9mVB9eK3G3QpsAx03GxaDdiruQ8Rp0JX07S_JyABR4/edit"
  },
  {
    "name": "Bánh dày",
    "image": "/food-images/banh-day-dfb1ac36.jpg",
    "area": "Đống Đa",
    "referencePrice": 35000,
    "category": "Bánh",
    "sourceUrl": "https://docs.google.com/images/d/10Jf7WZqkv-d48eB22obrhNYI9vnfVmHnn3bi2zH6Im4/edit"
  },
  {
    "name": "Nem nướng",
    "image": "/food-images/nem-nuong-1467740f.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 50000,
    "category": "Món khác",
    "sourceUrl": "https://docs.google.com/images/d/1qMnVy3eD0W6WKpvMlOR-fV6kZy_OebyOMiwCn2Qrpow/edit"
  },
  {
    "name": "Bánh xèo",
    "image": "/food-images/banh-xeo-e624253c.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 40000,
    "category": "Bánh",
    "sourceUrl": "https://docs.google.com/images/d/13vJ10cBrC0pYCoiQoPPngLQI4DwgGw92fc1HyVMjKy8/edit"
  },
  {
    "name": "Bánh bột lọc",
    "image": "/food-images/banh-bot-loc-5025307d.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 40000,
    "category": "Bánh",
    "sourceUrl": "https://docs.google.com/images/d/1dz1x7703vYFyCD7Xa3LKliHbZiY5dNSO-xgDAkxboc0/edit"
  },
  {
    "name": "Nem chua rán",
    "image": "/food-images/nem-chua-ran-4d9beabf.jpg",
    "area": "Đống Đa",
    "referencePrice": 35000,
    "category": "Món khác",
    "sourceUrl": "https://docs.google.com/images/d/17_rowWt5xONNOQTiWzocBZI0-Pi6C6W5P1EfghECbuk/edit"
  },
  {
    "name": "Nộm sứa",
    "image": "/food-images/nom-sua-c5954ba2.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 40000,
    "category": "Món khác",
    "sourceUrl": "https://docs.google.com/images/d/15EFnb3TAzHNplBG4mcvXVsFV8BiYkyqhn6DIY_9y3GE/edit"
  },
  {
    "name": "Nem tai",
    "image": "/food-images/nem-tai-3690c101.jpg",
    "area": "Hoàn Kiếm",
    "referencePrice": 40000,
    "category": "Món khác",
    "sourceUrl": "https://docs.google.com/images/d/1y25ISc9BxQ9vsiLibA7RImKiICLIwlhr2dwxDuyi7Io/edit"
  }
];

export function filterMenuAssets(query = "", category = "", budget = 0, sort = "end") {
  const term = normalize(query);
  const items = productAssets.filter(p =>
    (!term || normalize(`${p.name} ${p.area}`).includes(term)) &&
    (!category || p.category === category) &&
    (!budget || p.referencePrice <= budget)
  );
  return sort === "price" ? items.sort((a, b) => a.referencePrice - b.referencePrice) : items;
}
