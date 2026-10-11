# Bếp Núc — đối chiếu mục tiêu và kết quả triển khai

Ngày kiểm tra: 07/10/2026. Đây là nghiệm thu kỹ thuật bằng tiền giả, chưa phải bằng chứng khả năng bán hàng hoặc hiệu quả pilot.

## Căn cứ và quyết định

Đối chiếu nhanh hai nguồn chính đã đọc trong lượt thiết kế: [beFood](https://food.be.com.vn/) và [BCG](https://www.bcg.com/). beFood được tham khảo về tìm kiếm, danh sách món/quán và tổ chức thực đơn; BCG được tham khảo về màu xanh, tiêu đề serif và khoảng trắng. Nhận định rằng cách phối hợp này phù hợp Bếp Núc là quyết định thiết kế, chưa được xác nhận bằng nghiên cứu người dùng.

Khách xem công khai. Món trước, quán sau. Một loại món mỗi đơn, 1–3 suất. Tự đến quán nhận; không có giao hàng. Đặt hàng vẫn yêu cầu tài khoản sinh viên đã được duyệt. Không xây ML hoặc bot Telegram trong lần chỉnh này.

## Mục tiêu và bằng chứng

| Mục tiêu | Kết quả triển khai | Bằng chứng / trạng thái |
|---|---|---|
| Khách khám phá trước đăng nhập | Catalogue chỉ đọc công khai; tìm món/quán/địa chỉ không phân biệt dấu; lọc loại món/quán/tồn/giờ nhận | Kiểm thử bộ lọc đạt; HTTP khách trả catalogue, API đơn riêng trả 401 |
| Có hành trình mua bữa rõ | Trang khám phá, trang quán, chi tiết món, checkout, đăng nhập, danh sách/chi tiết đơn | Các route trả HTTP 200; chưa xác nhận hành trình click trên trình duyệt |
| Giá đúng, dễ phân biệt | Giá menu, giá sau giảm nền, ước tính với voucher và giá server; bảng giảm nền/voucher/thưởng/tổng | 30k/50k/100k và số tiền lẻ được kiểm thử; hai suất 50k với voucher 20% = 76.000đ, tiết kiệm 24.000đ |
| Giữ hàng không làm khách mắc kẹt | API khôi phục báo giá; bỏ giữ để chỉnh đơn; hạn giữ server | HTTP giữ hai suất làm tồn 12 còn 10; bỏ giữ hai lần vẫn hoàn tồn về 12; báo giá đã tạo đơn không được giải phóng |
| Đặt bữa gắn thanh toán và nhận hàng | Hướng dẫn chuyển khoản, trạng thái chờ xác nhận, mã nhận sau xác nhận, địa chỉ/khung nhận | HTTP tiền giả đi qua thanh toán, pickup một lần, đối soát và trả quán |
| Hoàn tiền và trả quán khớp sổ | Quán hủy hiển thị trạng thái hoàn; chỉ đơn đã giao được đối soát | Kiểm thử hoàn tiền/quán hủy/no-show và đối soát đạt; HTTP kịch bản giao một đơn, hủy một đơn đã trả tiền đạt |
| Không lộ điều khoản riêng | DTO công khai không có giá sàn/chi phí/biên; báo giá riêng không có payout | Kiểm thử DTO và HTTP kiểm tra trường cấm đạt |
| Món xuất hiện sớm, thao tác phù hợp điện thoại | Hero thấp, header tìm kiếm, thẻ món có ảnh/giá/giờ nhận, CSS responsive, dialog bàn phím và thanh tổng tiền mobile | Đã triển khai; kiểm tra hình ảnh, clipping, focus và thao tác thật trên 390×844 / 1366×768 còn chờ |
| Lượt xem phục vụ pilot | IntersectionObserver chỉ gửi lượt tiếp xúc khi ít nhất nửa thẻ món xuất hiện; chống gửi lặp trong phiên trang | Đã triển khai; chưa xác minh bằng trình duyệt |

## Kết quả kiểm tra kỹ thuật

- TypeScript đạt; 15 kiểm thử nghiệp vụ, catalogue, tìm kiếm, giá, quyền và transaction đạt.
- Build production đạt. HTTP smoke trên bản build dùng database demo riêng đạt.
- Kịch bản HTTP: giữ/khôi phục/bỏ báo giá, tạo đơn, ghi nhận tiền giả, nhận hàng, trả quán; thêm đơn trả tiền rồi quán hủy và hoàn tiền.
- Thu 80.750đ, hoàn 42.750đ, trả quán 32.500đ, tiền còn giữ 5.500đ. Thu − hoàn − trả quán − tiền còn giữ = 0đ.
- Khoản 5.500đ còn giữ gồm 3.000đ chi phí biến đổi cấu hình và 2.500đ contribution. `unallocated` không phải lỗi đối soát hay lợi nhuận.
- Kiểm tra Mathematics for ML: biểu thức chưa làm tròn `P×0,95×(1−v)` tương đương số học với `P−0,05P−0,95Pv` trên 30 điểm ngẫu nhiên. SymPy không có; đây là kiểm tra số, không phải chứng minh đại số. Làm tròn và sàn tài chính kiểm tra bằng bộ test TypeScript.

## Giới hạn nghiệm thu còn lại

Trình duyệt tự động từ chối mở localhost bởi chính sách URL. Không đổi công cụ để vượt chặn. Chưa có ảnh chụp giao diện mới, xác nhận console, clipping, copy clipboard, geolocation, focus dialog hoặc hành trình mua qua thao tác trình duyệt. Không dùng ảnh giao diện BCG cũ làm bằng chứng cho bản thương mại mới.

Context Mode bị xét duyệt tự động chặn việc xuất mã nguồn riêng vào plugin. Việc đọc mã thực hiện cục bộ; không tuyên bố đã index bằng Context Mode. Deep Research dùng mức đối chiếu nhanh, không chạy runner hoặc nghiên cứu chuyển đổi bán hàng.

Ảnh demo là SVG minh họa gắn nhãn; thiếu ảnh thật hiển thị placeholder. Ảnh lô và quán thật cần chuẩn bị dưới `/public/food-images/`; không nhận URL bên ngoài hoặc tự tải ảnh thương hiệu tham khảo. Chưa xây uploader. Chưa thử OTP Supabase, vị trí Google Routes hoặc tiền thật.

Trước mở pilot: kiểm tra trực tiếp các viewport, dùng quán/món/ảnh thật, xác nhận kênh hỗ trợ khách và thẩm định nguồn hàng, điều khoản quán, ngân sách theo runbook. Không suy ra hiệu quả kinh doanh từ số liệu demo.

## Chạy lại demo

`scripts/demo-market.ts` tạo 3 quán và 6 món giả, gồm món hết suất và món chưa đến giờ nhận. Chỉ chạy khi không có `DATABASE_URL`, `APP_MODE=demo` và `PGLITE_DIR` có tên `market-demo`. Script từ chối ghi đè database đã có báo giá/đơn/tiền.

`scripts/market-smoke.mjs` nghiệm thu HTTP với database mới và server localhost. Sau smoke, dữ liệu đã có đơn; dùng thư mục demo mới cho lần chạy kế tiếp. `DEMO_NOW` đóng băng thời gian để kết quả lặp lại; đếm ngược/expiry theo thời gian thực cần thử không đặt biến này.
