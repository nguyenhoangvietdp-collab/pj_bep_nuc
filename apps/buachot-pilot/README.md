# BữaChốt — MVP pilot Hà Nội

Ứng dụng độc lập: Next.js 15, TypeScript, Supabase Auth, PostgreSQL. Demo sử dụng PostgreSQL nhúng PGlite; production dùng database Supabase riêng. Không có ML, theo dõi GPS hoặc thanh toán tự động.

## Chạy mô phỏng

```powershell
npm install
$env:APP_MODE='demo'
$env:DEMO_NOW='2026-10-05T18:30:00+07:00'
npm run dev
```

Mở http://127.0.0.1:3200. Chuyển ba vai trò trên thanh DEMO. Dùng mã giao dịch giả để thử; **không chuyển tiền thật**. DEMO_NOW chỉ dùng mô phỏng, bỏ biến này để thử hết hạn theo thời gian thực. Dữ liệu ở `.data/postgres`, không chia sẻ với ứng dụng khác. Mỗi tiến trình PGlite dùng thư mục riêng; không chạy dev và production demo cùng thư mục.

## Cấu hình thật

Sao chép `.env.example` thành `.env.local`, đặt APP_MODE=production, APP_URL đúng origin, DATABASE_URL của dự án Supabase riêng, URL/anon key Supabase và thông tin ngân hàng. Bật email OTP ở Supabase (template hiển thị token). Tạo tài khoản qua email rồi cấp vận hành bằng CLI:

```powershell
node --env-file=.env.local --import tsx scripts/staff.ts SUPABASE_USER_ID ops
node --env-file=.env.local --import tsx scripts/staff.ts SUPABASE_USER_ID merchant SHOP_ID
```

Sinh viên mới mặc định chờ duyệt. Không cho người dùng tự chọn vai trò thật. Server giữ kết nối PostgreSQL; không đưa DATABASE_URL hoặc Google key vào biến NEXT_PUBLIC. Bảng bc_state bật RLS, thu hồi quyền PUBLIC; cần thu hồi quyền anon/authenticated riêng trong Supabase nếu project đã đặt default grants. Chỉ tài khoản server sở hữu bảng được đọc/ghi. Cấu hình kết nối TLS theo hướng dẫn Supabase cho môi trường triển khai. Google Routes key giới hạn API Routes, quota/ngân sách ở Google Cloud; quota cần cấu hình trước khi dùng thật. Khi Routes thất bại hoặc không lấy vị trí, dùng voucher gốc. Không lưu tọa độ khách.

Production khóa đặt hàng nếu chưa bật REAL_PILOT_ENABLED=true, chưa có ba quán thật đã duyệt/ký/nguồn dư lặp lại và món đủ voucher20%, hoặc thiếu thông tin ngân hàng. Gate kiểm tra khả năng tài chính của món; tồn tại thời điểm mua được kiểm tra riêng để việc một quán hết hàng không khóa cả cụm. Gate là kiểm tra bản ghi vận hành, không thay thế xác minh hiện trường. Quyền ops ghi đối tác phải đi kèm hồ sơ được lưu ngoài app. Demo không được triển khai public.

Bộ voucher cho mọi sinh viên đã duyệt được kích hoạt từ18:00 theo giờ Việt Nam; bản ghi được tạo ở giao dịch kế tiếp, không có push notification. Giữ hàng cũng không vượt mốc23:59. Google Routes có giới hạn số yêu cầu/tháng ở server, mặc định1000; giá/quota thực tế vẫn phải kiểm tra và cấu hình Google Cloud. Không coi giới hạn số request là đo chi phí hóa đơn.

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
