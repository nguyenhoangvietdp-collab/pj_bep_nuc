# Thẩm định và nghiệm thu

## Bằng chứng trước mở

Khảo sát70 sinh viên: cụm trường, thời gian về, ngân sách bữa tối, tần suất tự nhận, bán kính đi được, lo ngại hàng dư, dị ứng, ý định đăng ký, mức giá thực trả chấp nhận. Xin đồng ý lưu dữ liệu; không thu giấy tờ/vị trí liên tục. Không diễn giải ý định là hành vi mua.

Phỏng vấn10–20 quán: menu và bằng chứng giá gốc (ảnh menu/hóa đơn), lượng dư theo từng ca trong ít nhất một tuần, khoản muốn nhận F, cửa sổ nhận, quy trình bảo quản, trách nhiệm chất lượng, công đăng lô/giao, cách giảm/tặng/xử lý hiện tại. Ghi cả trường hợp không có dư. So sánh số quán thật đủ điều kiện trong2km từng cụm; ngang nhau dùng số sinh viên đăng ký. Tọa độ quán xác minh thực tế.

Cho từng món: T=P×0,95×(1-v), vmax=1-(F+C+m)/(0,95P); dùng C3.000/m2.000 mỗi suất chỉ để sàng lọc. Giá menu30.000 với F19.500 không đủ voucher20%;50.000 với F32.500 đủ;100.000 với F65.000 đủ. Không giảm voucher gốc âm thầm; món không đủ bị chặn. Thưởng8 điểm%/km, tối đa2km và vmax.

## Điều khoản ký pilot (mẫu để hoàn thiện)

Điền pháp nhân/người chịu trách nhiệm, địa chỉ, thời hạn; danh sách món, bằng chứng giá P, số tiền F mỗi suất, C thực tế; quán đồng ý nền tảng giữ phần chênh lệch thu-F và chịu chi phí đã thống nhất. Lịch trả tiền cụ thể, tài khoản nhận và cách xử lý đối soát sai. Chỉ trả F cho đơn giao thành công. Quán hủy hoàn khách và phục hồi voucher trong tối; no-show hoàn khách trong pilot nhưng không phục hồi voucher. Thống nhất trách nhiệm bảo quản, dị ứng, chất lượng, thời điểm giao, khiếu nại và nguồn tiền hoàn. Đính kèm chữ ký hai bên, phiên bản, ngày ký. Mẫu này không phải hợp đồng đã ký.

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

Chỉ mở rộng khi đối soát chính xác, quán muốn tiếp tục và contribution có căn cứ đo thực. Nếu không đủ dư hay20% không khả thi: báo lý do, P/F/C/m cần thương lượng; không sửa quy tắc gốc lặng lẽ. Hồ sơ chất lượng thực phẩm và các yêu cầu pháp lý triển khai thật cần được đối tác xác nhận trước mở.
