# Voucher theo vị trí và hỗ trợ ship: phân tích bổ sung
Ngày 01/11/2026. Đặc tả ứng viên và phép tính điều kiện; chưa thay website, API, dữ liệu, hoặc quy tắc giao dịch.

## Yêu cầu đã nhận và phần chưa chốt
Người dùng đề xuất mỗi tuần 2 voucher 15%, 2 voucher 10%, nhiều voucher 9k hơn; chọn vị trí nơi ở trước khi chọn voucher, ưu tiên gần rẻ/xa đắt và cân nhắc chiều đi lại. Ship dự kiến nền tảng hỗ trợ 30%, khách chịu 70%.

Người dùng đã xác nhận: 9k là giảm cố định9.000đ; khách xa được hỗ trợ nhiều hơn để bù công đi lại. Đây là hướng ưu đãi đã xác nhận, chưa phải bảng khoảng cách/mức hỗ trợ đã duyệt. Số lượng voucher9k và trần ship chưa được xác định. Số ngày/giờ reset, phạm vi ngành, khả năng cộng dồn và bên tài trợ cũng cần chốt trước công bố.

## Tính tiền: ưu đãi không đồng nghĩa lợi nhuận
Giữ ví dụ cũ: menu40.000đ, giảm nền5% => B38.000đ trước voucher; tiệm nhận28.000đ. Các chi phí ngoài voucher gồm công/lỗi/biến phí/CAC phân bổ =5.263,16đ/đơn. Đều là giả định, không phải dữ liệu pilot. Giữ CAC này chỉ khi voucher mới chưa được tính vào CAC; nếu đã tính thì loại phần trùng.

| Voucher ứng viên | Giảm | Khách trả tiền hàng | CM sau chi phí/CAC |
|---|---:|---:|---:|
| 15% của B | 5.700 | 32.300 | −963 |
| 10% của B | 3.800 | 34.200 | 937 |
| 9.000đ cố định, đã xác nhận | 9.000 | 29.000 | −4.263 |

Không thể tính điểm hòa vốn hữu hạn trên đơn có CM <=0 nếu càng bán càng tăng lỗ. Phải tính CM theo cơ cấu voucher thực sử dụng, không chỉ tính một loại có biên dương.

Nếu cơ chế mới bỏ giảm nền5% và dùng B40.000đ, giữ nguyên các giả định chi phí khác, CM15% là737đ; CM10% là2.737đ; CM9k cố định là−2.263đ. Vì vậy kết luận cần chỉ rõ voucher tính trên giá nào; không mặc định giảm nền5% được giữ hoặc bị bỏ.

9.000đ bằng 15% tại B60.000đ; bằng 10% tại B90.000đ. Dưới các ngưỡng này voucher cố định mạnh hơn. Người dùng đã xác nhận9k cố định nên không áp dụng cách hiểu9k là trần phần trăm. Voucher15% và10% vẫn cần trần riêng nếu muốn giới hạn nghĩa vụ tiền trên mỗi lượt; các trần đó chưa được chốt.

Khả năng tài trợ tối đa = max(0; B − F − C − CM_mục_tiêu + tài_trợ_bên_ngoài_đủ_điều_kiện).
Với CM mục tiêu minh họa2.000đ, không có bên ngoài tài trợ, ví dụ này chỉ còn2.736,84đ để giảm thêm. Khoản tài trợ bên ngoài chỉ ghi nhận khi rõ bên chịu tiền, điều kiện, thời điểm thu, không mặc định tiệm chịu.

Không âm thầm cắt giá trị voucher đã quảng cáo: xác định trước sản phẩm và mức chi đủ điều kiện; nếu không đủ khả năng tài trợ thì không phát voucher hoặc ghi rõ đó là chiến dịch chấp nhận lỗ có ngân sách.

## Hạn mức tuần và tổng ngân sách
Tại B38.000đ, nếu một người dùng đủ2 voucher15% và2 voucher10% thì tiền giảm là19.000đ/tuần trước voucher9k.
Nếu9k cố định và dùng thêm n lần: tổng=19.000+9.000n. Với n4, số tiền giảm là55.000đ/người/tuần; 100 người sử dụng đủ là5,5triệu/tuần. Đây là quy mô chiết khấu, chưa đồng nghĩa toàn bộ là lỗ hoặc CAC. Tiền giảm chỉ chuyển thành chi nền tảng nếu nền tảng tài trợ.

Cần ba trần riêng: tài khoản/tuần; đơn; toàn chiến dịch/tuần. Theo dõi khoản đã dùng và khoản đã giữ chỗ. Không phát nhiều voucher không bảo đảm rồi vô hiệu hóa bất ngờ. Có thể phát theo đợt nhỏ, công bố số lượng/điều kiện từ đầu.

