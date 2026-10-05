# DễDùng Dẫn Bước

Ngày nghiên cứu: 05/10/2026. Mục tiêu: xác định hướng sản phẩm cho DễDùng trong hạng mục Silver Economy. Các kết luận về nhu cầu và mức trả tiền là giả thuyết; chưa có phỏng vấn hoặc pilot tại Việt Nam.

## Kết luận

Không nên xây một chatbot chung để “dạy người cao tuổi dùng điện thoại”. Hướng mạnh hơn là **dịch vụ onboarding số B2B2C cho một hành trình cụ thể**, kết hợp ba lớp:

1. AI hỏi lại để hiểu người dùng đang mắc ở đâu.
2. Hướng dẫn từng bước theo đúng thiết bị và phiên bản ứng dụng.
3. Chuyển sang một “người dẫn số” đồng niên hoặc hỗ trợ viên đã xác minh khi hệ thống không chắc.

Tên làm việc: **DễDùng Dẫn Bước**. Người lớn tuổi dùng miễn phí hoặc trả rất ít. Nhà cung cấp dịch vụ số trả tiền vì khách hoàn thành onboarding, giảm cuộc gọi hỗ trợ và tiếp tục sử dụng dịch vụ.

MVP không hỗ trợ mọi ứng dụng. Chọn một đối tác và một hành trình ít rủi ro, ví dụ cài đặt điện thoại mới để gọi video, tìm ảnh và đăng ký một hoạt động cộng đồng. Không xử lý ngân hàng, OTP, chuyển tiền, chẩn đoán y tế hoặc điều khiển thiết bị từ xa.

## Vì sao hướng cũ chưa đủ mạnh

Phiên bản cũ đề xuất AI đọc ảnh màn hình rồi đưa hướng dẫn. Ba vấn đề:

