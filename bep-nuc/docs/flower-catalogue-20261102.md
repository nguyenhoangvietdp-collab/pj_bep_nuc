# Danh mục hoa DEMO — 02/11/2026

Danh mục gồm 12 sản phẩm và hai hồ sơ sáng tạo tại Hà Nội. Đây không phải đối tác, tồn kho hoặc hoạt động kinh doanh đã xác minh. Giá bán mô phỏng bằng 70% bảng giá người dùng cung cấp; không có căn cứ gọi bảng đó là giá thị trường hoặc giá thường của tiệm.

## Ảnh và quy cách

Nguồn dữ liệu duy nhất là [flower-catalogue.json](../lib/flower-catalogue.json). Mỗi mục lưu tên tệp gốc, SHA-256, ảnh web, quy cách, ghi chú và cặp giá. Script [prepare-flower-demo.py](../scripts/prepare-flower-demo.py) chỉ tạo bản WebP tối đa 1.200px, không thay đổi ảnh trong thư mục nguồn `hoa`.

| Tên | Quy cách cung cấp | Tiền tố ảnh | Tham chiếu | DEMO |
|---|---|---|---:|---:|
| Kèn hồng 1T | 10 cành | 1793582528066 | 99.000 | 69.300 |
| Ly kép trắng | 5 cành; 3–4 tai theo bảng | 1793582528114 | 129.000 | 90.300 |
| Ly kép hồng | 5 cành; 4–5 tai theo bảng | 1793582528176 | 159.000 | 111.300 |
| Chuối điểu | 30 bông | 1793582528415 | 75.000 | 52.500 |
| Hướng dương | 5 bông | 1793582528490 | 29.000 | 20.300 |
| Hoa chuông | 1 bó, chưa rõ số cành | 1793582528618 | 49.000 | 34.300 |
| Mao lương mix | 10 bông | 1793582528919 | 49.000 | 34.300 |
| Mao lương cánh bướm | 1 bó, chưa rõ số cành | 1793582528972 | 59.000 | 41.300 |
| Scabiosa | 1 bó, chưa rõ số cành | 1793582529033 | 49.000 | 34.300 |
| Phăng tím viền | 20 bông | 1793582529086 | 59.000 | 41.300 |
| Phăng đỏ nhung | 20 bông | 1793582529279 | 59.000 | 41.300 |
| Phăng xanh–trắng | 20 bông | 1793582529335 | 59.000 | 41.300 |

Đơn vị tiền: VNĐ. Ảnh được rà bằng hình thái nhóm/màu, chưa phải xác minh giống hoặc chất lượng hàng thật. Không suy ra số cành từ số bông; không dùng toàn bộ bình/bó lớn trong ảnh làm cam kết lượng nhận. Không bao gồm bình, phụ kiện hoặc thiết kế bó tặng.

## Phân bổ hồ sơ sáng tạo

- À Flower & More: ly kép, hoa chuông, mao lương và phăng xanh–trắng; phong cách tối giản/pastel, khu vực Cầu Giấy.
- Khúc Ban Chiều Florist: kèn hồng, chuối điểu, hướng dương, scabiosa và phăng tím/đỏ; cảm hứng cổ điển, khu vực Hoàn Kiếm.

Không dựng tiểu sử chủ tiệm, số điện thoại, địa chỉ nhận, tọa độ, chứng nhận hoặc đánh giá khách hàng. Trường `mock` luôn bật; production không hiển thị hoặc nhận đơn cho các tiệm này.

## Chờ xác nhận

Không đưa vào danh mục đặt hàng: tuyết mai; CTC (chưa giải nghĩa tên viết tắt); phi yến; hoàng kim; lan tường; đồng tiền nhí; bí ngô; phăng hồng dâu/hồng cam/chùm 500gr; hồng lạc thần, Sofia, sao hồng, Fairy Kiss, HC chiết xạ, HC Plume. Ảnh có nhóm gần giống không chứng minh được tên hàng, giống thương mại, khối lượng hoặc quy cách dòng bị cắt.

Ảnh ứng viên phi yến có dáng gần stock; đó là suy luận cần xác nhận, không phải định danh chắc chắn. Mô tả hình thái đối chiếu: [RHS — Matthiola incana](https://www.rhs.org.uk/plants/48284/matthiola-incana/details). Nguồn này không xác nhận tên người bán hoặc giá của ảnh được cung cấp.

## Giới hạn giao dịch

- Seed phiên bản 1 chỉ chạy trong DEMO: 3 đơn vị tồn/mục, khung nhận từ lúc seed đến 3 giờ sau; không làm mới tồn khi tải lại. Lô cũ có đơn/quote tham chiếu được giữ để không phá đơn đã tạo.
- Không tự nâng quy tắc giao dịch của dữ liệu DEMO v1 cũ: dùng vùng dữ liệu DEMO v2 mới để tránh áp nhầm cách giảm giá cũ cho sản phẩm mới.
- Giả định mỗi đơn vị: khoản tiệm nhận 60% giá DEMO; chi phí 3.000đ; đóng góp tối thiểu 1.000đ. Các số này phục vụ kiểm tra luồng, chưa chứng minh mô hình có lãi.
- Voucher: 2 lượt 15%, 2 lượt 10%, 4 lượt 9.000đ mỗi tuần Việt Nam; trần phần trăm 9.000đ và ngân sách tuần 500.000đ trong cấu hình DEMO. Giảm 30% đã nằm trong giá trước voucher, không giảm thêm 5%.
- Kiểm tra biên, ngân sách, tồn và lượt voucher trước khi giữ hàng. Hướng dương 20.300đ/đơn vị không đủ biên cho voucher 9.000đ khi mua một đơn vị.
- Không tạo hỗ trợ đi lại từ tọa độ tiệm hư cấu. Tiệm mới không có tọa độ và không gọi dịch vụ định tuyến.
- Ứng dụng chính/MVP dùng quy tắc giao dịch trên máy chủ hiện có. Pages dùng mô phỏng một trình duyệt, không xác thực tài khoản hoặc xác nhận tiền ngân hàng; không thay thế backend khi bán thật.
- Vào “Đồ ăn & hoa” → Nhóm hàng → “Hoa” để thử danh mục này trong cùng trang. “Đồ ăn” là nhóm ngang cấp, có các loại món và lựa chọn “Tất cả món” riêng; không đặt hoa trong “Tất cả món”. Không còn tab Hoa DEMO trên thanh chính. `/#/flowers` cũ tự chuyển về nhóm Hoa. Danh mục chung vẫn đọc dữ liệu Supabase hiện có; thao tác đặt hoa DEMO chỉ lưu trên thiết bị, không ghi đơn vào Supabase hoặc thay đổi đơn thật.
- Sau bàn giao, hoàn tiền khách không tự xóa khoản phải trả tiệm. Hết hạn giữ/hủy trước thanh toán giải phóng tồn và voucher.

Không triển khai migration/backend, không bật chương trình voucher thật, không dùng giao dịch DEMO làm traction.

## Kiểm tra bản triển khai

Đã chạy 93 kiểm thử; TypeScript, Deno check, build Next/MVP/Pages và kiểm tra CSP/static đều đạt. Trình duyệt đã kiểm tra 17 trường hợp, gồm các giao diện ở 390/768/1440px và luồng giữ–thanh toán–nhận–phản ánh–hoàn tiền. Không ghi nhận lỗi JavaScript hoặc tràn ngang trong lượt kiểm tra đó. Đây là kiểm tra DEMO, chưa kiểm chứng thanh toán, chất lượng hoa hoặc vận hành tiệm thật.
