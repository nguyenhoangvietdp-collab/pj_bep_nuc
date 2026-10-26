# Bếp Núc — kế hoạch redesign xanh BCG, chọn bữa nhanh

Ngày 17/10/2026. Phạm vi: toàn bộ giao diện khách hàng trên website, ưu tiên điện thoại. Đây là kế hoạch triển khai dựa trên kiểm tra giao diện trực tiếp và rà mã nguồn, không phải kết quả nghiên cứu người dùng hay chứng nhận sẵn sàng giao dịch thật.

## 1. Quyết định nhận diện

Tham khảo trang chủ https://www.bcg.com/ được mở trực tiếp ngày 17/10/2026. Màu lấy mẫu từ computed style của trang đang hiển thị: xanh đậm rgb(12,43,21) (#0C2B15), xanh sáng rgb(150,248,120) (#96F878), chữ rgb(33,36,39) (#212427), trắng và xám #F2F2F2. Đây là quan sát homepage hiện tại, không phải bản hướng dẫn nhận diện chính thức của BCG.

Bếp Núc dùng xanh đậm cho thương hiệu, nút chính và chữ quan trọng; trắng là nền chính; xanh sáng dùng cho trạng thái lọc được chọn; xanh rất nhạt #EAFBE3 dùng cho nền phụ. Màu cảnh báo và lỗi có nhãn riêng. Không dùng xanh sáng làm chữ nhỏ trên nền trắng hoặc chữ trắng trên nền xanh sáng. Giữ tên Bếp Núc và ảnh món của quán, không dùng logo hoặc font độc quyền BCG.

H1 ngắn dùng Georgia hỗ trợ tiếng Việt để tạo nét biên tập; tên món, giá, form và điều hướng dùng system-ui 16px, phụ tối thiểu 14px. Không biến trang mua đồ ăn thành trang giới thiệu tư vấn. Lưới thẻ đồng nhất và nút dễ tìm được ưu tiên hơn bố cục trang trí bất đối xứng.

Đã sửa bảng màu và hover trong mã CSS khách hàng ở lượt này. Bản đang chạy cổng 3200 vẫn là bằng chứng của thiết kế trước; cần chạy build .next-bcg để nghiệm thu màu mới. Không đánh dấu ảnh cũ là ảnh bản xanh mới.

## 2. Vấn đề và mức bằng chứng

P1: cần giải quyết trước khi nghiệm thu redesign. P2: cần hoàn thiện trước pilot thật. Quan sát trực tiếp không đồng nghĩa đã đo tác động đến tỷ lệ mua.

