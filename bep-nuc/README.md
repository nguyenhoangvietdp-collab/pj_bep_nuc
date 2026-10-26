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

Sinh viên mới mặc định chờ duyệt. Không cho người dùng tự chọn vai trò thật. Server giữ kết nối PostgreSQL; không đưa DATABASE_URL hoặc Google key vào biến NEXT_PUBLIC. Bảng bc_state bật RLS, thu hồi quyền PUBLIC; cần thu hồi quyền anon/authenticated riêng trong Supabase nếu project đã đặt default grants. Chỉ tài khoản server sở hữu bảng được đọc/ghi. Cấu hình kết nối TLS theo hướng dẫn Supabase cho môi trường triển khai. Google Routes key giới hạn API Routes, quota/ngân sách ở Google Cloud; quota cần cấu hình trước khi dùng thật. Khi Routes thất bại hoặc không lấy vị trí, dùng voucher gốc. Không lưu tọa độ khách.

Production khóa đặt hàng nếu chưa bật REAL_PILOT_ENABLED=true, chưa có ba quán thật đã duyệt/ký/nguồn dư lặp lại và món đủ voucher20%, hoặc thiếu thông tin ngân hàng. Gate kiểm tra khả năng tài chính của món; tồn tại thời điểm mua được kiểm tra riêng để việc một quán hết hàng không khóa cả cụm. Gate là kiểm tra bản ghi vận hành, không thay thế xác minh hiện trường. Quyền ops ghi đối tác phải đi kèm hồ sơ được lưu ngoài app. Demo không được triển khai public.

Bộ voucher cho mọi sinh viên đã duyệt được kích hoạt từ18:00 theo giờ Việt Nam; bản ghi được tạo ở giao dịch kế tiếp, không có push notification. Giữ hàng cũng không vượt mốc23:59. Google Routes có giới hạn số yêu cầu/tháng ở server, mặc định1000; giá/quota thực tế vẫn phải kiểm tra và cấu hình Google Cloud. Không coi giới hạn số request là đo chi phí hóa đơn.

## Trải nghiệm mua bữa

Trang `/` và `/shops/[id]` cho khách xem catalogue công khai. `/meals/[id]` mở chi tiết món, `/checkout` kiểm tra một loại món với 1–3 suất, `/orders` và `/orders/[id]` xem đơn riêng. Đăng nhập qua `/login`; quán và vận hành dùng `/internal`. Mô hình tự nhận tại quán, không giao hàng.

`GET /api/catalogue` không yêu cầu đăng nhập và không trả điều khoản tài chính riêng. API tài khoản trả báo giá đang giữ; `release_quote` chỉ bỏ báo giá chưa tạo đơn thuộc người dùng hiện tại. Nháp không giữ tồn. Ảnh tùy chọn là tài nguyên `/food-images/` trong website.

Đọc `docs/commerce-objectives.md` để xem kết quả nghiệm thu và các phần chưa kiểm tra trực tiếp trên trình duyệt. Script `scripts/demo-market.ts` tạo catalogue giả; `scripts/market-smoke.mjs` chạy nghiệm thu HTTP bằng tiền giả trên database mới.

## Kiến trúc và giới hạn

Một aggregate PostgreSQL JSONB cho cụm pilot nhỏ; transaction + advisory lock toàn cục chống tranh tồn/voucher trên nhiều tiến trình production. PGlite có hàng đợi trong một tiến trình. Chuyển sang bảng chuẩn hóa/index và khóa theo lô khi mở rộng. API trả DTO theo vai trò, không trả giá sàn/chi phí/biên/settlement cho sinh viên. Mutation có origin check, phân quyền, idempotency key và audit. Expiry được xử lý ở mỗi giao dịch; khi không có traffic, việc giải phóng giữ hàng xảy ra ở lần truy cập kế tiếp. Không có cron được triển khai tự động.

Chi phí và biên tối thiểu tính **mỗi suất**, nhân số lượng1–3. Tiền làm tròn lên đồng, không thấp hơn F+C+m. Voucher dùng lúc xác nhận tiền đúng hạn; tiền muộn/sai/thu thêm được ghi vào hàng chờ hoàn, không lấy lại tồn. No-show chỉ xử lý sau khung nhận; tiền hoàn thủ công. Mã nhận ngẫu nhiên24 ký tự, dùng một lần. Đối soát chỉ gom đơn đã giao chưa được gom trước đó; thao tác trả tiền yêu cầu mã giao dịch khác.

Sổ `cash` = thu - hoàn đã trả - trả quán. `refundDue` và `merchantDue` là nghĩa vụ chưa trả. `unallocated` gồm tiền đơn chưa giao và chênh lệch gộp, **không phải lợi nhuận**. Contribution trừ chi phí biến đổi cấu hình, chưa trừ chi phí cố định/CAC. Chi phí thực tế cần thay giá trị sàng lọc3.000đ và biên2.000đ trước pilot.

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

`npm run build:pages` hiện chỉ xuất trang giới thiệu GitHub Pages, thay bản đặt hàng giả trước đây. Đặt repository variable `MVP_APP_URL` sau khi có URL Cloudflare đã kiểm tra. Code demo cũ vẫn giữ làm tham chiếu, không được nhập trong entrypoint public mới.
