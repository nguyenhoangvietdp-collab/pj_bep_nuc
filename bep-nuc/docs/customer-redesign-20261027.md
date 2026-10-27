# Tinh chỉnh giao diện khách hàng — 27/10/2026

## Kết quả

- Giữ trắng, xanh #0C2B15, Inter tự lưu và 14 ảnh đội cung cấp.
- Header có Chọn bữa / Ưu đãi / Đơn hàng và vùng tài khoản; mobile hai hàng, không cuộn ngang.
- Trang chủ và catalogue ưu tiên ảnh món. Khi chưa có lô thật, bỏ khối 0 món còn suất trước danh mục chuẩn bị.
- Ưu đãi chuyển sang /offers (Cloudflare: #/offers), chọn món qua dish là basename của ảnh. Không hợp lệ thì yêu cầu chọn lại. Có route tương ứng ở Next.js.
- Bộ tính chia Chọn món / Địa chỉ xuất phát / Voucher. Không mặc định voucher; chọn voucher tính lại tại thiết bị. Ảnh và giá tóm tắt thành cột riêng ở desktop, xếp dọc ở mobile. Giá có nhãn mô phỏng và trần quán chưa xác định.
- API Photon, giới hạn gọi và chính sách tiền/tồn không thay đổi. Địa chỉ/tọa độ không đưa vào URL hoặc lưu trữ browser; rời trang hủy dữ liệu trong bộ nhớ.
- Nối /api/geocode cho bản Next.js bằng handler chung, không tách thêm logic provider hoặc rate limit.
- Thu gọn CSS cũ của menu/bộ tính và cách hiển thị dạng hàng; dùng grid ảnh món nhất quán.
- Thứ tự đơn: chờ tiền ưu tiên chuyển khoản; đã trả tiền ưu tiên mã nhận; đơn hủy/hết hạn không hướng dẫn đến quán hoặc vẽ tiến trình đang mua.
- Sửa heading chính ở trang chi tiết món và focus sau khi đóng bộ lọc bằng Escape.

## Kiểm chứng đã thực hiện

- 42 kiểm thử Node/TypeScript qua, gồm URL /offers và ánh xạ đủ 14 món; các kiểm thử nghiệp vụ tồn, voucher, tiền, quyền và idempotency vẫn qua.
- Build Next.js vào .next-redesign-check, TypeScript, build static và kiểm tra CSP/artifact qua.
- Chrome headless, HTTP được chặn bằng fixture tiền giả: 360×800, 390×844, 768×1024, 1366×768. Sáu màn cơ bản × bốn kích thước và bảy trạng thái giao dịch × bốn kích thước; không tràn ngang, mỗi trang có một main/H1, không lỗi JavaScript trong các lần chạy đạt.
- Màn cơ bản: catalogue, ưu đãi, đăng nhập, checkout chưa chọn món, đơn khách chưa đăng nhập, trang chủ.
- Trạng thái giao dịch: chi tiết món, kiểm tra/giữ suất, chờ tiền, đã trả tiền/mã nhận, hết hạn, hủy, chờ hoàn. Đây là fixture, không phải đơn thật trên production.
- Kiểm tra chọn món từ card, không tự chọn voucher, tìm/xác nhận địa chỉ, tính giá, nhãn 7%, bảo toàn q/budget khi quay về, mã món không hợp lệ, Inter được tải, Escape và phục hồi focus, CSS zoom 200% ở màn 360px.
- Bản chụp desktop catalogue trước sửa chưa có ảnh món trong màn đầu; sau sửa ảnh đầu xuất hiện khoảng y=457px ở 1366px. Đây là quan sát bố cục, không phải kết quả đo chuyển đổi.

Ảnh kiểm tra trên máy: C:/Users/Admin/AppData/Local/Temp/bep-nuc-ux-before-20261027 và C:/Users/Admin/AppData/Local/Temp/bep-nuc-ux-after-20261027. Các screenshot trạng thái mua dùng dữ liệu và tiền giả.

## Giới hạn

Chưa tuyển sáu sinh viên, chưa kiểm tra bàn phím ảo trên điện thoại thật, chưa xác nhận tăng chuyển đổi. Không thực hiện đăng nhập Google/thu tiền thật trong kiểm tra giao diện. Pilot chưa mở bán; bộ tính dùng điểm nhận giả định và chưa áp trần tài chính quán. Kiểm tra HTTP công khai không thay cho nghiệm thu vận hành.