| Mức | Điểm vướng | Bằng chứng | Hướng xử lý |
|---|---|---|---|
| P1 | Chưa thấy món ở màn hình đầu | Đo trực tiếp 390×844: món đầu y≈896px, bộ lọc ≈475px. 1366×768: món đầu y≈791px | Nén header/giới thiệu; ngân sách một hàng; chuyển phần lọc ít dùng vào panel |
| P1 | Voucher hiển thị 7.000000000000001% | Đã thấy tại checkout; source dùng rate*100 không định dạng | Một formatter phần trăm cho thẻ, chi tiết, voucher và trợ năng; kiểm tra cả 7/10/20% |
| P1 | Cách hiển thị giá thiếu liên tục | Hai suất bánh mì: chi tiết 45.600đ với 20%, checkout chưa chọn voucher là 57.000đ | Tách giá trước voucher, giá gợi ý có điều kiện và tổng đã chọn; không gọi giá gợi ý là tiền phải trả |
| P1 | Nút giữ suất ở quá sâu | Trên mobile, khối action bắt đầu ≈1701px trong kịch bản đã thử | Voucher dạng hàng gọn, tóm tắt và CTA ngay sau lựa chọn; giải thích và vị trí đặt sau |
| P1 | Lỗi giao dịch xuất hiện xa nơi thao tác | Source: error dùng một alert đầu trang; action/quote ở phía dưới | Lỗi thao tác hiện cạnh CTA; lỗi tải có banner riêng; đưa focus đến lỗi có hành động phục hồi |
| P1 | Không rõ server đã nhận thao tác khi mất phản hồi | Source: key mới cho mỗi lần act; backend từ chối tạo đơn lần hai trên cùng quote, nhưng UI chưa nối lại đơn đã tạo khi phản hồi bị mất | Giữ key cho retry cùng ý định, tải lại trạng thái trước retry và điều hướng đến đơn hiện có; không tự gửi thêm quote/order |
| P2 | Hover/selected còn kế thừa xanh cũ | Đã quan sát voucher chưa chọn chuyển xanh khi hover; style.css có hover toàn cục | Đã bổ sung override ở phạm vi khách; tiếp tục dọn quy tắc lặp và kiểm tra đủ trạng thái |
| P2 | Quay lại catalogue mất điều kiện tìm | Source: nhiều liên kết về /; draft chỉ có món và số suất | Lưu URL browse hợp lệ và phục hồi khi quay lại; không lưu tọa độ hoặc điều khoản tài chính |
| P2 | Đăng nhập chưa có gửi lại mã/đổi email rõ ràng | Source: sent đổi form sang nhập mã, không có nút gửi lại; chưa thử Supabase thật | Thêm đổi email, gửi lại mã có chờ 60 giây, giữ kiểm soát từ Supabase; không có thông báo giả thành công |
| P2 | Trạng thái đang chờ duyệt thiếu hướng đi | Source: chỉ kiểm tra trạng thái hoặc xem món | Hiện lựa chọn còn lưu, cách liên hệ thật nếu có, và quay lại tìm món; không hứa thời gian duyệt |
| P2 | Thời gian và trạng thái tiền dễ nhầm | Source: hướng dẫn có xác nhận thủ công, chưa có lần cập nhật gần nhất hoặc thông báo mất kết nối | Trạng thái theo server, cập nhật gần nhất, nút kiểm tra lại; hết hạn không yêu cầu chuyển thêm |
| P2 | Tín hiệu tin cậy về đồ ăn chưa đủ cho giao dịch thật | Hai món demo không có ảnh, địa chỉ minh họa; chưa có nghiên cứu người dùng | Giữ nhãn demo/thiếu thông tin; bổ sung ảnh lô, địa chỉ và hướng dẫn quán cung cấp trước pilot, không bịa rating |
| P2 | Cần kiểm tra tiếp cận và khả năng phục hồi | Chưa thử bàn phím điện thoại thật, phóng chữ, OTP thật; mã nhận là chuỗi dài | Duyệt bằng bàn phím/đọc màn hình, copy mã và dòng dài không tràn, focus và mạng chậm |

Ngoài các điểm trên, polling/focus/visibility có thể chạy load đồng thời; source chưa ngăn phản hồi cũ cập nhật sau phản hồi mới. Đây là rủi ro từ mã, chưa phải lỗi đã tái hiện. Kiểm thử với response trì hoãn trước khi kết luận.

## 3. Thiết kế mục tiêu theo màn hình

### Khám phá

Thứ tự mobile: header thương hiệu/đơn → dòng ngắn Hà Nội, tự nhận và điều kiện pilot → tìm kiếm → hàng ngân sách và nút Lọc → loại món cuộn ngang → kết quả.

Không dùng hero riêng trên mobile. Header tối đa hai dòng; demo banner vẫn rõ và ngắn. Mọi mức/30k/40k/50k nằm trong một hàng cuộn ngang, không xuống nhiều hàng. Nhập mức khác, giờ nhận, quán, sắp xếp nằm trong panel details mở rộng. Khi chọn Mức khác, mở panel và focus trường nhập. Các bộ lọc áp dụng có chip bỏ riêng; không tự xóa hoặc nới điều kiện khi kết quả rỗng.

