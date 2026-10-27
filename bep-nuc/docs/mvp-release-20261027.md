# MVP Bếp Núc — cập nhật 27/10/2026

## Dữ liệu chủ sản phẩm cung cấp

- Quán: BÒ TƠ MAI CHÂU.
- Địa chỉ: 198 Thái Thịnh, Đống Đa, Hà Nội.
- Tài khoản vận hành: email chủ sản phẩm đã chỉ định, cấu hình riêng trên máy chủ; không đưa email vào mã frontend.
- Ba món được chọn theo quyền chủ sản phẩm giao: bún riêu 45.000đ, bún đậu 60.000đ, bánh dày 35.000đ, dùng ảnh tương ứng từ bộ Drive.
- Đối soát mới: quán nhận 90% tiền món khách thực trả sau ưu đãi, không gồm phí giao; Bếp Núc giữ 10% trước chi phí. Chủ sản phẩm đã xác nhận mẫu số này.

## Những thay đổi dùng thật

- Bỏ bộ tính ưu đãi theo điểm nhận giả định và giá không áp trần quán.
- Bản Cloudflare hiện chưa áp thưởng di chuyển; trang ưu đãi thông báo rõ điều này, không dùng điểm giả định để hứa giảm giá.
- Trang ưu đãi dùng lô hàng thật, voucher khả dụng của tài khoản và giá hiển thị chung với catalogue. Báo giá backend vẫn là căn cứ chuyển khoản.
- Ảnh chưa gắn với lô mở bán được trình bày là ảnh giới thiệu, không có nút mua hoặc giá ưu đãi có thể gây nhầm lẫn.
- Lô mới mặc định đối soát 90/10. Hợp đồng khoản cố định cũ vẫn được hỗ trợ; báo giá cũ không bị tính lại.
- Làm tròn khoản quán lên đến đồng nguyên: quán nhận `T - floor(T/10)`. Bếp Núc giữ `floor(T/10)` trước chi phí.
- Trần thưởng và điều kiện voucher tiếp tục bảo vệ chi phí và biên tối thiểu của lô. Với chia 90/10, `T` phải ít nhất bằng `10 × (chi phí + biên tối thiểu)`. Không tự bỏ chi phí để món đủ điều kiện.
- Phí giao báo riêng, khách đồng ý trước thanh toán; chi phí người giao ghi riêng. Không chia phí giao cho quán.
- Khởi tạo quyền vận hành chỉ cho email cấu hình ở máy chủ đã được Supabase xác minh, khi chưa có tài khoản ops; có nhật ký. Không nhận vai trò do client khai.
- Ghi nhận địa chỉ quán khi chưa có tọa độ bằng giá trị null; không dựng tọa độ ước chừng. Luồng tuyến đi bộ bỏ qua quán chưa có tọa độ.

## Hoàn tất vận hành trước nhận tiền

Chưa có số suất, khung nhận, bảo quản/dị ứng, chi phí thực tế và tài khoản nhận chuyển khoản do chủ sản phẩm xác nhận. Không tự tạo các con số này. Quán được lưu ở trạng thái chờ hoàn tất hồ sơ; chưa có lô bán thật.

Chủ sản phẩm đăng nhập bằng email vận hành đã chỉ định, vào khu vực nội bộ, hoàn tất thông tin đối tác và đăng lô. Biểu mẫu có chọn ảnh/tên/giá sẵn, cách chia 90/10, số suất và khung nhận. Giá tham khảo từ tên ảnh chỉ là điền nhanh; vận hành xác nhận trước khi đăng.

Cổng mở bán hiện tại vẫn kiểm tra cấu hình nhận tiền và điều kiện pilot trong backend. Việc hoàn thiện giao diện hoặc thêm một hồ sơ quán chưa tự mở cổng này.

## Kiểm chứng

Kiểm thử riêng tỷ lệ 90/10 ở các mức giá, số lượng 1–3, cả ba voucher, làm tròn đồng, trần thưởng, hợp đồng cố định cũ, tách phí giao, quyền ops và bảo toàn khoản đối soát của báo giá đã chốt. Chưa có giao dịch tiền thật hoặc giao đồ ăn thật.
