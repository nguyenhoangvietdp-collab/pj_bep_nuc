# Đào sâu tám ứng viên công nghệ

Ngày cập nhật: 04/10/2026. Đây là tài liệu quyết định trước pilot. Các mức giá, điểm số và hành vi người dùng là giả thuyết cần kiểm tra.

## Kết luận

Đưa ba hướng vào vòng phỏng vấn: **BếpCanh**, **CaĐầu AI**, **VòngĐờiSố**. Chỉ làm MVP cho một hướng sau khi có quyền tiếp cận dữ liệu hoặc đối tác.

**BếpCanh** mạnh nhất nếu có quán cung cấp dữ liệu mỗi ngày. **CaĐầu AI** mạnh nhất nếu có chuỗi cửa hàng hoặc giảng viên nghề duyệt kịch bản. **VòngĐờiSố** mạnh nhất nếu có cửa hàng sửa điện thoại chịu đứng tên kết quả kiểm tra.

Không chia lực làm ba sản phẩm. Mỗi hướng có một cửa kiểm chứng. Không qua cửa thì loại.

## Khung chấm

| Tiêu chí | Trọng số | Câu hỏi |
|---|---:|---|
| Nỗi đau và người trả tiền | 25 | Sự cố có xảy ra thường xuyên, gây chi phí và có người sở hữu ngân sách không? |
| Bằng chứng MVP | 20 | Đội có thể thu kết quả thật trước hạn không? |
| Công nghệ cốt lõi | 20 | Tắt công nghệ thì giá trị có giảm rõ không? |
| Thích nghi Việt Nam | 15 | Thay đổi có vượt qua dịch ngôn ngữ và đổi giao diện không? |
| Bền vững hoặc tác động | 10 | Có đại lượng vật chất hoặc hành vi đo được không? |
| Phù hợp năng lực đội | 10 | Đội hiện tại có thể làm và trình diễn không? |

Điểm dưới đây là đánh giá nội bộ, không phải rubric của cuộc thi.

| Hạng | Ý tưởng | Điểm/100 | Cửa kiểm chứng |
|---:|---|---:|---|
| 1 | BếpCanh | 84 | Một quán ghi đủ dữ liệu trong 14 ngày |
| 2 | CaĐầu AI | 80 | Một chuyên gia nghề duyệt 10 kịch bản và rubric |
| 3 | VòngĐờiSố | 76 | Một cửa hàng cho kiểm tra 10 máy thật |
| 4 | HộpVòng Smart | 70 | Có ba điểm cấp, trả và rửa trong cùng cụm |
| 5 | KýỨcNhà AI | 66 | Hai gia đình đặt cọc cho sản phẩm mẫu |
| 6 | TinNhà Lab | 63 | Có chuyên gia an toàn số duyệt nội dung |
| 7 | DễDùng | 58 | Có ít nhất năm người lớn tuổi thử trực tiếp |
| 8 | MátTrọ Monitor | 51 | Có phòng thử, đối chứng và người phụ trách kỹ thuật |

## 1. BếpCanh

### Luận điểm

