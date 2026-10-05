# Điều chỉnh ý tưởng: công nghệ tạo ra giá trị cốt lõi

Cập nhật 04/10/2026 theo yêu cầu của người dùng. Bản này thay xếp hạng ban đầu trong `bao-cao-y-tuong.md`; giữ nguyên thông tin cuộc thi đã kiểm tra. Năng lực đội: một ít kinh doanh bền vững, lập trình và thiết kế.

## Quy tắc lựa chọn mới

Công nghệ phải làm được ít nhất một việc có giá trị: dự báo để quyết định tốt hơn; giảm công việc khó tự làm; đo và kiểm tra chất lượng; hoặc giúp người dùng tiếp cận công nghệ an toàn hơn. Khi tắt chức năng đó, giá trị sản phẩm phải giảm rõ rệt.

AI, IoT, thuật toán tối ưu và dữ liệu thiết bị là các lựa chọn. Không mặc định phải dùng công nghệ phức tạp nhất. So sánh với giải pháp đơn giản đủ tốt, kể cả bảng tính và quy tắc thủ công.

Các biến đổi, dữ liệu cần thu, mô hình thu tiền và phép thử dưới đây là đề xuất. Chưa có khách hàng xác nhận, pilot hay cam kết hiệu năng. Hạng mục chính đề xuất là lựa chọn của đội; ý tưởng dùng công nghệ vẫn có thể thuộc Gen Z Economy, Silver Economy hoặc Social Impact.

## 1. BếpCanh — dự báo nấu bao nhiêu để giảm dư mà vẫn đủ bán

**Thay trọng tâm của BữaChốt. Hạng mục: Technology hoặc Social Impact. Ưu tiên 1.**

