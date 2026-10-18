# Bếp Núc: nghiệm thu hành trình chọn bữa nhanh

Ngày 17/10/2026. Bản này ghi thiết kế và quy trình kiểm chứng; chưa có kết quả người dùng thật.

## Đã triển khai

- Tìm địa chỉ/khu vực và ngân sách mỗi suất trên danh sách; lọc hết giờ và mặc định còn suất. URL lưu bộ lọc khi tải lại.
- Giá thẻ món, chi tiết, lọc ngân sách và sắp xếp dùng chung displayPrice. Sinh viên đã duyệt được xem ước tính voucher còn dùng, đúng ngày và từ 18:00 đến trước 23:59. Không tự chọn hay tiêu voucher.
- Voucher hiện mức giảm thêm, tổng tiền và đề xuất tiết kiệm nhất cho đơn. Tổng tiền backend vẫn là căn cứ thanh toán.
- Sau giữ suất, chuyển focus tới tóm tắt giá/hạn và bước tiếp theo. Thanh tổng tiền và hành động cùng khối trong luồng trang, không dùng hai lớp fixed đè nội dung trên điện thoại.
- Tự cập nhật đơn khi quay lại cửa sổ hoặc tab; mã nhận nổi bật sau xác nhận tiền; trạng thái hủy/hết hạn không dùng tiến trình mua còn hoạt động.
- SUPPORT_EMAIL là hộp thư thật do vận hành cấu hình, tùy chọn. Nút liên hệ mang mã đơn trong tiêu đề email, không có dữ liệu bí mật. Không cấu hình thì không hiện nút; trước pilot thật phải cấu hình và thử gửi nhận.

## Kiểm tra kỹ thuật và giao diện

Chạy npm test, npm run type-check và npm run build. HTTP market-smoke dùng database mới và tiền giả: giữ/bỏ giữ, tạo đơn, xác nhận tiền, pickup một lần, hủy/hoàn và đối soát.

Checklist duyệt trực tiếp chưa xác nhận: 390×844, 360×800, 1366×768; phóng chữ 200%; bàn phím số mở ở ngân sách; Tab/Shift+Tab/Escape và focus dialog; tổng tiền không che trường nhập; quay lại sau ứng dụng ngân hàng; từ chối geolocation vẫn báo giá; clipboard và email hỗ trợ. Không suy từ test HTTP thành đã đạt checklist này.

## Thử định tính với 6 sinh viên

Không dùng tiền thật. Xin đồng ý tham gia và ghi chú trước thử; dùng mã S01–S06, không ghi OTP hoặc tài khoản ngân hàng thật. Tuyển người chưa dùng Bếp Núc; không hướng dẫn cách thao tác trước nhiệm vụ.

A là giao diện trước thay đổi, commit 952bdf8 trên GitHub. B là bản hiện tại. Chạy hai bản với DB demo riêng, cùng mức giá, tồn, voucher và giờ đóng băng. Hai bộ món X/Y tương đương về số lựa chọn, khoảng giá và khung nhận. Không dùng chung DB giữa tiến trình.

| Người | Lượt 1 | Lượt 2 |
|---|---|---|
| S01 | A / X | B / Y |
| S02 | B / X | A / Y |
| S03 | A / Y | B / X |
| S04 | B / Y | A / X |
| S05 | A / X | B / Y |
| S06 | B / X | A / Y |

Nhiệm vụ mỗi lượt:
1. Chọn một bữa không quá 40.000đ/suất ở khu vực được ghi trên bộ món, có thể đến nhận trong khung 18:30–19:30. Thời gian đến thực tế do người tham gia tự cân nhắc, không giả định tuyến đường an toàn.
2. Đặt một suất, tự chọn voucher; đến màn hướng dẫn chuyển tiền giả. Hỏi: trả bao nhiêu, chuyển nội dung gì, đã được nhận chưa, bước tiếp theo là gì?
3. Cho xem đơn hết hạn trong dữ liệu thử riêng. Hỏi: có nên chuyển thêm không, nếu đã chuyển thì xử lý thế nào?

Người điều phối chỉ nói lại nhiệm vụ. Mỗi lần giải thích cách dùng tính là một trợ giúp. Bắt đầu đồng hồ khi giao nhiệm vụ, dừng khi chọn đúng món đáp ứng điều kiện; ghi riêng thời gian đến hướng dẫn thanh toán. Ghi thao tác quay lại và lời nói nguyên văn khi hiểu sai.

