# Ghi chú phép tính chuẩn bị

Các giá trị trong economic-scenarios.json và CSV đều là kịch bản giả định để duyệt luận điểm, không phải báo giá đã ký hoặc doanh số dự báo. Đây chưa phải workbook tài chính cập nhật hoàn chỉnh.

## Công thức

Gọi T là tiền khách thực trả, F là khoản trả tiệm, r là số đơn hoàn tất chia số đơn nhận. Gọi L là tổn thất ròng thêm trên đơn lỗi, không gồm tiền gốc đã hoàn đủ và không gồm công đã ghi riêng (analysis).

Công/đơn hoàn tất = phút/đơn nhận × giá trị giờ công ÷ 60 ÷ r (analysis).
Tổn thất/đơn hoàn tất = (1−r) × L ÷ r (analysis).
CAC/đơn hoàn tất = chi phí tìm một khách mua lần đầu ÷ số đơn hoàn tất của khách trong cùng kỳ (analysis).
CM = T − F − chi phí theo lô/suất − chi phí đơn thành công − công phân bổ − tổn thất phân bổ − CAC phân bổ (analysis).
Đơn hòa vốn = làm tròn lên(chi phí cố định cần bù trong kỳ ÷ CM), chỉ có nếu CM dương (analysis).

Không phân bổ đơn lỗi hai lần qua cả tỷ lệ bán và số đơn hoàn tất: r dùng phân bổ công/lỗi, sell-through dùng tính công suất hoàn tất từ lượng hàng chào (analysis).

## Kết quả

| Kịch bản giả định | Khách trả | Tiệm nhận | CM sau CAC | Đơn bù fixed 2 triệu |
|---|---:|---:|---:|---:|
| Bữa ăn theo giá cũ, công 4 phút | 34.200 | 28.000 | 937 | 2.135 |
| Giữ giá, công còn 2 phút | 34.200 | 28.000 | 1.989 | 1.006 |
| Bữa ăn theo giá lô mới thương lượng | 30.000 | 22.000 | 3.789 | 528 |
| Gói bánh thành phần rõ | 45.000 | 30.000 | 10.263 | 195 |
| Hoa cắm nhà theo lô | 59.000 | 40.000 | 8.167 | 245 |

Toàn bộ bảng trên là phép tính (analysis). Công bữa ăn/gói bánh dùng giá trị 30.000đ/giờ, r=95%, CAC=6.000đ/khách và 3 đơn/khách cùng kỳ; gói bánh có chi phí lô/lỗi riêng. Hoa dùng 5 phút, r=90%, CAC=9.000đ/khách và 1,5 đơn/khách; không gán tần suất mua bữa ăn sang hoa (analysis).

Fixed 2 triệu là một pool chi phí ngoài biến phí và CAC đã tính; không tự đồng nhất với trần ngân sách pilot cũ. Một pilot nhiều nhóm hàng cộng CM của các nhóm để bù cùng pool chung, không bắt mỗi nhóm bù lại toàn bộ pool. Mở thêm quán có thể làm fixed tăng nên hòa vốn tuyến tính là điều kiện tính, không phải cam kết mở rộng (analysis).

## Điều kiện thay đổi cách hiểu

Đơn 40.000đ ở ví dụ cũ chỉ còn 937đ CM. Thêm 8 điểm phần trăm giảm trên nền 95% của giá menu cho một kilomet có giá trị 3.040đ; trước cap sẽ làm CM thành âm. Cap bảo vệ tiền nhưng không chứng minh lời hứa thưởng khoảng cách hấp dẫn hoặc dễ hiểu (analysis).

Tiền giao mà khách không phải trả khi tự nhận không mặc nhiên trở thành tiền mặt Bếp Núc tiết kiệm. Chỉ chi phí thực sự tránh được của bên tài trợ, hoặc ngân sách ưu đãi được chấp nhận và ghi rõ, mới có thể tài trợ thêm ưu đãi mà không bào phần CM mục tiêu (analysis).

Các kịch bản giá lô mới đồng thời thay khoản tiệm nhận và công; không được dùng bảng để gán toàn bộ cải thiện cho một tính năng. Chưa biết tiệm nào chấp nhận khoản F này (analysis).

Lợi ích khách phải so với lựa chọn thật cùng khẩu phần/chất lượng/gói và chi phí đi vòng tăng thêm. Lợi ích tiệm là F trừ chi phí phục vụ thêm và khoản thu hồi ròng từ phương án khác; không lấy toàn bộ F làm lãi hay mặc định phương án khác là vứt bỏ (analysis).

Với công suất giả định 3 quán × 5 lô × 20 tối × 60% hoàn tất, chỉ có 180 đơn; chưa đủ mức hòa vốn 195 đơn của kịch bản bánh. Nếu hoa chỉ có 2 tiệm × 2 lô × 8 tối × 60%, công suất là 19 đơn hoàn tất làm tròn xuống, không dùng nhầm 180 đơn cho nhánh này (analysis).

## Limitations

Phí thanh toán và giao hàng đang đặt 0 cho kịch bản tự nhận; không phải đã xác minh miễn phí. Chi phí xử lý khiếu nại, thuế, capex và khoản chưa nhập chưa được bao phủ đầy đủ. Không có cơ sở định giá doanh nghiệp hoặc IRR từ các kịch bản này.