Khi không có bộ lọc tùy chọn mở và không có đơn đang chờ, mục tiêu ở 390×844: thẻ đầu có tên, giá và CTA nhìn thấy trong màn hình đầu; mép trên thẻ không quá 430px. Ở 360×800: mép trên không quá 450px. Desktop 1366×768: mép trên không quá 380px. Đây là mục tiêu nghiệm thu thiết kế, không phải kết quả hiện tại. Khi phóng chữ hoặc lỗi dài, ưu tiên đọc đủ và cuộn đúng thay vì giữ giới hạn này.

Thẻ mobile một cột ngang: ảnh 96px, tên, giá, quán/địa chỉ, giờ nhận, tồn và CTA. Không cắt điều kiện giá. Giờ nhận hiển thị Đang nhận hoặc Nhận từ HH:mm bằng dữ liệu thật. Desktop giữ 3 cột từ 1000px, tablet 2 cột từ 600px. Thiếu ảnh dùng placeholder gọn; ảnh demo luôn có nhãn.

### Chi tiết món

Ảnh vừa đủ, tên và quán, địa chỉ/giờ nhận, giá mỗi suất, chọn số suất và tổng ước tính gần nhau. Thông tin dị ứng chưa rõ hiện cảnh báo ngắn trước CTA, hướng dẫn bảo quản vẫn mở được. Nút tiếp tục trong luồng nội dung, không che khi mở bàn phím. Giữ dialog desktop và trang chi tiết riêng, focus/đóng/quay lại hoạt động như nhau.

### Kiểm tra và voucher

Hiển thị món/số suất/giờ nhận ngắn ở đầu. Ba voucher là ba hàng radio có nhãn, tỷ lệ định dạng nguyên, tổng còn trả và số đồng tiết kiệm. Trạng thái đề xuất và đã chọn khác nhau: đề xuất chỉ là lời gợi ý; chỉ lựa chọn chủ động mới đổi voucher cho đơn.

Trước khi chọn, ghi Giá trước voucher, đồng thời giữ một dòng gợi ý giá nếu chọn voucher tương ứng. Sau chọn, tổng ước tính đổi ngay và nói rõ chưa giữ suất. Không tự chọn voucher 20%. Không quảng cáo mức giảm mà tài khoản không đủ điều kiện.

Tổng và CTA đặt ngay dưới voucher. Thưởng vị trí là tùy chọn sau khối này, mở khi khách muốn; nếu đã giữ thì không thay đổi. Breakdown và công thức nằm trong details. Sau giữ, khối đổi thành giá xác nhận + hạn giữ + tiếp tục thanh toán; cần sửa đơn thì giải phóng giữ bằng thao tác hiện có.

### Thanh toán và nhận

Màn đơn dùng một khối hành động theo trạng thái. Chờ thanh toán ưu tiên tiền/tài khoản/nội dung/hạn; sao chép có phản hồi riêng. Chưa có xác nhận thì không hiển thị như đã trả. Không thêm nút Tôi đã thanh toán giả làm bằng chứng tiền về. Có thể kiểm tra trạng thái, nhưng việc xác nhận vẫn do vận hành.

Hiện thời điểm lần cập nhật thành công theo thời gian thiết bị, phân biệt với giờ nghiệp vụ demo đóng băng. Nếu tải thất bại, báo trạng thái có thể cũ và cho thử lại. Không ghi Đã cập nhật vừa xong khi request thất bại.

Đã trả: mã nhận + nút sao chép + địa chỉ/giờ nhận. Hết hạn/hủy/no-show/chờ hoàn/đã hoàn là các trường hợp riêng; tiền đã thu và hoàn lấy từ dữ liệu server. Hỗ trợ dùng SUPPORT_EMAIL hợp lệ; thiếu kênh phải được coi là việc vận hành cần hoàn thiện trước pilot, không tạo thông tin giả.

### Đăng nhập

