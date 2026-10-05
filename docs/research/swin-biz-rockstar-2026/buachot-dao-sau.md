# BữaChốt — nghiên cứu sâu mô hình hàng dư cuối ngày

Ngày rà soát: 05/10/2026. Đây là bản nghiên cứu và thiết kế kiểm chứng, chưa phải bằng chứng về nhu cầu hoặc hiệu quả ở Việt Nam.

**Cập nhật theo ý tưởng mới của người dùng:** hướng đang phát triển là marketplace hàng dư với bộ voucher 7%–10%–20%, mỗi đơn một voucher, giá sàn thương mại riêng và thưởng tự nhận theo tuyến. Xem [thiết kế voucher và khoảng cách](buachot-voucher-khoang-cach.md) cho mô hình giá, đối soát, trần ngân sách, lộ trình ML và pilot. Khuyến nghị ưu tiên công cụ B2B bên dưới là phương án nghiên cứu trước cập nhật này, không thay thế hướng người dùng đã chọn.

## Kết luận điều hành

**Không nên làm BữaChốt như một bản sao của Too Good To Go, cũng không thể nói Việt Nam chưa có đối thủ.** CrumbUp đã chào bán Surprise Box và khuyến mãi hiển thị rõ món; ứng dụng ResQ - Food Rescue Vietnam mới được Google Play ghi nhận cập nhật ngày 06/08/2026 với bản đồ, đặt giữ hàng và công cụ cho cửa hàng. Trang CrumbUp khi kiểm tra ngày 05/10 hiển thị 0 box đang có và nhiều listing cũ hết hạn. Đây là ảnh chụp tại một thời điểm, không đủ để kết luận hai bên không có giao dịch hay hoạt động ở nơi khác. [CrumbUp Khám phá](https://www.crumbup.store/discover), [ResQ trên Google Play](https://play.google.com/store/apps/details?id=vn.d2tech.resq)

Khoảng trống đáng thử không phải “đưa hàng dư lên app”, mà là **lớp vận hành hàng dư cho tiệm nhỏ**: giúp cửa hàng chốt nhanh hàng thật sự còn bán được, chọn kênh nhận phù hợp, hiện thông tin đáng tin, và học từ dữ liệu bán/không bán để giảm lượng dư phát sinh trong các ngày tiếp theo. Khách có thể dùng Zalo OA, mini app hoặc web đặt hàng; lợi thế sản phẩm nằm ở quy trình phía cửa hàng và dữ liệu, không ở việc bắt khách cài thêm một app.

Tên sản phẩm làm việc: **BữaChốt — “Chốt hàng còn tốt, nhận đúng đường về.”** Phân loại cuộc thi phù hợp nhất là **Technology**, với tác động xã hội/môi trường là kết quả được đo; có thể chọn **Social Impact** nếu thể lệ yêu cầu tác động làm trọng tâm. Trước khi chốt hạng mục, cần đối chiếu rubric chính thức của mùa thi.

## 1. Điều gì đã được chứng minh, điều gì chưa

| Nhận định | Bằng chứng hiện có | Giới hạn |
|---|---|---|
| Mô hình đặt trước, trả tiền, tự đến nhận đã vận hành ở nước ngoài | Too Good To Go mô tả tìm hàng dư gần đó, đặt Surprise Bag, thanh toán và đến nhận trong khung giờ cửa hàng; hãng cho biết có hơn 180.000 doanh nghiệp tham gia. | Số đối tác do nền tảng tự công bố; thị trường và hành vi tiêu dùng khác Việt Nam. [Nguồn](https://www.toogoodtogo.com/en-us/how-does-the-app-work) |
| Lựa chọn hiện đúng món thay cho hộp bất ngờ là một nhánh khác | Karma cho khách chọn món cụ thể, mua trong ứng dụng và nhận tại quán; nền tảng tự báo cáo hơn 2.000 điểm tại Thụy Điển. | Chưa chứng minh khách Việt thích chọn món hơn deal bí ẩn hoặc mức giá giảm sâu. [Nguồn](https://karma.life/app) |
| Công cụ B2B có thể là một phần sản phẩm, không chỉ marketplace | Flashfood hướng cửa hàng đăng hàng dư/near-expiry, báo khách quanh đó và tuyên bố tích hợp vào quy trình kiểm kho/rotation. | Kết quả giảm shrink và số người dùng là số do công ty tự báo cáo. [Nguồn](https://flashfood.com/en/for-grocers) |
| Dự báo nhu cầu và markdown có bằng chứng nghiên cứu, nhưng khó hơn gắn AI vào giao diện | Nghiên cứu trên dữ liệu hơn 1.700 SKU ở 676 cửa hàng cho thấy dự báo thường thấp hơn nhu cầu thực khi có hàng giảm giá; số hàng bán markdown liên quan đáng kể đến sai số còn lại. | Nghiên cứu ở một nhà bán lẻ châu Âu; bản đăng arXiv cần được xem là nghiên cứu sơ bộ cho đến khi xác nhận phản biện/xuất bản. [Nguồn](https://arxiv.org/abs/2602.04464) |
| Giảm giá động có thể đồng thời cải thiện thu hồi và giảm bỏ phí trong vài bối cảnh | Nghiên cứu mô hình về bánh mì thủ công ước tính định giá động giảm lãng phí 21% và tăng biên lợi nhuận gộp 3%. | Đây là kết quả mô hình/counterfactual ở một chuỗi bán lẻ; không phải cam kết hiệu quả cho quán nhỏ Việt Nam. [Nguồn](https://ideas.repec.org/a/inm/ormksc/v43y2024i2p289-316.html) |
| Thị trường Việt Nam đã có sản phẩm cùng nhóm | CrumbUp giới thiệu Surprise Box, chương trình khuyến mãi rõ món; ResQ mô tả hàng gần hạn/hàng cần bán trong ngày, đặt giữ và đến nhận. | Nội dung store listing/website cho biết tính năng và trạng thái hiển thị, không xác nhận số giao dịch, retention, doanh thu, độ phủ hay sức khỏe vận hành. |
| Tệp khách hàng có thể quen với Zalo và ưu tiên giá, tiện lợi, nguồn gốc | Zalo công bố 80,2 triệu MAU cuối Q1/2026; PwC khảo sát 517 người tiêu dùng Việt Nam năm 2025, trong đó 47% nói giá là yếu tố chính khi chọn hàng thực phẩm và 57% ưu tiên dùng thực phẩm sẵn có trước khi mua thêm. | Số liệu Zalo là công bố của nền tảng; khảo sát PwC không riêng người mua hàng dư, sinh viên hay khu vực pilot. [Zalo](https://www.zalo.me/vi/blog/zalo-vuot-nguong-80-trieu-nguoi-dung), [PwC](https://www.pwc.com/vn/en/publications/vietnam-publications/voice-of-consumer-2025.html) |
| Quy mô lãng phí tạo ra vấn đề xã hội, nhưng không cho biết lượng có thể bán trong một cụm | UNEP 2024 bổ sung ước tính quốc gia và phương pháp đo cho hộ gia đình, bán lẻ, dịch vụ ăn uống; báo cáo khuyến nghị xây baseline theo ngành. | Không lấy số toàn cầu để suy ra TAM hay sản lượng thương mại tại Việt Nam. Cần đo tại cửa hàng pilot. [Nguồn](https://www.unep.org/resources/publication/food-waste-index-report-2024) |

### Hàm ý cạnh tranh

Sản phẩm tối thiểu đã bị các nền tảng hiện có “hàng hóa hóa”: bản đồ, đăng deal, giữ hàng, nhận tại cửa hàng và thông điệp cứu thực phẩm không còn là điểm mới. BữaChốt cần trả lời một câu khó hơn: **cửa hàng có giảm được thao tác và thu hồi được thêm tiền từ hàng dư so với giảm giá tại quầy, đăng Zalo/Facebook, hoặc dùng đối thủ hiện hữu không?**

## 2. Định vị đề xuất: hệ điều hành “chốt ca hàng dư” cho cửa hàng độc lập

### Người dùng đầu tiên

Không bắt đầu với toàn bộ ngành F&B. Chọn **tiệm bánh/café có sản phẩm đóng gói hoặc định lượng rõ**, ở một cụm đi bộ/đi xe ngắn quanh trường đại học, ký túc xá, cụm văn phòng hoặc khu căn hộ. Loại hàng đầu nên có danh mục và thành phần dễ mô tả, chất lượng dễ kiểm soát, thường còn bán được vài giờ sau khi ngừng bán chính; chọn cụ thể sau phỏng vấn và quy trình an toàn của từng cửa hàng.

Tránh giai đoạn đầu: món nóng cần giao ngay, buffet tự chọn, món có lịch sử/điều kiện bảo quản không rõ, hàng khách trả lại, hàng đã hết hạn/không đạt điều kiện an toàn, hàng phải gom từ nhiều quán bằng giao riêng. Không dùng giảm giá để khuyến khích sản xuất thêm hàng.

### Công việc cần giải quyết

- **Chủ/quản lý:** biết còn gì, thời điểm nào cần chốt, giá tối thiểu nào hợp lý, kết quả cuối ca và vì sao hàng không bán.
- **Nhân viên:** đăng/chỉnh số lượng trong dưới một phút bằng vài thao tác; không phải chụp/nhập lại thông tin rườm rà.
- **Khách:** nhìn thấy sản phẩm hoặc thành phần, giá gốc và giá chốt, giờ nhận, địa chỉ, số lượng, điều kiện bảo quản; đặt trước/giữ suất và nhận đúng lịch.
- **BữaChốt:** xác thực người bán, quản lý listing và đơn, xử lý hết hàng/hoàn tiền/khiếu nại, ghi nhận lượng hàng chuyển thành bán được và lượng vẫn bỏ đi.

### Luồng sản phẩm

1. **Trước ca:** cửa hàng nhập lịch sử bán hoặc chỉ ghi số lượng sản xuất/nhập và bán theo khung giờ. Nếu chưa có POS tích hợp, cho nhập nhanh qua web/PWA.
2. **Khi gần đóng cửa:** nhân viên ghi lại số thực tế còn bán được. BữaChốt tạo danh sách gợi ý từ catalogue đã duyệt; không tạo listing tự động nếu chưa xác nhận hàng còn an toàn và sẵn sàng.
3. **Định giá:** khởi đầu bằng luật cố định có thể giải thích (chẳng hạn mức giảm theo số phút đến giờ chốt và tồn còn lại), với giá sàn do cửa hàng duyệt. Không gọi đây là AI. Chạy A/B chỉ khi có đủ lượng và theo dõi tác động lên bán giá thường.
4. **Phân phối:** khách theo dõi cửa hàng/khu vực, nhận thông báo phù hợp; ưu tiên pickup tại quầy hoặc một điểm nhận chung có nhân sự. Không tài trợ ship lẻ từ mô hình phí hoa hồng thấp.
5. **Chốt đơn:** reservation kèm thời hạn thanh toán/nhận; số lượng cập nhật tức thời; check-in QR/mã đơn hoặc xác nhận tại quầy. Nếu không còn đúng món, khách chọn thay thế hoặc hoàn tiền theo điều khoản rõ.
6. **Học sau ca:** dashboard tóm tắt thời điểm đăng, giá, lượt xem, chuyển đổi, hết hàng, no-show, hoàn tiền và số lượng dư chưa bán. Sau khi đủ dữ liệu, dự báo gợi ý số lượng cần chuẩn bị theo thứ/ngày/giờ/mưa/sự kiện; người bán quyết định.

**Nguyên tắc quan trọng:** tách “giảm hủy bỏ hàng dư đã phát sinh” khỏi “giảm tạo ra hàng dư”. Doanh thu từ kênh deal không được coi là thành công nếu nó khiến cửa hàng làm thêm để bán giá rẻ hoặc làm khách chờ đến giờ giảm giá thay vì mua giá thường.

## 3. Công nghệ: đủ khác biệt nhưng vừa sức đội

### MVP không cần AI

- Web/PWA cho catalogue cửa hàng, listing, đặt giữ, thanh toán hoặc xác nhận đơn, quản trị và dashboard.
- Zalo OA để bắt đầu hội thoại, gửi link sản phẩm và hỗ trợ khách/nhân viên. Có thể thử mini app khi đối tác hoặc điều kiện OA phù hợp. Zalo công bố hơn 80 triệu MAU Q1/2026, nhưng độ phủ không tự tạo khách mua hoặc giảm CAC.
- Backend dùng một mô hình dữ liệu gọn: Store → Product → Batch/lot → Listing → Order → Pickup → Outcome. Mỗi bản ghi hàng dư có thời điểm tạo, khung giờ nhận và trường người bán xác nhận an toàn.
- Vận hành thử bằng QR, Google Sheets/CRM đơn giản và payment link nếu cổng thanh toán/đăng ký doanh nghiệp chưa sẵn sàng. Đội vẫn ghi lại thao tác thủ công để biết phần nào đáng tự động hóa.

### Lộ trình dữ liệu/AI

**Tầng 0 – nhật ký:** số lượng chuẩn bị/bán/còn lại theo SKU và giờ, giá, thời tiết cơ bản, ngày trong tuần, sự kiện/đóng cửa. Thu thập dữ liệu ít nhạy cảm nhất có thể.

**Tầng 1 – baseline minh bạch:** median theo SKU × ngày trong tuần × khung giờ; hiển thị dải dự báo và mức tin cậy. So sánh với “không dự báo” và dự báo người bán.

**Tầng 2 – gợi ý hành động:** ước lượng số lượng chuẩn bị và mốc chốt giá bằng luật/ngưỡng. Tối ưu mục tiêu đóng góp gộp sau giảm giá và hủy bỏ, có ràng buộc không giảm doanh thu giá thường quá mức.

**Tầng 3 – mô hình dự báo/định giá:** chỉ khi nhiều cửa hàng đồng ý chia sẻ schema dữ liệu, có đủ tuần dữ liệu, và nhóm đo được lift so với baseline. Mô hình ban đầu nên dự đoán khoảng nhu cầu/khả năng bán chứ không “ra giá bí mật” theo từng khách. Ghi rõ lý do gợi ý và cho cửa hàng quyền từ chối.

Nghiên cứu năm 2026 cảnh báo dữ liệu markdown có thể làm sai dự báo nếu trộn nhầm vào nhu cầu giá thường. Vì thế BữaChốt cần gắn nhãn trạng thái giá và thời điểm can thiệp, báo cáo riêng bán giá thường với bán giảm giá. Một thuật toán có thể tăng doanh thu deal nhưng làm giảm giá trị bán chính; phải đo cả hai.

### OA hay Mini App?

Zalo hợp để giảm ma sát onboarding và giao tiếp; không nên phụ thuộc toàn bộ kiến trúc vào chính sách OA, hạn mức tin và quyền API. Chi phí, quyền lợi OA đổi từ 01/06/2026 theo gói mới nên cần tính theo bảng giá tại thời điểm pilot. Đội sinh viên có thể cần cửa hàng đối tác có OA hợp lệ; nếu chưa có, dùng PWA/form và chat hiện có để kiểm chứng nỗi đau trước. [Thông báo gói OA 2026](https://oa.zalo.me/home/resources/news/chinh-thuc-quyen-loi-va-bieu-phi-cac-goi-dich-vu-zalo-oa-moi-tu-162026-_5100578039811031184)

Nếu BữaChốt nhận đơn trực tuyến như một sàn trung gian, cần thiết kế quy trình xác minh người bán, dữ liệu listing, hoàn trả/khiếu nại và lưu dữ liệu theo quy định TMĐT áp dụng. Luật TMĐT được Chính phủ đăng tháng 08/2026 nêu trách nhiệm với nền tảng trực tiếp và trung gian có chức năng đặt hàng; phạm vi nghĩa vụ tùy mô hình pháp lý cụ thể, cần rà soát với luật sư/cơ quan có thẩm quyền trước thương mại hóa. [Nguồn Chính phủ](https://en.baochinhphu.vn/viet-nams-law-on-e-commerce-111260825143234285.htm)

## 4. Mô hình kinh doanh và kinh tế đơn vị

### Hai luồng doanh thu, theo thứ tự kiểm chứng

1. **Phí theo đơn hoàn tất**: dễ thử nhưng có thể quá nhỏ để chi trả acquisition, hỗ trợ, hoàn tiền và thanh toán. Chỉ tính doanh thu trên đơn đã nhận thành công.
2. **Thuê bao công cụ vận hành**: dashboard hàng dư, báo cáo sell-through, lịch sử markdown và gợi ý chuẩn bị cho cửa hàng/chuỗi. Chỉ thu khi chứng minh tiết kiệm tiền/giờ lao động hoặc tăng phần thu hồi.
3. **Hợp đồng cụm/tổ chức**: trường, tòa nhà hoặc doanh nghiệp mua điều phối pickup và đo lường tác động. Đây là giả thuyết, không đưa vào dự báo doanh thu chính cho đến khi có bên trả tiền.

Không đưa quảng cáo, tài trợ ESG, giao hàng riêng hay bán dữ liệu khách làm trụ cột ban đầu. Tài trợ có thể hỗ trợ thử nghiệm nhưng không chứng minh mô hình tự đứng được.

### Công thức cần ghi trong pilot

**Lợi ích tăng thêm của cửa hàng** = tiền thu thực từ hàng chốt + chi phí xử lý/bỏ hàng tránh được − phí nền tảng − giảm giá mất đi so với giá vốn/giá có thể bán thường − giờ lao động tăng thêm − bao bì/điều phối − hoàn tiền/khiếu nại.

**Đóng góp của BữaChốt/đơn** = phí đơn hoàn tất + phân bổ thuê bao − phí thanh toán − ưu đãi do BữaChốt tài trợ − chăm sóc khách − chi phí hoàn tiền/chargeback.

Đo hai baseline: (A) cách cửa hàng hiện đang xử lý, kể cả giảm tại quầy/đăng mạng/tặng/đem bỏ; (B) khung giờ hoặc cửa hàng tương đồng không bật BữaChốt. Chỉ tính “hàng cứu được” theo định nghĩa đã chốt trước, không lấy lượt xem hoặc số listing làm tác động.

## 5. Thiết kế thử nghiệm trong 4 tuần

### Tuần 1 — khám phá và đo baseline

- Phỏng vấn 10–12 cửa hàng trong cùng một cụm, quan sát tối thiểu 5 ca gần đóng cửa. Ghi số SKU còn, giá vốn ước lượng do cửa hàng chia sẻ, thời điểm dư, quy trình hiện hành, phút thao tác và lý do không muốn giảm giá.
- Phỏng vấn 20–30 khách đi qua cùng tuyến: họ mua gì, ngân sách bữa/snack, mức chấp nhận đến lấy, điều gì làm họ tin/lo ngại, có chấp nhận sản phẩm cụ thể hay muốn box bất ngờ. Đây là discovery, không dùng làm dự báo thị trường.
- Ghi baseline lượng dư được bán lại, được cho, bỏ đi; không trộn các loại này.

### Tuần 2 — concierge MVP

- Chọn 3 cửa hàng trong bán kính đi bộ/xe máy ngắn và khoảng 30–50 khách đăng ký nhận tin.
- Nhân viên ghi listing qua form nội bộ; đội kiểm duyệt trường bắt buộc và gửi link qua Zalo. Khách đặt/nhận tại cửa hàng. Chạy 5–7 ngày liên tiếp, không có giao ship riêng.
- Hai kiểu trình bày thử theo ngày/điểm bán: (a) box định lượng rõ nhưng thành phần cụ thể; (b) từng món rõ. Không thử cùng lúc quá nhiều biến về giá, khuyến mãi và ngôn ngữ môi trường.

### Tuần 3–4 — công cụ và thử giá có kiểm soát

- Dựng PWA nhập hàng, trang mua, dashboard kết quả. Không cần mini app nếu chưa vượt qua tiêu chí nhu cầu.
- Với cửa hàng đồng ý, so chính sách giá cố định với hai mốc markdown đề xuất trong các ngày tương đồng; ghi rõ thời điểm, tồn, giá gốc, đặt chỗ và bán thường còn lại. Không cho thuật toán tự thay giá.
- Thu phản hồi sau pickup và lý do hủy/no-show; chặn bán khi quá giờ nhận hoặc cửa hàng báo không bảo đảm điều kiện.

### Chỉ số và ngưỡng quyết định (ngưỡng là giả thuyết đội cần đăng ký trước)

| Nhóm | Chỉ số | Tiếp tục nếu… |
|---|---|---|
| Cung | listing có hàng thật/tuần/quán; tỷ lệ ca có hàng dư; thời gian đăng | Ít nhất 2/3 quán có đủ hàng thật ở ≥3 ngày/tuần; trung vị thao tác ≤60 giây sau buổi hướng dẫn |
| Cầu | tỷ lệ listing mua hết; thời gian đến đơn đầu; pickup đúng giờ; mua lại | ≥50% suất chốt bán được trong cửa sổ nhận; ≥80% đơn đã trả tiền được nhận; có người mua lặp lại trong 14 ngày |
| Tin cậy | lỗi sai mô tả, hoàn tiền, than phiền chất lượng/an toàn | 0 vụ việc an toàn chưa xử lý; mọi đơn không khớp được xử lý/hoàn tiền theo chính sách |
| Giá trị quán | doanh thu thu hồi tăng thêm, phút lao động, chi phí xử lý | Ít nhất 2/3 quán muốn tiếp tục ở mức phí được nói rõ và lợi ích tăng thêm không âm theo dữ liệu quán |
| Giá trị nền tảng | đóng góp/đơn, CAC, chi phí hỗ trợ và hoàn tiền | Đóng góp biến đổi hướng tới dương khi không trợ giá ship; nếu âm phải chỉ ra thuê bao hoặc mật độ cụm sẽ sửa được bằng chứng nào |
| Tác động | khối lượng hàng ăn được đã bán thay cho bị bỏ | Cân/đếm từng SKU và xác minh với cửa hàng; không quy đổi CO₂ nếu không có phương pháp và hệ số nguồn tin cậy |

Các ngưỡng không phải benchmark ngành. Cần thay đổi sau discovery nếu chu kỳ hàng, biên lợi nhuận hay sản lượng thật cho thấy ngưỡng vô lý; ghi rõ mọi thay đổi trước khi xem kết quả cuối để giảm thiên lệch.

### Điều kiện dừng

- Cửa hàng không có lượng dư lặp lại hoặc chỉ đưa hàng lên khi được trợ phí.
- Khách không muốn tự đến nhận và tiền giao hàng làm đơn lỗ.
- Cửa hàng không thể cung cấp thông tin thành phần, thời điểm/điều kiện bảo quản tối thiểu.
- BữaChốt chỉ chuyển khách mua sang giá giảm, làm giảm doanh thu giá thường mà tổng đóng góp không tăng.
- Tỷ lệ sai listing/no-show/khiếu nại khiến chủ quán tốn công hơn phương pháp hiện tại.

## 6. Rủi ro chính và cách xử lý

| Rủi ro | Tại sao quan trọng | Kiểm soát trong MVP |
|---|---|---|
| Đối thủ nội địa hoạt động trước | CrumbUp và ResQ đã phủ các tính năng cơ bản; người bán không muốn nhập trùng | Phỏng vấn cửa hàng đang/đã dùng sản phẩm cùng nhóm; tìm hiểu vì sao tiếp tục/ngừng; khác biệt phải là ít thao tác và insight vận hành |
| Cold start | Hàng rải rác, khách mở app không thấy deal; quán không đăng nếu không có cầu | Một cụm nhỏ, lịch nhận rõ, seed supply trước, Zalo/community distribution; không mở rộng địa lý sớm |
| Hàng không an toàn hoặc mô tả thiếu | Tác hại lớn hơn giá trị discount | Chỉ danh mục/quy trình được xác minh, trường ingredient/allergen/storage/produced-at/use-by where relevant; cửa hàng chịu trách nhiệm xác nhận, BữaChốt có quyền gỡ listing và quy trình xử lý khiếu nại |
| Ăn mòn doanh thu giá thường | Khách học chờ markdown; cửa hàng sản xuất dư có chủ đích | Chỉ đăng sau khi lượng dư thực tế được xác nhận; giới hạn khối lượng/khung giờ; đo tổng lợi nhuận và bán thường theo ngày, SKU |
| Dự báo sai do dữ liệu ít | Cửa hàng nhỏ có SKU lẫn lộn, ngày lễ/thời tiết đổi nhu cầu | MVP dùng form và baseline đơn giản; không tuyên bố dự báo AI; đo sai số và confidence |
| Chi phí thông báo/đặt hàng | OA đổi gói, tin nhắn/feature API có điều kiện | Thiết kế PWA + link + kênh cửa hàng sẵn có; tính chi phí Zalo vào economics; không phụ thuộc broadcast |
| Pháp lý sàn và thực phẩm | Có thể phát sinh nghĩa vụ xác minh, lưu hồ sơ, hoàn trả và an toàn theo cấu trúc vận hành | Trước pilot công khai và nhận thanh toán, xác định chủ thể bán, vai trò nền tảng, điều khoản và trách nhiệm; nhờ tư vấn chuyên môn |
| Tác động bị thổi phồng | Bán một phần chưa chắc giảm phát thải ròng hoặc rác thực tế | Lưu baseline/quy trình thay thế; cân thực phẩm; báo cáo kg và đơn đã nhận; không tuyên bố CO₂ tiết kiệm nếu không tính được phảnfactual |

## 7. Cách trình bày cho cuộc thi

**Vấn đề:** tiệm nhỏ phải tự đoán hàng cuối ca, đăng thủ công, định giá cảm tính; khách không biết cửa hàng nào còn gì và liệu đáng đi lấy hay không.

**Giải pháp:** BữaChốt là lớp “chốt ca” đa cửa hàng. Một thao tác xác nhận hàng thật → công cụ tạo deal có thông tin rõ → phân phối đến người đang ở gần → theo dõi nhận hàng và kết quả → dữ liệu cải thiện quyết định chuẩn bị/markdown ngày mai.

**Đổi mới phù hợp Việt Nam:** dùng Zalo/PWA thay app tải riêng; tối ưu nhận trên đường đi và cụm bán kính hẹp; minh bạch món/thành phần vì khách có thể không thích “mua hộp bất ngờ”; công cụ nhập cực nhanh cho quán nhỏ; gắn giá trị thương mại với đo lường tác động.

**Đóng góp công nghệ thật:** pipeline dữ liệu theo lô và thời gian, kiểm soát tồn/listing, dự báo nhu cầu theo điểm bán, gợi ý markdown giải thích được, đo incrementality. Không coi QR, chatbot hay AI tự thân là đổi mới.

**Câu hỏi thẩm định:** (1) vì sao cửa hàng dùng BữaChốt thay giảm giá tại quầy hoặc CrumbUp/ResQ; (2) hàng có đủ thường xuyên trong một vùng để khách quay lại; (3) khách chịu đến nhận bao xa/khung giờ nào; (4) ai trả phí; (5) quy trình an toàn và trách nhiệm người bán được bảo đảm ra sao; (6) số kg thực sự giảm bỏ phí là bao nhiêu.

## Đánh giá khả thi cuối

- **Khả thi làm prototype:** cao. Đội có kinh doanh, code và thiết kế đủ làm form/PWA, dashboard và luồng thông báo.
- **Khả thi pilot:** trung bình. Cần 3–5 cửa hàng sẵn sàng chia sẻ dữ liệu và cho phép đo hàng dư; nhu cầu và retention còn chưa biết.
- **Khả thi kinh doanh mở rộng:** chưa chứng minh. Đơn nhỏ + phí thấp + giao lẻ là cấu trúc rủi ro; sản phẩm phải kiếm tiền từ tần suất/cluster hoặc SaaS vận hành.
- **Khả năng dự thi:** tốt nếu kể như nền tảng công nghệ cho quản trị hàng dư và chứng minh pilot thật. Yếu nếu chỉ dừng ở bản đồ deal, tuyên bố giảm food waste, hoặc dựng AI không có dữ liệu.

**Khuyến nghị:** làm khám phá 1 tuần và concierge pilot 2 tuần trước. Chỉ viết mô hình machine learning sau khi thấy chủ quán chịu nhập dữ liệu và muốn dùng lại. Trình diễn tốt nhất là một ca thực: số hàng được nhập → số suất đặt/nhận → phút thao tác → tiền quán thu hồi → lượng còn phải bỏ → quyết định ngày tiếp theo.

## Tài liệu tham khảo chính

- [CrumbUp — trang chủ và mô hình](https://www.crumbup.store/)
- [CrumbUp — danh sách box đang/đã hết hạn](https://www.crumbup.store/discover)
- [ResQ — Google Play](https://play.google.com/store/apps/details?id=vn.d2tech.resq)
- [Too Good To Go — cách sử dụng](https://www.toogoodtogo.com/en-us/how-does-the-app-work)
- [Flashfood — giải pháp cho cửa hàng](https://flashfood.com/en/for-grocers)
- [Karma — chọn món và nhận tại cửa hàng](https://karma.life/app)
- [Winkelmann et al. (2026), demand forecasting with discounted perishables](https://arxiv.org/abs/2602.04464)
- [Sanders (2024), dynamic pricing and retail food waste](https://ideas.repec.org/a/inm/ormksc/v43y2024i2p289-316.html)
- [UNEP, Food Waste Index Report 2024](https://www.unep.org/resources/publication/food-waste-index-report-2024)
- [PwC, Voice of the Consumer Survey 2025 — Vietnam](https://www.pwc.com/vn/en/publications/vietnam-publications/voice-of-consumer-2025.html)
- [Zalo, 80.2 triệu người dùng thường xuyên hàng tháng, Q1/2026](https://www.zalo.me/vi/blog/zalo-vuot-nguong-80-trieu-nguoi-dung)
- [Zalo OA — gói dịch vụ mới từ 01/06/2026](https://oa.zalo.me/home/resources/news/chinh-thuc-quyen-loi-va-bieu-phi-cac-goi-dich-vu-zalo-oa-moi-tu-162026-_5100578039811031184)
- [Luật TMĐT — Cổng Thông tin điện tử Chính phủ](https://en.baochinhphu.vn/viet-nams-law-on-e-commerce-111260825143234285.htm)