Dùng biểu mẫu CSV customer-journey-observations.csv; để trống cho tới khi thực sự thử. Completion là hoàn thành cả chọn món và hiểu thanh toán không cần hướng dẫn. Mục tiêu bản B: ít nhất 5/6 hoàn thành; mọi hiểu nhầm dẫn đến chuyển sai tiền, chuyển thêm sau hết hạn hoặc đến nhận trước xác nhận phải được sửa và thử lại. So sánh thời gian và trợ giúp theo từng người, mô tả ảnh hưởng thứ tự; không suy ra tăng chuyển đổi hoặc tác động nhân quả từ nhóm nhỏ.

## Triển khai

Bản phát triển chính vẫn là Swin-Biz-Rockstar 2026/bep-nuc. Không đổi chính sách tiền, tồn, voucher hoặc lưu trữ. Kiểm thử dùng dữ liệu giả, chưa mở giao dịch thật. Ghi kết quả kỹ thuật thực tế vào báo cáo bàn giao; không đánh dấu checklist người dùng là đạt khi chưa quan sát.

## Kết quả thực tế ngày 17/10/2026

- 17 kiểm thử đạt, bao gồm giá/đủ điều kiện voucher, ngân sách, sắp xếp, mốc 18:00–23:59, voucher đã giữ và email hỗ trợ chống chèn dòng.
- TypeScript đạt. Production build tại .next-journey đạt sau thay đổi, không còn cảnh báo CSS align-items.
- Đã tạo DB tiền giả riêng gồm 3 quán và 6 món cho smoke test.
- Chưa chạy được HTTP smoke mới: công cụ chặn cả lệnh Start-Process chạy nền và lệnh next start trong phiên trực tiếp với thông báo “blocked by policy”. Không đánh dấu HTTP hoặc browser là đạt. Không thay công cụ để vượt chặn.
- Chưa thử với 6 sinh viên, chưa kiểm tra trực quan mobile/bàn phím/phóng chữ hoặc OTP/chuyển khoản thật. Mẫu quan sát vẫn trống.

## Đợt nhận diện cam–kem, 17/10/2026

Mốc A cho đợt này: `.data/ux-baselines/before-orange-20261017-123237.zip`. Đây là mã giao diện trước thay nhận diện (đã có chỉnh hành trình vòng trước), không phải commit 952bdf8. Lưu commit 952bdf8 chỉ cho nghiên cứu so sánh phiên bản cũ hơn. Giữ bảng đảo thứ tự S01–S06 và hai bộ món X/Y như trên, nhưng dùng mốc A này khi đánh giá tác động của đợt đổi nhận diện.

Bản ZIP chứa app/lib/tests/scripts/public và cấu hình mẫu; không chứa tài khoản thật, .env.local, database, thư viện hoặc build. Giải nén vào thư mục riêng, cài bằng lockfile, dùng database demo khác tên cho mỗi bản; không ghi đè ứng dụng chính.

Bản B: cam #C83E16, nền #FFF8EE, chữ #16382B. Một ô tìm kiếm; ngân sách nhanh 30/40/50 nghìn; bỏ riêng từng bộ lọc; thẻ ngang dưới 600px, 2 cột ở 600–999px, 3 cột từ 1000px. Giá mỗi suất và tổng chọn 1–3 suất tách rõ. Chỉ dẫn voucher theo thời gian và trạng thái. Có liên kết tiếp tục đơn chờ thanh toán. CSS khách hàng được giới hạn dưới .commerce.

Đã chạy 19 kiểm thử và TypeScript đạt. Đo số học tương phản: trắng/cam 5,05:1; xanh đen/kem 12,18:1; chữ phụ/kem 6,07:1. Đây là kiểm tra các cặp màu được chọn, không phải chứng nhận toàn bộ trang đạt WCAG.

Chưa có nghiệm thu ảnh chụp, tương tác trình duyệt, bàn phím thật hoặc kết quả sáu sinh viên. Lệnh mở máy chủ bị chặn trong phiên trước của cùng công việc; không thử cách khác để vượt chặn. Cần hoàn tất checklist trực tiếp trước khi tuyên bố sẵn sàng pilot. Chưa đẩy GitHub hoặc mở giao dịch thật trong đợt này.