Đề xuất một voucher tiền hàng/đơn. Không mặc định cộng voucher tự nhận với ship. Voucher ship có thể đi cùng tiền hàng chỉ khi tổng trợ giá nằm trong ngân sách và CM được tính lại. Quota là mức tối đa sử dụng, không phải cam kết mọi đơn đều đủ điều kiện.

## Khoảng cách và chiều đi lại
Bán kính nhà–tiệm là chỉ báo sơ bộ, không đo công đi vòng. Khách ở nhà và khách đang từ trường/cơ quan về có chi phí nhận khác nhau.

Đề xuất:
- Vị trí đã lưu giúp khám phá quanh nhà; cho phép lưu điểm học/làm và chọn điểm xuất phát cho lần nhận.
- Gần/thuận đường ưu tiên hiển thị; tạm thời không phát thưởng tăng tuyến tính theo số km.
- Lọc sơ bộ theo bán kính, sau đó dùng thời gian/quãng đường tuyến thực cho khả năng đến đúng khung nhận.
- Với khách khai báo hành trình s đến t, thời gian đi vòng ước tính = thời gian(s,tiệm)+thời gian(tiệm,t)−thời gian(s,t), dùng cùng giả định phương tiện/thời điểm; sai số không dùng để phạt khách.
- Theo hướng đã xác nhận, vùng xa có mục tiêu hỗ trợ lớn hơn để bù công đi lại. Công bố điều kiện vùng rõ; cùng sản phẩm vẫn hiển thị giá gốc/giá lô và ưu đãi riêng. Không hứa vùng xa luôn có giá cuối thấp hơn khi hàng/điều kiện khác nhau.
- Tính lợi ích khách sau cả lượt đi/về khi đi từ nhà, và kiểm tra ngân sách; không coi km là nguồn tiết kiệm của nền tảng. Khoảng cách xa chỉ tạo nhu cầu hỗ trợ, không tạo tiền tài trợ.

Phân biệt giá trị mặt voucher với tổng hỗ trợ theo vùng. Voucher9k đã phát có giá trị9.000đ khi đáp ứng điều kiện; không tự đổi thành6k/12k theo vị trí. Nếu thiết kế thêm trợ giá khoảng cách, phải ghi riêng khoản đó, bên tài trợ và tổng trần; chưa coi khoản cộng thêm này là chính sách được duyệt. Phương án ưu tiên là ngân sách hỗ trợ tăng theo vùng nhưng chỉ mở trên lô có đủ biên hoặc có tài trợ xác định. Không gán cố định10% cho gần,15% cho trung bình và9k cho xa: giá trị thực có thể đảo thứ tự theo giá đơn.

Đề xuất giới hạn vùng xa nhất bằng thời gian đến và khung nhận/chất lượng. Khi đi riêng từ nhà, dùng cả thời gian đi và về; khi thuận đường, dùng thời gian đi vòng tăng thêm. Ví dụ giả định20phút phát sinh, giá trị thời gian30.000đ/giờ tương đương10.000đ chi phí cơ hội, nên riêng9k chưa chắc đủ bù; đây không phải tiền mặt khách đã chi và chưa tính khoản tiết kiệm do giá lô.

Rủi ro riêng của hướng xa được hỗ trợ nhiều hơn là khai điểm xuất phát xa hơn, đặt hộ/nhận hộ và tạo hành trình giả. Địa chỉ đã lưu không chứng minh đã di chuyển. Pilot nên giới hạn chênh lệch hỗ trợ và số lượt, không trả tiền theo lịch sửGPS; đánh giá tổng chi vận hành chống lạm dụng trước khi bổ sung xác minh phức tạp. Nếu không thể kiểm chứng xuất phát với công hợp lý, không dùng sốkm tự khai làm căn cứ trả trợ giá lớn.

Google Routes mô tả tính tuyến, thời gian và khoảng cách theo các cặp điểm:
https://developers.google.com/maps/documentation/routes
Trích đoạn: Calculate travel times and distances for a matrix of routes
Phạm vi: khả năng kỹ thuật nói chung, không xác nhận độ phủ mọi phương tiện/địa điểm Hà Nội hoặc chi phí API=0.

Không yêu cầu GPS liên tục/giấy tờ nơi ở trong pilot. Địa chỉ tự nhập không chứng minh cư trú; nhận hàng bằng mã chỉ chứng minh nhận, không chứng minh đã đi từ nhà. Nếu chênh lệch ưu đãi theo địa chỉ lớn, người dùng có động cơ chọn điểm có lợi. Giữ mức chênh nhỏ, kiểm soát tốc độ đổi điểm đủ điều kiện, cho phép đổi địa chỉ hợp lệ và cơ chế xử lý nhầm; không khóa tự động chỉ vì dùng chung mạng/thiết bị.

