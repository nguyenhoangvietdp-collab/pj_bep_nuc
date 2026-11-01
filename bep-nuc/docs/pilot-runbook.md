# Thẩm định và nghiệm thu

## Bằng chứng trước mở

Khảo sát70 sinh viên: cụm trường, thời gian về, ngân sách bữa tối, tần suất tự nhận, bán kính đi được, lo ngại hàng dư, dị ứng, ý định đăng ký, mức giá thực trả chấp nhận. Xin đồng ý lưu dữ liệu; không thu giấy tờ/vị trí liên tục. Không diễn giải ý định là hành vi mua.

Phỏng vấn10–20 quán: menu và bằng chứng giá gốc (ảnh menu/hóa đơn), lượng dư theo từng ca trong ít nhất một tuần, khoản muốn nhận F, cửa sổ nhận, quy trình bảo quản, trách nhiệm chất lượng, công đăng lô/giao, cách giảm/tặng/xử lý hiện tại. Ghi cả trường hợp không có dư. So sánh số quán thật đủ điều kiện trong2km từng cụm; ngang nhau dùng số sinh viên đăng ký. Tọa độ quán xác minh thực tế.

Cho từng lô mới: T=B−voucher−hỗ trợ tự nhận; kiểm T−F−chi phí nền tảng−hỗ trợ ship≥biên tối thiểu và tổng chương trình không vượt cap tuần. B là giá lô, không tự nhân0,95. Voucher9k là giảm cố định, không mặc định nhẹ hơn15%. Không mở ưu đãi chưa có nguồn tài trợ. Vùng xa được hỗ trợ hơn trong cap; thiếu tuyến thì không hỗ trợ khoảng cách. Quy tắc hiện hành: [cập nhật01/11](trading-update-20261101.md).

## Điều khoản ký pilot (mẫu để hoàn thiện)

Điền pháp nhân/người chịu trách nhiệm, địa chỉ, thời hạn; thông tin đồ ăn/hoa, ảnh lô, giờ kiểm, B và khoản thực nhậnF, chi phí/công thực, lịch trả tiền và xử lý sai lệch. Tiệm có nghĩa vụ payout khi đã bàn giao cho khách hoặc người giao; giao lỗi/hoàn sau bàn giao không tự xóa khoản này. Quán hủy phục hồi voucher còn trong tuần; no-show theo chính sách pilot không trả lượt. Ký rõ trách nhiệm chất lượng, hoàn tiền và nguồn chịu chi; mẫu không phải hợp đồng đã ký.

## Chạy bằng tiền giả

1. Tạo báo giá; kiểm tra giá cuối và tiết kiệm khác tỷ lệ voucher.
2. Tạo đơn và ops ghi đúng tiền/reference/thời điểm. Sinh viên nhận mã; quán nhập mã trong khung nhận.
3. Nhập lại mã, reference, idempotency key: không được thu/giao hai lần.
4. Hai sinh viên tranh suất cuối; một người thành công. Hết10phút, báo giá lại. Chuyển khoản muộn vào hàng chờ hoàn.
5. Quán hủy và no-show; xác nhận hoàn bằng mã chuyển giả. Gom đối soát chỉ đơn giao, xác nhận trả giả.
6. So tổng tiền thu, từng refund, từng payout với sổ ngân hàng giả. Không còn sai lệch mới thử10 sinh viên/1quán, rồi mở3quán sau khi đủ gate.

## Hàng ngày

Kiểm tra đơn chờ tiền/tiền muộn, liên hệ xử lý ngoài app bởi người được phân công; đối chiếu ngân hàng, tồn quán, pickup, hoàn và payout. Xuất dữ liệu ops, lưu nơi hạn chế quyền. Đo công nhân viên thực tế; ghi chi phí hạ tầng/maps≤400k, tuyển thử≤500k, khảo sát/di chuyển≤600k, dự phòng≤500k. Không dùng dự phòng bù voucher lỗ kéo dài. Lập cảnh báo/quota Google ngoài app. Không bật nhóm thưởng ngẫu nhiên trước khi vận hành ổn.

Theo dõi hàng dư theo ca, tỷ lệ giao, no-show/hoàn, voucher mix, số khách quay lại, F thực trả, thời gian nhân viên, contribution sau chi phí. Tách fixed/CAC. MVP ghi lượt xem món theo người và tồn; chưa có thí nghiệm ngẫu nhiên hoặc kết luận nhân quả. Phiếu khảo sát và ghi chú không được giả lập thành kết quả thực địa.

## Dừng/mở rộng

Chỉ mở rộng khi đối soát đúng, tiệm tiếp tục, khách tiết kiệm so lựa chọn thật, đóng góp sau toàn bộ ưu đãi/CAC/công dương và có đủ nguồn cung. Không dùng voucher20% hay thưởng8điểm%/km làm quy tắc mới. Hồ sơ chất lượng và điều kiện triển khai thực phải được xác nhận trước mở.
