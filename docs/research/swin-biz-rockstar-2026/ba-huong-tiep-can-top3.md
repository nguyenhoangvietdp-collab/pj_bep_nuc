# Ba hướng tiếp cận lớn cho ba ứng viên tiềm năng nhất

Ngày: 04/10/2026. Tài liệu này dùng để chọn một hướng làm hồ sơ và MVP cho Swin-Biz Rockstar 2026. Không có kết quả khách hàng hay hiệu năng mô hình nào được coi là đã chứng minh.

## Cách đọc

Ba hướng không phải ba tính năng của cùng một sản phẩm. Mỗi hướng là một chiến lược kinh doanh khác nhau:

1. **BếpCanh:** AI vận hành cho quán nhỏ, tạo giá trị bằng dự báo và giảm lãng phí.
2. **CaĐầu AI:** AI huấn luyện kỹ năng, tạo giá trị bằng luyện tập có phản hồi.
3. **VòngĐờiSố:** hạ tầng niềm tin cho thiết bị cũ, tạo giá trị bằng bằng chứng kiểm tra.

Nguồn gốc chứng minh cơ chế có thật, không chứng minh thị trường Việt Nam. Winnow công bố các lớp đo lãng phí và dự báo sản lượng; Yoodli công bố nền tảng AI roleplay và vòng Series B 40 triệu USD; Fairphone công bố thiết kế sửa chữa, linh kiện thay thế và hỗ trợ phần mềm dài hạn. Xem [Winnow](https://www.winnowsolutions.com/solutions), [Yoodli](https://yoodli.ai/platform/ai-experiential-learning), [thông báo Series B của Yoodli](https://yoodli.ai/blog/yoodli-raises-40-million-series-b-to-lead-the-future-of-experiential-learning), [Fairphone Longevity](https://www.fairphone.com/hub/en/impact/long-lasting-design/).

## Hướng A — BếpCanh: hệ điều hành quyết định lượng nấu cho quán nhỏ

### Luận đề chiến lược

Quán ăn nhỏ không cần thêm một hệ thống quản trị lớn. Họ cần một câu trả lời đáng tin cho câu hỏi: “Ca tới nên chuẩn bị bao nhiêu phần món này?”. BếpCanh biến dữ liệu bán, dư và hết món thành quyết định lượng nấu. Giá trị đến từ việc cân bằng hai lỗi đối nghịch: nấu thừa và nấu thiếu.

Định vị nên là **decision support cho chủ quán**, không phải “AI tự động điều hành bếp”. Chủ quán luôn duyệt hoặc sửa đề xuất. Điều này giảm rủi ro và làm dữ liệu sửa trở thành tài sản học tập.

### Phân khúc và luồng giá trị

- Khách hàng đầu tiên: quán cơm, bún, bánh mì hoặc căn tin có 5–20 món, chưa có POS tốt.
- Người dùng: người chốt lượng nấu mỗi ca.
- Người trả tiền: chủ quán hoặc quản lý chuỗi nhỏ.
- Sự cố: hàng dư cuối ca, hết món trước giờ đóng cửa, ghi chép mất thời gian.
- Kết quả phải đo: giá trị hàng dư, số lượt hết món, phút nhập liệu, tỷ lệ dùng đề xuất.

Khách hàng không mua “mô hình dự báo”. Họ mua ít tiền thất thoát hơn và quyết định ít căng thẳng hơn. Nếu không đo được hai kết quả đó, dashboard không có giá trị kinh doanh.

### Sản phẩm và kiến trúc

MVP là PWA hoặc bot nhập liệu có xác nhận trên điện thoại:

1. Chủ quán nhập món, số đã nấu, số bán, số dư và số lần khách hỏi khi hết món.
2. Hệ thống tạo dự báo cho ca kế tiếp, hiển thị khoảng số phần và lý do.
3. Chủ quán sửa đề xuất, ghi lý do nếu cần.
4. Cuối ca, hệ thống cập nhật sai số và giá trị lãng phí.

Kiến trúc gồm giao diện nhập nhanh, API dữ liệu, cơ sở dữ liệu theo cửa hàng/món/ca, dịch vụ dự báo và dashboard. Không cần camera, blockchain hay tích hợp POS trong MVP. Nhập giọng nói chỉ tạo bản nháp; người dùng phải xác nhận số và đơn vị.

### Mô hình toán học tối thiểu

Gọi (Y_{d,m}) là số phần món (m) bán được ở ngày/ca (d), và (Q_{d,m}) là số phần chuẩn bị. Có hai chi phí:

\[
L(Q,Y)=c_w(Q-Y)_+ + c_s(Y-Q)_+
\]

Trong đó (c_w) là chi phí dư và (c_s) là chi phí hết món; ((x)_+=\max(x,0)). Lượng nấu tối ưu là phân vị:

\[
Q^*=F_Y^{-1}\left(\frac{c_s}{c_w+c_s}\right).
\]

Nếu hết món gây mất khách lớn hơn chi phí dư, (Q^*) sẽ cao hơn trung vị. Nếu món dễ hỏng và biên lợi nhuận thấp, (Q^*) sẽ thấp hơn.

MVP không cần ước lượng phân phối phức tạp. Dùng median cùng thứ trong tuần làm baseline. Sau đó thử quantile regression hoặc mô hình thống kê theo món khi có đủ dữ liệu. Huấn luyện ML chỉ được giữ nếu giảm pinball loss hoặc WAPE trên ngày chưa thấy.

Ví dụ: nếu ba thứ Hai gần nhất bán 40, 43 và 47 suất, median baseline là 43. Hệ thống có thể đề xuất 43–46 suất. Chủ quán chọn 45 vì thứ Hai đầu tháng thường đông. Lựa chọn này trở thành dữ liệu `owner_override`, không bị coi là lỗi mô hình.

### Thiết kế thử nghiệm

Thiết kế theo thời gian, không chia ngẫu nhiên từng dòng dữ liệu. Dùng 7–10 ngày đầu để hiệu chỉnh, dự báo ngày sau chưa thấy. So sánh:

- baseline cùng thứ tuần trước;
- baseline median 3–4 ngày tương tự;
- mô hình quantile nếu dữ liệu đủ;
- quyết định thực tế của chủ quán.

Không dùng chỉ một metric. Báo cáo WAPE hoặc MAE, tỷ lệ hết món, giá trị dư và thời gian nhập liệu. Giảm hàng dư nhưng tăng mạnh hết món là thất bại.

### Mô hình kinh doanh và lợi thế

Pilot có thể miễn phí hoặc thu 0–99.000 đồng để kiểm tra hành vi trả tiền. Sau khi có dữ liệu, thử 199.000–499.000 đồng/điểm/tháng. Đây là dải giả thuyết, không phải giá thị trường đã xác nhận.

Lợi thế dài hạn gồm dữ liệu theo món và ca, cách ghi nhận phù hợp quán Việt, lịch sử chủ quán sửa dự báo và giải thích quyết định bằng ngôn ngữ vận hành. Thuật toán chung dễ sao chép.

### Lộ trình 30–90 ngày

- Ngày 0–7: phỏng vấn 5 chủ quán; ký một pilot có dữ liệu.
- Ngày 8–21: chạy nhập liệu thủ công và baseline; chưa cần ML.
- Ngày 22–30: thêm khoảng dự báo và dashboard sai số.
- Ngày 31–60: thử 2–3 quán cùng loại; kiểm tra khả năng chuyển giao.
- Ngày 61–90: tích hợp POS nếu có giá trị; thử thu phí.

### Điều kiện dừng

Dừng nếu không có quán ghi ít nhất 10/14 ngày, nhập liệu vượt 3 phút mỗi ca, chủ quán không dùng đề xuất hoặc giá trị tiết kiệm không vượt công nhập liệu và phí phần mềm.

## Hướng B — CaĐầu AI: phòng tập kỹ năng cho nhân viên mới

### Luận đề chiến lược

Nhiều kỹ năng đi làm không thiếu nội dung hướng dẫn; chúng thiếu cơ hội luyện tập trước tình huống thật. CaĐầu AI mô phỏng khách hàng, quản lý hoặc đồng nghiệp, sau đó phản hồi theo quy trình nghề cụ thể.

Định vị nên là **AI coach có rubric do người trong nghề duyệt**, không phải AI chấm người để tuyển dụng. Ranh giới này bảo vệ người học và tăng khả năng bán cho doanh nghiệp đào tạo.

### Phân khúc và luồng giá trị

- Khách hàng đầu tiên: chuỗi bán lẻ, quán cà phê, trung tâm đào tạo nghề.
- Người dùng: nhân viên mới hoặc sinh viên chuẩn bị đi làm.
- Người trả tiền: quản lý đào tạo hoặc nhà trường.
- Sự cố: quản lý phải đóng vai lặp lại, nhân viên ngại luyện, lỗi chỉ lộ ra khi gặp khách.
- Kết quả phải đo: bước xử lý hoàn thành, lỗi nghiêm trọng, thời gian kèm và mức đồng thuận với người hướng dẫn.

### Sản phẩm và kiến trúc

MVP chọn một nghề và 10–15 tình huống. Scenario engine lưu trạng thái hội thoại và điều kiện thành công. Mô hình ngôn ngữ đóng vai. Evaluator riêng đối chiếu transcript với rubric, trích dẫn câu nói và đề xuất bước luyện tiếp.

Kho tri thức chỉ dùng SOP mà đối tác cho phép. Mỗi kịch bản có: mục tiêu, thông tin khách biết, trạng thái, hành động bắt buộc, lỗi nghiêm trọng, tiêu chí kết thúc. Chữ đi trước giọng nói; ASR/TTS chỉ thêm khi chứng minh được giá trị.

Các tình huống phù hợp gồm khách đổi yêu cầu, nhầm đơn, tranh chấp tiền cọc hộp, khách yêu cầu đồ dùng một lần và bàn giao ca. Hệ thống cần xử lý xưng hô và không phạt giọng địa phương nếu nội dung và hành động đúng.

### Mô hình toán học và đánh giá

Mỗi tình huống là một chuỗi trạng thái (s_t), hành động người học (a_t) và phản hồi khách (r_t). Rubric có (K) tiêu chí, mỗi tiêu chí (z_k\in\{0,1,2\}). Điểm phiên:

\[
S=\sum_{k=1}^{K}w_kz_k-\lambda\,I(\text{lỗi nghiêm trọng}).
\]

Trọng số (w_k) do chuyên gia duyệt. Evaluator không được tự thay đổi trọng số trong pilot. So sánh điểm AI với điểm người hướng dẫn bằng weighted Cohen’s kappa hoặc intraclass correlation, tùy dạng điểm. Nếu AI cho phản hồi nhưng không bám bằng chứng transcript, xem là lỗi hệ thống.

Hiệu quả học tập không đo bằng điểm AI tăng. Đo tỷ lệ hoàn thành rubric trong một tình huống mới, chưa dùng khi luyện. Có thể dùng mô hình chuyển trạng thái đơn giản:

\[
P(s_{t+1}\mid s_t,a_t),
\]

nhưng MVP chỉ cần log đủ để phân tích lỗi. Không cần reinforcement learning.

### Thiết kế thử nghiệm

So sánh ba điều kiện: video hướng dẫn, chatbot prompt chung và CaĐầu AI có rubric. Người hướng dẫn chấm bài roleplay trước/sau mà không biết điều kiện hoặc điểm AI. Báo cáo cả độ đồng thuận, mức cải thiện và thời gian quản lý tiết kiệm.

Không kết luận hiệu quả đào tạo từ 10 người. Mẫu nhỏ chỉ dùng để tìm lỗi kịch bản, lỗi rubric và vấn đề trải nghiệm. Claim mạnh hơn cần thử nghiệm lớn hơn.

### Mô hình kinh doanh và lợi thế

Bán theo cohort, số người học hoặc gói kịch bản cho doanh nghiệp. Không định giá theo số token. Lợi thế là thư viện tình huống Việt Nam được doanh nghiệp duyệt, dữ liệu lỗi thực tế và rubric có thể kiểm toán.

Yoodli đã mô tả roleplay, feedback và continuous coaching cho doanh nghiệp; nguồn đó chứng minh cơ chế sản phẩm, không chứng minh người học Việt Nam sẽ trả tiền. [Yoodli experiential learning](https://yoodli.ai/platform/ai-experiential-learning).

### Lộ trình 30–90 ngày

- Ngày 0–7: phỏng vấn quản lý; lấy một SOP được phép dùng.
- Ngày 8–21: viết 10 kịch bản và rubric; thử bằng giao diện chữ.
- Ngày 22–30: cho 5–10 người roleplay; sửa lỗi đánh giá.
- Ngày 31–60: so sánh video, chatbot chung và hệ thống có rubric.
- Ngày 61–90: bán cohort nhỏ cho một đơn vị đào tạo.

### Điều kiện dừng

Dừng nếu không có chuyên gia chịu duyệt; rubric không mô tả hành động quan sát được; AI phản hồi sai SOP; người hướng dẫn không đồng ý với điểm; hoặc video rẻ hơn tạo cùng mức cải thiện.

## Hướng C — VòngĐờiSố: hồ sơ bằng chứng cho thiết bị cũ

### Luận đề chiến lược

Thị trường máy cũ bị cản bởi bất cân xứng thông tin: người bán biết lịch sử thiết bị, người mua khó xác minh. VòngĐờiSố không bán lời hứa “máy tốt”. Nó bán hồ sơ cho biết điều gì đã đo, ai đo, đo bằng cách nào và điều gì vẫn chưa biết.

Fairphone là nguồn cảm hứng về sửa chữa, linh kiện thay thế và kéo dài hỗ trợ phần mềm. [Fairphone mô tả thiết kế modular](https://www.fairphone.com/hub/en/impact/long-lasting-design/) và [quy trình chẩn đoán–sửa chữa](https://www.fairphone.com/repairs). Nguồn này không chứng minh nhu cầu cho dịch vụ kiểm định máy cũ tại Việt Nam; đó là giả thuyết của đội.

### Phân khúc và luồng giá trị

- Khách hàng đầu tiên: cửa hàng máy cũ có kỹ thuật viên và tranh chấp bảo hành.
- Người dùng: kỹ thuật viên, nhân viên bán hàng và người mua.
- Người trả tiền: cửa hàng hoặc người mua trả phí kiểm tra độc lập.
- Sự cố: biên bản thiếu nhất quán, lỗi phát hiện sau bán, khách không hiểu “đã thay” khác “đã kiểm tra”.
- Kết quả phải đo: thời gian kiểm tra, lỗi phát hiện, tỷ lệ tranh chấp, mức hiểu hồ sơ và willingness-to-pay.

### Sản phẩm và kiến trúc

Mỗi thiết bị có một hồ sơ phiên bản hóa. Trường dữ liệu gồm model, mã thiết bị đã băm, bài kiểm tra, kết quả, công cụ, thời gian, người kiểm tra, linh kiện thay, bằng chứng và mục không thể xác minh.

Nhật ký append-only tạo phiên bản mới thay vì sửa âm thầm. Không lưu IMEI thô, ảnh cá nhân, tin nhắn hay tài khoản. Không cần blockchain trong MVP. Một cơ sở dữ liệu có quyền truy cập, dấu thời gian và trách nhiệm người kiểm tra đủ để thử.

Bắt đầu với một nhóm Android. Một số test chạy bằng ứng dụng/web; một số do kỹ thuật viên xác nhận bằng công cụ hiện có. Giao diện phân biệt `đã đo`, `người bán khai báo` và `không thể xác minh`.

### Mô hình toán học và biểu diễn bằng chứng

Gọi (x) là thiết bị, (T_j(x)) là kết quả test (j), và (e_j) là bằng chứng đi kèm. Thay vì gom thành một điểm tin cậy duy nhất, tạo vector:

\[
E(x)=\big[(T_1,e_1,c_1),\ldots,(T_n,e_n,c_n)\big],
\]

trong đó (c_j) là điều kiện kiểm tra và mức chắc chắn của test. Quyết định mua chỉ được hỗ trợ khi các test bắt buộc đạt và không có cảnh báo nghiêm trọng:

\[
\text{Pass}(x)=\prod_{j\in J_{required}}I(T_j(x)\text{ đạt})\cdot I(\text{không có cảnh báo}).
\]

Nếu test không chạy được, kết quả là `unknown`, không phải `pass`. Điều này quan trọng hơn một điểm 87/100 dễ gây hiểu lầm. Các ngưỡng pin, màn hình, camera và cổng sạc phải được chuyên gia duyệt theo model.

### Thiết kế thử nghiệm

Chọn 10–20 máy. Mỗi máy được kiểm tra bằng biên bản cũ và mẫu mới. Đo thời gian, số lỗi phát hiện, số mục không xác minh và mức hiểu của người mua. Sau đó hỏi người mua chọn máy nào và có trả phí cho hồ sơ không.

Nếu có dữ liệu hoàn trả, theo dõi các lỗi xuất hiện trong 30 ngày. Đây là chỉ số xác thực hậu kiểm; không tuyên bố hiệu quả chỉ từ việc biên bản đẹp hơn.

### Mô hình kinh doanh và lợi thế

Thu phí theo máy, gói cho cửa hàng hoặc phí API khi đối tác muốn nhúng hồ sơ. Dải 50.000–150.000 đồng/lần kiểm tra chỉ là giả thuyết thử giá.

Lợi thế là mạng kỹ thuật viên có trách nhiệm, schema test theo model, lịch sử sửa chữa và dữ liệu lỗi hậu kiểm. Không coi một con dấu “đã kiểm định” là lợi thế nếu ai cũng có thể phát hành.

### Lộ trình 30–90 ngày

- Ngày 0–7: chọn một cửa hàng và nhóm Android; thống nhất quyền dữ liệu.
- Ngày 8–21: viết schema và kiểm tra 10 máy bằng biên bản song song.
- Ngày 22–30: tạo trang hồ sơ có phiên bản và mục chưa xác minh.
- Ngày 31–60: đo thời gian, lỗi phát hiện và mức hiểu của người mua.
- Ngày 61–90: thử thu phí và theo dõi hoàn trả 30 ngày.

### Điều kiện dừng

Dừng nếu cửa hàng không chấp nhận lưu kết quả bất lợi; kỹ thuật viên không thể lặp lại test; hồ sơ làm thời gian tăng hơn 20% mà không phát hiện thêm lỗi; hoặc người mua chỉ tin bảo hành và không trả phí cho bằng chứng.

## So sánh chiến lược

| Chiều | BếpCanh | CaĐầu AI | VòngĐờiSố |
|---|---|---|---|
| Giá trị chính | Dự báo quyết định vận hành | Luyện tập có phản hồi | Giảm bất cân xứng thông tin |
| Dữ liệu khó nhất | Số nấu, bán, dư, hết món | SOP và rubric nghề | Kết quả test, lịch sử sửa |
| MVP nhanh nhất | Có | Có | Trung bình |
| Rủi ro lớn nhất | Không có dữ liệu đều | AI chấm sai hoặc không có chuyên gia | Xung đột lợi ích người kiểm tra |
| Đường thu tiền | Phí theo điểm bán | B2B theo cohort | Phí theo máy/hồ sơ |
| Tác động bền vững | Giảm thực phẩm dư | Giảm công đào tạo và lỗi dịch vụ | Kéo dài vòng đời thiết bị |
| Hạng mục nên chọn | Technology/Social Impact | Gen Z Economy/Technology | Technology/Social Impact |

## Quy tắc chọn một hướng

Chọn **BếpCanh** nếu đội tiếp cận được quán và dữ liệu mỗi ngày. Chọn **CaĐầu AI** nếu có doanh nghiệp hoặc giảng viên cung cấp SOP và chấm được roleplay. Chọn **VòngĐờiSố** nếu có cửa hàng sửa chữa chịu trách nhiệm trước người mua.

Nếu cả ba cửa đều đóng, không chọn theo độ hấp dẫn của demo. Quay lại phỏng vấn vấn đề. Khả năng tiếp cận bằng chứng là biến quyết định, không phải phần phụ sau khi code xong.

## Evidence ledger

| Nguồn | Điều đã lấy | Giới hạn |
|---|---|---|
| Winnow Solutions | Đo lãng phí và dự báo sản lượng là cơ chế sản phẩm; có lớp tablet-only và lớp nhận diện | Không suy ra mức tiết kiệm ở quán Việt Nam |
| Yoodli experiential learning | AI roleplay, phản hồi, luyện liên tục cho doanh nghiệp | Case study và claim hiệu quả do doanh nghiệp công bố |
| Yoodli Series B | Công bố vòng Series B 40 triệu USD ngày 02/12/2025 | Gọi vốn không chứng minh hiệu quả Việt Nam |
| Fairphone Longevity | Modular repairability, linh kiện thay, hỗ trợ phần mềm dài hạn | Không chứng minh nhu cầu dịch vụ hồ sơ máy cũ |
| Fairphone Repairs | Quy trình chẩn đoán rồi chọn tự sửa hoặc trung tâm sửa | Quy trình của nhà sản xuất Fairphone, không phải Android cũ nói chung |

Các biến đổi cho Việt Nam, giá, ngưỡng và điểm số là tổng hợp chiến lược của đội. Cần cập nhật sau phỏng vấn và pilot.
