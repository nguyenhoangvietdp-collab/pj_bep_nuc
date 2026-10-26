# MVP 0đ — trạng thái triển khai 27/10/2026

## Mã đã hoàn thiện

- Cloudflare static entrypoint dùng lại Market, giao diện quán/vận hành và nhận diện trắng/xanh/Inter; hash router, Google OAuth PKCE, Bearer API transport. Không có dữ liệu/đơn giả trong entrypoint mới.
- Supabase Edge API kiểm tra danh tính, quyền, Origin, kích thước yêu cầu và idempotency; giữ nguyên lõi tính tiền/voucher/giao/hoàn/đối soát. Maps bị tắt. Khi dừng quote mới, đơn đang tồn vẫn xem thông tin thanh toán và được vận hành xử lý.
- Migration dữ liệu trống, RLS và role runtime hạn chế. DDL không chạy trong request production. Hồ sơ giả không chuyển tự động thành hồ sơ bán hàng.
- Build tĩnh có CSP hash, font/ảnh cục bộ; không chấp nhận secret/service_role key ở cấu hình frontend. GitHub Pages chuyển sang giới thiệu, chỉ hiện liên kết app khi cấu hình MVP_APP_URL.
- Poll trạng thái đơn còn hoạt động mỗi 30s khi trang đang hiển thị; không polling catalogue nền. Retry thao tác vận hành giữ idempotency key khi chưa rõ kết quả.

## Đã kiểm tra cục bộ

32 kiểm thử: nghiệp vụ cũ, API Edge với danh tính giả được tiêm trong test, migration/RLS trên PostgreSQL nhúng, giá và thao tác trùng, chặn quán chưa đủ điều kiện, không lộ lỗi database, key public và điều hướng nội bộ. TypeScript, Deno check, build Cloudflare, kiểm tra artifact/CSP và build Next.js tương thích đều qua. Hướng dẫn CLI deploy đã đối chiếu với help của Supabase CLI.

## Chưa nghiệm thu

Chủ dự án chưa có tài khoản Cloudflare/Supabase nên chưa có URL Cloudflare, Supabase project hoặc Google OAuth client thực. Chưa triển khai Edge/DB từ xa, chưa thử login Google thật, chưa chạy tranh tồn multi-instance từ xa, chưa restore backup thật, chưa thử 6 sinh viên hoặc giao dịch tiền thật. Kiểm thử local không thay thế các bước đó.

Trình tự tạo tài khoản/cấu hình: [zero-budget-setup.md](zero-budget-setup.md). Không báo MVP đã mở bán khi chỉ có bản build hoặc trang giới thiệu.
