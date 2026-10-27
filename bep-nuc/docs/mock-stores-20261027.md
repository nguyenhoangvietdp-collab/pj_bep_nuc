# Ba cửa hàng mô phỏng — 27/10/2026

Chủ sản phẩm cho phép tạo ba cửa hàng hư cấu tại ba địa chỉ dưới đây để phân bổ toàn bộ ảnh món còn lại. Tên Bếp Nguyễn Chí Thanh, Bếp Giải Phóng và Bếp Điện Biên Phủ là tên mô phỏng, không xác nhận có doanh nghiệp tương ứng hoạt động tại các địa chỉ này.

| Cửa hàng | Địa chỉ do chủ sản phẩm chỉ định | Món |
| --- | --- | --- |
| Bếp Nguyễn Chí Thanh | Số 8 đường Nguyễn Chí Thanh, Hà Nội | Cháo quẩy, bánh khọt, hoành thánh, xôi cốm |
| Bếp Giải Phóng | Số 10 đường Giải Phóng, Hà Nội | Bánh rán đường, nem nướng, bánh xèo, bánh bột lọc |
| Bếp Điện Biên Phủ | Số 30 đường Điện Biên Phủ, Hà Nội | Nem chua rán, nộm sứa, nem tai |

BÒ TƠ MAI CHÂU giữ ba món đã chọn: bún riêu, bún đậu và bánh dày. Tổng cộng 14 ảnh món Drive được gán đúng một lần. Ảnh và giá của các quán mô phỏng lấy từ bộ dữ liệu ảnh đã có, không bịa tồn, giờ nhận hoặc tọa độ.

Catalogue giới thiệu ghi tên quán, địa chỉ và nhãn mô phỏng trên từng món. Tìm kiếm không dấu hỗ trợ tên món, tên quán và địa chỉ; bộ lọc ngân sách/sắp xếp dùng giá đang hiển thị.

Hồ sơ mô phỏng lưu `mock: true`, `approved: false`, `signed: false`, `recurring: false`, tọa độ null. Không tạo lô nhận tiền từ các hồ sơ này. Không được dùng chúng để thỏa điều kiện đối tác thật hoặc mở cổng pilot. Chưa bổ sung luồng đặt hàng bằng tiền giả riêng cho các quán mô phỏng.

Kiểm chứng: 58 kiểm thử nghiệp vụ đạt; TypeScript và bản dựng tĩnh đạt. Kiểm tra trình duyệt ở 360, 390, 768 và 1366px: đủ 14 món/4 quán, nhãn mô phỏng trên 11 món, chọn/chuyển quán, tải lại giữ đúng quán, bỏ lọc, tìm địa chỉ không dấu và ngân sách 5.000đ. Không có cuộn ngang toàn trang hoặc lỗi JavaScript trong các kịch bản này. API production từ chối báo giá quán mô phỏng ngay cả khi các quán thật khác đã đủ điều kiện pilot.
