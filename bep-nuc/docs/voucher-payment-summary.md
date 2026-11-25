# Tính tiền sau voucher

Thẻ tham khảo có đường vào “Chọn voucher & tính tiền”. Khách chưa đăng nhập vẫn thay đổi số lượng, voucher mong muốn và cách nhận để xem kịch bản; gửi yêu cầu thật vẫn cần đăng nhập. Bản nháp lưu theo sản phẩm và được khôi phục khi đăng nhập.

Bảng chung hiển thị tiền hàng, khoản giảm theo voucher, hỗ trợ tự nhận nếu có, phí giao và hỗ trợ giao đã xác nhận, tổng tiền và bình quân mỗi suất/đơn vị mua. Đổi hoặc bỏ voucher cập nhật ngay, không chờ gửi yêu cầu. Tiền hàng đã là giá lô/giá đang xem; không giảm thêm30% hoặc tự thêm5% cho lô hiện hành.

Với yêu cầu chưa có nguồn, số sau voucher là kịch bản theo mong muốn, không phải khoản được phép thu. Dùng hạn mức phần trăm khi đã có hạn mức dương; khi chưa có chương trình xác nhận, phép tính chỉ minh họa lựa chọn trước xác nhận điều kiện. Voucher cố định9k không tính cho giỏ<=9k. Không giữ tồn, tiêu lượt, trừ ngân sách hoặc tạo đơn khi tính thử. Ngân sách, biên, lượt dùng và nguồn vẫn do máy chủ kiểm tra trước báo giá.

Checkout lô thật sử dụng voucher được chọn và báo giá máy chủ. Báo giá yêu cầu trả thêm trường JSON tùy chọn `quote.priceBreakdown`, dùng lại `publicQuote` để phản ánh cả ưu đãi/giá cũ và hỗ trợ tự nhận. Phí giao chưa báo hiển thị “Chờ báo phí”; chưa có tổng thanh toán gồm giao hàng, không mặc định phí bằng0. Phí đã xác nhận bằng0 vẫn là giao miễn phí thật. Tổng thu theo báo giá/đơn hiện hành, không tính lại nghĩa vụ tiệm.

Không đổi ngân sách voucher, cổng thanh toán, quyền tài khoản hoặc migration. Các lô sale chỉ xuất hiện sau xác nhận nguồn/giá/lịch thật. Kiểm tra tương tác dùng fixture/mock cách ly, không seed hoặc gửi giao dịch giả vào production.


## Tính thử tự lấy cho tài khoản chờ duyệt — 03/11/2026

- Tài khoản khách chờ duyệt được lưu điểm xuất phát, chọn voucher mong muốn và tính thử; chưa được giữ lô, đồng ý báo giá hoặc thanh toán.
- Action `preview_receiving` dùng cùng kiểm tra tài chính của báo giá trên bản sao trạng thái. Không phát hành voucher, không giữ tồn/ngân sách và không tạo đơn. Kết quả chỉ tồn tại tối đa 60 giây, không vượt hạn sale/lô.
- Máy chủ dùng vị trí đã lưu và tuyến thật, bỏ qua giá, khoảng cách hoặc khoản giảm khách gửi. Áp dụng ngân sách, biên và chính sách cộng dồn hiện hành; không thay khoản trả tiệm.
- Chưa có nguồn/tuyến thì hiển thị chờ tính; chương trình tắt thì chưa có hỗ trợ. Không dựng phí giao để tuyên bố tiết kiệm. Tổng tiết kiệm tiền hàng so giá trước giảm tách khỏi chênh lệch tự lấy/giao.
- Thay số lượng, voucher, điểm xuất phát, cách nhận hoặc tài khoản làm kết quả cũ mất hiệu lực. Kiểm tra lại đầy đủ khi báo giá thật.


## Checkout theo địa chỉ và cách nhận — cập nhật 03/11/2026

Bố cục chung cho đồ ăn/hoa: sản phẩm và địa chỉ/cách nhận bên trái; voucher và hóa đơn bên phải. Mobile xếp theo thứ tự đó. Không thêm giỏ nhiều nhà bán, tiền xu hoặc nhận xét giả từ ảnh tham chiếu.