Xem món công khai, chỉ yêu cầu đăng nhập khi đặt hoặc xem đơn. Email/OTP có lỗi tại trường và nút thử lại phù hợp. Đổi email xóa OTP/sent và giữ nháp. Gửi lại dùng endpoint hiện có, bỏ token khỏi request, khóa bấm 60 giây sau lần gửi thành công; lỗi nhà cung cấp vẫn hiển thị. Tài khoản chưa duyệt có trạng thái rõ, giữ nháp và đường về catalogue.

## 4. Triển khai kỹ thuật và interfaces

- Giữ Next.js/TypeScript và thư viện hiện có. Dọn commerce.css thành một hệ token, component và breakpoint thay cho thêm nhiều lớp override. Mọi style mới trong .commerce; không đổi màu quán/vận hành.
- Định dạng phần trăm bằng một helper Intl.NumberFormat vi-VN style percent maximumFractionDigits:0. Dùng ở mọi chỗ hiển thị tỷ lệ; dữ liệu tính tiền vẫn giữ rate dạng số.
- Giữ public catalogue, nghiệp vụ quote/order/payment/pickup/refund và schema. Không cần API tài chính mới.
- Bổ sung trạng thái UI cho panel lọc, lỗi theo thao tác và thời điểm sync. Phản hồi load chỉ áp dụng nếu vẫn là request mới nhất; không để cũ đè mới.
- Session chỉ lưu browse URL, listingId, qty và voucherId nháp đã chọn. Validate URL cùng origin chỉ đường / hoặc /shops/ID và các tham số lọc đã hỗ trợ; xác minh voucher lại theo profile khi khôi phục, không khôi phục key tiền, vị trí hay giá xác nhận từ client.
- Giữ key idempotency cho retry cùng payload, tạo key mới khi khách đổi ý định. Sau timeout quote/order, đọc lại heldQuotes/orders; nếu đơn của cùng quote đã tồn tại thì mở đơn đó. DTO đơn sinh viên hiện đã trả quoteId; dùng trường này để nối lại đúng đơn, không bổ sung API hoặc trường tiền riêng của quán.
- Giữ tương thích URL q, budget, category, shop, stock, receiving, sort. Trong mỗi đợt triển khai chỉ chỉnh các phần cần cho hành vi mới; không viết lại aggregate database.

## 5. Thứ tự bàn giao

1. Màu và trạng thái thương hiệu: đổi token xanh–trắng, sửa hover; build mới tách khỏi bản đang chạy. Xem lại screenshot màu mới trước khi tuyên bố hoàn tất nhận diện.
2. P1: formatter voucher, liên tục giá, nén khu khám phá, voucher/CTA gọn, lỗi tại nơi thao tác và phục hồi sau mất phản hồi. Bàn giao đủ chuỗi tìm → chọn → checkout trên mobile trước khi thêm polish.
3. P2: quay lại giữ bộ lọc, OTP/gửi lại, trạng thái chờ tiền và hỗ trợ; dọn CSS để không hồi quy nội bộ.
4. QA trực tiếp và thử sáu sinh viên. Lưu baseline trước redesign làm A và bản hoàn thiện làm B; giữ bộ dữ liệu, giờ, tài khoản và thứ tự thử cân bằng. Không mở giao dịch thật trong lúc nghiệm thu.

## 6. Kiểm thử và tiêu chí đạt