Quán cơm nhỏ thường quyết định lượng nấu bằng kinh nghiệm. Sai số tạo hai tổn thất trái chiều: dư món hoặc hết món. [Winnow](https://www.winnowsolutions.com/solutions) cho thấy đo lãng phí và dự báo sản lượng là cơ chế đã được thương mại hóa. Cơ hội của đội là giảm công nhập liệu và điều chỉnh cơ chế cho quán nhỏ, thực đơn Việt Nam thay đổi nhanh.

### Người dùng và người mua

- Người dùng: chủ quán hoặc người quyết định lượng nấu trước mỗi ca.
- Người mua: chủ một điểm bán hoặc quản lý chuỗi nhỏ.
- Việc cần làm: quyết định số phần cho từng món mà không tăng số lần hết món.
- Đối thủ thực: trí nhớ, sổ tay, POS, bảng tính và dự báo tích hợp trong phần mềm bán hàng.

### Sản phẩm

Luồng tối thiểu gồm bốn bước: nhập món và số lượng đã nấu; chốt số bán, số dư và số lượt hỏi khi hết món; nhận đề xuất cho ca kế tiếp; chủ quán sửa đề xuất và ghi lý do.

MVP nên là web app dùng trên điện thoại. Mô hình dữ liệu tối thiểu gồm `shop`, `service_date`, `shift`, `dish`, `prepared_qty`, `sold_qty`, `waste_qty`, `stockout_requests`, `recommended_qty`, `owner_override` và `override_reason`.

Baseline đầu tiên là lượng bán của cùng thứ tuần trước hoặc trung vị ba ngày tương tự. Chỉ thêm hồi quy, cây quyết định hoặc dự báo xác suất khi dữ liệu đủ và vượt baseline trên ngày chưa thấy. Không huấn luyện computer vision.

Đề xuất nên là khoảng, ví dụ 35–42 phần, kèm mức tin cậy. Người dùng quyết định cuối cùng. Dữ liệu thời tiết và lịch địa phương chỉ thêm sau khi dữ liệu nội bộ ổn định.

### Chỉ số và kinh tế

- Chỉ số kỹ thuật: MAE hoặc WAPE theo món; tỷ lệ ngày dự báo tốt hơn baseline.
- Chỉ số kinh doanh: giá trị hàng dư, tỷ lệ hết món, số phút nhập liệu, số lần chủ quán dùng đề xuất.
- Chỉ số tác động: khối lượng thực phẩm dư đã cân. Không tự quy đổi CO2.
- Giá thử: 0–99.000 đồng cho pilot; kiểm tra mức 199.000–499.000 đồng/điểm/tháng sau khi chứng minh tiết kiệm. Đây là dải phỏng vấn, không phải giá đã xác nhận.
- Công thức giá trị: `tiền giảm dư + lợi nhuận giữ lại nhờ giảm hết món - phí - công nhập liệu`.

### Pilot 14 ngày

Ngày 1–3 chuẩn hóa 5–10 món và đơn vị đo. Ngày 4–10 thu dữ liệu nhưng chưa đưa đề xuất. Ngày 11–14 đưa dự báo cho ngày tiếp theo. So sánh với baseline trên cùng các ngày. Pilot ngắn chỉ chứng minh luồng sử dụng và tín hiệu ban đầu.

### Lợi thế có thể xây

Lợi thế không nằm ở thuật toán chung. Nó nằm ở lịch sử món của từng quán, cách ghi nhận cực nhanh, dữ liệu sửa đề xuất của chủ quán và khả năng giải thích dự báo bằng ngôn ngữ vận hành.

### Kill criteria

Loại hướng nếu không có quán ghi dữ liệu 10/14 ngày; nhập liệu vượt ba phút mỗi ca; người dùng không xem đề xuất; hoặc giảm dư chỉ vì tăng hết món. Sửa phân khúc nếu chủ quán không có quyền quyết định lượng nấu.

## 2. CaĐầu AI

### Luận điểm

[Yoodli](https://yoodli.ai/blog/yoodli-raises-40-million-series-b-to-lead-the-future-of-experiential-learning) cho thấy mô phỏng hội thoại bằng AI có thể trở thành sản phẩm huấn luyện. Cơ hội tại Việt Nam là một mô-đun hẹp cho ca làm đầu tiên, dùng quy trình thật và cách xưng hô theo ngữ cảnh.

### Người dùng và người mua

- Người dùng: sinh viên hoặc nhân viên mới trong bán lẻ và dịch vụ ăn uống.
- Người mua: chuỗi cửa hàng, trường hoặc trung tâm đào tạo.
- Việc cần làm: tập xử lý tình huống khó trước khi tiếp xúc khách thật.
- Đối thủ thực: video hướng dẫn, shadowing, quản lý đóng vai và chatbot dùng prompt chung.

### Sản phẩm và kiến trúc

MVP có ba lớp. Scenario engine giữ trạng thái và điều kiện thành công. Mô hình hội thoại đóng vai khách. Evaluator riêng đối chiếu transcript với rubric và trích dẫn câu nói làm bằng chứng.

Kho tri thức chỉ chứa SOP do đối tác cho phép sử dụng. Mô hình không tự sáng tác quy trình. Một kịch bản gồm mục tiêu, trạng thái, dữ kiện khách biết, hành động bắt buộc, lỗi nghiêm trọng và câu hỏi kết thúc.

Bắt đầu bằng chữ. Giọng nói chỉ thêm khi đối tác xác nhận kỹ năng giao tiếp bằng giọng là giá trị chính. Hệ thống không tạo điểm tuyển dụng hoặc xếp hạng nhân viên.

### Chỉ số và mô hình doanh thu

- Chỉ số kỹ thuật: tỷ lệ phản hồi bám rubric; tỷ lệ dẫn chứng đúng câu; mức đồng thuận giữa AI và người hướng dẫn.
- Chỉ số học tập: hoàn thành bước bắt buộc trong tình huống mới; số lỗi nghiêm trọng; thời gian người quản lý phải kèm.
- Mô hình doanh thu: doanh nghiệp trả theo cohort, số người học hoặc gói kịch bản. Giá chỉ hỏi sau khi xác định ai có ngân sách đào tạo.

### Pilot

Chọn một nghề và 10 tình huống. Lấy năm quy trình từ chuyên gia nghề. Cho 10–20 người học làm một tình huống trước, luyện ba tình huống, rồi làm tình huống mới. Người hướng dẫn chấm mà không xem điểm AI.

### Lợi thế và kill criteria

Lợi thế có thể nằm ở thư viện tình huống Việt Nam đã được doanh nghiệp duyệt, rubric có bằng chứng và dữ liệu lỗi phổ biến. Loại hướng nếu chuyên gia không đồng ý dành thời gian duyệt; phản hồi AI mâu thuẫn SOP trên 5% lượt pilot; hoặc người học tiến bộ tương đương khi chỉ xem video.

## 3. VòngĐờiSố

### Luận điểm

[Fairphone](https://www.fairphone.com/the-one-that-lasts) cung cấp nguyên tắc kéo dài vòng đời và sửa chữa. VòngĐờiSố chuyển nguyên tắc đó thành hồ sơ bằng chứng cho điện thoại cũ. Giá trị không đến từ blockchain. Giá trị đến từ bài kiểm tra nhất quán, trách nhiệm người kiểm tra và lịch sử không bị sửa âm thầm.

### Người dùng, sản phẩm và dữ liệu

- Người dùng: kỹ thuật viên, người bán và người mua máy cũ.
- Người mua: cửa hàng muốn tăng độ tin cậy hoặc người mua trả phí kiểm tra độc lập.
- Hồ sơ gồm mã thiết bị đã băm, model, bài kiểm tra, kết quả, công cụ, thời gian, người kiểm tra, linh kiện đã thay, ảnh bằng chứng và phần chưa xác minh.
- Nhật ký là append-only. Mọi sửa đổi tạo phiên bản mới. Không lưu ảnh cá nhân, nội dung chat, tài khoản hoặc IMEI thô.

MVP chỉ hỗ trợ một nhóm Android. Một số bài kiểm tra chạy trên web hoặc app; số khác do kỹ thuật viên xác nhận bằng công cụ hiện có. Giao diện phải phân biệt `đã đo`, `người bán khai báo` và `không thể xác minh`.

### Chỉ số và kinh tế

Đo thời gian kiểm tra, tỷ lệ lỗi được phát hiện, tỷ lệ người mua hiểu hồ sơ và mức sẵn sàng trả. Giá thử 50.000–150.000 đồng/máy là giả thuyết phỏng vấn. Công thức lợi ích của cửa hàng gồm tăng tỷ lệ chốt, giảm hoàn trả và giảm tranh chấp.

### Rủi ro và kill criteria

Rủi ro lớn nhất là xung đột lợi ích nếu cửa hàng trả tiền nhưng muốn xóa kết quả xấu. Cần lưu phiên bản, quyền truy cập và dấu người kiểm tra. Loại hướng nếu không có đối tác chịu trách nhiệm; kiểm tra mất quá 20 phút mà không tạo thêm giá trị; hoặc người mua không phân biệt hồ sơ với lời cam kết của người bán.

## 4. HộpVòng Smart

### Luận điểm

[Vytal](https://www.presseportal.de/pm/154934/5988050) cung cấp bằng chứng về mô hình bao bì tái sử dụng có theo dõi vòng quay. Cơ hội của đội là công cụ vận hành cho một cụm nhỏ: biết hộp sạch ở đâu, hộp bẩn ở đâu, điểm nào sắp thiếu và chuyến thu nào đáng chạy.

### Người dùng, người mua và quyết định

Nhân viên điểm bán và điểm rửa dùng hệ thống. Đơn vị quản lý cụm trả tiền. Quyết định cần cải thiện là số hộp sạch cần điều chuyển và điểm cần thu trước. Baseline là lịch thu cố định hoặc gọi điện khi thiếu.

### Dữ liệu và kiến trúc MVP

Mỗi hộp có trạng thái `clean`, `issued`, `returned_dirty`, `washing`, `lost` hoặc `retired`. MVP nhận quét QR, hiển thị tồn từng điểm và đề xuất điều chuyển theo mức tồn tối thiểu. Không cần tối ưu tuyến đường nếu quy tắc đơn giản đã đủ.

### Chỉ số, kinh tế và lợi thế

Chỉ số gồm tỷ lệ hoàn trả, số vòng/hộp, tỷ lệ mất, số lần thiếu hộp, số chuyến và chi phí một lượt. Công thức chi phí gồm khấu hao hộp, rửa, thu hồi, mất/hỏng và phần mềm. Dữ liệu vòng quay trong một cụm và quy trình rửa có thể tạo lợi thế; QR riêng lẻ thì không.

### Rủi ro và kill criteria

Rủi ro gồm vệ sinh, trách nhiệm mất hộp và người dùng quên quét. Loại hướng nếu không có ba điểm thật; chi phí rửa và thu hồi vượt giá trị bao bì tránh mua; hoặc tỷ lệ mất khiến hoàn vốn không khả thi.

## 5. KýỨcNhà AI

### Luận điểm

[Remento](https://www.remento.co/) cho thấy lời kể có thể trở thành sách kèm âm thanh gốc. Cơ hội Việt Nam là biên tập nhiều người kể, xử lý cách xưng hô và cho phép truy ngược từng đoạn về nguồn âm thanh.

### Người dùng, người mua và quyết định

Người lớn tuổi kể chuyện; con cháu duyệt và thường là người trả tiền. Quyết định cần cải thiện là đoạn nào đủ tin cậy để đưa vào bản in. Baseline là thu âm điện thoại cộng biên tập thủ công.

### Dữ liệu và kiến trúc MVP

Pipeline gồm thu âm, tách người nói, transcript, phát hiện tên và mốc thời gian, đánh dấu độ chắc chắn, biên tập và gia đình duyệt. Mỗi đoạn giữ timecode. Hai ký ức mâu thuẫn được hiển thị như hai phiên bản.

### Chỉ số, kinh tế và lợi thế

Đo lỗi tên riêng, phút biên tập trên mỗi phút âm thanh, số vòng sửa và số đặt cọc. Chi phí phải tính phiên âm, biên tập, thiết kế và in. Lợi thế có thể là quy trình duyệt nhiều người và dữ liệu xưng hô gia đình Việt, nếu có sự đồng ý rõ ràng.

### Rủi ro và kill criteria

Rủi ro gồm bịa thêm chi tiết, lộ dữ liệu gia đình và tranh chấp giữa người kể. Loại hướng nếu biên tập thủ công làm biên lợi nhuận âm; lỗi tên hoặc sự kiện không thể giảm; hoặc gia đình thích giữ file ghi âm miễn phí hơn sản phẩm hoàn thiện.

## 6. TinNhà Lab

### Luận điểm

[Scamnetic](https://scamnetic.com/blog/scamnetic-13m-series-a-funding/) cho thấy các lớp phát hiện và can thiệp chống lừa đảo đang được đầu tư. Việt Nam đã có [nTrust](https://baochinhphu.vn/ra-mat-phan-mem-phat-hien-dau-hieu-lua-dao-qua-dien-thoai-102240730125149283.htm), nên MVP không nên cạnh tranh bằng lời hứa kiểm tra thật/giả.

### Người dùng, người mua và quyết định

Sinh viên hoặc nhân viên là người học. Trường và doanh nghiệp là bên mua. Quyết định cần cải thiện là hành động xác minh khi gặp tín hiệu đáng ngờ. Baseline là bài trình bày hoặc checklist tĩnh.

### Dữ liệu và kiến trúc MVP

TinNhà Lab là phòng tập an toàn. Scenario engine tạo biến thể của tuyển dụng giả, QR giả, mạo danh và thúc ép chuyển tiền. Hệ thống ghi quyết định, chấm hành động xác minh theo rubric đã duyệt và giải thích dấu hiệu.

### Chỉ số, kinh tế và lợi thế

So sánh với checklist tĩnh bằng tình huống mới chưa thấy. Đo tỷ lệ chọn hành động an toàn, thời gian quyết định và khả năng giải thích. Giá trị với bên mua là giảm công tổ chức huấn luyện và có báo cáo năng lực. Thư viện tình huống Việt Nam được chuyên gia duyệt có thể thành lợi thế.

### Rủi ro và kill criteria

Rủi ro gồm nội dung nhanh lỗi thời, tạo cảm giác tự tin giả và vô tình dạy cách lừa đảo. Loại hướng nếu không có chuyên gia duyệt; người dùng chỉ nhớ đáp án cũ; hoặc bên mua coi nội dung miễn phí hiện có là đủ.

## 7. DễDùng

> **Bản nghiên cứu chuyên sâu:** xem [DễDùng Dẫn Bước](de-dung/huong-di.md), gồm khoảng trống, năm hướng ứng viên, MVP, mô hình B2B2C và sổ bằng chứng.

### Luận điểm

[Be My Eyes](https://www.bemyeyes.com/) kết hợp AI và hỗ trợ con người cho người mù hoặc thị lực yếu. DễDùng chỉ chuyển giao cơ chế hỗ trợ nhiều tầng. Không suy ra người cao tuổi có cùng nhu cầu.

### Người dùng, người mua và quyết định

Người lớn tuổi là người dùng. Con cái hoặc nhà cung cấp dịch vụ có thể trả tiền. Quyết định cần cải thiện là bước tiếp theo khi người dùng bị kẹt. Baseline là gọi người thân hoặc xem tờ hướng dẫn có hình.

### Dữ liệu và kiến trúc MVP

MVP hỗ trợ ba tác vụ ít rủi ro: gọi video, tìm ảnh và đặt lịch. Hướng dẫn dùng ảnh màn hình theo phiên bản ứng dụng, chữ lớn, giọng đọc và nút chuyển cho người thân. Không yêu cầu quyền điều khiển toàn máy. Không xử lý ngân hàng, OTP hoặc chuyển tiền.

### Chỉ số, kinh tế và lợi thế

Đo tỷ lệ tự hoàn thành, số lần cần người trợ giúp, thời gian hoàn thành và cảm giác kiểm soát. Chi phí gồm cập nhật hướng dẫn khi ứng dụng đổi giao diện và thời gian hỗ trợ của người thân. Lợi thế chỉ hình thành nếu kho hướng dẫn theo phiên bản giảm đáng kể số lần hỗ trợ.

### Rủi ro và kill criteria

Rủi ro gồm ảnh màn hình chứa dữ liệu riêng tư, hướng dẫn sai phiên bản và người dùng phụ thuộc hơn. Loại hướng nếu AI không vượt baseline; người dùng không muốn chia sẻ ảnh; hoặc người mua không trả cho tác vụ không thường xuyên.

## 8. MátTrọ Monitor

### Luận điểm

[i2Cool](https://www.i2cool.com/company-news/74) cho thấy vật liệu làm mát thụ động tiếp tục được đầu tư. Việt Nam đã có sản phẩm chống nóng như [KOVA CN-05](https://sonchongnong.kovapaint.com/son-chong-nong-tuong-nha-kova-cn-05-giai-phap-chong-nong-tiet-kiem-cho-nha-o/). Đội không nên nghiên cứu vật liệu mới. Sản phẩm là dịch vụ đo để chọn và xác minh phương án cải tạo.

### Người dùng, người mua và quyết định

Người thuê cung cấp phản hồi; chủ nhà hoặc đơn vị quản lý trả tiền. Quyết định cần cải thiện là phương án cải tạo nào đáng đầu tư. Baseline là cảm nhận, nhiệt kế đơn lẻ hoặc lời chào bán của nhà thầu.

### Dữ liệu và kiến trúc MVP

MVP dùng cảm biến nhiệt độ, độ ẩm và dữ liệu thời tiết. Thiết kế phải có phòng đối chứng, vị trí cảm biến thống nhất và nhật ký cửa, quạt, máy lạnh. Dashboard so sánh nhiều ngày, không suy ra tác động từ một ngày trước–sau.

### Chỉ số, kinh tế và lợi thế

Đo số giờ vượt ngưỡng nhiệt, chênh lệch với ngoài trời và đối chứng, độ ổn định cảm biến và mức sẵn sàng trả. Nếu có đồng hồ điện riêng, mới đo điện năng. Lợi thế có thể là bộ dữ liệu theo kiểu phòng và phương án cải tạo địa phương.

### Rủi ro và kill criteria

Rủi ro gồm cảm biến sai, vị trí đo thiên lệch và thời tiết gây nhiễu. Loại hướng nếu không có đối chứng; cảm biến không được hiệu chuẩn; không có đối tác thi công; hoặc người mua không trả phí khảo sát.

## Kế hoạch ra quyết định trong 72 giờ

### Bước 1: mở cửa dữ liệu

Tìm một quán, một chuyên gia đào tạo và một cửa hàng sửa điện thoại. Yêu cầu cụ thể: 14 ngày dữ liệu; 60 phút duyệt kịch bản; hoặc 10 máy kiểm tra. Một lời khen ý tưởng không tính là cam kết.

### Bước 2: phỏng vấn sự cố gần nhất

Mỗi hướng phỏng vấn năm người. Hỏi lần gần nhất vấn đề xảy ra, hậu quả, cách xử lý, người quyết định mua và dữ liệu có sẵn. Không hỏi “bạn có dùng không”.

### Bước 3: chấm lại

Mỗi bằng chứng thật có thể thay đổi điểm. Quyền truy cập dữ liệu hoặc người mua sẵn sàng đặt cọc quan trọng hơn độ đẹp của demo.

### Bước 4: khóa một hướng

Chọn một hướng duy nhất. Viết problem statement, kiến trúc MVP, baseline, thước đo và kill criteria trước khi code.

## Câu chuyện đề xuất mạnh nhất hiện tại

> BếpCanh giúp quán cơm nhỏ quyết định số phần cần nấu cho từng ca từ dữ liệu bán, dư và hết món. Khác với hệ thống quản trị nhà hàng nặng và giải pháp dùng camera, MVP ưu tiên nhập liệu dưới ba phút, đơn vị món Việt và dự báo có khoảng bất định. Pilot đo đồng thời hàng dư và lượt hết món, rồi chỉ tính giá trị khi khoản tiết kiệm vượt phí và công nhập liệu.

Đây là câu chuyện rõ nhất vì nối công nghệ, bền vững, người mua và phép thử. Điểm yếu duy nhất mang tính quyết định là quyền tiếp cận dữ liệu quán thật.

## Sprint kiểm chứng 72 giờ cho top 3

### BếpCanh

**Mục tiêu:** kiểm tra quán có chịu ghi dữ liệu và chủ quán có đổi quyết định nấu hay không.

**Cần tìm:** một quán bán ít nhất 5 món, có người quyết định lượng nấu hiện diện mỗi ngày.

**Hỏi đúng:**

- Trong 7 ngày gần nhất, món nào bị dư hoặc hết sớm? Chi phí ước tính bao nhiêu?
- Hiện ai ghi số nấu, bán và dư? Mất bao nhiêu phút mỗi ca?
- Nếu có đề xuất số phần cho ngày mai, ai có quyền sửa?
- Quán có cho đội ghi dữ liệu 14 ngày không? Có thể xem số bán theo món không?
- Mức phí nào khiến chủ quán sẵn sàng thử có trả tiền?

**Bằng chứng phải có:** ảnh hoặc bản ghi biểu mẫu thật; cam kết ghi ít nhất 10/14 ngày; một ca chủ quán dùng đề xuất; ít nhất một lần sửa đề xuất có lý do.

**Qua cửa:** dữ liệu đủ 10 ngày, thời gian nhập dưới 3 phút/ca, chủ quán dùng đề xuất ít nhất 5 lần và chấp nhận pilot có phí nhỏ.

**Loại:** chỉ nhận lời khen; không có quyền xem số bán; hoặc chủ quán không thay đổi quyết định sau khi xem dự báo.

### CaĐầu AI

**Mục tiêu:** kiểm tra doanh nghiệp có vấn đề đào tạo cụ thể và chuyên gia có thể biến vấn đề thành rubric.

**Cần tìm:** một quản lý cửa hàng hoặc giảng viên nghề từng kèm nhân viên mới.

**Hỏi đúng:**

- Nhân viên mới thường mắc lỗi nào trong tuần đầu?
- Lỗi nào có thể mô tả thành hành động quan sát được?
- Hiện ai đóng vai luyện tập và mất bao lâu?
- Một buổi luyện tốt phải khiến người học làm được những bước nào?
- Doanh nghiệp có cho đội dùng SOP và chấm thử 10 kịch bản không?

**Bằng chứng phải có:** 10 kịch bản có người duyệt; rubric có mục đạt/chưa đạt; 5 người học thử; người hướng dẫn chấm ít nhất 3 transcript.

**Qua cửa:** chuyên gia xác nhận ít nhất 8/10 kịch bản; người hướng dẫn thấy phản hồi có ích; người học hoàn thành tốt hơn ở một tình huống mới.

**Loại:** không có người chịu trách nhiệm duyệt; rubric chỉ là điểm cảm tính; hoặc video hướng dẫn đã cho kết quả tương đương với chi phí thấp hơn.

### VòngĐờiSố

**Mục tiêu:** kiểm tra cửa hàng có chịu công khai quy trình kiểm tra và người mua có trả tiền cho bằng chứng không.

**Cần tìm:** một cửa hàng máy cũ có kỹ thuật viên và lịch sử hoàn trả/tranh chấp.

**Hỏi đúng:**

- Khách thường tranh chấp lỗi nào sau khi mua máy?
- Cửa hàng kiểm tra những gì, lưu bằng chứng ở đâu?
- Phần nào trong quy trình phụ thuộc vào lời nói của kỹ thuật viên?
- Cửa hàng có cho đội kiểm tra 10 máy bằng mẫu hồ sơ phiên bản hóa không?
- Ai sẽ trả tiền: cửa hàng hay người mua? Vì giá trị nào?

**Bằng chứng phải có:** 10 biên bản kiểm tra có thời gian và người chịu trách nhiệm; ít nhất một lỗi phát hiện mà biên bản cũ bỏ sót; người mua hiểu sự khác nhau giữa “đã đo” và “người bán khai báo”.

**Qua cửa:** kỹ thuật viên dùng mẫu mà không tăng quá 20% thời gian; cửa hàng đồng ý lưu lịch sử sửa; người mua chấp nhận trả cho một lần kiểm tra.

**Loại:** cửa hàng không cho ghi kết quả bất lợi; thiết bị không thể kiểm tra nhất quán; hoặc người mua chỉ tin bảo hành mà không trả cho hồ sơ.

## Mẫu ghi bằng chứng

Mỗi cuộc phỏng vấn ghi cùng một dòng dữ liệu: `phân khúc | sự cố gần nhất | chi phí | giải pháp hiện tại | người quyết định | dữ liệu sẵn có | cam kết tiếp theo | mức phí thử`.

Không ghi “khách hàng thích”. Ghi hành vi cụ thể: cho dữ liệu, đặt lịch, ký pilot, đặt cọc hoặc giới thiệu người có quyền mua.

## Quyết định sau sprint

- **Chọn BếpCanh** nếu có quán cam kết dữ liệu và cho phép đo dư/hết món.
- **Chọn CaĐầu AI** nếu có chuyên gia nghề và đơn vị mua đào tạo.
- **Chọn VòngĐờiSố** nếu có cửa hàng chịu trách nhiệm kết quả kiểm tra.
- **Không có cửa nào mở:** dừng code; quay lại phỏng vấn vấn đề hoặc chọn hướng mới.
