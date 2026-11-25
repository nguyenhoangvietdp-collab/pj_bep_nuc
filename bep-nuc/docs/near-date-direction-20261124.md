# Cận date và ngưỡng ưu đãi — định hướng Bếp Núc

Ngày 24/11/2026. Chủ dự án chọn mở nhóm cận date gồm thực phẩm đóng gói, đồ uống và hàng phi thực phẩm. Trọng tâm thương hiệu tiếp tục là **Tự đến lấy, tiết kiệm thêm**.

## Bài học và cách chuyển thành mô hình

Bài của Khải San Food nhấn mạnh quản lý tồn, hạn chế sản xuất dư, tăng lượng hàng bán và chọn đối tác có điều khoản đổi trả rõ. Đây là bài do doanh nghiệp bán hàng đăng, không phải báo cáo hiệu quả được kiểm toán; không lấy nhận định lợi nhuận trong bài làm dự báo cho Bếp Núc. [Khải San Food, 13/10/2024](https://khaisanfood.vn/mo-hinh-kinh-doanh-hang-can-date/).

Các lựa chọn dưới đây là đề xuất/triển khai riêng cho Bếp Núc:

| Điều cần giải quyết | Cách Bếp Núc áp dụng |
|---|---|
| Hàng còn giá trị nhưng khó bán kịp | Cửa hàng giữ hàng và bảo quản; Bếp Núc kết nối nhu cầu, báo giá và tự nhận. Không mặc định mua đứt hoặc gom kho. |
| Tăng lượng hàng bán | Cho mua nhiều đơn vị cùng lô hoặc combo cố định cùng tiệm, nhưng chỉ cấp ưu đãi khi đóng góp sau chi phí đạt ngưỡng. |
| Quản trị vòng quay | Với cận date, mặc định sắp theo HSD gần nhất; thời hạn nhận vẫn là trường riêng. Không lấy thời hạn nhận làm HSD. |
| Niềm tin | Tên hàng, ảnh nhãn/HSD, nguồn hàng, mã lô, bao bì, quy cách và cửa nhận đi cùng lô. |
| Lợi ích của việc tự lấy | Voucher cơ bản là lựa chọn trước; tự lấy có khoản cộng thêm được tính riêng. Không tự tạo ưu đãi bằng cách giảm khoản trả tiệm. |
| Trải nghiệm rõ nhưng gọn | Hiện giá, HSD, quy cách, ngưỡng đủ điều kiện và số tiền dự tính. Phép tính sau dấu hỏi; giả định vận hành trong popup lưu ý. |

Không tự nhập mức giảm sâu được quảng bá trong nguồn vào bảng giá Bếp Núc. Giữ quy tắc giá hiện hành và giá đã được tiệm xác nhận. Tăng doanh số không bù được một đơn có đóng góp âm.

## Ba nhóm khác nhau

- **Đồ ăn cuối ngày:** xác nhận món, thời điểm kiểm, bảo quản/dị ứng và khung nhận; không suy hạn an toàn từ việc tiệm đóng cửa.
- **Hoa:** quy cách cành/bông/bó, tình trạng và chăm hoa; không gắn nhãn HSD thực phẩm.
- **Cận date:** thực phẩm đóng gói, đồ uống, hàng phi thực phẩm có hạn dùng theo nhãn; không mặc định là hàng dư trong ngày. Nhóm riêng trong danh mục, không lẫn vào “Tất cả món”.

WHO đặt vệ sinh, tách sống/chín, nấu kỹ và bảo quản ở nhiệt độ an toàn trong các nguyên tắc an toàn thực phẩm. Vì vậy, riêng đồ ăn cần giữ quy trình kiểm điều kiện bảo quản thay vì suy chất lượng chỉ từ giá hoặc ngày trên nhãn. Nguồn này không được dùng để suy rằng mọi hàng cận date đều an toàn, hoặc để gia hạn nhãn. [WHO — Five keys to safer food manual](https://www.who.int/publications/i/item/9789241594639).

## Ngưỡng ưu đãi và lợi ích cho team

Mỗi đơn mới cần giữ:

`tiền hàng sau toàn bộ ưu đãi − khoản trả tiệm − chi phí cấu hình ≥ đóng góp tối thiểu`.

Ngưỡng áp dụng tính trên **giá sale trước voucher**, theo từng lô và loại voucher. Máy chủ tìm số đơn vị nhỏ nhất trong giới hạn hiện tại 1–3 để đủ điều kiện; không áp một mức tiền chung tùy ý. Số lượng tăng chỉ có ích khi phần chênh lệch của mỗi đơn vị đủ bù chi phí. Nếu không có số lượng phù hợp trong giới hạn thì không cấp ưu đãi đó, và cần báo giá/chi phí khác.

Ví dụ kịch bản: giá sale 27.550đ, trả tiệm 20.300đ, chi phí 3.000đ và đóng góp tối thiểu 1.000đ/đơn vị. Voucher 9k cần 3 đơn vị, tiền hàng 82.650đ. Sau voucher còn 73.650đ; trừ trả tiệm 60.900đ và chi phí 9.000đ còn 3.750đ, đủ yêu cầu 3.000đ. Nếu tự lấy, khoản cộng thêm còn bị giới hạn tối đa 750đ ở cấu hình này. Đây là phép thử giả định, không phải lợi nhuận thực đo.

Đóng góp sau chi phí cấu hình không đồng nghĩa lợi nhuận ròng sau toàn bộ chi phí cố định. Vận hành cần cập nhật công, phí, lỗi, CAC và chi phí chung phù hợp; không ghi chi phí 0 chỉ để đơn vượt ngưỡng. Ngưỡng tiền hàng cũng áp dụng cho hỗ trợ tự lấy và ship khi không dùng voucher cơ bản. Ngân sách giữ/đã dùng tiếp tục kiểm riêng. Snapshot nghĩa vụ trả tiệm của đơn cũ không bị tính lại.

## Bán kèm bằng combo cố định

Đợt này hỗ trợ lô combo cố định cùng cửa hàng qua luồng thẻ → chi tiết → checkout → báo giá/giữ lô → đơn hàng hiện có. Combo có 2–5 thành phần, quy cách và ảnh nhãn/HSD từng thành phần; HSD combo không muộn hơn thành phần hết hạn sớm nhất. Cửa hàng tách sẵn số hàng cho combo, nhập tồn theo combo và tổng giá/khoản trả tiệm/chi phí cho cả combo. Không tái dùng phần tồn này để đăng lô bán lẻ.

Không ghép hàng phi thực phẩm cùng hàng ăn/uống trong cùng combo. Không giả lập giỏ hàng nhiều lô hoặc nhiều cửa hàng: để làm giỏ đó cần thêm cơ chế phân bổ tồn, phí, voucher và nghĩa vụ từng tiệm. Combo hiện tại là một quy cách bán, không phải thao tác lấy nhiều lô bán lẻ rồi bỏ qua kiểm tồn thành phần.

## Trạng thái triển khai và đo pilot

Chưa có danh sách sản phẩm, giá, ảnh nhãn và HSD cụ thể do chủ dự án cung cấp cho nhóm mới; không seed hàng hoặc hạn dùng giả vào production. Form vận hành sẵn sàng đăng lô năm nhóm và combo với dữ liệu thật. Lô hết hạn/thiếu căn cứ bị chặn ở máy chủ; ngày HSD hiển thị là thông tin sản phẩm, không phải đồng hồ sale tự khởi động lại.

Theo dõi: đóng góp sau ưu đãi, tỷ lệ đủ ngưỡng, số đơn vị mỗi đơn, hàng bán trước HSD, hủy/hoàn do chất lượng, công xử lý và mức khách thực sự dùng hết. Chỉ tăng combo khi cả đóng góp và tỷ lệ hoàn tất tốt lên; không lấy số lượt xem hoặc mô phỏng làm traction.


## Phân loại và tên hiển thị

Tên khách hàng thấy là “Hàng gần hạn sử dụng”. Năm loại hàng: thực phẩm đóng gói, đồ uống, chăm sóc cá nhân, đồ dùng gia đình và hàng phi thực phẩm khác. Các loại hiện ngay trong danh mục trên điện thoại; không chỉ nằm trong bộ lọc. Đây là cấu trúc phân loại, không xác nhận rằng đã có nguồn của từng loại. Mã non_food cũ và liên kết “Cận date” tiếp tục được đọc tương thích.

Tham khảo cấu trúc [Kuradashi](https://kuradashi.jp/) (đối chiếu 24/11/2026): loại sản phẩm tách khỏi lý do giảm giá. Bếp Núc áp dụng nguyên tắc này bằng thông tin loại hàng, hạn dùng theo nhãn và lý do ưu đãi riêng; không dùng phong cách Nhật thay cho chứng cứ hàng hóa.
