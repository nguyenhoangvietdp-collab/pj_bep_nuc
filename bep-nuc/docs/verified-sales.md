# Sale đã xác nhận cho đồ ăn và hoa

Chỉ lô của tiệm thật đã được duyệt mới có nhãn sale. Giá thường phải là giá của cùng sản phẩm/quy cách tại cửa hàng; không dùng bảng tham khảo của khách để dựng giảm giá.

## Đăng và duyệt

Trong form đăng lô, chọn đăng sale, nhập giá lô trước voucher, giá thường, bằng chứng/ngày/phạm vi, giờ bắt đầu/kết thúc sale và xác nhận cửa hàng đồng ý. Giờ nhập theo Việt Nam. Giờ sale tách khỏi giờ nhận; sale phải kết thúc không muộn hơn khung nhận. Máy chủ ghi thời điểm xác nhận và kiểm tra giá thường cao hơn giá lô. Bằng chứng gốc chỉ hiển thị cho vận hành/nhà bán có quyền; khách thấy nguồn giá tóm tắt và ngày xác nhận.

Merchant vẫn chờ duyệt lô. Vận hành đọc bằng chứng, lịch, chất lượng, ảnh, khoản trả tiệm và chi phí trước khi duyệt. Không tự kích hoạt ngân sách voucher hoặc mở cổng thanh toán.

## Dữ liệu và hành vi

Các trường tùy chọn trong `Lot`: `referenceKind: store_regular`, `referenceConfirmedAt`, `saleStart`, `saleEnd`; tái sử dụng `referencePrice` và `referenceEvidence`. Lô cũ không có metadata sale tiếp tục dùng quy tắc cũ. Không migration SQL hoặc API mới.

Catalogue trả `saleVerified` chỉ khi tiệm thật và lô đã duyệt. Frontend dùng chung SalePrice ở thẻ, chi tiết, checkout và báo giá yêu cầu. Phần trăm giảm lấy phần nguyên, tiền giữ đến đồng. Tiết kiệm từ giá thường sang giá lô tách khỏi voucher và phí giao; không tự thêm giảm 30% hoặc nền 5% cho lô hiện hành.

Trước phiên hiển thị Sắp mở sale, trong phiên Đang sale, sau phiên Đã kết thúc. Khách chỉ thấy đếm ngược giờ/phút/giây đến hết sale hoặc đến lúc mở, tính từ đồng hồ máy chủ; không hiển thị ngày, khung giờ tuyệt đối hay chữ giờ Việt Nam trong khối sale. Không tạo/reset thời hạn. Báo giá mới chỉ được tạo trong phiên; hết hạn không muộn hơn cuối phiên hoặc giới hạn đang có. Snapshot báo giá/đơn giữ nguyên giá và nghĩa vụ trả tiệm sau chấp nhận.

Các sản phẩm chưa có nguồn giữ giá mục tiêu/tham khảo và luồng gửi yêu cầu. Không seed giá, lịch sale hoặc hồ sơ tiệm giả lên production. QA tương tác có dữ liệu sale sử dụng fixture/mock cục bộ; kiểm tra production chỉ đọc.
