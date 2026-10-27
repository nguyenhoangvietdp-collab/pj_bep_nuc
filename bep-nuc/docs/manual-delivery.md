# Giao tận nơi do đội Bếp Núc điều phối — 27/10/2026

## Luồng và chính sách

Khách chọn Tự đến lấy hoặc Giao tận nơi tại Ưu đãi/checkout. Giao tận nơi chỉ áp giảm nền + một voucher trên tiền món; không có thưởng di chuyển, không giảm trên phí giao. Trang ưu đãi dùng listing thật và voucher khả dụng; bộ tính theo điểm giả định đã được bỏ. Đơn thật cần listing/quán thật, tài khoản được duyệt và mọi gate pilot hiện có.

Lô mới mặc định chia quán 90% / Bếp Núc 10% trên tiền món sau ưu đãi, không gồm phí giao. Phần 10% là doanh thu giữ lại trước chi phí, chưa phải lợi nhuận. Khoản trả quán được chốt trong quote. Lô cũ dùng khoản cố định tiếp tục giữ cách tính cũ. Chi tiết tại [bản cập nhật MVP](mvp-release-20261027.md).

Quote ghi fulfillment (pickup mặc định cho dữ liệu cũ); food price/floor/cost/margin vẫn độc lập với giao hàng. Đơn giao yêu cầu tên người nhận, số điện thoại Việt Nam và địa chỉ đầy đủ. Trạng thái: awaiting_delivery_fee → awaiting_payment → paid → out_for_delivery → delivered. Phí do ops báo, mỗi lần sửa tăng revision; khách phải đồng ý đúng revision trước khi có hướng dẫn chuyển khoản. Không tự dùng fee từ client, không tự coi phí chưa biết là 0đ, không bật nhận tiền tự động.

Hạn giữ 10 phút/giờ kết thúc món/23:59 tiếp tục lấy mốc sớm nhất; không kéo dài khi chờ phí. Chuyển khoản khi chưa đồng ý phí hoặc sai tổng đưa vào hoàn thủ công, không làm đơn thành paid. Khách có thể từ chối phí khi còn chờ, trả tồn và voucher. Nếu hết hạn, không tự cấp lại tồn khi tiền tới muộn.

Sau paid, ops chuyển mã bàn giao cho người nhận món. Quán/ops xác nhận mã một lần trong khung nhận để chuyển out_for_delivery, không đánh dấu khách đã nhận. Ops ghi căn cứ xác nhận khách nhận để chuyển delivered. Đơn giao không dùng no_show tự nhận. Hủy sau bàn giao chỉ ops được làm, hoàn toàn bộ tiền món + phí đã đồng ý, không trả món đã rời quán về tồn.

Quán được đối soát khi đã bàn giao thực tế (pickupAt), gồm cả trường hợp đội giao thất bại sau đó. Giao thành công tới khách được đo riêng. Đây là quy tắc MVP cần đưa vào thỏa thuận quán/người giao trước pilot thật; không có nhà cung cấp giao hàng hoặc cam kết ETA tự động.

## Dữ liệu và API

- JSONB bc_state thêm trường tùy chọn; không chạy migration phá dữ liệu. Quote/Order thiếu fulfillment được coi pickup.
- Order.delivery chứa recipient/phone/address, fee/revision/acceptedAt và xác nhận hoàn tất. Chủ đơn và ops đọc được; merchant không đọc tên/điện thoại/địa chỉ khách. Ops chỉ thấy mã bàn giao cho đơn giao đã trả tiền; khách giao tận nơi không thấy mã tự lấy.
- Các action mới trên API pilot: delivery_fee (ops, fee), accept_delivery_fee (chủ đơn, revision), decline_delivery_fee (chủ đơn), delivery_complete (ops, confirmation), delivery_cost (ops, amount/reference). Thao tác dùng key chống trùng hiện có.
- delivery_cost ghi khoản người giao đã thực trả, chỉ cho đơn đã có xác nhận tiền; một khoản/đơn, chứng từ không trùng refund/payout. Có thể ghi khoản trả trước khi bàn giao nếu đó là thực chi. Không tự ghi phí khách trả thành chi phí đã thanh toán.
- Audit order không sao chép thông tin nhận hàng. Signature retry phía khách lưu SHA-256 của intent, không lưu tên/điện thoại/địa chỉ dưới dạng plaintext trong sessionStorage. Chỉ lưu lựa chọn pickup/delivery và draft món/voucher.
- Nếu API cũ không trả quote.fulfillment=delivery, frontend từ chối tạo đơn giao. Health có deliveryFeeApproval=true để xác minh backend đã cập nhật.

## Đối soát

Tiền thu/hoàn bao gồm toàn bộ tổng khách chuyển. merchantDue/settlement chỉ gồm khoản quán nhận, không gồm ship. deliveryFeesCollected là phí giao thu gộp; deliveryCostPaid là khoản ops đã xác nhận thực chi. cash/unallocated trừ thực chi giao hàng. contribution tính trên đơn quán đã bàn giao, trừ hoàn, khoản quán nhận, cost món và thực chi giao; không coi phần ship chưa biết chi phí là lợi nhuận chắc chắn. deliveryCostsUnconfirmed gắn cờ đơn đã bàn giao nhưng chưa ghi chi phí; giao diện ghi contribution tạm tính khi còn thiếu.

## Kiểm tra và triển khai

Đã thêm kiểm thử domain/API cho: số điện thoại/địa chỉ, không thưởng tự nhận cho ship, chưa báo phí, sửa phí/accept cũ, quyền ops/chủ đơn, chuyển khoản sớm/thiếu phí, bàn giao một lần, hoàn tất giao, chi phí lặp, từ chối/hết hạn, hủy trước/sau bàn giao, refund gồm phí, privacy merchant/khách khác và số đối soát. UI thử bằng tiền giả ở 360/390/768/1366px, không đặt hàng hoặc trả người giao thật.

Triển khai backend trước, kiểm tra health, rồi frontend. Giữ REAL_PILOT_ENABLED=false và ACCEPTING_ORDERS=false khi chưa có quán, ngân hàng, nhân sự báo phí/điều phối và hợp đồng thật. Không đổi thỏa thuận qua giao diện một cách ngầm định. Khi đã có đơn giao thật, không rollback backend về phiên bản không hiểu trạng thái/fee mới; tạm ngừng đơn mới và sửa tiến tới, giữ khả năng xử lý đơn hiện hữu.

Dữ liệu người nhận là dữ liệu thật khi mở pilot: chỉ dùng cho báo phí/giao hàng, không gửi vào catalogue công khai. Phân quyền và backup hiện có vẫn áp dụng. Chưa kiểm chứng giao nhận vật lý, thông tin quán hoặc quy trình thu/chi tiền thật.