Nguồn học: [Winnow](https://www.winnowsolutions.com/solutions) có sản phẩm đo thực phẩm bỏ, nhận diện bằng camera/cân và dự báo lượng sản xuất. Winnow cũng có bản nhập dữ liệu không dùng camera, nên “rẻ hơn vì không camera” chưa đủ tạo khác biệt.

**Bài toán Việt Nam đề xuất:** quán cơm nhỏ bán món thay đổi theo ngày; người bán khó nhập dữ liệu dài và có thể không dùng POS. Giả thuyết này cần kiểm tra ở quán cụ thể.

**Công nghệ cốt lõi:** dự báo lượng bán theo món và ca. Nhập số phần nấu, bán, dư và số lần khách báo hết món. Ghi ngày trong tuần, lịch trường/công ty và thời tiết nếu lấy được dữ liệu phù hợp. Hệ thống đề xuất khoảng số phần, mức bất định và cho chủ quán sửa.

MVP có thể dùng nhập giọng nói để tạo bản nháp, nhưng người dùng phải xác nhận số và đơn vị. Dự báo đầu tiên là trung bình theo thứ trong tuần hoặc mô hình thống kê đơn giản. Chỉ thêm ML nếu vượt baseline. Không cần huấn luyện computer vision từ đầu; ảnh không tự cho biết khối lượng thực phẩm.

**Điểm thích nghi:** lượng món kiểu Việt, đơn vị phần/vá/khay được chuẩn hóa riêng cho quán, lượng bán thay đổi theo lịch địa phương, giao diện rất ít thao tác. Lợi thế phải thể hiện ở công nhập liệu và quyết định tốt hơn, không chỉ đổi ngôn ngữ.

**Người mua:** chủ quán hoặc chuỗi quán nhỏ, trả phí theo điểm bán nếu chi phí thực phẩm tiết kiệm được vượt phí.

**Thử:** một hoặc hai quán, 2–3 tuần dữ liệu thật để kiểm tra luồng và nhu cầu. Với dữ liệu ngắn, chưa được tuyên bố dự báo tổng quát hay tác động nhân quả. Khi dữ liệu đủ, đánh giá theo thời gian: dự báo trên ngày chưa thấy; so với nấu theo cùng thứ tuần trước. Đo hàng dư và hết món cùng nhau. Chỉ giảm dư nhờ giảm món đến mức hết hàng thường xuyên là thất bại.

## 2. CaĐầu AI — luyện tình huống đi làm bằng AI và tiêu chí nghề cụ thể

**Phát triển từ CaĐầu Xanh. Hạng mục: Gen Z Economy. Ưu tiên 2.**

Nguồn học: [Yoodli](https://yoodli.ai/blog/yoodli-raises-40-million-series-b-to-lead-the-future-of-experiential-learning) mô phỏng hội thoại để người dùng luyện tập và nhận phản hồi; công bố Series B 40 triệu USD ngày 02/12/2025. Gọi vốn không chứng minh hiệu quả đào tạo tại Việt Nam.

**Công nghệ cốt lõi:** hội thoại đóng vai theo kịch bản; chuyển giọng nói thành văn bản khi cần; tham chiếu quy trình cửa hàng; phản hồi theo rubric do người hướng dẫn duyệt. Có bằng chứng từ câu trả lời và bước xử lý, thay vì một điểm AI khó giải thích.

**Thích nghi đề xuất:** chọn một nghề đầu tiên, như nhân viên cửa hàng hoặc quán cà phê. Tình huống gồm khách đổi yêu cầu, nhầm đơn, tranh chấp tiền cọc hộp, khách muốn đồ dùng một lần và bàn giao ca. Khách lớn tuổi/cùng tuổi cần cách xưng hô khác; hệ thống không chấm thấp chỉ vì giọng địa phương.

**Người mua:** chuỗi cửa hàng, trung tâm hướng nghiệp hoặc trường mua chương trình luyện tập. Vai trò là huấn luyện; không dùng điểm AI làm quyết định tuyển dụng tự động.

**MVP:** 10–15 kịch bản, một nghề, giao diện hội thoại chữ trước. Thêm âm thanh sau khi luồng phản hồi hoạt động. Thu quy trình từ đối tác đồng ý cung cấp, không tự bịa quy trình nghề.

**Thử:** so với video hướng dẫn và chatbot dùng prompt chung. Người hướng dẫn đánh giá buổi đóng vai thực tế trước/sau, không biết điểm AI. Đo hoàn thành các bước, lỗi xử lý và thời gian đào tạo. Lời khen “app thú vị” không đủ.

## 3. VòngĐờiSố — hồ sơ kiểm tra và sửa chữa cho thiết bị cũ

**Thay BànQuen trong danh sách ưu tiên. Hạng mục: Technology hoặc Social Impact. Ưu tiên 3.**

Nguồn học: [Fairphone](https://www.fairphone.com/the-one-that-lasts) phát triển thiết bị dễ sửa và hỗ trợ sử dụng lâu. Đây là cảm hứng về kéo dài vòng đời; không phải bằng chứng về hiệu quả một sàn kiểm định máy cũ.

**Công nghệ cốt lõi:** hồ sơ thiết bị có các bài kiểm tra chuẩn, dấu thời gian, lịch sử sửa, linh kiện thay và bằng chứng. Người mua nhìn thấy cái gì đã kiểm tra, ai kiểm tra và phần nào chưa thể xác minh.

**Thích nghi đề xuất:** người mua điện thoại cũ cần phân biệt công bố của người bán với kết quả kiểm tra. Dịch vụ kết nối một cửa hàng sửa có chuyên môn, chuẩn hóa biên bản rồi cập nhật hồ sơ sau sửa chữa. Không mặc định blockchain; một cơ sở dữ liệu có nhật ký chỉnh sửa và trách nhiệm rõ là đủ cho MVP.

**Giới hạn kỹ thuật:** trình duyệt không đọc được mọi chỉ số phần cứng trên mọi điện thoại. Bắt đầu một nhóm Android, kết hợp thao tác người dùng và thiết bị/công cụ của đối tác. Ghi rõ điều kiện từng bài kiểm tra. Hồ sơ không bảo đảm tất cả linh kiện là nguyên bản.

**Người mua:** cửa hàng bán máy cũ trả phí kiểm tra/hồ sơ; người mua có thể mua dịch vụ kiểm tra riêng. Tránh để người trả tiền được sửa kết quả bất lợi mà không có dấu vết.

**Thử:** 10–20 máy, một đối tác sửa chữa. So với biên bản kiểm tra thông thường, đo thời gian, lỗi phát hiện và mức sẵn sàng trả. Kiểm tra điện thoại cần sự đồng ý; không thu ảnh, chat hoặc tài khoản cá nhân. Không tự quy đổi số máy sửa thành CO2 giảm được.

## 4. HộpVòng Smart — tối ưu tồn hộp và lịch thu hồi

**Nâng cấp HộpVòng. Hạng mục: Social Impact hoặc Technology.**

Học cơ chế theo dõi vòng quay từ Vytal, nguồn đã kiểm tra trong báo cáo gốc. Công nghệ đề xuất là mô hình trạng thái hộp và đề xuất điều phối theo tồn ở quầy, hộp bẩn ở điểm trả, nhu cầu ngày mai và sức chứa điểm rửa.

QR chỉ là đầu vào. Giá trị kỹ thuật là quyết định hôm nay phải đưa bao nhiêu hộp sạch đến đâu, thu ở đâu trước và mức dự trữ phù hợp. MVP gồm 3 điểm, ghi giao dịch quét rồi so lịch thu cố định với lịch đề xuất. Không cần thuật toán tuyến đường phức tạp nếu một quy tắc tồn tối thiểu đã đủ.

Người mua là đơn vị quản lý cụm. Đo thiếu hộp, số chuyến, công thu và chi phí/lượt; vẫn phải kiểm tra vệ sinh riêng. Nhiều lượt quét không chứng minh lợi ích môi trường.

## 5. DễDùng — giúp người cao tuổi thực hiện việc số bằng từng bước dễ hiểu

**Chuyển trọng tâm NhàCóNhau sang tiếp cận công nghệ. Hạng mục: Silver Economy.**

Nguồn học: [Be My Eyes](https://www.bemyeyes.com/) kết hợp hỗ trợ con người và AI thị giác cho người mù/thị lực yếu. Chuyển sang hỗ trợ người cao tuổi là giả thuyết mới; không đồng nhất hai nhóm hoặc giả định hiệu quả tự chuyển sang.

Công nghệ đề xuất: tài liệu từng bước theo màn hình và phiên bản ứng dụng, nhận dạng ảnh màn hình được người dùng chủ động chọn, đọc hướng dẫn bằng tiếng Việt, chuyển cho người thân khi không chắc. Điểm thích nghi cần thử là cỡ chữ, từ ngữ, số bước và quyền tự chủ của người dùng.

MVP dùng môi trường mô phỏng an toàn: gọi video, tìm lại ảnh, đặt lịch đơn giản. Không cần quyền truy cập toàn máy. Loại thao tác OTP, ngân hàng và giao dịch khỏi MVP; ảnh màn hình có thông tin nhạy cảm cần loại bỏ trước xử lý.

Người mua có thể là con cái hoặc đơn vị cung cấp dịch vụ muốn giảm công hỗ trợ. Đo tỷ lệ tự hoàn thành việc và số lần cần người giúp, so với một tờ hướng dẫn có hình. Nếu AI không tốt hơn hướng dẫn thiết kế tốt, giữ giải pháp đơn giản.

## 6. KýỨcNhà AI — biên tập ký ức có thể kiểm tra lại nguồn

**Nâng cấp KýỨcNhà. Hạng mục: Silver Economy.**

Nguồn học Remento đã kiểm tra trong báo cáo gốc. Công nghệ cốt lõi đề xuất gồm nhận dạng tiếng nói, phân biệt người kể, trích tên/mốc thời gian, liên kết mỗi đoạn biên tập về âm thanh gốc và giao diện sửa.

Điểm cần thử ở Việt Nam: cách xưng hô họ hàng, lời kể địa phương, tên riêng và sự kiện nhiều người nhớ khác nhau. Đánh dấu tên/mốc không chắc để gia đình duyệt. Không tự tổng hợp hai phiên bản mâu thuẫn thành một câu chuyện chắc chắn.

MVP 5 gia đình. Người mua là người con. Đo lỗi tên/ngày tháng, phút biên tập mỗi chương và đặt cọc thật. So với dịch vụ phiên âm và biên tập thủ công. Không hứa sản phẩm mới chỉ vì có AI hoặc sách QR.

## 7. TinNhà Lab — tập nhận diện lừa đảo công nghệ trong môi trường mô phỏng

**Thu hẹp TinNhà để đội có thể thử an toàn và kiểm soát. Hạng mục: Technology.**

Học các lớp đánh giá nội dung và can thiệp từ Scamnetic; nguồn trong báo cáo gốc. MVP chuyển từ bảo vệ giao dịch trực tiếp sang bài tập tương tác: tuyển dụng giả, QR giả, mạo danh người quen và gây áp lực chuyển tiền. Các tình huống phải có nhãn mô phỏng; không gửi lừa đảo thật cho người tham gia.

Công nghệ tạo biến thể kịch bản, ghi quyết định và giải thích dấu hiệu. Hệ thống chấm hành động xác minh theo đáp án có người duyệt. Không hứa phát hiện deepfake hoặc biết nội dung thật/giả chỉ từ AI.

Người mua có thể là trường hoặc doanh nghiệp tổ chức đào tạo. So với đọc checklist cảnh báo; đo người dùng chọn hành động phù hợp ở tình huống mới. Khi có kết quả, mới nghiên cứu hướng kiểm tra nội dung thật. Cạnh tranh với đào tạo miễn phí và nTrust cần nêu rõ.

## 8. MátTrọ Monitor — đo và chọn giải pháp chống nóng bằng cảm biến

**Đổi MátTrọ sang trọng tâm dữ liệu và quyết định. Hạng mục: Technology.**

Học giải pháp vật liệu từ i2Cool và so với vật liệu sẵn có trong nước; nguồn đã kiểm tra. Công nghệ đề xuất là cảm biến nhiệt độ/độ ẩm, dữ liệu thời tiết, dashboard và so sánh phương án cải tạo. Phần thi công cần đối tác.

MVP không nghiên cứu sơn mới: 4 cảm biến cho phòng thử, phòng đối chứng và ngoài trời theo thiết kế phù hợp. Ghi trạng thái cửa, quạt/máy lạnh; tránh kết luận từ một ngày đo. Một chuỗi số đo trước/sau không đủ để tách tác động thời tiết.

Người mua là chủ nhà hoặc đơn vị quản lý chỗ ở. Đo lợi ích thực trong phòng, độ tin cậy cảm biến, công khảo sát và sẵn sàng trả. Không đo được điện thì không tuyên bố phần trăm tiết kiệm điện.

## Xếp hạng cho đội hiện tại

| Ưu tiên | Hướng | Vì sao | Điều kiện để theo |
|---|---|---|---|
| 1 | BếpCanh | Bền vững có số đo; code vừa sức; người mua rõ | Có quán đồng ý ghi dữ liệu |
| 2 | CaĐầu AI | Dễ trình diễn; ít phần cứng; thiết kế tương tác quan trọng | Có đối tác cung cấp kịch bản và người đánh giá |
| 3 | VòngĐờiSố | Chủ đề công nghệ và tuần hoàn gắn trực tiếp | Có cửa hàng sửa/kiểm tra đáng tin |
| 4 | HộpVòng Smart | Thuật toán có thể giảm chi phí vận hành | Có điểm cấp/trả/rửa thật |
| 5 | KýỨcNhà AI | Có thể làm mẫu sớm | Khách trả tiền và chi phí biên tập hợp lý |
| 6 | TinNhà Lab | Bài toán công nghệ xã hội rõ | Chuyên gia duyệt tình huống và đầu ra |
| 7 | DễDùng | Thiết kế tiếp cận là trọng tâm | Có người dùng lớn tuổi và hỗ trợ phù hợp |
| 8 | MátTrọ Monitor | Dữ liệu và phần cứng rõ | Có đối tác kỹ thuật và phòng thử |

Xếp hạng là nhận định theo năng lực, chưa phải điểm thị trường hay điểm cuộc thi. Có đối tác tốt có thể thay đổi thứ tự.

## Bằng chứng cần cho một bài dự thi có trọng tâm công nghệ

1. Một quyết định trước đây khó làm, sản phẩm giúp làm tốt hơn.
2. Luồng dữ liệu: lấy từ ai, có được phép dùng không, chất lượng thế nào.
3. Demo một ca từ đầu vào tới hành động, có hiển thị trường hợp không chắc.
4. So sánh với baseline đơn giản và sản phẩm gần giống.
5. Số đo kỹ thuật cùng kết quả người dùng: dự báo tốt nhưng người bán không dùng vẫn chưa đạt.
6. Chi phí chạy và người mua; không chỉ chi phí viết code.

Với BếpCanh, bộ demo đủ rõ là dữ liệu một quán, dự báo ngày tiếp theo, chủ quán sửa đề xuất và kết quả bán/dư thực tế. Với CaĐầu AI, là một tình huống khách khó, hội thoại, phản hồi có dẫn chứng và đánh giá của người hướng dẫn.
