# Bếp Núc: voucher sinh viên, giá sàn riêng và thưởng tự đến nhận

Ngày: 05/10/2026. Phát triển ý tưởng người dùng; số liệu tính toán là ví dụ giả định, chưa phải kết quả pilot.

## 1. Cơ chế được giữ nguyên và điểm cần thống nhất

Mỗi sinh viên cuối ngày nhận đủ ba voucher 7%, 10%, 20%; mỗi đơn dùng một voucher, không cộng dồn. Hàng có giá niêm yết đã giảm 5%; voucher áp dụng vào giá sau giảm đó. Cửa hàng và nền tảng thỏa thuận giá tối thiểu riêng; sinh viên chỉ thấy giá gốc hợp lệ, giá sau giảm, voucher, phần thưởng tự nhận và số tiền cuối cùng. Điểm này thay thế định hướng ưu tiên công cụ B2B ở báo cáo trước: hướng hiện hành là marketplace hàng dư với cơ chế khuyến khích pickup sinh viên do người dùng đề xuất.

Theo ví dụ của người dùng, voucher 7% có thể lên 15% cho tuyến nhận 1 km trong nội thành. Thiết kế giữ phần thưởng này, có trần để bảo vệ số tiền trả cửa hàng và ngân sách. Phần tính khoảng cách dùng dịch vụ tuyến đường; ML đánh giá tác động của ưu đãi và lựa chọn mức thưởng hiệu quả sau khi có dữ liệu.

**Đã xác nhận:** nhận cả ba voucher, chọn một mỗi đơn. **Chưa xác nhận:** giá sàn là giá trước phí hay tiền cửa hàng thực nhận. Tài liệu tạm dùng cách chặt hơn: giá sàn là tiền cửa hàng thực nhận, với một mô hình đối soát cố định để tính ví dụ. Nếu cửa hàng chỉ đồng ý giảm tối đa 35% trước phí, phải tính lại tiền thực nhận và không hứa cửa hàng sẽ nhận 65% giá gốc sau phí.

Một điểm cần thỏa thuận thêm khi ký đối tác: giá sàn chỉ là ràng buộc tối thiểu hay cũng chính là mức đối soát cố định cho mọi đơn? Hai cơ chế khác nhau về doanh thu nền tảng. Báo cáo không mặc định rằng toàn bộ ngân sách giảm giá 35% thuộc về Bếp Núc.

## 2. Đánh giá đổi mới từ nghiên cứu

