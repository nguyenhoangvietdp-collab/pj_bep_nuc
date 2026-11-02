# Hoa tham khảo và yêu cầu đặt hàng thật — 02/11/2026

Website chính: https://pj-bep-nuc.nguyenhoangvietdp.workers.dev/#/meals . Nhóm hàng gồm Đồ ăn và Hoa; hoa dùng cùng renderer thẻ sản phẩm, trang chi tiết, checkout yêu cầu, báo giá và Đơn hàng của đồ ăn.

## Danh mục được cung cấp

12 ảnh đã được đối chiếu theo nhóm/màu; chưa xác minh được lô, độ tươi, số cành từ ảnh hoặc khả năng cung cấp thực tế. Mức tham khảo do người dùng cung cấp; giá mục tiêu bằng 70% mức đó, không phải giá bán hoặc ưu đãi đã cam kết. Không gồm bình hay thiết kế bó tặng.

| Sản phẩm | Quy cách mỗi đơn vị mua | Mức tham khảo | Giá mục tiêu |
|---|---|---:|---:|
| Kèn hồng 1T | 10 cành | 99,000đ | 69,300đ |
| Ly kép trắng | 5 cành; 3–4 tai theo bảng cung cấp; chưa kiểm đếm từ ảnh | 129,000đ | 90,300đ |
| Ly kép hồng | 5 cành; 4–5 tai theo bảng cung cấp; chưa kiểm đếm từ ảnh | 159,000đ | 111,300đ |
| Chuối điểu | 30 bông | 75,000đ | 52,500đ |
| Hướng dương | 5 bông | 29,000đ | 20,300đ |
| Hoa chuông | 1 bó; Chưa xác định số cành trong bó | 49,000đ | 34,300đ |
| Mao lương mix | 10 bông | 49,000đ | 34,300đ |
| Mao lương cánh bướm | 1 bó; Chưa xác định số cành trong bó | 59,000đ | 41,300đ |
| Scabiosa | 1 bó; Chưa xác định số cành trong bó | 49,000đ | 34,300đ |
| Phăng tím viền | 20 bông | 59,000đ | 41,300đ |
| Phăng đỏ nhung | 20 bông | 59,000đ | 41,300đ |
| Phăng mix xanh–trắng | 20 bông | 59,000đ | 41,300đ |

Nguồn ảnh, tên tệp và SHA-256 lưu trong [flower-catalogue.json](../lib/flower-catalogue.json); ảnh gốc giữ nguyên. Danh mục chung cho frontend và máy chủ ở [request-catalogue.ts](../lib/request-catalogue.ts). Không gán hai tiệm sáng tạo của DEMO trước đây cho yêu cầu thật.

## Hành trình chung

1. Danh mục → chi tiết → kiểm tra lựa chọn; không có tồn hoặc giờ nhận giả.
2. Đăng nhập, chọn số đơn vị, voucher mong muốn và cách nhận; tài khoản chờ duyệt vẫn gửi được yêu cầu.
3. Gửi yêu cầu thật vào cùng hàng đợi vận hành và Đơn hàng. Chưa giữ hàng, chưa tiêu voucher và chưa thu tiền.
4. Vận hành chọn lô/tiệm thật đã xác minh, đúng mã loại hoa và quy cách. Lô hoa phải có ảnh, kiểm đếm số cành, tình trạng, bảo quản, giá, khoản trả tiệm và khung nhận thực tế. Bó chưa biết số cành chỉ dùng ở giai đoạn nhu cầu; báo giá cần số cành thực tế.
5. Vận hành đề xuất giá và ưu đãi thực tế; có thể báo không voucher khi chương trình chưa đủ điều kiện. Khách nhìn thấy giá, quy cách, voucher, phí giao/hỗ trợ và tổng tiền để đồng ý đúng phiên bản báo giá.
6. Sau chấp nhận, dùng luồng đơn hàng/thanh toán/nhận hàng/hỗ trợ hiện hành. Giữ các cổng pilot, tài khoản, ngân sách và xác nhận tiền hiện có.

Không tự áp dụng giảm 30% hoặc 5% vào báo giá. Không seed tiệm hoặc lô giả vào production. Không chuyển dữ liệu `bep-nuc-flowers-demo-v1` trên trình duyệt thành yêu cầu thật và không xóa dữ liệu đó. Widget mua hoa cũ ngừng được nhập vào website; GitHub Pages chỉ dẫn sang website Workers.

## API và tương thích

Giữ action `meal_request`, `confirm_meal_request`, `accept_meal_request` và `reject_meal_request`. `productId` tùy chọn được máy chủ đối chiếu; snapshot quy cách/giá mục tiêu do máy chủ tạo, không lấy từ dữ liệu giá của trình duyệt. `appliedRate` là ưu đãi báo giá, độc lập với `rate` mong muốn. Yêu cầu đồ ăn cũ tiếp tục hoạt động. Các trường tùy chọn trong JSON không cần migration SQL.

Các mục chưa xác nhận (CTC, các giống hồng, phi yến, hoàng kim, đồng tiền nhí và những tên/quy cách còn thiếu) chưa được tự thêm vào danh mục hoặc gán giá từ ảnh gần giống.

Kiểm thử nghiệp vụ, tài khoản, xác minh nguồn, báo giá và đồng ý khách chạy trong fixtures/môi trường kiểm thử. Kiểm tra production chỉ đọc danh mục và đường vào đăng nhập; không tạo yêu cầu/đơn giả trên database thật.