- Đơn vị: 7/10/20% không có chữ số thừa; 1–3 suất giá lẻ; điều kiện voucher; budget đúng biên và sort theo cùng giá; nháp/voucher sau reload; URL quay lại và link hỗ trợ an toàn.
- Tích hợp: tranh tồn cuối, quote hết hạn, duplicate click, mất response sau tạo order, retry cùng key, phản hồi load sai thứ tự, xác nhận tiền muộn, quán hủy, hoàn và pickup một lần. Tiền vẫn khớp sổ.
- Trình duyệt: 360×800, 390×844, 768×1024, 1366×768; ảnh chụp catalogue/chi tiết/checkout/chờ tiền/mã nhận/hết hạn; Tab/Shift+Tab/Escape, bàn phím thực, phóng chữ 200%, không tràn ngang hoặc che thao tác. Dùng dữ liệu demo, không lấy vị trí thật để thử nếu chưa được đồng ý.
- Màu: chữ thường đạt 4,5:1, focus và control rõ; hover, focus, selected, disabled, error được xem trực tiếp, không chỉ kiểm tra màu token. Không đánh dấu đạt WCAG toàn bộ chỉ từ vài cặp màu.
- Thử 6 sinh viên như kịch bản đã chuẩn bị. Tối thiểu 5/6 chọn đúng bữa và hiểu đúng tổng tiền, nơi/giờ nhận, bước tiếp theo không cần hướng dẫn. Mọi hiểu nhầm dẫn đến chuyển sai/thêm tiền hoặc nhận trước xác nhận phải sửa và thử lại; chưa dùng mẫu nhỏ để tuyên bố tăng chuyển đổi.
- Cập nhật tài liệu nghiệm thu theo trạng thái đã quan sát. Trang hiện đang mở được qua browser, vì vậy giới hạn cũ “không xem được localhost” không còn áp dụng cho việc đọc UI ở lần đánh giá này; OTP, tiền thật và toàn luồng có mutation vẫn chưa được kiểm tra trong lượt audit.

## 7. Giới hạn và giả định

Không đổi bộ ba voucher, giảm nền, tự nhận, duyệt sinh viên hoặc đối soát thủ công. Không mở rộng sang bot/ML/giao hàng, không dùng dữ liệu giả làm rating/chứng nhận an toàn. Nguồn hàng, ảnh/địa chỉ thật, hộp thư hỗ trợ và thời gian xử lý tiền cần đội pilot xác nhận. Không cam kết thời gian duyệt/hoàn khi chưa có năng lực vận hành đo được.

## Kết quả phần màu đã thực hiện

Production build .next-bcg đạt, bao gồm kiểm tra TypeScript. Ba cặp màu chữ đã đo: trắng/xanh đậm 15,31:1; xanh đậm/xanh sáng 11,66:1; chữ phụ/trắng 7,60:1. Chưa restart máy chủ hoặc chụp ảnh bản màu mới. Các hạng mục redesign còn lại ở trên là kế hoạch, chưa được triển khai trong lượt này.

## Triển khai tiếp ngày 17/10/2026

Đã sửa trong mã:
- Nén giới thiệu/header; ngân sách một hàng cuộn; chuyển nhập mức khác/giờ nhận vào panel lọc; giữ URL tìm và phục hồi liên kết quay lại.
- Formatter phần trăm dùng chung, radio voucher gọn; phân biệt giá trước voucher, gợi ý có điều kiện và tổng đã chọn. Vị trí/công thức nằm trong phần tùy chọn sau hành động.
- Lưu voucherId nháp cùng món/số suất; chỉ sử dụng lại khi server profile còn cho phép. Không giữ giá từ session làm căn cứ thanh toán.
- Lỗi thao tác cạnh CTA, trạng thái lỗi tải riêng; chỉ nhận kết quả load mới nhất. Thời điểm cập nhật chỉ đổi sau lần tải thành công.
- Preflight đọc trạng thái trước mutation; timeout giữ idempotency key theo ý định, tìm lại đơn bằng quoteId trước khi retry. Chưa xác định trạng thái thì hướng dẫn kiểm tra, không chuyển thêm tiền.
- Đăng nhập có gửi lại OTP với chờ 60 giây sau thành công, đổi email, giữ nháp; tài khoản chưa duyệt có đường về catalogue và link email nếu cấu hình hợp lệ. GET /api/auth bổ sung supportEmail tùy chọn (hộp thư hỗ trợ công khai, không chứa dữ liệu khách).
- Sao chép mã nhận, cập nhật đơn thủ công; dọn 44 khai báo CSS đã bị ghi đè và kiểm tra map khai báo hiệu lực trước/sau tương đương.