Too Good To Go đã có quy trình tự đến cửa hàng nhận và chương trình loyalty đổi voucher. Vì vậy, voucher hoặc pickup riêng lẻ chưa đủ chứng minh cách tiếp cận khác hoàn toàn. [Hướng dẫn nhận hàng](https://www.toogoodtogo.com/en-ca/how-to-collect-too-good-to-go), [Loyalty Card](https://tgtg.zendesk.com/hc/en-us/articles/32645640145938-How-does-the-Loyalty-Card-work).

Google Routes có thể trả khoảng cách và thời gian giữa nhiều điểm đầu/cuối. Không cần huấn luyện ML để tính 1 km; kết quả tuyến đường cũng không chứng minh khách đã thực sự di chuyển bằng cách nào. API có lưu ý về tuyến đi bộ/xe đạp/xe hai bánh và độ đầy đủ của đường; cần kiểm tra phủ sóng và phí tại địa bàn triển khai. [Route Matrix](https://developers.google.com/maps/documentation/javascript/routes/get-a-route-matrix), [Travel modes](https://developers.google.com/maps/documentation/routes/reference/rest/v2/RouteTravelMode?hl=en).

Nghiên cứu coupon allocation có mô hình tối ưu phân bổ dưới ngân sách, dùng dữ liệu coupon phân phối ngẫu nhiên; nghiên cứu uplift tại Booking.com đo tác động tăng thêm và giới hạn ROI. Các kết quả này hỗ trợ chuyển giao phương pháp thiết kế thử nghiệm và tối ưu ngân sách, chưa chứng minh cơ chế 7–10–20 hoặc thưởng 1 km hiệu quả ở sinh viên Việt Nam. [Uehara và cộng sự, 2024](https://arxiv.org/abs/2405.12865), [Goldenberg và cộng sự, RecSys 2020](https://arxiv.org/abs/2008.06293).

Điểm khác biệt có thể phát triển: **ba quyền sử dụng voucher mỗi tối + phân bổ phần thưởng pickup theo tuyến và thời gian + ràng buộc tiền thực nhận của quán + ML học mức thưởng làm tăng đơn nhận thành công**, trong một cụm trường–khu trọ. Đây là đổi mới ứng dụng cần kiểm chứng cạnh tranh và pilot, không phải tuyên bố tính mới toàn cầu.

## 3. Cách tính đúng mức giảm

Ký hiệu: P là giá gốc VND, b=0,05 là giảm sẵn, v là voucher áp dụng trên giá sau giảm (0,07/0,10/0,20 hoặc mức đã tăng). Q=P(1-b) là giá niêm yết Bếp Núc trước voucher; T=Q(1-v) là tiền sinh viên trả, chưa xét thuế/phí khác nếu có.

Tổng tỷ lệ giảm so với giá gốc:

`D = 1 - (1-b)(1-v)`

| Voucher cuối cùng | Giá gốc P | Giá sau giảm sẵn Q | Sinh viên trả T | Tổng giảm D |
|---|---:|---:|---:|---:|
| 7% | 100.000 | 95.000 | 88.350 | 11,65% |
| 10% | 100.000 | 95.000 | 85.500 | 14,50% |
| 20% | 100.000 | 95.000 | 76.000 | 24,00% |
| 15% (7% → 15%) | 100.000 | 95.000 | 80.750 | 19,25% |

7% → 15% là tăng **8 điểm phần trăm**, không phải tăng 8% tương đối. Không cộng 5% + 20% thành 25%. Nếu nhầm cho cộng dồn cả ba voucher theo phép nhân thì tổng giảm gồm 5% ban đầu là 36,388%, vượt ngân sách giảm 35% ngay cả khi chưa có chi phí. Quy tắc một voucher mỗi đơn giải quyết trường hợp này.

## 4. Giá sàn và mô hình kiếm tiền

### Phương án A: đối soát cố định theo giá thỏa thuận

Giả định cửa hàng đồng ý nhận F=0,65P cho từng sản phẩm đủ điều kiện. Nền tảng thu T, đối soát F, trả chi phí biến đổi C. Chênh lệch trước chi phí là T-F; đóng góp sau chi phí là M=T-F-C. C gồm thanh toán, hỗ trợ, chi phí maps/thông báo phân bổ, dự phòng hoàn tiền phù hợp; không bao gồm toàn bộ chi phí cố định và acquisition. Phải tránh tính phí/hoàn tiền hai lần.

Đây là mô hình hợp đồng cần cửa hàng đồng ý, không tự phát sinh từ việc quán nói “tôi chấp nhận giảm 35%”. Quán nên thấy quy tắc đối soát, ngày trả tiền, người chịu voucher, hoàn tiền và xử lý sai hàng. Không thu thêm commission vào F nếu đã hứa F là tiền thực nhận.

Ví dụ P=100.000, F=65.000, C=3.000/đơn, yêu cầu đóng góp tối thiểu m=2.000/đơn:

| Voucher | Sinh viên trả | Cửa hàng nhận | Chênh lệch trước C | Đóng góp sau C |
|---|---:|---:|---:|---:|
| 7% | 88.350 | 65.000 | 23.350 | 20.350 |
| 10% | 85.500 | 65.000 | 20.500 | 17.500 |
| 20% | 76.000 | 65.000 | 11.000 | 8.000 |
| 15% | 80.750 | 65.000 | 15.750 | 12.750 |
| 28% (20% + 8 điểm) | 68.400 | 65.000 | 3.400 | 400 |
| 36% (20% + 16 điểm) | 60.800 | 65.000 | −4.200 | −7.200 |

Đơn voucher 28% vẫn trả được F nhưng không đạt m=2.000; đơn 36% thiếu cả tiền trả quán. Các số trên minh họa toán học, không phải mức phí hoặc biên thực tế của Bếp Núc.

Trần voucher để bảo vệ F, C và m:

`v_max = 1 - (F + C + m) / [P(1-b)]`

Trong ví dụ: v_max=26,315789%. Nếu chỉ xét F mà bỏ C và m, trần là 31,578947%. Vì vậy “quán chấp nhận giảm 35%” không đồng nghĩa có thể cấp voucher 35% trên giá đã giảm 5%.

Nếu F+C+m>Q, listing không đủ ngân sách ngay cả khi voucher bằng 0: từ chối áp dụng cơ chế hoặc thương lượng lại, không ép giá/voucher về một giá trị trông có vẻ hợp lệ. Nếu voucher gốc 20% đã vượt trần, không quảng cáo rằng món đó dùng được voucher 20%; phải hiển thị loại hàng đủ điều kiện trước khi khách đặt.

### Phương án B: quán nhận doanh thu bán trừ commission

Nếu quán muốn giữ phần tăng thêm khi khách dùng voucher thấp, có thể dùng commission r trên T. Khi đó quán nhận `(1-r)T`, phải ≥F; nền tảng có đóng góp `rT-C`. Trần do quán là `v ≤ 1 - F / [(1-r)Q]`. Thêm ràng buộc `rT-C ≥ m` và ngân sách do nền tảng tài trợ nếu có.

Ví dụ r=10%, F=65.000, Q=95.000: trần bảo vệ quán khoảng 23,976608%, khác đáng kể phương án A. Không lấy bảng lợi nhuận của A áp vào B. Chọn một mô hình đối soát thật trước khi thử giá.

Giá sàn riêng được lưu ở backend và chỉ chủ quán/nhân sự được cấp quyền thấy. API khách chỉ trả giá gốc hợp lệ, giá niêm yết, voucher đủ điều kiện, thưởng, số tiền cuối cùng và điều kiện. Giá sàn bí mật không ngăn khách suy ra một khoảng từ ưu đãi đã công bố; mục tiêu là bảo mật điều khoản thương mại, không phải đảm bảo không ai có thể ước lượng.

## 5. Ba voucher: động lực chọn và mua lại

Nếu mọi voucher có cùng hạn dùng, cùng phạm vi và cùng điều kiện, khách hợp lý thường chọn 20% trước. Điều này không làm ý tưởng sai, nhưng 7% và 10% ít có giá trị với người chỉ đặt một lần tối đó. Không được giả định phân bổ sử dụng đồng đều 1/3 mỗi loại.

Giữ cơ chế đã xác nhận và thử như sau: mỗi tối cấp một bộ ba; mỗi voucher một lần; mỗi đơn một voucher; không đổi thành tiền; không cộng dồn; suất hàng thật giới hạn. Khi khách chọn món, hiển thị loại voucher đủ điều kiện và preview giá. Đo số người dùng 20% rồi quay lại dùng 10%/7%, số đơn mỗi người và số lượng thực phẩm tiêu thụ, để tránh thưởng cho mua dư.

Chưa chốt minimum spend, thời hạn theo phút hay chia cửa hàng cho từng voucher; đây là các biến pilot. Nếu áp dụng, cần giải thích trước và giữ 7%/10% thật sự có thể sử dụng. Có thể thử phần thưởng pickup theo mức: ví dụ 7% → 15%, 10% → 18%, 20% → mức trần tài chính, nhưng khách phải thấy tỷ lệ cuối cùng trước khi xác nhận. Không gắn nhãn 28% nếu hệ thống thực tế chỉ áp dụng 26,3%.

## 6. Thưởng khoảng cách: giữ ví dụ 1 km, kiểm soát hành vi

Luật thử nghiệm giữ ý tưởng người dùng:

`v_requested = v_base + 0,08 × min(d, d_cap)`

`v_effective = min(v_requested, v_max, v_policy_cap)`

d là km của tuyến hợp lệ được tính trước khi đặt, không phải tổng GPS khách đi. Hệ số 0,08/km và d_cap là tham số thử nghiệm, chưa phải mức được nghiên cứu chứng minh. Với d=1 km, voucher 7% thành 15%; voucher 20% thành 28% theo yêu cầu, rồi bị chặn ở 26,315789% trong ví dụ đối soát A. Làm tròn giá tiền lên ở bước cuối để không vượt trần; hiển thị ưu đãi thực tế sau làm tròn.

**Không trả thêm cho đi vòng.** Chốt điểm xuất phát hợp lệ và tuyến ước lượng tại thời điểm báo giá; không tăng thưởng theo odometer. Người ở xa có thể nhận thêm bù công sức nhưng chính sách tăng mãi theo km sẽ khuyến khích chọn quán xa, tạo chuyến đi mới và GPS giả. Trong nội thành, quãng đường dài cũng không tương đương chi phí đi bộ/xe máy hay thời gian; thời gian tăng thêm và khả năng đến trước giờ nhận là biến quan trọng.

Có hai lựa chọn cần thử:

- **Thưởng theo khoảng cách một chiều có trần:** sát ý tưởng ban đầu, dễ giải thích; không yêu cầu khách khai tuyến về nhà. Giới hạn vùng và chỉ trả thưởng cho pickup hoàn tất.
- **Thưởng theo đoạn vòng thêm trên tuyến có sẵn:** khách tự nguyện chọn điểm đi/đến, tính `detour = max(0, time(O→S→H) − time(O→H))`; phù hợp thông điệp “nhận trên đường về”, nhưng phức tạp hơn và có dữ liệu địa điểm nhạy cảm hơn. Đây là phương án bổ sung, không tự thay thế lựa chọn ban đầu.

Chi phí thời gian không có một mức cố định cho mọi người. Thử các dải khoảng cách/thời gian, không mặc định 1 km là mức bù công sức đủ. Ưu đãi 7% → 15% cho P=30.000 chỉ tiết kiệm thêm 2.280 đồng; P=100.000 tiết kiệm thêm 7.600 đồng. Phải hiển thị **số đồng tiết kiệm thêm** để khách quyết định đáng đi hay không.

### Xác nhận nhận hàng và chống gian lận

Người bán xác nhận mã QR/mã đơn dùng một lần, thời điểm và số lượng nhận. Ưu đãi áp ngay lúc checkout và khóa theo đơn; khách không bị nâng giá bất ngờ tại quầy. Dùng check-in để xác nhận pickup, không tuyên bố một check-in chứng minh toàn bộ tuyến di chuyển. Nếu cung cấp vị trí để nhận thưởng, lưu dấu xác minh cần thiết trong thời gian giới hạn; không mặc định theo dõi GPS liên tục. Có đường xử lý khi điện thoại mất kết nối/định vị sai.

Điểm xuất phát có thể được xác minh bằng vùng campus/ký túc xá đối tác hoặc location permission tại lúc đặt. Không chọn nhà xa giả bằng tay để tăng thưởng. Không thu dữ liệu GPS nền khi không cần; không khuyến khích đi xa/vòng nhiều hay đi gấp để săn voucher. Xác thực sinh viên là một bước riêng, không đăng công khai thẻ hoặc thông tin cá nhân.

Tự đến nhận có thể tiết kiệm phí logistics cho mô hình, nhưng **chưa chứng minh giảm phát thải**. Nếu phát sinh chuyến xe máy riêng, lợi ích môi trường có thể khác pickup trên tuyến đã có; không gắn lượng CO₂ mặc định vào mỗi km.

## 7. ML nên giải quyết bài toán gì?

### Mục tiêu

Không dùng ML chỉ để biến 1 km thành 8 điểm phần trăm. Dùng ML để học **phần thưởng nào làm tăng pickup hoàn tất**, so với không có thưởng thêm, trong giới hạn giá sàn và ngân sách.

Với x là bối cảnh đơn (cụm trường, khoảng cách, thời gian còn đến chốt, SKU, tồn, giờ, các dữ kiện được đồng ý thu thập), a là hành động thưởng thêm, Y=1 nếu đã trả tiền và nhận đúng hạn:

`q(x,a) = Pr(Y=1 | do(thưởng=a), x)`

`uplift(x,a) = q(x,a) - q(x,0)`

Một mô hình dự đoán ai hay mua không tự đo uplift: người vốn đã mua có thể nhận thưởng không cần thiết. Muốn ước lượng tác động phải có nhóm đối chứng và phân bổ thưởng ngẫu nhiên hợp lệ; lịch sử khách tự chọn voucher 20%/10%/7% có selection bias.

Trong mô hình đối soát A, lựa chọn a có thể tối đa hóa:

`q(x,a) × [T(x,a) - F - C_success] - C_offer(x,a)`

với các ràng buộc: giá sàn, tồn còn, cửa sổ nhận, ngân sách theo ngày, giới hạn ưu đãi/khách và không cộng dồn. Nếu mục tiêu xã hội là số kg hàng dư cứu được, có thể tối ưu số kg tăng thêm với ràng buộc đóng góp/budget, nhưng phải công bố trade-off; không tối ưu đồng thời nhiều chỉ số mà không xác định trọng số.

### Tính toán làm rõ trade-off

Trong ví dụ C=3.000: voucher 7% đóng góp 20.350/đơn hoàn tất, voucher 20% đóng góp 8.000. Nếu bỏ qua các chi phí offer và khác biệt khác, mức 20% cần xác suất hoàn tất cao hơn khoảng 2,54375 lần mức 7% để đóng góp kỳ vọng lớn hơn. Nếu q_7=50%, không thể đạt q_20>127%: tăng giảm giá trong tình huống đó không tối ưu đóng góp của đơn, dù có thể phục vụ mục tiêu xả hàng. Đây là phép tính điều kiện, không phải dự báo hành vi khách.

### Lộ trình

1. Engine luật giá và trần chạy trước; thử voucher/pickup bằng vận hành thủ công. Không huấn luyện AI khi chưa có outcome đáng tin.
2. Ngẫu nhiên **phần thưởng thêm**, giữ bộ voucher 7/10/20 cho tất cả. Nhóm control có bộ ba và không thêm thưởng; nhóm treatment có cùng bộ ba và chính sách thưởng có trần. Đây là đo tác động của policy tổng thể, không riêng từng mức voucher tự chọn.
3. Khi cần chọn mức thưởng tốt hơn, ngẫu nhiên các mức bonus đủ điều kiện trong từng bucket khoảng cách/giờ; ghi xác suất được phân bổ, toàn bộ lượt hiển thị đủ điều kiện, cả không mua, no-show và hoàn tiền. Giữ assignment theo người/ca để giảm nhiễm chéo.
4. Baseline: bảng tỷ lệ pickup theo dải bonus và khoảng cách; logistic regression đơn giản với tương tác treatment×distance. Sau đó mới thử uplift tree hoặc contextual bandit. Chia tập theo thời gian/cửa hàng, tránh rò outcome hoặc thông tin sau pickup vào feature lúc đặt.
5. Chỉ nâng cấp nếu tăng số pickup/đóng góp hoặc giảm lượng bỏ phí so với luật đơn giản trong holdout online. Không tuyên bố ML hiệu quả chỉ từ AUC hay dữ liệu giả lập.

Giới hạn năng lực: toàn bộ sinh viên cùng thấy tồn hữu hạn, nên người mua trước có thể làm treatment của người sau hết hàng. Ghi availability tại lúc exposure; thử theo block cửa hàng×ca/ngày khi đủ cửa hàng, hoặc giới hạn quota cân bằng. Cỡ mẫu cần tính theo outcome và lift tối thiểu, không gọi 30 người/3 quán là bằng chứng causal mạnh.

## 8. MVP cho đội có kinh doanh, code, thiết kế

**Chặng 1:** thỏa thuận 3–5 tiệm cạnh một cụm trường, danh mục hàng dư và cửa sổ nhận; phân biệt giá sàn/net payout với commission; khảo sát khả năng nhận 1 km của sinh viên. Giữ giấy tờ/điều khoản người bán và xử lý thực phẩm theo quy trình của pilot Bếp Núc trước.

**Chặng 2:** PWA catalogue + bộ ba voucher + preview final price + backend tính trần + stock reservation có timeout + xác nhận pickup tại quầy + ledger đối soát. Zalo dùng làm kênh link/hỗ trợ nếu phù hợp điều kiện OA. Giá sàn không nằm trong payload client.

**Chặng 3:** tích hợp route API, tính thưởng 1 km theo luật thử, hiển thị mức thực áp sau trần; phiên báo giá khóa TTL, vị trí xác minh và giá chốt; hoàn voucher khi quán hủy/hết hàng. Nếu stock/giá thay đổi khi quote hết hạn, báo lại trước thanh toán.

**Chặng 4:** randomized pilot bonus, dashboard và xuất dữ liệu; ML là bước tiếp theo nếu lượng dữ liệu và hiệu quả kinh tế đủ.

Tối thiểu lưu: giá gốc có bằng chứng, giá listing, net payout contract, voucher issued/used/restored, base voucher, bonus requested/effective, distance/time bucket, eligible inventory, quote/order IDs, assignment probability, pickup outcome, refund và cost components. Dữ liệu địa điểm chi tiết tách quyền truy cập khỏi dữ liệu phân tích.

### Các câu hỏi phải được dữ liệu trả lời

- Bao nhiêu người chỉ dùng 20%, bao nhiêu quay lại dùng các voucher thấp hơn? Có người mua quá nhu cầu vì voucher sắp hết hạn không?
- Tăng 7% → 15% cho 1 km tăng pickup bao nhiêu so với không bonus? Có đủ bù mất đóng góp không?
- Tỷ lệ dùng voucher ở sát trần, chi phí bình quân/đơn, pickup rate, no-show, hoàn tiền và tiền thực nhận quán?
- Đơn cứu được thay cho bỏ đi hay chuyển khách mua giá thường sang giảm giá? Quán có làm thêm hàng cho chương trình không?
- Quán thấy mức F đủ hấp dẫn so với tự giảm/tặng/bán trên kênh khác không? Sinh viên thấy số đồng tiết kiệm đủ đáng đi không?

Tiếp tục nếu thu được lượng hàng dư lặp lại, pickup thuận tiện, quán muốn tiếp tục có phí và chính sách thưởng tạo lift đo được trong giới hạn tiền. Điều chỉnh bonus hoặc cắt vùng quá xa nếu pickup không tăng mà đóng góp giảm. Đây là gate nghiên cứu, chưa phải tuyên bố mô hình sẽ sinh lời.

## 9. Định vị đề án

“Bếp Núc kết nối hàng dư cuối ngày với sinh viên bằng bộ voucher và ưu đãi tự nhận được tính theo tuyến. Hệ thống bảo vệ số tiền thực nhận đã thỏa thuận với cửa hàng, giúp khách biết giá cuối trước khi đặt, và học từ dữ liệu thử nghiệm để phân bổ phần thưởng pickup hiệu quả hơn.”

Technology phù hợp nếu nhóm chứng minh engine ràng buộc giá, tính tuyến và tăng trưởng pickup có kiểm soát. Gen Z Economy phù hợp nếu trọng tâm là nhu cầu, hành vi và kinh tế sinh viên. Chỉ chọn hạng mục sau khi đối chiếu rubric cuộc thi.

**Đánh giá:** triển khai kỹ thuật bằng luật là khả thi; hiệu quả hành vi và tài chính chưa được chứng minh. Giữ giá sàn riêng khả thi bằng backend và phân quyền; “đi xa hơn thưởng nhiều hơn” cần có trần, xác minh và kiểm chứng. Cơ chế voucher có thể tạo khác biệt trải nghiệm, nhưng sức mạnh của đề án sẽ nằm ở bằng chứng rằng thưởng đúng lúc làm tăng số đơn nhận thành công mà vẫn bảo vệ quán và nền tảng.

## 10. Bằng chứng và kiểm tra

Nguồn và giới hạn đã ghi trong [buachot-voucher-sources.csv](buachot-voucher-sources.csv). Hai nguồn publisher/SSRN về coupon/personalized pricing không mở được toàn văn trong lần kiểm tra nên không dùng làm bằng chứng cho khuyến nghị.

Mã [verify-buachot-voucher.cjs](verify-buachot-voucher.cjs) tái tính các ví dụ, kiểm tra trần/giá sàn/rounding/no stacking và 252 trường hợp với ba mệnh giá, nhiều tỷ lệ sàn và khoảng cách. Đây là kiểm tra mô hình toán, không phải sản phẩm đang chạy hoặc ML đã huấn luyện.