## Ship 3:7
Gọi S là phí vận chuyển đủ điều kiện thực được báo, H=min(0,3S; trầnđơn; hạnmứccònlại), chỉ phát/hiển thị khi đã bảo đảm ngân sách. Khách trả S−H.
Nếu trần thấp hơn0,3S, khách chịu hơn70% tổng phí; thông điệp phải là hỗ trợ30%, tối đa Xđ, với định nghĩa phí đủ điều kiện rõ ràng. Phụ phí nằm ngoài hỗ trợ phải hiện trước xác nhận.

| Phí giả định | Hỗ trợ30% trước cap | Khách chịu70% |
|---|---:|---:|
| 15.000 | 4.500 | 10.500 |
| 20.000 | 6.000 | 14.000 |
| 30.000 | 9.000 | 21.000 |
| 40.000 | 12.000 | 28.000 |

CM_ship = B−voucher_tiền_hàng−F−C_ship−H. C_ship phải có công điều phối, lỗi giao, thanh toán và chi khác thực tế; phí khách trả dùng trả vận chuyển không coi là doanh thu thuần có thể giữ toàn bộ.

Tại ví dụ bữa ăn với voucher10%, nếu phí30.000 và H9.000, CM từ937 xuống−8.063đ, CHƯA cộng chi xử lý giao hàng tăng thêm. Nếu không dùng voucher tiền hàng, CM trước ship là4.737đ, vẫn xuống−4.263đ sau hỗ trợ9.000đ. Không chỉ bỏ cộng dồn là giải quyết được.

180 đơn đều nhận hỗ trợ9k tạo khoản trợ giá1,62triệu. Đây là ảnh hưởng tăng thêm chỉ khi chưa ghi trong chi phí khác, không cộng hai lần.

## Rủi ro và điều kiện pilot
| Rủi ro | Cơ chế gây hại | Cách hạn chế đề xuất |
|---|---|---|
| Biên âm, chọn voucher mạnh nhất | Quota15/10 không hạn chế9k nhiều hơn | CM theo lô và cơ cấu redemption; trần tiền, minimum basket; không dùng số voucher để thay ngân sách |
| Tự trả trợ giá cho người vốn đã mua | Voucher không tạo đơn/khách mới | So nhóm tương đồng có/không voucher; đo đóng góp tăng thêm và mua lại không voucher |
| Nhiều tài khoản, tách đơn, địa chỉ có lợi | Lách quota/cự ly | Xác thực số điện thoại, dấu hiệu bất thường, quy tắc gộp/giới hạn minh bạch, xử lý nhầm |
| Chi phí vượt dự kiến | Ship cao, mất tài xế, giao lại | Báo phí trước; cap; vùng/khung phục vụ nhỏ; chốt bên chịu chi khi lỗi |
| Mất hàng và chất lượng | Khách/tài xế đến sau hạn, hoa hư, đồ ăn bảo quản sai | Ngừng bán trước giờ cắt, tồn kho theo lô, hướng dẫn bảo quản, trách nhiệm bàn giao rõ; không giao khi ngoài điều kiện |
| Hủy/hoàn để farm voucher | Giữ hàng ảo, lạm dụng hoàn quota | Voucher giữ chỗ khi đặt, tiêu khi hoàn tất; trả quota khi tiệm/hệ thống lỗi; quy tắc khách hủy công bố trước |
| Bất mãn địa lý/quyền riêng tư | Giá cuối khác mà không hiểu, thu thập quá nhiều | Giải thích điều kiện vùng; vị trí tối thiểu; không GPS liên tục; không công khai địa chỉ nhà |
| Cạn tiền và sai đối soát | Lấy tiền tiệm bù voucher, hoàn sau đã trả tiệm | Sổ nghĩa vụ riêng; nguồn tài trợ rõ; trần chiến dịch; ngừng phát mới trước khi vượt ngân sách |
| Tồn kho/ưu đãi giả, thông đồng | Tạo đơn/giá gốc để rút hỗ trợ | Bằng chứng giá/lô, kiểm tra đơn bất thường, không gọi khuyến mãi tìm khách là xử lý hàng dư |

Pilot ưu tiên một cụm, một cơ chế tiền hàng, ship thử riêng. Tiếp tục khi CM sau trợ giá và chi phí thực đáp ứng ngưỡng đã chọn, đối soát đủ tiền, khách tiết kiệm so lựa chọn thật và giao/nhận trong điều kiện chất lượng. Sửa khi đơn tăng nhưng đóng góp tăng thêm không dương. Dừng phát ưu đãi mới khi vượt ngân sách, không bảo đảm nghĩa vụ, hoặc có sự cố chất lượng cần xử lý. Không tăng trần để che lỗ lặp lại.
