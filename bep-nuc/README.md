# Bếp Núc — MVP pilot Hà Nội

Ứng dụng độc lập: Next.js 15, TypeScript, Supabase Auth, PostgreSQL. Demo sử dụng PostgreSQL nhúng PGlite; production dùng database Supabase riêng. Không có ML, theo dõi GPS hoặc thanh toán tự động.

## Chạy mô phỏng

```powershell
cd 'C:\Users\Admin\Documents\ChatGPT\Swin-Biz-Rockstar 2026\bep-nuc'
npm ci
$env:APP_MODE='demo'
$env:DEMO_NOW='2026-10-05T18:30:00+07:00'
npm run dev
```

Mở http://127.0.0.1:3200. Mở /login để chọn vai trò DEMO (khách, sinh viên, quán, vận hành). Dùng mã giao dịch giả để thử; **không chuyển tiền thật**. DEMO_NOW chỉ dùng mô phỏng, bỏ biến này để thử hết hạn theo thời gian thực. Dữ liệu ở `.data/postgres`, không chia sẻ với ứng dụng khác. Mỗi tiến trình PGlite dùng thư mục riêng; không chạy dev và production demo cùng thư mục.

## Cấu hình thật

Sao chép `.env.example` thành `.env.local`, đặt APP_MODE=production, APP_URL đúng origin, DATABASE_URL của dự án Supabase riêng, URL/anon key Supabase và thông tin ngân hàng. Bật email OTP ở Supabase (template hiển thị token). Tạo tài khoản qua email rồi cấp vận hành bằng CLI:

```powershell
node --env-file=.env.local --import tsx scripts/staff.ts SUPABASE_USER_ID ops
node --env-file=.env.local --import tsx scripts/staff.ts SUPABASE_USER_ID merchant SHOP_ID
```

Sinh viên mới mặc định chờ duyệt. Không cho tự chọn vai trò thật. Server giữ DATABASE_URL và khóa dịch vụ, không đưa vào NEXT_PUBLIC. bc_state bật RLS, khóa các role browser. Giao dịch mới lưu điểm nơi ở/địa danh do khách khai báo để tính tuyến, không theo dõi GPS hoặc xác minh cư trú; thiếu tuyến thì không hỗ trợ khoảng cách. Xem [hướng dẫn cập nhật](docs/trading-update-20261101.md) về quyền, ảnh và vận hành.

Production khóa đặt hàng nếu chưa bật REAL_PILOT_ENABLED, thiếu ngân hàng hoặc chưa có ba tiệm thật đã duyệt/ký/nguồn dư lặp lại, có lô đủ thông tin và biên. Không còn yêu cầu mọi tiệm phải đủ voucher20%. Gate là kiểm tra bản ghi, không thay xác minh hiện trường. Demo không được triển khai công khai.

Voucher mới theo tuần giờ Việt Nam: hai lượt15%, hai lượt10%,9k cố định theo số lượt và cap được vận hành cấp ngân sách. Mặc định production chưa bật ưu đãi, chưa đặt số lượt9k/cap thực. Lô mới được đặt sau khi đăng/duyệt đến giờ cắt của lô, không bắt hoa hoặc đồ ăn phải chờ18h. Giữ tối đa10phút, không quá cuối khung lô hoặc thời điểm sang tuần. Tuần mới bắt đầu thứ Hai00:00; rà lại nguồn tài trợ từng tuần.

## Trải nghiệm mua bữa

Trang `/` và `/shops/[id]` cho khách xem catalogue công khai. `/meals/[id]` mở chi tiết món, `/checkout` kiểm tra một loại món với 1–3 suất, `/orders` và `/orders/[id]` xem đơn riêng. Đăng nhập qua `/login`; quán và vận hành dùng `/internal`. Khách chọn tự nhận tại quán hoặc giao tận nơi do đội Bếp Núc điều phối. Đơn giao cần ops báo phí và khách đồng ý tổng tiền trước khi thanh toán; không áp thưởng tự nhận. Xem `docs/manual-delivery.md` để vận hành, đối soát và triển khai đúng thứ tự.