Khách đăng nhập chọn địa chỉ qua kết quả tìm kiếm, chọn tự lấy/giao; giao hàng cần người nhận, điện thoại và chỉ dẫn tùy chọn. Xác nhận bước này mới mở voucher. Đổi địa chỉ/cách nhận/thông tin giao làm xác nhận cũ và khoản giảm cũ mất hiệu lực. Tài khoản chờ duyệt được tính thử và gửi nhu cầu, không được thanh toán.

`checkout` phiên bản 1 gửi placeId, fulfillment và thông tin giao chuẩn hóa. Máy chủ đối chiếu với địa chỉ đã lưu, từ chối phương thức, địa chỉ hoặc thông tin nhận bị thay đổi. Các yêu cầu/báo giá mới ở production v2 phải có xác nhận này. Snapshot JSON bổ sung tùy chọn; đơn/báo giá cũ tiếp tục đọc được, không migration SQL. Yêu cầu cũ chưa có snapshot cần xác nhận lại bằng nhu cầu mới trước khi vận hành báo giá mới. Không tự chuyển điều kiện cũ sang xác nhận mới.

Voucher của yêu cầu chưa có nguồn là mong muốn, không phải ưu đãi đã được cấp. Phí giao chưa biết luôn là “Chờ báo phí”; số nổi bật khi đó là tiền hàng tạm tính, không phải tổng có giao hàng. Chỉ giữ hàng khi báo giá đủ điều kiện; chưa thanh toán trước khi đồng ý phí giao và tổng tiền.

Snapshot địa chỉ được giữ trong báo giá để không đổi điều kiện khi tạo đơn; không ghi điện thoại/địa chỉ vào audit của thao tác quote. Giá 5% trước voucher, khoản trả tiệm, ngân sách và cổng mở thanh toán không đổi.


## Quyết định mới nhất: voucher cơ bản trước, voucher tự lấy cộng thêm

Phần này thay thế quy tắc khóa lựa chọn voucher theo địa chỉ ở mục trước. Khách chọn một voucher cơ bản trước khi quyết định nhận hàng. Đổi địa chỉ hoặc chuyển tự lấy/giao không xóa lựa chọn đó; vẫn kiểm tra lượt, thời hạn, điều kiện lô, ngân sách và biên khi chốt thật.

Xác nhận tự đến lấy là cam kết nhận tại tiệm để tính một khoản voucher tự lấy riêng, cộng vào voucher cơ bản. Khoản này ghi ở `promotion.pickup`, không phát thêm lượt voucher cơ bản, không trừ hai lần và không thêm mức tiền/bán kính giả. Chỉ áp dụng khi chương trình được tài trợ, tuyến có kết quả và lô đủ biên; chuyển sang giao bỏ riêng khoản tự lấy. Địa chỉ vẫn phải xác nhận trước khi gửi nhu cầu/giữ lô/thanh toán.

`stackReceiving` giữ nguyên trường JSON và chỉ điều khiển việc kết hợp hỗ trợ phí giao với voucher cơ bản. Voucher tự lấy được cộng thêm không phụ thuộc cờ này, nhưng vẫn chịu kiểm tra ngân sách/biên hiện hành. Quy tắc giao hàng khác không đổi.

Vận hành báo giá yêu cầu tự lấy cũng tính tuyến từ điểm xuất phát của khách, không dùng vị trí nhân viên vận hành; chống thay điểm giữa hai bước đọc dữ liệu. Hóa đơn có hai dòng riêng: voucher cơ bản, voucher tự lấy. Khoản trả tiệm và snapshot đơn cũ giữ nguyên.

Thông điệp sản phẩm: “Voucher của bạn, bạn chọn trước. Tự đến lấy, nhận thêm ưu đãi.” Chính sách chưa có tiền tài trợ thì vẫn hiển thị chờ kích hoạt, không hứa một khoản giảm chưa được cấp.


## Phản hồi khi tính voucher tự lấy — 04/11/2026

Khi khách xác nhận tự lấy và điểm xuất phát cho lô thật, phép tính tự chạy sau một nhịp chờ ngắn. Thay đầu vào sẽ kiểm tra lại; nút tính vẫn dùng để thử lại, không gửi trùng cùng một phép tính đang chạy. Tiến trình 0–90% là ước tính hiển thị trong lúc chờ, có nhãn rõ; chỉ lên 100% khi máy chủ trả kết quả tuyến đã tính. Không tự hoàn tất theo timer.