21 kiểm thử đạt, gồm tỷ lệ voucher, URL quay lại an toàn, giá/biên ngân sách và backend phát lại cùng key sau mất response không tạo quote/order lần hai. Chưa có kiểm thử trình duyệt mô phỏng ngắt mạng hay phản hồi đảo thứ tự; không xem test backend là bằng chứng client network đã đạt.

Bản production .next-bcg được build riêng, không ghi đè .next-journey mà site cổng 3200 đang phục vụ. Chưa restart site vì lệnh khởi động đã bị policy chặn trong cùng công việc. Không đánh dấu các ngưỡng first-fold và screenshot phiên bản mới là đạt trước khi server được đổi sang build này.

Để xem bản mới, tại terminal đang chạy Bếp Núc, dừng server rồi chạy lại trong thư mục bep-nuc với các biến demo hiện tại và NEXT_DIST_DIR=.next-bcg. Không đổi PGLITE_DIR sang database thật. Tiếp tục checklist bốn viewport, bàn phím/phóng chữ, tiền giả, OTP thật và sáu sinh viên trước pilot. Chưa commit/push trong lượt sửa này.

## Điều chỉnh sau phản hồi ảnh: bộ lọc thương mại điện tử

Người dùng phản hồi trực tiếp rằng khu vực tìm/lọc vẫn gây khó hiểu. Giữ đây là kết quả chưa đạt của bản cũ, không dùng các test kỹ thuật để phủ nhận phản hồi.

Đã thay các hàng nút ngang giá/loại món bằng sidebar từ 768px, gồm fieldset có legend, radio chọn loại/giá, ngân sách tùy chọn, checkbox giờ nhận/tồn và select quán. Sắp xếp tách ra trên toolbar kết quả. Search vẫn độc lập. Các chip chỉ xuất hiện khi có điều kiện, cho phép bỏ từng điều kiện.

Dưới 768px dùng một nút Bộ lọc mở native dialog; bộ lọc trong dialog là bản nháp, Xem N món mới áp dụng; Đóng/Escape bỏ thay đổi chưa áp dụng. Mỗi lần mở lấy lại các điều kiện đang dùng. Xóa trong dialog chỉ xóa nháp. Nhóm radio desktop/mobile có tên riêng để không tác động chéo. Count xem trước dùng cùng filterFood và giá như catalogue; không tự nới điều kiện khi không có kết quả.

Nguồn tham khảo đã mở ngày 17/10/2026: IKEA furniture https://www.ikea.com/us/en/cat/furniture-fu001/ (tách category, Sort and Filter và kết quả); MOJ Filter a list https://design-patterns.service.justice.gov.uk/patterns/filter-a-list/ (nhóm bộ lọc và tag đã chọn). Sidebar và dialog là lựa chọn thích nghi cho Bếp Núc, không phải bằng chứng người dùng Bếp Núc đã sử dụng thành công.

Đã xóa 33 rule CSS của bộ lọc ngang không còn dùng. 21 kiểm thử và TypeScript đạt. Build mới dùng .next-filter để không ghi đè build đang chạy. Cần restart bằng build mới, kiểm tra desktop/sidebar, mobile/dialog, Escape, apply/cancel và URL reload trước khi xác nhận trải nghiệm này đã giải quyết sự khó hiểu. Chưa có phản hồi người dùng về bản sửa mới.

## Trang chính và màn hình tải

Đã thêm trang chính `/` giới thiệu cách chọn, thanh toán thủ công và tự nhận; CTA đi `/meals`. Trang chính là server component, không yêu cầu đăng nhập hoặc tải catalogue để đọc. Không bắt người quay lại phải đi qua giới thiệu: `/meals`, quán, món và đơn vẫn có thể mở trực tiếp.

Link catalogue cũ tại `/?q=...&budget=...` chuyển sang `/meals` với các tham số lọc hợp lệ. `browseUrl` chuẩn hóa cả session cũ và link mới; liên kết quay lại mua không quay nhầm về giới thiệu. Link logo vẫn về `/`. HTTP smoke đã bổ sung route `/meals`.

