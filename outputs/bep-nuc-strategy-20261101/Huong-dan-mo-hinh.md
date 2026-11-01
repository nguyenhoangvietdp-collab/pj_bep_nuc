# Cách đọc mô hình tài chính

Ngày01/11/2026. Workbook là mô hình giả định có công thức, chưa phải actuals hoặc forecast đã hiệu chỉnh từ pilot.

## Chọn và sửa

- Kinh te don: G5 chọn1bữa ăn/2bánh/3hoa. G6 chọn1không voucher/2voucher15%/3voucher10%/4voucher9k cố định. Bộ tính chung sử dụng nhóm đang chọn; không phải bảng so đồng thời ba nhóm.
- G7/G8 là cap phần trăm giả định9k; chưa được người dùng chốt. G9 là hỗ trợ tự nhận, chỉ tính khi phí shipG10=0. G10/G11 thử phí và capship; hỗ trợ là30%phí nhưng không vượt cap. G12 là tài trợ thực có điều kiện, không phải khoản thu tự động có.
- CộtG/H/I ở dòng26–45 chứa giá và chi phí giả định theo ngành. CộtC là nhóm đang chọn. GiáB nhập trực tiếp:38k ở bữa ăn giữ giảm nền5% của menu40k; nếu bỏ giảm nền, thay40k. Không có thêm giảm nền ẩn.
- Nhập chi phí điều phối/ship tăng thêm vào chi theo đơn và tổn thất nếu phát sinh. Phí thanh toán đang0, không phải được xác nhận miễn phí. Thuế/capex/chi khác chưa nhập không được bao phủ.
- Ngan sach voucher: tính tiền giảm trên một tuần. Bốn lượt9k,100người, tỷ lệ dùng100%, ngân sách500k là giả định thử. CM cơ cấu dùng cùng giỏ trung bình và chi phí nhóm đang chọn, chưa trừ thêm hỗ trợ nhận/ship. Không cộng bảng ngân sách một lần nữa vào dòng tiền nếu ưu đãi đã nằm trong CM.
- Von va dong tien: nhập tiền đội thực có ở C5, không nhập tiền đang giữ để trả tiệm/hoàn khách. Để trống thì số dư hiện n.a.; nhập0 thì mô hình thể hiện thiếu tiền. Bảng bốn tuần lấy CM tiền mặt của nhóm/voucher đang chọn, không tự lấy cơ cấu voucher ở sheet ngân sách.
- Số đơn tuần45, fixed500k/tuần và đệm500k đều giả định. Số tối/công suất trên sheet đơn là giới hạn cần đối chiếu; lượng đơn tuần không tự bị cắt theo công suất. Cần sửa lượng đơn khi nguồn cung không đáp ứng, đặc biệt hoa chỉ có8tối/kỳ giả định.
- Vốn đầu kỳ cần có ở C33 là setup+đệm+thiếu hụt vận hành lớn nhất, trước vốn mới. Nếu có vốn mới, xem lịch số dư từng tuần. Số dư nghĩa vụ tiệm là ước tính theo ngày đối soát đều, không phải sổ đối soát giao dịch thực.

## Phân biệt đại lượng

CM kinh tế có công quy đổi. CM tiền mặt chỉ loại phần công chưa thực trả. Pool fixed không được lặp lại công/CAC/ưu đãi đã tính. Nếu CAC đã bao gồm voucher thì loại khoản trùng trước dùng mô hình.

Lợi ích khách dùng giá lựa chọn thay thế và thời gian tăng thêm, không dùng phần trăm giảm so menu. Thu hồi tiệm trừ phương án xử lý ròng khác; khoản đó cần bao gồm ảnh hưởng mất bán thường nếu có. Không xem payout là toàn bộ lợi nhuận tiệm.

## Kiểm tra đã làm

Đã tính lại công thức bằng Artifact Tool, so18kết quả với tính tay/điều kiện biên: ba nhóm hàng,9k,CMâm,capship,tỷ lệ ship thực saucap,vốn trống/vốn0/vốn dương và cơ cấu voucher. Không có lỗi công thức trong vùng quét hoặc ô lỗi trong fileXLSX đã xuất. Đã xem ảnh của cả ba sheet và vùng giả định. Chưa kiểm tái tính trực tiếp trong ứng dụng Microsoft Excel.

Nguồn35claim của nghiên cứu được kiểm khớp trích đoạn với bản nguồn đã lưu. Đây là tự kiểm và kiểm bằng công cụ, không phải review độc lập. Dữ liệu thương mại Hà Nội, vốn thực góp và các tham số chưa duyệt vẫn cần được thu thập trước mở giao dịch.