- Hướng dẫn tự động đã xuất hiện trong nghiên cứu và sản phẩm quốc tế. [Synapse](https://arxiv.org/abs/2209.09596) cho phép người hỗ trợ tạo tutorial đa phương thức; nghiên cứu CHI 2024 thử AR hỗ trợ người lớn tuổi khám phá ứng dụng điện thoại. [Nguồn](https://arxiv.org/abs/2402.04991)
- AI không giải quyết được mọi lỗi vì người dùng có thể mô tả thiếu, quá dài hoặc dùng sai thuật ngữ. Nghiên cứu ASSETS 2026 ghi nhận bốn dạng khó khăn: dài dòng, thiếu thông tin, quá cụ thể và quá ít chi tiết. Prompt chaining cải thiện độ chính xác của câu hỏi được diễn đạt lại trong bối cảnh nghiên cứu, nhưng nghiên cứu dùng người nói tiếng Anh và chưa chứng minh triển khai tại Việt Nam. [Nguồn](https://arxiv.org/abs/2601.10018)
- Hỗ trợ công nghệ cho người lớn tuổi mang tính liên tục và quan hệ, giống một dạng chăm sóc hơn là IT support một lần. Tổng quan 2026 gọi đây là “technology caregiving” và chỉ ra gánh nặng còn đến từ việc hệ thống số thay đổi liên tục. [Nguồn](https://arxiv.org/abs/2608.23751)

Vì vậy, phần khó không phải tạo câu trả lời. Phần khó là hiểu đúng tình trạng, giữ hướng dẫn đúng phiên bản và đặt một người đáng tin ở điểm AI không chắc.

## Bối cảnh và tín hiệu thị trường

Việt Nam đã phát động nền tảng [Bình dân học vụ số](https://www.binhdanhocvuso.gov.vn/) từ tháng 3/2025. Đây là bằng chứng về ưu tiên phổ cập kỹ năng số, không phải bằng chứng người cao tuổi sẽ mua một ứng dụng riêng.

Một nghiên cứu hỗn hợp năm 2026 tại xã Bình Minh, Đồng Nai khảo sát 135 người cao tuổi và phỏng vấn sâu 6 trường hợp; kết quả tóm tắt cho thấy nhận thức và thái độ tích cực thúc đẩy sử dụng smartphone. Phạm vi một xã không đại diện toàn quốc. [Tạp chí Khoa học Đại học Cần Thơ](https://www.vjol.info.vn/tcdaihocCanTho/vi/article/view/194417/)

Thị trường trong nước không trống. [HASU](https://hasu.vn/ve-hasu/) cung cấp nội dung sức khỏe và hoạt động xã hội; [ElderVoice](https://play.google.com/store/apps/details?id=com.eldervoice.app) dùng giọng nói tiếng Việt, nhắc thuốc và kết nối gia đình; [FACA](https://faca.vn/en/) tập trung gọi người thân đơn giản. DễDùng phải tránh trở thành một ứng dụng chăm sóc hoặc trợ lý giọng nói tương tự.

Quốc tế đã có các mô hình hỗ trợ người thật. [Candoo Tech](https://www.candootech.com/) bán hỗ trợ từ xa, bài học và tài liệu cho người lớn tuổi. [GetSetUp](https://www.getsetup.com/our-solutions/digital-onboarding) dùng người đồng niên hướng dẫn onboarding và bán cho telco, nhà sản xuất thiết bị, ngân hàng và chương trình hòa nhập số. Những mô hình này chứng minh cách vận hành tồn tại; các số liệu tác động trên website là tự báo cáo.

## Khoảng trống có thể khai thác

### Khoảng trống 1: người dùng không biết gọi tên lỗi

Một câu như “điện thoại bị mất hình” có thể là độ sáng thấp, mất mạng, ứng dụng đổi giao diện hoặc người dùng đang ở sai màn hình. Tìm kiếm và chatbot thường thất bại vì đầu vào không đủ ngữ cảnh.

DễDùng dùng câu hỏi từng bước: thiết bị gì, đang nhìn thấy gì, vừa bấm gì, mục tiêu cuối là gì. AI chỉ làm rõ vấn đề và xếp tuyến hỗ trợ; không tự nhận biết chắc chắn khi bằng chứng thiếu.

### Khoảng trống 2: tutorial nhanh lỗi thời

Hướng dẫn bằng ảnh mất giá trị khi ứng dụng cập nhật. DễDùng gắn tutorial với hệ điều hành, model thiết bị, phiên bản ứng dụng và ngày kiểm tra. Người hướng dẫn báo “giao diện đã đổi”; tutorial chuyển sang trạng thái cần duyệt.

### Khoảng trống 3: hỗ trợ gia đình thiếu cấu trúc

Con cháu thường phải đoán lỗi qua điện thoại. Họ có thể thiếu thời gian hoặc giải thích quá nhanh. DễDùng lưu lại các bước đã thành công, để lần sau người dùng tự thử trước. Nếu vẫn mắc, hệ thống chuyển cho người dẫn số với ngữ cảnh đã được làm rõ.

### Khoảng trống 4: người mua hưởng lợi khác người dùng

Người cao tuổi hưởng lợi từ việc hoàn thành tác vụ. Doanh nghiệp, bệnh viện, telco hoặc cơ quan cung cấp dịch vụ hưởng lợi khi tỷ lệ onboarding tăng và số cuộc gọi hỗ trợ giảm. Mô hình B2B2C hợp lý hơn thuê bao trực tiếp nếu pilot xác nhận giá trị này.

## Năm ứng viên hướng đi

| Ứng viên | Cơ chế | Điểm /30 | Kết luận |
|---|---|---:|---|
| AI hướng dẫn chung | Đọc ảnh màn hình rồi trả lời | 18 | Loại: cạnh tranh cao, sai phiên bản, buyer mờ |
| Tutorial gia đình tạo | Con cháu ghi thao tác mẫu để cha mẹ làm lại | 24 | Giữ như một tính năng |
| Người đồng niên dẫn số | Người lớn tuổi có kỹ năng hướng dẫn người cùng tuổi | 25 | Mạnh về tin cậy và Silver Economy |
| Onboarding số cho đối tác | Hướng dẫn một hành trình của telco, y tế hoặc dịch vụ công | 27 | Hướng kinh doanh tốt nhất |
| Remote control toàn thiết bị | Hỗ trợ viên điều khiển máy từ xa | 16 | Loại khỏi MVP vì riêng tư và rủi ro lạm dụng |

Điểm dùng sáu tiêu chí của Research Gap Claw: structural fidelity, gap closure, assumption fit, insight gain, feasibility và novelty in domain. Ngưỡng giữ là 22/30 và không tiêu chí nào dưới 3.

## Sản phẩm đề xuất

### Người dùng

- Người dùng chính: người từ khoảng 60 tuổi trở lên đã có smartphone nhưng thường cần trợ giúp cho tác vụ mới hoặc giao diện thay đổi.
- Người dùng hỗ trợ: người dẫn số đồng niên, tình nguyện viên đã đào tạo hoặc nhân viên đối tác.
- Người mua: telco, nhà bán thiết bị, phòng khám, tổ chức người cao tuổi hoặc chương trình hòa nhập số.

Không coi mọi người trên 60 tuổi là một nhóm giống nhau. Pilot cần phân tầng theo kinh nghiệm smartphone, thị lực, khả năng đọc, sống một mình và mức hỗ trợ gia đình.

### Luồng sử dụng

1. Người dùng chọn mục tiêu bằng giọng nói hoặc ba nút lớn.
2. Hệ thống hỏi 2–4 câu để xác định thiết bị, phiên bản và màn hình hiện tại.
3. Hướng dẫn hiển thị một bước mỗi lần bằng ảnh, giọng đọc và nút “đã xong”.
4. Người dùng xác nhận kết quả hoặc chụp riêng vùng màn hình được yêu cầu.
5. Khi độ chắc chắn thấp, hệ thống chuyển người dẫn số cùng lịch sử bước đã thử.
6. Sau khi hoàn thành, người dùng làm lại một phần để kiểm tra khả năng tự thực hiện.

### Kiến trúc MVP

- Web app/PWA, không yêu cầu quyền điều khiển toàn máy.
- Task graph lưu từng bước, điều kiện chuyển và lỗi thường gặp.
- Context collector hỏi thiết bị, phiên bản ứng dụng, màn hình và mục tiêu.
- Guide renderer hiển thị một bước, chữ lớn, giọng đọc và ảnh đã duyệt.
- Confidence gate chuyển người thật khi thiếu bằng chứng hoặc gặp dữ liệu nhạy cảm.
- Version registry lưu ngày kiểm tra và trạng thái tutorial.
- Support console hiển thị mục tiêu và bước đã thử, không hiển thị toàn bộ nội dung điện thoại.

AI chỉ dùng cho diễn đạt lại vấn đề, chọn tutorial phù hợp và tạo bản nháp hướng dẫn. Bản hướng dẫn đối tác phải có người duyệt.

## MVP nên thử

### Phạm vi

Chọn một câu lạc bộ người cao tuổi hoặc điểm cộng đồng; 8–12 người dùng; 2–3 người dẫn số; ba tác vụ:

- gọi video cho người thân;
- tìm và gửi một ảnh;
- đăng ký một hoạt động cộng đồng trong môi trường thử.

Không đưa OTP, tài khoản ngân hàng, thanh toán, hồ sơ y tế hoặc VNeID vào pilot đầu.

### So sánh

Ba điều kiện:

1. Tờ hướng dẫn có ảnh được thiết kế tốt.
2. DễDùng chỉ có hướng dẫn thích ứng.
3. DễDùng có hướng dẫn và chuyển người dẫn số.

### Chỉ số

- Tỷ lệ hoàn thành tác vụ mà không cần người thân.
- Số lần yêu cầu trợ giúp trên mỗi tác vụ.
- Thời gian hoàn thành.
- Tỷ lệ thực hiện lại sau 3–7 ngày.
- Số phút hỗ trợ của người dẫn số.
- Số lỗi riêng tư hoặc hướng dẫn sai phiên bản.
- Mức tự tin trước/sau bằng thang ngắn, không thay cho kết quả hành vi.

Mẫu nhỏ chỉ kiểm tra luồng, an toàn và tín hiệu. Không dùng để tuyên bố hiệu quả đại diện cho người cao tuổi Việt Nam.

### Ngưỡng qua cửa

- Ít nhất 70% hoàn thành hai trong ba tác vụ.
- Thời gian người hỗ trợ giảm so với cuộc gọi không có ngữ cảnh.
- Ít nhất một đối tác đồng ý thử hành trình onboarding riêng.
- Không có sự cố lộ OTP, tài khoản hoặc điều khiển ngoài phạm vi.
- Người dùng đồng ý thử lại, thay vì chỉ nói sản phẩm thú vị.

## Mô hình kinh doanh

### Giai đoạn đầu

Pilot do câu lạc bộ người cao tuổi, telco hoặc đơn vị dịch vụ tài trợ. Đội thu phí thiết kế một hành trình, đào tạo người dẫn số và báo cáo tỷ lệ hoàn thành.

### Giai đoạn sau

- Phí triển khai theo hành trình onboarding.
- Phí thuê bao theo số người dùng được hỗ trợ.
- Phí phiên hỗ trợ người thật vượt định mức.
- Không bán dữ liệu người cao tuổi và không chèn quảng cáo vào hướng dẫn.

Đơn vị kinh tế cần tính: doanh thu đối tác trừ công xây tutorial, cập nhật phiên bản, đào tạo người dẫn số, thời gian hỗ trợ và chi phí AI. Nếu mỗi thay đổi giao diện phải sửa thủ công toàn bộ, mô hình khó mở rộng.

## Lợi thế có thể xây

- Thư viện task graph theo phiên bản ứng dụng phổ biến tại Việt Nam.
- Dữ liệu ẩn danh về điểm người dùng thường mắc, không thu nội dung cá nhân.
- Mạng người dẫn số đồng niên đã đào tạo.
- Quy trình consent và confidence gate cho người dùng dễ tổn thương.
- Khả năng báo cho đối tác bước onboarding gây rơi nhiều nhất.

Lợi thế không nằm ở LLM. LLM có thể thay thế. Dữ liệu tác vụ, chất lượng hướng dẫn, mạng hỗ trợ và quan hệ với đối tác khó sao chép hơn.

## Rủi ro phải xử lý

- **Paternalism:** giao diện không được mặc định người lớn tuổi kém năng lực. Cho phép họ chọn nhịp và bỏ qua trợ giúp.
- **Riêng tư:** chỉ xin ảnh màn hình cần thiết; che thông tin; xóa theo thời hạn rõ.
- **Lừa đảo hỗ trợ từ xa:** người dẫn số không xin OTP, mật khẩu hoặc quyền điều khiển máy.
- **Sai phiên bản:** mọi tutorial có version, ngày duyệt và nút báo lỗi.
- **Phụ thuộc:** đo khả năng làm lại, không chỉ số lần hoàn thành có người kèm.
- **Người mua mờ:** yêu cầu đối tác cam kết pilot trước khi xây tích hợp.

## Câu chuyện dự thi

> Chuyển đổi số đang đưa nhiều tác vụ hằng ngày lên màn hình, nhưng hỗ trợ hiện nay vẫn là một cuộc gọi trong đó người dùng khó mô tả mình đang thấy gì và người thân phải đoán từ xa. DễDùng Dẫn Bước biến hỗ trợ công nghệ thành một hành trình có thể kiểm tra: AI làm rõ vấn đề, hướng dẫn theo đúng phiên bản và chuyển sang người dẫn số đồng niên khi không chắc. Đối tác trả tiền cho onboarding thành công; người lớn tuổi giữ quyền kiểm soát và học cách tự thực hiện lại.

Hạng mục phù hợp nhất là **Silver Economy**. Technology là lớp tạo giá trị, không phải câu chuyện chính. Điểm mới nằm ở người cao tuổi vừa là người dùng vừa có thể trở thành người dẫn số có trả công.

## Câu hỏi chưa trả lời

- Tác vụ nào gây đau nhất nhưng đủ an toàn để thử?
- Ai có ngân sách: telco, nhà bán thiết bị, phòng khám, hội người cao tuổi hay gia đình?
- Người dùng thích người đồng niên, con cháu hay hỗ trợ viên chuyên nghiệp?
- Ảnh màn hình có được chấp nhận không, kể cả khi che dữ liệu?
- Một tutorial tồn tại được bao lâu trước khi ứng dụng đổi giao diện?
- B2B2C có giảm chi phí hỗ trợ đủ để đối tác trả tiền không?

Không nên bắt đầu code trước khi có câu trả lời hành vi cho ba câu đầu.

## Sổ bằng chứng rút gọn

| Nguồn | Điều hỗ trợ | Giới hạn |
|---|---|---|
| Be My Eyes | Mô hình AI cộng hỗ trợ người thật có thể vận hành | Người dùng chính là người mù/thị lực yếu, không phải người cao tuổi nói chung |
| ASSETS 2026, Helping the Helper | AI hỏi lại và diễn đạt lại có thể cải thiện vấn đề hỗ trợ công nghệ | Người nói tiếng Anh; chưa có triển khai Việt Nam |
| Technology Caregiving 2026 | Hỗ trợ số có tính quan hệ, liên tục và tạo gánh nặng | Tổng quan/khung lý thuyết, không phải thử nghiệm sản phẩm |
| CHI 2024 AR study | Hướng dẫn tương tác có tiềm năng giảm tải nhận thức/vật lý | Mẫu nhỏ, AR có thể quá phức tạp cho MVP |
| GetSetUp | Peer-led onboarding và B2B2C là mô hình đang bán | Claim tác động do công ty tự công bố |
| Candoo Tech | Concierge, tài liệu và hỗ trợ từ xa cho người lớn tuổi đang tồn tại | Bối cảnh Hoa Kỳ, chi phí và niềm tin khác Việt Nam |
| Bình dân học vụ số | Việt Nam có ưu tiên chính sách về phổ cập kỹ năng số | Không phải nghiên cứu nhu cầu hay willingness-to-pay |
| Nghiên cứu Đồng Nai 2026 | Có bằng chứng địa phương về hành vi smartphone và vai trò thái độ | Một xã, 135 khảo sát và 6 phỏng vấn; chưa đại diện quốc gia |
| HASU, ElderVoice, FACA | Việt Nam đã có sản phẩm AgeTech và trợ lý số | Không xác minh doanh thu, hiệu quả hoặc quy mô sử dụng |

