# Giả định khởi động — 04/11/2026

Chủ dự án xác nhận hàng và địa điểm đã cung cấp là thật, đồng thời yêu cầu dùng giả định cho số lượng, khung nhận và ngân sách còn thiếu. Các số dưới đây là kịch bản làm việc được chọn để hoàn thiện cấu hình, không phải tồn kho được kiểm đếm, giờ cửa hàng đã xác nhận hoặc vốn đã thực góp.

| Tham số | Giả định khởi động | Phạm vi |
|---|---:|---|
| Số lượng | 3 đơn vị mua / sản phẩm / phiên | Cành, bông, bó hoặc suất theo quy cách; không đổi thành 3 cành |
| Khung nhận | 3 giờ / phiên | Tính từ giờ vận hành mở phiên; không tự khởi động lại khi tải trang |
| Ngân sách ưu đãi | 500.000đ / tuần, dùng chung | Bao gồm voucher cơ bản, tự lấy và hỗ trợ ship; không phải mỗi tiệm hoặc mỗi khách |
| Voucher 15% | 2 lượt / khách / tuần; trần 9.000đ / lượt | Tính trên giá sale sau giảm nền 5% |
| Voucher 10% | 2 lượt / khách / tuần; trần 9.000đ / lượt | Tính trên cùng nền giá |
| Voucher cố định 9k | 4 lượt / khách / tuần | Không bảo đảm mọi sản phẩm đều đủ biên áp dụng |
| Tự lấy | +8 điểm phần trăm/km đường chim bay, tối đa 2km | Cộng riêng với voucher cơ bản; giảm theo ngân sách và biên còn lại |
| Hỗ trợ ship | 30% phí giao được báo, tối đa 9.000đ / đơn | Cộng voucher cơ bản nếu tổng hỗ trợ vẫn đủ ngân sách và biên |
| Chi phí nền tảng | 3.000đ / đơn vị | Ước lượng ban đầu; thay bằng tổng công, phí, lỗi, CAC thực tế khi đo được |
| Đóng góp tối thiểu | 1.000đ / đơn vị | Sau toàn bộ ưu đãi và chi phí; không lấy từ khoản phải trả tiệm |

Nguồn: số lượng/khung nhận/chi phí/biên từng được dùng trong kế hoạch hoa DEMO đã chốt; ngân sách 500.000đ và cap 9.000đ là cấu hình kịch bản thử có sẵn trong `demoTradingRules`, nay được lựa chọn làm giả định khởi động theo yêu cầu mới. Đây không phải kết luận rằng báo cáo tài chính đã xác nhận các giá trị này. Báo cáo tài chính ngày 01/11 chưa chốt ngân sách voucher; trần pilot 2.000.000đ không tự động là tiền tài trợ voucher.

## Giá và khoản trả tiệm

Giữ nguyên công thức hiện hành: F là giá đàm phán, r là 30% hoặc 35% theo gian hàng; P = ceil(F / (1-r)); giá sale Q = ceil(P × 95%). Voucher cơ bản và tự lấy tính trên Q. Khoản trả tiệm F không giảm khi dùng voucher. Không sử dụng giả định DEMO cũ là tiệm nhận 60% giá hoa.

## Ngân sách và công suất

500.000đ là hạn mức chiết khấu giả định, không phải lợi nhuận hoặc doanh thu. Nếu mỗi đơn dùng đúng 9.000đ và không nhận thêm hỗ trợ, ngân sách đủ 55 đơn, còn 5.000đ. Khi cộng tự lấy hoặc ship, số đơn được hỗ trợ giảm tương ứng. Dừng giữ hỗ trợ mới khi hết ngân sách; không thay đổi nghĩa vụ của đơn đã chấp nhận.

Danh mục hiện có 14 món và 12 mục hoa: 3 đơn vị/mục cho công suất lý thuyết 78 đơn vị/phiên nếu toàn bộ cùng sẵn có. Đây không phải bằng chứng nguồn cung hoặc 78 đơn đã bán. Chỉ mở từng phiên khi vận hành tiếp nhận khả năng phục vụ; khách có thể gửi nhu cầu trước phiên, sau đó đồng ý báo giá có hiệu lực trước thanh toán.

## Phân biệt giả định và cam kết

Các giả định dùng cho báo cáo, dự tính và chuẩn bị vận hành. Không tự biến thành nhãn “còn 3”, đồng hồ đếm ngược, xác nhận chất lượng hoặc tiền đã được cấp trên website. Khi mở phiên giao dịch, vận hành xác nhận số thực có thể phục vụ và thời điểm phiên; khi bật ngân sách, ghi nhận nguồn tài trợ. Không cần giả định lại công thức đường chim bay hoặc danh tính hàng/địa điểm mà chủ dự án đã xác nhận.

## Bản triển khai trên Workers

Mục Nội bộ → Ngân sách và quy tắc giao dịch có nút “Nạp giả định vào bản nháp”. Form đăng lô điền sẵn số lượng, chi phí, biên và khung nhận ba giờ từ lúc mở form. Các thời điểm giữ cố định trong lần chỉnh sửa; không phải đồng hồ sale phía khách. Nạp giả định không gửi yêu cầu ghi dữ liệu, không đánh dấu đã cấp tiền và không sửa đơn cũ. Người vận hành kiểm tra rồi lưu bằng các action hiện có.

Checkout yêu cầu hiển thị bộ quyền lợi ngay trong hóa đơn cho mọi tài khoản, kể cả chờ duyệt, tiệm và vận hành. Điểm xuất phát lấy từ vị trí riêng đã lưu; nút “Dùng vị trí hiện tại” chỉ hỏi GPS một lần sau khi người dùng bấm, có thể thay bằng tìm địa chỉ. Mọi vai trò được lưu điểm riêng và dùng API tính thử; không thay quyền đặt đơn hoặc thanh toán.

Khoảng cách tự tính bằng Haversine từ điểm xuất phát và tọa độ tiệm đã được duyệt, không nhập km. Nếu chưa có tọa độ tiệm thì chọn điểm nhận từ kết quả tìm địa chỉ; điểm do khách chọn chỉ dùng dự tính, không ghi đè tọa độ tiệm hoặc địa chỉ nhà. Chưa đủ hai điểm thì chưa tính phần tự lấy. Tọa độ tiệm công khai trong catalogue chỉ thuộc tiệm được duyệt; địa chỉ/vị trí tài khoản khác không được công khai.

Hóa đơn tách giảm nền, voucher cơ bản, tự lấy và hỗ trợ ship; vẫn kiểm biên bằng khoản trả tiệm cùng chi phí/biên giả định. Không đủ biên thì hiển thị lý do và không trừ voucher không đủ điều kiện. Phí giao nhập dự tính tiếp tục ghi rõ là kịch bản. Luồng báo giá thật dùng tọa độ tiệm và ngân sách phía máy chủ; kết quả tính thử không được gửi làm giá giao dịch.
