# Bếp Núc — định hướng giao diện tham khảo BCG

Đối chiếu trang chủ [BCG](https://www.bcg.com/) ngày 06/10/2026 bằng trình duyệt. BCG là nguồn tham khảo về phong cách; Bếp Núc dùng tên, nội dung và luồng giao dịch riêng.

## Các nét đã áp dụng

- Tiêu đề serif lớn, nhãn mục nhỏ và nội dung sans-serif dễ đọc. Font hệ thống hỗ trợ tiếng Việt, không tải font thương hiệu BCG.
- Khối đầu trang chuyển sắc xanh sáng, chữ xanh đậm; thanh điều hướng trắng nổi. Nền tĩnh để nhẹ và tránh chuyển động không cần thiết.
- Khoảng trắng rộng, các mục có đường phân cách, thẻ ít bo góc. Hệ màu, chữ và nút thống nhất cho sinh viên/quán/vận hành.
- Điều hướng vào món hôm nay, voucher, đơn hàng và cách nhận bữa. Điện thoại có menu riêng; nút và form có trạng thái focus/bàn phím.

## Điều chỉnh cho nhiệm vụ đặt bữa

Hero giới thiệu ngắn và dẫn vào catalogue. Khối voucher hiển thị trạng thái ba loại từ dữ liệu backend. Thẻ món trình bày quán, giá menu, số suất và giờ nhận; bảo quản/dị ứng có thể mở trước khi đặt. Giá với voucher gốc chỉ là ước tính; báo giá server là giá xác nhận, gồm thưởng nếu có. Không tự tạo lời hứa giá giảm tối đa hay số liệu tác động chưa đo.

Quán và vận hành có tiêu đề gọn thay cho hero lớn. Luồng thanh toán, giữ tồn, voucher, pickup, hoàn và đối soát giữ cùng các thao tác backend. Giao diện bot/Mini App trong tương lai nên dùng chung token màu/chữ/nút, giữ giá cuối và thao tác chính rõ trên màn hình nhỏ.

## Kết quả kiểm tra

- TypeScript đạt; 10 kiểm thử giao dịch hiện có đạt sau thay đổi giao diện.
- Trình duyệt demo: hai suất giá menu 50.000đ, voucher 20% cho giá ước tính và giá server cùng 76.000đ, tiết kiệm 24.000đ; tồn giảm từ 12 còn 10 và voucher chuyển sang đang giữ.
- Đã xem giao diện sinh viên, quán, vận hành; menu điện thoại tự đóng sau chọn mục. Màn hình 390px không tràn ngang. Liên kết về đầu trang đã kiểm tra. Console không ghi nhận lỗi.
- Build production chưa được thực thi: hệ thống xét duyệt tự động gặp giới hạn sử dụng tài khoản. Cần chạy lại build trước triển khai.
- Ảnh kiểm tra lưu tại `artifacts/buachot-bcg-ui/` trong workspace; không đưa dữ liệu demo này vào thẩm định hiệu quả kinh doanh.