Loading dùng component chung cho Next route fallback và initial load của Market. Nội dung có role status/live polite, skeleton không đọc bằng screen reader, animation tắt khi prefers-reduced-motion. Không có delay giả hoặc phần trăm tải giả. Nếu API lỗi/timeout, load kết thúc và hiện thông báo/nút thử lại; polling nền không phủ màn loading lên thao tác đang làm.

Build dùng `.next-home`, riêng với server cổng 3200. Chưa restart server hoặc xác minh trực quan bản mới. Ảnh hero là minh họa đã có trong dự án, ghi rõ không phải món đang bán. Chưa thêm thư viện hoặc thay đổi nghiệp vụ tiền/tồn/voucher.

## Luồng đọc dọc và giảm cuộn thừa

Theo yêu cầu tiếp theo, trang chính dùng một cột nội dung ngắn: tiêu đề/giá trị → nút chọn bữa → điều kiện pilot → ba bước nhận bữa dọc. Đã bỏ ảnh hero minh họa lớn không giúp chọn món và thu phần voucher phụ trong details; vẫn giữ điều kiện đặt, xác nhận tiền thủ công và tự nhận hiển thị rõ.

Catalogue chuyển thành một danh sách món dọc, mỗi hàng có ảnh nhỏ và thông tin một bữa; giá menu và giá hiển thị gộp một dòng để không tăng chiều cao thẻ quá mức. Sidebar desktop vẫn là vùng lọc phụ; mobile dùng dialog đã có. Không thêm carousel hoặc yêu cầu cuộn ngang để xem lựa chọn.

Checkout dùng một luồng duy nhất trên mọi kích thước: thông tin bữa → số suất → voucher → tổng tiền và CTA. Bước hiện tại được tóm tắt một dòng thay vì một dãy ba mục lặp. Hình trong chi tiết giới hạn 170px để giá và thao tác không bị ảnh đẩy xuống sâu. Thông tin bảo quản/dị ứng vẫn có mặt, không xóa để rút ngắn trang.

Build mới ở .next-vertical, chưa đổi server hiện tại. Việc giảm chiều cao là thay đổi thiết kế trong mã, chưa có số đo viewport mới để khẳng định mức cuộn đã giảm. Tiếp tục cần kiểm tra thực tế 360×800, 390×844, phóng chữ và bàn phím trước nghiệm thu.

## Ảnh món lớn hơn, chi tiết không hiện thanh cuộn

Theo ảnh phản hồi của người dùng, modal cũ vẫn quá dài và ảnh quá nhỏ. Đã thay foodDetails dùng chung cho dialog/trang riêng bằng ảnh lớn + cột thông tin mua trên desktop; mobile xếp dọc. Giữ thông tin dị ứng hiển thị, hướng dẫn bảo quản trong details. Số suất, tổng tiền và CTA đặt cùng khối.

Dialog tối đa 960px, cách mép viewport 20px, overflow vẫn auto để chữ lớn/nội dung dài truy cập được. scrollbar-width:none và ::-webkit-scrollbar ẩn phần chrome, không đặt overflow:hidden trên nội dung. Khi native dialog mở, html/body nền khóa cuộn bằng :has. Filter drawer vẫn cuộn được, ẩn thanh cuộn của vùng nội dung.

Ảnh catalogue desktop dùng cột 224px (cao 200px), mobile 136px, màn dưới 360px còn 112px. Ảnh chi tiết chiếm khoảng nửa modal desktop, chiều rộng đầy đủ trên mobile. Không cắt thông tin dị ứng hoặc tắt khả năng cuộn để làm giao diện trông ngắn.

