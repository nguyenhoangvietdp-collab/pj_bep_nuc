# Ảnh món từ đội Bếp Núc — 26/10/2026

## MVP — cập nhật 27/10/2026

Đối chiếu lại thư mục Drive: đủ 14 ảnh, khớp bảng nguồn bên dưới. Catalogue MVP hiển thị toàn bộ trong nhóm “Các món đang chuẩn bị”, với tên, khu vực và giá tham khảo từ tên file. Không tạo quán, tồn kho, giờ nhận hoặc giá đối soát từ ảnh. Tìm kiếm, loại món, ngân sách và sắp xếp áp dụng trên giá tham khảo của nhóm này; bộ lọc quán/đang nhận chỉ hiển thị lô bán thật. Món chuẩn bị không có nút đặt hàng và không được tính voucher. Khi đã có listing thật dùng cùng ảnh, ẩn bản chuẩn bị để tránh trùng. Giữ nguyên nguồn và SHA-256 của các JPEG đã tải.

Phần mô tả demo phía dưới là lịch sử trước khi chuyển sang MVP; trang GitHub Pages hiện chỉ giới thiệu.

Bộ tính thưởng tự nhận dùng điểm giả định Đống Đa (21.016, 105.826), không gắn điểm này làm địa chỉ quán thật. Khách nhập tọa độ hoặc chủ động yêu cầu vị trí một lần. Phép tính chạy trên thiết bị, không gửi/lưu tọa độ trong API hay tài khoản: Haversine đường chim bay, 8 điểm phần trăm/km, tối đa 2 km. Giá mô phỏng áp giảm nền 5%, voucher 7/10/20% và thưởng, chưa có trần tài chính quán; không phải báo giá giao dịch, không giữ suất/trừ voucher/mở nhận tiền. Backend production tiếp tục bỏ tọa độ và không thưởng khoảng cách cho đơn thật đến khi có dữ liệu quán và chính sách đã xác nhận.

Nguồn: https://drive.google.com/drive/folders/1nHmOgV3W11EQLpEQ8V6h8TL18mQ-4_PQ . 14 Google Pics được xuất bằng nút Xuất → Kích thước ban đầu trong giao diện Google; không sửa ảnh gốc, không tăng độ phân giải, không thay quyền chia sẻ. Bản JPEG phục vụ từ website, không hotlink vào Drive và không yêu cầu khách đăng nhập Google. Tổng dung lượng 1.171.985 byte (~1,12 MiB).

Bảng ghép và SHA-256: `product-image-sources.csv`. Tên món, khu vực và giá tham khảo lấy từ tên file; sửa cách viết “Nôm sứa” thành “Nộm sứa” ở nhãn giao diện, vẫn giữ nguyên tên nguồn trong CSV. Không suy luận khẩu phần, thành phần, dị ứng, chất lượng hoặc tính xác thực của ảnh từ hình nhìn thấy. Không xóa watermark hoặc dấu hiệu có sẵn trong ảnh.

Catalogue GitHub Pages thay 4 món giả cũ bằng 14 món có ảnh tương ứng. Mỗi món có tồn demo 5 suất; giờ nhận và ba điểm nhận theo khu vực chỉ mô phỏng, không đại diện quán đã được xác nhận. Giá hiển thị là giá tham khảo từ tên file, chưa xác minh menu; không mở nhận tiền. Các ảnh món có thể chứa đồ ăn kèm, chưa xác minh những gì có trong một suất.

Vẫn dùng công thức giảm nền 5%, voucher 7%/10%/20%, số lượng 1–3 và logic đơn demo. Kho lưu trình duyệt chuyển sang v2 để đơn từ menu cũ không bị ghép sai món/giá; chỉ dữ liệu thử cũ không được nạp lại, không đụng dữ liệu pilot thật. Ứng dụng giao dịch chính không tự nhập quán hoặc thay database từ các ảnh này.

Ảnh card và chi tiết dùng object-fit: contain để giữ toàn bộ bố cục ảnh, tải lười cho catalogue; không tạo chứng nhận dị ứng từ ảnh. Kiểm tra mapping asset, số món, giá và lọc trong tests/pages-demo.test.ts.