Nếu máy chủ trả voucher tự lấy dương, vé dự tính xuất hiện bằng một nhịp rơi/nhún ngắn, với khoản cộng thêm và khoảng cách tuyến nếu có. Không đổi nhãn thành đã cấp/đã giữ; hóa đơn cập nhật bằng số tiền máy chủ và chốt trong báo giá thật. Kết quả 0đ không nhận hiệu ứng thưởng; chưa có tuyến, chương trình tắt hoặc lỗi không hiển thị 100%/vé.

Âm ting tùy chọn mặc định tắt, chỉ chạy với vé dương sau khi khách bật. Không gọi thêm dịch vụ âm thanh. Respect prefers-reduced-motion: không nhún vé hoặc chuyển động thanh tiến trình. Đổi đầu vào/cách nhận, hết hạn hay kết quả đến muộn không để vé cũ tồn tại; voucher cơ bản vẫn giữ. Không thay quy tắc, tiền ưu đãi hoặc nghĩa vụ tiệm.


## Khôi phục công thức đã có: Haversine + 8 điểm phần trăm/km — 04/11/2026

Mục này thay các mô tả tính theo Google Routes hoặc bảng vùng ở các mục trước. Không có công thức mới do hệ thống tự đặt: khôi phục công thức ghi tại `product-images.md` và hàm `price` cũ, giữ cách tách hai voucher hiện hành.

- d = Haversine(tọa độ khách đã lưu, tọa độ điểm nhận thật), đơn vị km. Không cần API tuyến đường hoặc hạn mức gọi Google. Không dùng khoảng cách, tọa độ hoặc số tiền do trình duyệt gửi trong yêu cầu tính giá.
- Q = tiền hàng sau giảm nền 5%, trước voucher cơ bản, nhân số đơn vị. F = khoản trả tiệm cố định; C = chi phí; M = đóng góp tối thiểu.
- V = voucher cơ bản đã chọn (15%/10% có trần, hoặc9k cố định).
- T = floor(Q × 0,08 × min(d,2)): số tiền tự lấy theo công thức. Không nhân lên theo chiều đi/về; không coi đường chim bay là đường thực đi.
- Kiểm tra Q−V đủ F+C+M và V có ngân sách trước. Khoản tự lấy thực áp = min(T, Q−V−F−C−M, ngân sách còn lại−V, Q−V−1), không âm; chương trình tắt thì thực áp0.
- Tổng tiền hàng = Q−V−tự lấy thực áp. Không giảm nền5% thêm lần nữa, không lấy phần tự lấy trên số tiền sau voucher cơ bản.

Ví dụ kiểm thử: F45.000đ, Q61.072đ, V9.000đ, C3.000đ, M1.000đ, d≥2km: công thức T9.771đ nhưng biên chỉ cho cộng3.072đ, thực trả49.000đ; tiệm vẫn nhận45.000đ. Nếu ngân sách sau V chỉ còn1.000đ, thực áp1.000đ và trả51.072đ. Đây là ví dụ fixture, không phải hiệu quả kinh doanh thực tế.

Snapshot JSON `pickupPricing` ghi cách đo, khoảng cách,8pp/km,cap2km,nominal,applied và cờ giới hạn; không công khai F/C/M hoặc số dư ngân sách. Preview, giữ lô, vận hành báo giá và xác nhận đơn dùng cùng phép tính trong domain. Đơn/báo giá đã chốt giữ snapshot cũ. Bảng `pickupBands` cũ vẫn đọc được nhưng không còn quyết định báo giá mới; màn hình vận hành hiển thị công thức thay cho bảng vùng.

Chưa đủ tọa độ khách/tiệm thì ghi đúng thiếu dữ liệu, không tuyên bố thiếu công thức. Có tọa độ nhưng chưa được cấp ngân sách vẫn xem được mức theo công thức và0đ thực áp, không phát vé thưởng giả. Không đổi cấu hình funding/pilot/thanh toán hoặc tạo nhà bán/tọa độ giả trên production.
