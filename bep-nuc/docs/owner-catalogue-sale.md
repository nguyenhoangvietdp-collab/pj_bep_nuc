# Giá menu, giảm nền 5% và voucher tự lấy

Chủ dự án xác nhận ngày 27/11/2026 dùng giá menu cho danh mục món ăn, danh mục hoa và lô tự đăng có giảm đàm phán. Danh mục lấy giá menu từ `referencePrice`.

- Giá menu P = `referencePrice`.
- Giá khách trước voucher Q = ceil(P × 95%).
- Khoản quán nhận F = P × (1 − r), làm tròn xuống đến đồng nếu lẻ. `catalogue-sale-policy.json` đặt mặc định r = 30% và cho phép ngoại lệ theo mã sản phẩm.
- Khi khách chọn tự lấy, khoản giảm thêm bằng 5% của Q nhân số lượng, làm tròn xuống đến đồng. Máy chủ giới hạn khoản áp dụng theo ngân sách còn lại, ngưỡng đơn và biên tối thiểu. Voucher cơ bản và voucher tự lấy cùng tính trên giá trước voucher.

Ví dụ giá menu 60.000đ cho Q = 57.000đ. Tiệm nhận 42.000đ ở mức 30% hoặc 39.000đ ở mức 35%. Với đủ biên và ngân sách, voucher 10% giảm 5.700đ, còn 51.300đ. Tự lấy giảm thêm 2.850đ, còn 48.450đ.

## Snapshot và đối soát

Snapshot danh mục món ăn và hoa mới dùng `version: 3`. Snapshot không có phiên bản tiếp tục đọc theo định dạng cũ, còn phiên bản 2 dùng `salePrice` đã lưu. Lô đàm phán cũ vẫn đọc theo công thức lúc đăng. Báo giá và đơn đã lưu tiếp tục dùng giá, khoản trả tiệm và mức thưởng đã chốt. Snapshot tự lấy mới dùng `method: "fixed"`; snapshot `"haversine"` vẫn đọc được.

Khi đăng hoặc duyệt lô có giảm đàm phán, kể cả lô hoa, nhập giá menu, mức giảm 30% hoặc 35%, chi phí đầy đủ và đóng góp tối thiểu. Máy chủ tính Q và F từ giá menu, đồng thời từ chối giá gửi lên nếu sai công thức. Báo giá chốt khoản tiệm nhận và kiểm tra đủ biên sau voucher. Công khai hiển thị giá menu, giá khách và các khoản giảm áp dụng cho lô.

## Đăng lô và đặt hàng

Lô đồ ăn mới trên production cần hướng dẫn bảo quản, giờ chế biến theo giờ Việt Nam và ảnh đúng lô tải qua website vào bucket `bep-nuc-lots`. Máy chủ kiểm tra bản ghi tải lên thành công. Giờ chế biến là trường tùy chọn trong demo và trong dữ liệu lô cũ.

Khách có thể gửi yêu cầu để quán xác nhận rồi báo giá, hoặc chọn lô sẵn và giữ suất 10 phút, tùy thời hạn lô. Với đơn tự lấy, chính sách hiển thị từ bước giữ suất. Nếu khách không đến trong khung nhận, Bếp Núc hoàn 100% số tiền đã thanh toán.