`GET /api/catalogue` không yêu cầu đăng nhập và không trả điều khoản tài chính riêng. API tài khoản trả báo giá đang giữ; `release_quote` chỉ bỏ báo giá chưa tạo đơn thuộc người dùng hiện tại. Nháp không giữ tồn. Ảnh tùy chọn là tài nguyên `/food-images/` trong website.

Đọc `docs/commerce-objectives.md` để xem kết quả nghiệm thu và các phần chưa kiểm tra trực tiếp trên trình duyệt. Script `scripts/demo-market.ts` tạo catalogue giả; `scripts/market-smoke.mjs` chạy nghiệm thu HTTP bằng tiền giả trên database mới.

## Kiến trúc và giới hạn

Một aggregate PostgreSQL JSONB cho cụm pilot nhỏ; transaction + advisory lock toàn cục chống tranh tồn/voucher trên nhiều tiến trình production. PGlite có hàng đợi trong một tiến trình. Chuyển sang bảng chuẩn hóa/index và khóa theo lô khi mở rộng. API trả DTO theo vai trò, không trả giá sàn/chi phí/biên/settlement cho sinh viên. Mutation có origin check, phân quyền, idempotency key và audit. Expiry được xử lý ở mỗi giao dịch; khi không có traffic, việc giải phóng giữ hàng xảy ra ở lần truy cập kế tiếp. Không có cron được triển khai tự động.

Chi phí và biên tối thiểu tính mỗi lô, nhân số lượng1–3. Lô mới dùng giá lô trực tiếp và khoản tiệm nhận cố định, không tự giảm nền5% hoặc chia90%. Lô do merchant đăng cần ops duyệt chất lượng và chi phí trước mở bán. Báo giá/đơn cũ giữ nguyên snapshot. Voucher giữ khi báo giá, tiêu khi bàn giao. Tiền muộn/sai/thu thêm vào hàng chờ hoàn. Hoàn sau bàn giao không xóa nghĩa vụ tiệm; mã nhận dùng một lần.

Sổ cash = thu − hoàn đã trả − trả tiệm − chi phí giao đã chi. Tách refundDue, merchantDue, heldCustomerFunds và deliveryReserve. unallocated đã trừ các phần này nhưng vẫn không phải lợi nhuận. Contribution chỉ bao phủ chi phí đã cấu hình và chi phí giao đã ghi; chi phí lô cần gồm công/lỗi/CAC phù hợp, không đếm trùng. Xem docs/trading-update-20261101.md để triển khai backend, ảnh và frontend cùng phiên bản.

```powershell
npm run type-check
npm test
npm run build
```

Đọc `docs/pilot-runbook.md` trước mở thử. Chưa thực hiện khảo sát, ký quán, xác minh an toàn thực phẩm, gửi OTP thật hay chuyển khoản thật.

## Thư mục phát triển chính

Đổi tên sản phẩm từ BữaChốt thành **Bếp Núc** ngày 07/10/2026. Mã nguồn chính nằm tại `Swin-Biz-Rockstar 2026/bep-nuc`.

Tên Bếp Canh trong tài liệu nghiên cứu chỉ hướng dự báo vận hành quán trước đây. MVP hiện tại là sản phẩm tìm và mua bữa cuối ngày, tự nhận tại quán.

- `app/`: catalogue, quán, chi tiết món, checkout, đơn hàng, đăng nhập và giao diện nội bộ.
- `lib/`: nghiệp vụ giá/voucher/tồn/thanh toán và lưu trữ.
- `tests/`, `scripts/`: kiểm thử và dữ liệu demo.
- `docs/`: vận hành, nghiệm thu, Telegram và định hướng giao diện.
- `docs/research/`: nghiên cứu và thẩm định kế thừa; tên tệp và evidence gốc được giữ để truy vết.

