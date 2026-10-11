import { transaction, closeStore, clock, demo } from "../lib/store";
import { demoState } from "../lib/domain";
if (
  !demo() ||
  process.env.DATABASE_URL ||
  !process.env.PGLITE_DIR?.includes("market-demo")
)
  throw new Error(
    "Chỉ dùng dữ liệu giả tại PGLITE_DIR có tên market-demo; không dùng PostgreSQL thật.",
  );
async function main() {
  await transaction((s) => {
    if (s.orders.length || s.payments.length || s.quotes.length)
      throw new Error(
        "Dùng database demo mới; không ghi đè đơn hoặc tiền đã có.",
      );
    const base = demoState(clock());
    const shop = base.shops[0],
      meal = base.listings[0];
    s.shops = [
      shop,
      {
        ...shop,
        id: "shop2",
        name: "Bún nhà · DEMO",
        address: "Khu trường Hà Nội · địa chỉ minh họa",
      },
      {
        ...shop,
        id: "shop3",
        name: "Tiệm bánh chiều · DEMO",
        address: "Khu trường Hà Nội · địa chỉ minh họa",
      },
    ];
    s.listings = [
      meal,
      {
        ...meal,
        id: "rice",
        name: "Cơm rau & đậu phụ",
        price: 40000,
        floor: 24000,
        stock: 8,
        image: undefined,
      },
      {
        ...meal,
        id: "noodle",
        shopId: "shop2",
        name: "Bún bò cuối chiều",
        category: "Bún/mì",
        price: 45000,
        floor: 27000,
        stock: 7,
        image: "/food-images/demo-noodle.svg",
      },
      {
        ...meal,
        id: "bread",
        shopId: "shop3",
        name: "Bánh mì trứng",
        category: "Bánh",
        price: 30000,
        floor: 17000,
        stock: 5,
        image: "/food-images/demo-bread.svg",
      },
      {
        ...meal,
        id: "sold",
        shopId: "shop3",
        name: "Bánh ngọt cuối ngày",
        category: "Bánh",
        price: 35000,
        floor: 20000,
        stock: 0,
        image: undefined,
      },
      {
        ...meal,
        id: "tea",
        shopId: "shop3",
        name: "Trà chanh",
        category: "Đồ uống",
        price: 25000,
        floor: 13000,
        stock: 6,
        start: clock() + 1800000,
        image: undefined,
      },
    ];
  });
  console.log(
    "Đã tạo catalogue giả: 3 quán, 6 món. Không dùng cho số liệu pilot.",
  );
}
main()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(closeStore);
