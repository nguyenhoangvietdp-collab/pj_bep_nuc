# Tính tiền sau voucher

Thẻ tham khảo có đường vào “Chọn voucher & tính tiền”. Khách chưa đăng nhập vẫn thay đổi số lượng, voucher mong muốn và cách nhận để xem kịch bản; gửi yêu cầu thật vẫn cần đăng nhập. Bản nháp lưu theo sản phẩm và được khôi phục khi đăng nhập.

Bảng chung hiển thị tiền hàng, khoản giảm theo voucher, hỗ trợ tự nhận nếu có, phí giao và hỗ trợ giao đã xác nhận, tổng tiền và bình quân mỗi suất/đơn vị mua. Đổi hoặc bỏ voucher cập nhật ngay, không chờ gửi yêu cầu. Tiền hàng đã là giá lô/giá đang xem; không giảm thêm30% hoặc tự thêm5% cho lô hiện hành.

Với yêu cầu chưa có nguồn, số sau voucher là kịch bản theo mong muốn, không phải khoản được phép thu. Dùng hạn mức phần trăm khi đã có hạn mức dương; khi chưa có chương trình xác nhận, phép tính chỉ minh họa lựa chọn trước xác nhận điều kiện. Voucher cố định9k không tính cho giỏ<=9k. Không giữ tồn, tiêu lượt, trừ ngân sách hoặc tạo đơn khi tính thử. Ngân sách, biên, lượt dùng và nguồn vẫn do máy chủ kiểm tra trước báo giá.

Checkout lô thật sử dụng voucher được chọn và báo giá máy chủ. Báo giá yêu cầu trả thêm trường JSON tùy chọn `quote.priceBreakdown`, dùng lại `publicQuote` để phản ánh cả ưu đãi/giá cũ và hỗ trợ tự nhận. Phí giao chưa báo hiển thị “Chờ báo phí”; chưa có tổng thanh toán gồm giao hàng, không mặc định phí bằng0. Phí đã xác nhận bằng0 vẫn là giao miễn phí thật. Tổng thu theo báo giá/đơn hiện hành, không tính lại nghĩa vụ tiệm.

Không đổi ngân sách voucher, cổng thanh toán, quyền tài khoản hoặc migration. Các lô sale chỉ xuất hiện sau xác nhận nguồn/giá/lịch thật. Kiểm tra tương tác dùng fixture/mock cách ly, không seed hoặc gửi giao dịch giả vào production.
