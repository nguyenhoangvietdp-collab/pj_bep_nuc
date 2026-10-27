# Ảnh món từ đội Bếp Núc — 26/10/2026

## MVP — cập nhật 27/10/2026

Đối chiếu lại thư mục Drive: đủ 14 ảnh, khớp bảng nguồn bên dưới. Catalogue MVP hiển thị toàn bộ trong nhóm “Các món đang chuẩn bị”, với tên, khu vực và giá tham khảo từ tên file. Không tạo quán, tồn kho, giờ nhận hoặc giá đối soát từ ảnh. Tìm kiếm, loại món, ngân sách và sắp xếp áp dụng trên giá tham khảo của nhóm này; bộ lọc quán/đang nhận chỉ hiển thị lô bán thật. Món chuẩn bị không có nút đặt hàng và không được tính voucher. Khi đã có listing thật dùng cùng ảnh, ẩn bản chuẩn bị để tránh trùng. Giữ nguyên nguồn và SHA-256 của các JPEG đã tải.

Phần mô tả demo phía dưới là lịch sử trước khi chuyển sang MVP; trang GitHub Pages hiện chỉ giới thiệu.

Bộ tính thưởng tự nhận dùng điểm giả định Đống Đa (21.016, 105.826), không gắn điểm này làm địa chỉ quán thật. Khách nhập địa chỉ hoặc địa danh gần nhà; API Bếp Núc gọi Photon/komoot (OpenStreetMap) một lần khi bấm tìm. Khách chọn và xác nhận kết quả gần đúng; không nhập tọa độ hoặc cấp GPS. Địa chỉ/kết quả không được lưu vào database, tài khoản hoặc nhật ký nghiệp vụ. Máy chủ chỉ lưu ngày, số lượt và thời điểm gọi gần nhất để giới hạn chung 20 lượt/ngày UTC, cách ít nhất 1,1 giây giữa các lượt. Nhà cung cấp có thể xử lý/lưu dữ liệu theo chính sách riêng; không nhập tên người, điện thoại hoặc thông tin riêng tư khác.

Photon không cần API key hoặc billing; chỉ phù hợp pilot nhỏ theo [điều kiện dịch vụ công khai](https://github.com/komoot/photon#demo-server), không cam kết uptime. Tìm trong vùng Hà Nội, hiển thị ghi nguồn OpenStreetMap, không gọi theo từng ký tự, không retry tự động và không đổi nhà cung cấp âm thầm khi lỗi. Chưa tìm được số nhà thì thử địa danh công cộng gần nhà; không suy đoán kết quả đúng. `POST /functions/v1/bep-nuc/geocode` yêu cầu đúng Origin, giới hạn body và đầu vào. Thay provider bằng cách sửa dependency trong entrypoint; không cần sửa giao diện.

Sau xác nhận địa chỉ, phép tính chạy trên thiết bị: Haversine đường chim bay, 8 điểm phần trăm/km, tối đa 2 km. Giá mô phỏng áp giảm nền 5%, voucher 7/10/20% và thưởng, chưa có trần tài chính quán; không phải báo giá giao dịch, không giữ suất/trừ voucher/mở nhận tiền. Backend production tiếp tục bỏ tọa độ và không thưởng khoảng cách cho đơn thật đến khi có dữ liệu quán và chính sách đã xác nhận.

Nguồn: https://drive.google.com/drive/folders/1nHmOgV3W11EQLpEQ8V6h8TL18mQ-4_PQ . 14 Google Pics được xuất bằng nút Xuất → Kích thước ban đầu trong giao diện Google; không sửa ảnh gốc, không tăng độ phân giải, không thay quyền chia sẻ. Bản JPEG phục vụ từ website, không hotlink vào Drive và không yêu cầu khách đăng nhập Google. Tổng dung lượng 1.171.985 byte (~1,12 MiB).

Bảng ghép và SHA-256: `product-image-sources.csv`. Tên món, khu vực và giá tham khảo lấy từ tên file; sửa cách viết “Nôm sứa” thành “Nộm sứa” ở nhãn giao diện, vẫn giữ nguyên tên nguồn trong CSV. Không suy luận khẩu phần, thành phần, dị ứng, chất lượng hoặc tính xác thực của ảnh từ hình nhìn thấy. Không xóa watermark hoặc dấu hiệu có sẵn trong ảnh.

Catalogue GitHub Pages thay 4 món giả cũ bằng 14 món có ảnh tương ứng. Mỗi món có tồn demo 5 suất; giờ nhận và ba điểm nhận theo khu vực chỉ mô phỏng, không đại diện quán đã được xác nhận. Giá hiển thị là giá tham khảo từ tên file, chưa xác minh menu; không mở nhận tiền. Các ảnh món có thể chứa đồ ăn kèm, chưa xác minh những gì có trong một suất.

Vẫn dùng công thức giảm nền 5%, voucher 7%/10%/20%, số lượng 1–3 và logic đơn demo. Kho lưu trình duyệt chuyển sang v2 để đơn từ menu cũ không bị ghép sai món/giá; chỉ dữ liệu thử cũ không được nạp lại, không đụng dữ liệu pilot thật. Ứng dụng giao dịch chính không tự nhập quán hoặc thay database từ các ảnh này.

Ảnh card và chi tiết dùng object-fit: contain để giữ toàn bộ bố cục ảnh, tải lười cho catalogue; không tạo chứng nhận dị ứng từ ảnh. Kiểm tra mapping asset, số món, giá và lọc trong tests/pages-demo.test.ts.
