# Trợ giúp theo ngữ cảnh và điểm nhận — 06/11/2026

Theo yêu cầu chủ dự án, các giả định triển khai chỉ được trình bày trong popup “Thông tin thử nghiệm”. Popup xuất hiện một lần mỗi phiên khi truy cập luồng mua hàng, và có thể mở lại ở chân trang. Phiên bản lưu ý mới dùng khóa phiên v2 để người đã xem thông tin cũ được đọc nội dung mới.

Giá, số lượng nhận, tiền tự lấy và tổng dự tính vẫn hiển thị trực tiếp. Diễn giải phép tính, giới hạn ưu đãi và cách dùng vị trí được mở bằng nút dấu hỏi cạnh tiêu đề tương ứng. Dialog dùng bàn phím được, đóng bằng Escape hoặc nút Đóng và trả focus về nút đã mở. Những việc cần làm tiếp theo và trạng thái lỗi vẫn hiện tại vị trí thao tác.

Thứ tự trên điện thoại: sản phẩm → số lượng → voucher cơ bản → địa chỉ/cách nhận → quyền lợi tự lấy và hóa đơn → gửi nhu cầu. Không đưa khối dự tính lên trước sản phẩm do thứ tự CSS mặc định.

## Dữ liệu địa điểm

Nguồn duy nhất là `lib/store-locations.json`, chép theo bảng tên biển hiệu, địa chỉ, GPS, cửa nhận và chỉ dẫn do chủ dự án cung cấp ngày 06/11. Đây là dữ liệu do chủ dự án xác nhận, không phải kết quả kiểm chứng độc lập. Bốn mã cũ được giữ nguyên; nhãn cũ còn dùng để tìm kiếm, tên biển hiệu mới dùng để hiển thị. Không tự bổ sung ghi chú tài xế còn thiếu của Highlands.

Danh mục tĩnh, chi tiết tiệm và dự tính tham khảo dùng cùng tọa độ. Catalogue máy chủ và báo giá mới của các tiệm đã có bản ghi mang đúng mã cũng dùng cùng dữ liệu chuẩn này. Việc thay thông tin địa điểm không phê duyệt tiệm/lô, không cấp ngân sách, không tạo tồn, không ghi đè bản ghi dữ liệu cũ hoặc tính lại snapshot giá đơn đã nhận.

Cửa nhận hiển thị trực tiếp; nhãn gốc, chỉ dẫn tài xế, tọa độ và liên kết bản đồ nằm trong dấu hỏi “Chỉ dẫn nhận hàng”. Hoa tiếp tục cần tọa độ tiệm riêng; không gán một trong bốn nhà hàng làm điểm nhận hoa.