22 kiểm thử và TypeScript đạt. Build riêng .next-visual; chưa restart site và chưa xác minh ảnh chụp bản mới. Ảnh đang dùng vẫn là SVG minh họa có nhãn DEMO; tăng kích thước chưa chứng minh tăng ý định mua. Ảnh lô thật do quán cung cấp vẫn cần trước giao dịch thật.

## Phân cấp vùng nhìn sau phản hồi thiếu điểm tập trung

Người dùng tiếp tục phản hồi vùng bố cục chưa tách bạch, mắt chưa biết tập trung ở đâu. Đây là kết quả chưa đạt của bản trước; kiểm thử kỹ thuật không chứng minh đã giải quyết cảm nhận này.

Đã sắp lại:
- Search có khung riêng; sidebar lọc nền trung tính nhạt; kết quả và món trên nền trắng. Không đặt cả bộ lọc và hành động mua cùng mức nhấn.
- Một thẻ món gồm ảnh lớn, mô tả/nhận hàng, khối mua nền xanh nhạt. Giá hiện tại lớn nhất trong khối mua; giá menu và điều kiện là chữ phụ. CTA duy nhất của thẻ là Chọn bữa này, còn tên/ảnh vẫn mở chi tiết bằng hành vi sẵn có.
- Chi tiết gồm ảnh, tên/quán, khối nhận hàng, khối mua. Địa chỉ/giờ nhận/dị ứng không trộn vào vùng số suất/tổng tiền/CTA. Dị ứng vẫn hiển thị trước khi tiếp tục; bảo quản vẫn mở được.
- Checkout tổng tiền/CTA có nền và đường viền riêng; phần thông tin bữa giữ nền trắng. Mobile đọc một cột, ảnh thẻ rộng đầy đủ và cao 210px. Không thêm chuyển động hoặc che điều kiện giá.

22 kiểm thử và TypeScript đạt. Build riêng .next-focus. Chưa restart bản đang chạy, chưa có screenshot hay quan sát người dùng cho bản phân cấp mới; không khẳng định đã tăng tập trung hoặc ý định mua. Cần kiểm tra lại chính vị trí người dùng phản hồi, xác nhận họ tìm được món/giá/nút tiếp tục mà không cần chỉ dẫn.


## 2026-10-18 — Nền trắng và khung trang dùng chung

- Dùng chung SiteHeader/SiteFooter cho trang chủ, mua hàng, đăng nhập, loading và nội bộ. Header/footer nằm ngoài main; liên kết bỏ qua điều hướng trỏ đến main. Điều hướng nội bộ giữ mục theo vai trò.
- Nền chính trắng, đường viền phân nhóm, footer trong luồng; header không sticky. Container tối đa 1.280px, lề 24px desktop/16px mobile; giữ cột hẹp của checkout/đăng nhập.
- Inter WOFF2 tự lưu kèm giấy phép OFL, Arial dự phòng; bỏ font serif/system cạnh tranh. Đã kiểm tra cmap cho mẫu tiếng Việt, ký hiệu đồng và trục weight 100–900 bằng fontTools (giải nén Brotli bằng Node có sẵn, không thêm dependency).
- Bỏ 53 quy tắc CSS của header/footer cũ; giữ ảnh món, bộ lọc, quy tắc giá và luồng giao dịch.
- 22 kiểm thử nghiệp vụ, TypeScript và production build `.next-white` đã qua. Kiểm tra HTML build của meals, checkout, login, orders, internal và trang 404: mỗi trang có đúng một main#content, header và footer. Đây là kiểm tra markup ban đầu, không thay thế QA sau đăng nhập hoặc tương tác trình duyệt.
- Kiểm tra trực quan ở 360/390/768/1366px, tải font thực tế/Arial fallback, zoom 200%, focus/Escape và ảnh đối chiếu CHƯA thực hiện: trình duyệt từ chối quyền truy cập localhost theo URL policy. Không đổi công cụ để vượt chặn. Không coi đây là nghiệm thu trực quan hoặc kết quả thử với sinh viên.
- Không commit/push và không triển khai công khai trong đợt này.
