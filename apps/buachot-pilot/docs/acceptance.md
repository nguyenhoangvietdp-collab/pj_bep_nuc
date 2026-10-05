# Biên bản kiểm tra kỹ thuật — 05/10/2026

## Đã xác nhận bằng dữ liệu giả

- Kiểm tra TypeScript và build Next.js thành công.
- 10 bài kiểm thử chạy qua: giá30k/50k/100k với3số lượng,3voucher và6mức khoảng cách; biên tài chính/làm tròn; thời gian Việt Nam; giữ/hết giữ; tiền muộn; ghi nhận tiền/mã giao/hoàn/payout trùng; quán hủy/no-show; dữ liệu sinh viên; gate quán giả/ngân sách; chặn báo giá vượt23:59.
- PostgreSQL nhúng: hai sinh viên tranh suất cuối, hai yêu cầu tranh cùng voucher và rollback mutation lỗi đã xác nhận bằng transaction thật. Chưa chạy multi-instance với Supabase từ xa.
- Smoke HTTP đủ ba vai trò: đơn50.000đ, voucher20%, thu38.000đ, giao một lần, đối soát/trả32.500đ. cash5.500đ; contribution2.500đ sau C3.000đ. Kiểm tra sinh viên bị từ chối export ops và Origin lạ bị từ chối.
- Đã xem giao diện sinh viên trên trình duyệt localhost. API và giao diện chạy cùng server, không dùng dữ liệu mock ở client.

## Còn cần môi trường và hiện trường

Chưa có credentials Supabase/Google Routes, quán ký thật, hồ sơ giá/bảo quản thực tế, khảo sát70sinh viên/phỏng vấn10–20quán. Vì vậy chưa nghiệm thu OTP email thật, tuyến Google thực tế, bảo mật RLS trên dự án Supabase đã cấu hình, triển khai public hoặc tiền ngân hàng thật. Chưa có kết quả kinh doanh, causal experiment hoặc ML.

Mặc định pilot thật bị khóa. Người vận hành có quyền xác nhận hồ sơ đối tác; dấu xác nhận trong app phải được chứng minh bằng hợp đồng/tài liệu ngoài app. Bộ kiểm thử không thay thế công đoạn đó.

## Lặp lại

`npm test`, `npm run type-check`, `npm run build`. Smoke: khởi động bằng APP_MODE=demo, DEMO_NOW=2026-10-05T18:30:00+07:00 và **PGLITE_DIR mới**, rồi `node scripts/smoke.mjs`. Script tạo đơn và tiêu voucher20%; không chạy lại trên dữ liệu đã có đơn nếu muốn đối chiếu các tổng chính xác. Thư mục test tạm và demo không dùng làm dữ liệu thật.