Không sao chép `.env.local`, database, cache, build hoặc `node_modules` từ Roomora. Cấu hình thật phải thiết lập riêng. Cookie `bc_demo`, nháp `bc-draft`, bảng `bc_state` và mã chuyển khoản `BC` giữ nguyên để tương thích; đây là định danh kỹ thuật, không phải tên thương hiệu.

Tài liệu nghiệm thu kế thừa mô tả kiểm tra trước khi tách thư mục; không coi là kiểm tra lại tại vị trí mới. Xem `docs/folder-migration.md` cho kết quả tại đây.
## Chọn bữa nhanh

Đọc [nghiệm thu hành trình](docs/customer-journey-validation.md) và [biểu mẫu quan sát](docs/customer-journey-observations.csv). Ngân sách mỗi suất và sắp xếp dùng giá hiển thị theo voucher khả dụng của sinh viên; giá xác nhận vẫn do backend tính. Cấu hình `SUPPORT_EMAIL` bằng hộp thư thật được theo dõi trước pilot để hiện liên hệ gắn mã đơn.

## Trang chính và loading

`/` là trang giới thiệu trước khi chọn bữa; `/meals` là catalogue. Link lọc cũ `/?budget=...` tự chuyển sang `/meals?budget=...`; nháp và URL quán vẫn dùng được. Loading hiển thị theo trạng thái tải thật, không có thời gian chờ tối thiểu. Từ chối mạng/hết timeout vẫn đưa về thông báo lỗi và nút kiểm tra lại.

## Demo GitHub Pages

`npm run build:pages` tạo bản demo công khai tại `pages-site/out`, không có backend hoặc giao dịch thật. Xem [cách xuất bản và giới hạn](docs/github-pages.md).

## MVP ngân sách hosting 0đ

Đọc [hướng dẫn tạo tài khoản và triển khai](docs/zero-budget-setup.md). `npm run build:mvp` tạo frontend Cloudflare tại `mvp-site/out`; API nằm trong `supabase/functions/bep-nuc`, migration trong `supabase/migrations`. Google login và giao dịch chỉ hoạt động sau khi kết nối project thật. Không seed hồ sơ giả định vào production.

`npm run build:pages` xuất trang giới thiệu GitHub Pages và liên kết sang danh mục/yêu cầu đặt hàng trên website Workers; không nhận đơn, đăng nhập hoặc thanh toán thật. Xem [đối chiếu ảnh và giới hạn DEMO](docs/flower-catalogue-20261102.md). Đặt repository variable `MVP_APP_URL` sau khi có URL Cloudflare đã kiểm tra. Bản demo món ăn cũ chỉ giữ làm tham chiếu, không được nhập trong entrypoint public mới.

Website chính trên Cloudflare Workers: `https://pj-bep-nuc.nguyenhoangvietdp.workers.dev/`. Trong thư mục `bep-nuc`, build bằng `npm run build:mvp` với đúng Supabase URL và publishable/anon key công khai đang dùng, kiểm tra `npm run check:static`, rồi chạy `npx wrangler deploy --config wrangler.jsonc --keep-vars`. Không dùng bản build GitHub Pages để cập nhật Worker này. Trong “Đồ ăn & hoa”, Nhóm hàng có “Đồ ăn” và “Hoa”; “Tất cả món” chỉ thuộc Đồ ăn. Hoa dùng cùng thẻ, chi tiết, form yêu cầu và Đơn hàng của đồ ăn. Giá 70% chỉ là mục tiêu khách mong muốn; vận hành xác minh tiệm/lô và báo giá thực tế trước khi khách đồng ý. Không seed tiệm giả hoặc chuyển đơn DEMO cũ thành yêu cầu thật. Xem [quy tắc hoa tham khảo](docs/flower-catalogue-20261102.md).
