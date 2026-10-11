# Phản biện và phát triển proposal Bếp Núc

Ngày rà soát: 05/10/2026, giờ Việt Nam. Đầu vào là proposal tiếng Anh người dùng gửi, chưa có dữ liệu fieldwork. Bản chỉnh riêng: [proposal-revised-en.md](proposal-revised-en.md). Không sửa attachment gốc.

## Kết luận

Giữ marketplace sinh viên, bộ ba voucher 7%–10%–20%, một voucher mỗi đơn, giảm nền 5%, giá đối soát riêng và thưởng pickup có trần. Cần tăng sức thuyết phục bằng **bằng chứng giao dịch và ràng buộc kinh tế thực**, thay vì gọi sự kết hợp tính năng là hoàn toàn mới. Hướng nghiên cứu mạnh nhất là: khi nào khoản thưởng tự nhận làm tăng pickup và giá trị thu hồi đủ để bù giảm tiền trên những đơn vốn đã mua?

Proposal có đủ nhiều mục cuộc thi yêu cầu, nhưng có lỗi số và vài khẳng định chưa có nguồn. Quan trọng nhất: ví dụ đơn 100.000 đồng có thể chạy, còn cùng chính sách ở đơn 30.000 đồng loại luôn voucher 20%. Vì thế bước đầu là xác định vùng khả thi giá–payout–chi phí ở cụm trường, rồi mới thử phản ứng của sinh viên.

## 1. Những chỗ sửa trong proposal

| Mục đầu vào | Vấn đề | Cách sửa trong bản tiếng Anh |
|---|---|---|
| Team information: 11:59 PM | Trang chính thức xác nhận 27/10/2026; trong nội dung đọc lại không thấy giờ chốt | Bỏ khẳng định 23:59; ghi cần xác nhận giờ và nộp sớm |
| Problem: shop almost always has leftovers | Không có khảo sát/quan sát chứng minh tần suất | Đổi thành giả thuyết về một nhóm quán có surplus lặp lại; đo từng ca |
| Current options: none gives predictable payout | Không thể loại bỏ giảm tại quầy, bán trực tiếp hay thỏa thuận khác | So baseline hiện có của từng quán, không khẳng định toàn ngành |
| Students decide price-first; all within walking distance | Chưa có dữ liệu phân khúc, lộ trình, thời gian hay tin cậy | So giá cuối, thời gian nhận, chất lượng, khẩu vị và phương án thường dùng |
| Existing alternatives | Thiếu cạnh tranh nội địa | Thêm CrumbUp và ResQ; chỉ xác nhận offering, không suy số đơn/doanh thu |
| Guarantee shop payout | Dễ hiểu thành bảo đảm doanh thu dù không bán, hoàn tiền hoặc sai hàng | Khoản đối soát áp dụng cho giao dịch hợp lệ theo hợp đồng; không hứa mọi hàng đều bán |
| Impact: up to about 26% | Nhầm voucher trên giá 95.000 với tổng giảm trên 100.000 | Trần v≈26,316% cho giá cuối 70.000, tổng giảm 30% |
| Worked example | Đơn 100.000 che vấn đề chi phí cố định ở đơn nhỏ | Thêm sensitivity 30.000/50.000/100.000, không gọi chúng là mức giá phổ biến đã đo |
| Stacking beyond any shop's payout | Không đúng với mọi hợp đồng F; chỉ đúng ví dụ F=65%P | Giữ quy tắc không cộng dồn, bỏ khái quát “mọi cửa hàng” |
| Net share shop accepts | Giá sàn tối thiểu không tự động là hợp đồng bán buôn fixed payout | Thỏa thuận rõ fixed settlement hoặc commission, quyền giữ chênh lệch và hoàn tiền |
| Margin every completed pickup | C và m ước lượng không bảo đảm lợi nhuận tổng thể | Phân biệt contribution với lợi nhuận sau CAC, nhân sự, fixed cost và giao dịch thất bại |
| Stakeholder map | Có mô tả nhưng chưa có bản đồ vai trò/quyền ảnh hưởng | Thêm bảng influence/interest/engagement với nhãn nhận định ban đầu |
| Survey threshold | Ý định pickup không phải pickup thực và discount task dễ bị anchoring | Hỏi hành vi gần nhất trước; cho final price/time, thứ tự tình huống ngẫu nhiên |
| Bonus gate | “Tăng đủ pickup bù chi phí” thiếu cách tính và bị stock interference | So contribution mỗi opportunity, ghi exposure/tồn; phân bổ theo block khi cần |
| Distance fraud | Fixed route + QR không xác minh xuất phát hoặc phương tiện thật | Tách xác minh origin, dự đoán tuyến và xác nhận handover; có cap và fallback |
| Success criteria | “Acceptable” chưa có ngưỡng; n≈70 không chứng minh causal lift | Đăng ký ngưỡng theo baseline trước pilot; báo uncertainty, không hứa significance |

Ngày chốt, email, tiếng Anh, yêu cầu >2 trang và video tùy chọn <10 phút được kiểm tra lại trên [trang cuộc thi](https://swinbizrockstar.swin.edu.vn/2026) qua trình duyệt ngày 05/10. PDF guideline/rubric đầy đủ không được xác minh lại trong lần này; không tự tạo trọng số chấm.

## 2. Kiểm tra toán và dòng tiền

P: giá gốc; Q=0,95P: giá trước voucher; F: khoản đối soát thực nhận đã ký; C: chi phí biến đổi/đơn; m: contribution tối thiểu. Các ví dụ dùng F=0,65P, C=3.000, m=2.000, tất cả là giả định.

`v_max = 1 - (F+C+m)/Q`

| P giả định | F giả định | Trần voucher trên Q | 20% có dùng được? | Giá cuối tại trần | Tổng giảm so với P |
|---|---:|---:|---|---:|---:|
| 30.000 | 19.500 | 14,035% | Không | 24.500 | 18,333% |
| 50.000 | 32.500 | 21,053% | Có | 37.500 | 25% |
| 100.000 | 65.000 | 26,316% | Có | 70.000 | 30% |

Nếu muốn voucher 20% dùng cho P=30.000 khi b=5%, C+m=5.000, thì F phải ≤17.800, tức ≤59,333%P. Hoặc phải giảm C+m, có nguồn tài trợ rõ hoặc thay basket; không thể đồng thời giữ mọi tham số và nói engine tự giải được mâu thuẫn. Không dùng bundle lớn để ép sinh viên mua quá nhu cầu.

Thưởng 7% → 15% làm tiết kiệm thêm 0,95P×0,08: **2.280 đồng** ở P=30.000, **7.600 đồng** ở P=100.000. Chỉ có khách mới cho biết mức đó đáng đi 1 km hay không. “Bù công sức đi nhận” là giả thuyết, không phải hệ số đã có bằng chứng.

Trong ví dụ P=100.000, voucher 20% có M=8.000. Sau bonus bị cap ở giá cuối 70.000, M=2.000. Bỏ qua khác biệt offer cost, bonus phải làm xác suất pickup cao hơn **4 lần** để contribution kỳ vọng lớn hơn. Nếu control đã pickup trên 25%, điều kiện này không thể đạt. Khi đó chỉ có thể chọn bonus vì một mục tiêu khác với ngân sách rõ, chứ không gọi nó là cải thiện lợi nhuận đơn.

Chỉ số đúng để so policy: `E[contribution | policy bonus] − E[contribution | control]` trên mọi opportunity đủ điều kiện đã phân bổ. Phải tính mất contribution do giảm giá cho khách vốn đã mua, chi phí thông báo/maps trước mua, no-show và refund; không chỉ lấy số đơn tăng nhân biên đơn.

## 3. Ràng buộc hard, soft và hidden

| Loại | Ràng buộc | Dữ kiện / trạng thái | Khi nào có thể đổi? |
|---|---|---|---|
| Hard theo thiết kế người dùng | Ba voucher mỗi tối, một voucher mỗi đơn | Đã xác nhận trong hội thoại | Chỉ khi người dùng chọn đổi; pilot không âm thầm chuyển thành một voucher |
| Hard sau ký hợp đồng | F thực nhận, đối soát/refund, stock thật | Mới có số ví dụ, chưa có hợp đồng | Thỏa thuận lại với quán trước phát hành offer |
| Hard vận hành | An toàn thực phẩm, không bán quá tồn, giá khách thấy trước thanh toán | Điều kiện thực thi | Không nới bằng ML hay bằng cap tài chính |
| Soft | b=5%, 8 điểm/km, d_cap, m | Proposal gọi là tham số thử | Có dữ liệu costs/choice/pickup và quyết định chính sách công khai |
| Hidden | Chi phí cơ hội thời gian của khách, trust, outside option | Chưa đo | Discovery + choice tasks + pickup thực |
| Hidden | Shop lo ăn mòn giá thường, withholding và công sản xuất thêm | Chưa đo | Quan sát trước/sau; sản lượng và regular sales; không suy từ payout riêng |
| Hidden | Khách chờ voucher 20%, khách mua dư, location gaming | Mới là failure mode | Theo dõi mix/consumption; điều kiện rõ; không quảng cáo đã chặn được hoàn toàn |
| Hidden | Stock interference, learning carryover giữa ca | Không xử lý được bằng ngẫu nhiên cá nhân đơn thuần | Thiết kế block/cluster phù hợp, đo availability và carryover |

## 4. Ba hướng tiếp cận toàn diện từ chuyển giao cấu trúc

### A. Vùng giá khả thi và ngân sách thưởng thận trọng — làm ngay

**Nguồn phương pháp:** constrained optimization / quản trị rủi ro ngân sách, từ coupon allocation và portfolio allocation. Uehara và cộng sự có thử số trên dữ liệu coupon ngẫu nhiên; bài nêu dynamic allocation là hướng mở của chính mô hình đó, không chứng minh cả lĩnh vực chưa làm. [Bài gốc](https://arxiv.org/html/2405.12865v1)

**Chuyển giao:** mỗi SKU×quán×ca là một vùng offer khả thi. Tính trần từ F, chi phí ước lượng thận trọng và m trước khi hiển thị voucher; giới hạn ngân sách bonus cấp ca/ngày. Cost sheet có low/base/high, quyết định theo cost scenario đã chọn, rồi so với actual. Không tự dùng robust solver khi bảng luật đủ.

**Dự đoán H1:** một phần món giá thấp bị loại voucher 20% do cost/order chứ không do quãng đường; giảm thao tác/chăm sóc và ghép pickup hợp lý có thể mở vùng này mà không ép F xuống. E1 kiểm tra sensitivity trên dữ liệu thật và tỷ lệ món đủ điều kiện từng voucher. Bác bỏ giả thuyết “triển khai đủ ba voucher cho món mục tiêu” nếu gần như toàn bộ món pilot không dùng được 20% hoặc chỉ đủ khi được tài trợ liên tục.

**Điểm gãy:** cost không ổn định; quán không đồng ý fixed settlement; người mua chỉ dùng voucher20; giả định tài chính không phản ánh refund. Lợi thế: cơ chế báo giá/đối soát tin cậy và ưu đãi có thật. Không phải thuật toán mới.

### B. Thưởng công sức dựa trên tác động tăng thêm — sau pilot vận hành

**Nguồn phương pháp:** causal uplift từ promotion recommendation. Bài Booking.com đặt ràng buộc ROI và có RCT; giả định tại mục 2 là không có doanh thu/chi phí khi không purchase. Bếp Núc có thể phát sinh maps/notification/support trước pickup, nên cần bổ sung offer-level costs. [Bài gốc](https://arxiv.org/html/2008.06293v2)

**Chuyển giao:** tất cả vẫn có ba voucher; treatment là bonus rule được randomize, không phải voucher khách tự chọn. Outcome chính là incremental contribution/opportunity; secondary là pickup rate và lượng hàng thực nhận. Học nhóm khoảng cách×thời gian nhận×mức giá trước, không dùng outcome sau pickup làm feature. Baseline khôngbonus và bảng luật tuyến; ML chỉ nâng cấp nếu online holdout tốt hơn.

**Dự đoán H2:** thưởng thêm có lợi nhất ở khách nằm gần ngưỡng chấp nhận, không nhất thiết ở khách xa nhất. E2 so bonus policy với control, báo cả pickup và contribution; falsify commercial claim nếu pickup tăng nhưng contribution giảm ngoài ngân sách hoặc nếu confidence interval quá rộng để kết luận. Không dùng kết quả khảo sát willingness làm causal evidence.

**Điểm gãy:** self-selection voucher, GPS không đáng tin, nhóm nhỏ, giới hạn tồn làm treatment giành hàng từ control. Điểm khác biệt có thể tích lũy: dữ liệu offer→pickup thực và chính sách giải thích được, không phải “AI định giá” chung chung.

### C. Thử nghiệm theo cụm và giữ tác động toàn hệ thống — lộ trình nghiên cứu

**Nguồn phương pháp:** marketplace interference từ thí nghiệm nền tảng chia sẻ, và switchback theo thời gian. Một field meta-experiment cho thấy design cá nhân và cluster có thể cho kết quả khác nhau; switchback phải xét carryover. [Holtz và cộng sự](https://arxiv.org/abs/2004.12489), [Bojinov và cộng sự](https://arxiv.org/abs/2009.00148)

**Chuyển giao:** món ít, khách chung cửa hàng: treat một khách có thể làm người khác hết hàng. Chọn block cửa hàng×ca hoặc các cụm khách/stock tách biệt, cân bằng ngày trong tuần. Nếu cùng khách đi nhiều quán, các quán không phải cluster độc lập; một cụm trường thử toàncluster theo ca cần nhiều ca và điều chỉnh carryover, không xem nhiều đơn trong một ca là nhiều đơn vị ngẫu nhiên độc lập.

**Dự đoán H3:** lift pickup tính riêng treatment có thể lớn hơn lift toàn cụm vì chuyển cầu thay vì tạo cầu. E3 kiểm tra tổng orders/ca, food leftover, regular sales và log availability. Không có bằng chứng giảm waste ròng nếu chỉ có “nhiều mã QR scan hơn”. Theo dõi tự nguyện food eaten/discarded sau nhận và xu hướng sản lượng; nhãn “rescued meals” chỉ dùng khi có định nghĩa baseline.

**Điểm gãy:** 3–5 quán và ít ca quá nhỏ cho cluster inference; hành vi chờ ưu đãi gây carryover; production thay đổi. Thí nghiệm ngắn chỉ chứng minh vận hành. Dữ liệu survey70 không thay thế số cluster/ca cần thiết.

## 5. Problem Signature và research gap

Signature và ánh xạ ở [problem_signature.md](problem_signature.md), [structural_mapping.csv](structural_mapping.csv). Chuỗi quan sát–gap–method–hypothesis–experiment ở [research_trace.csv](research_trace.csv).

**Gap ứng dụng có thể bảo vệ:** chưa có dữ liệu của đội về khả năng dung hòa thời gian/giá khách chấp nhận, net settlement quán và đóng góp nền tảng trong cụm campus đã chọn. Có thể kiểm chứng bonus policy trong vùng khả thi đó. Đây là gap dữ liệu/thiết kế triển khai của dự án, không phải tuyên bố rằng chưa ai từng nghiên cứu voucher, dự trữ giá, uplift hay surplus food.

Một nghiên cứu surplus clearance đã mô hình hóa cả store waste và consumer waste, đồng thời để mô hình stockpiling động chi tiết cho nghiên cứu tiếp theo. Bếp Núc lấy đây làm lý do đo consumption sau nhận; không coi khuyến mãi mặc nhiên giảm tổng lãng phí. [Yang và Yu, 2025, §5.5](https://pubsonline.informs.org/doi/10.1287/mnsc.2023.03001)

**Janusian trade-off:** muốn rẻ hơn cho sinh viên nhưng vẫn đủ payout và tiền vận hành; muốn thưởng effort nhưng không khuyến khích quãng đường vô ích; muốn bán hết nhưng không làm thêm và chuyển waste từ quán sang người mua. Trần + pilot giải thích được từng trade-off, không tuyên bố loại bỏ chúng.

**Why now:** chưa có bằng chứng về một công nghệ mới trong 6–18 tháng làm ý tưởng chỉ nay mới khả thi. Có nghiên cứu liên quan gần đây và dịch vụ sẵn có; đây là điều kiện thuận lợi, không đủ tạo novelty. Nguồn 2026 về commission tìm được chỉ đọc snippet/không mở toàn văn, nên không dùng để kết luận. Chủ đề dynamic coupon đã có các bài khác: không gọi future direction năm2024 là gap mới toàn lĩnh vực.

## 6. Gate 3–5 và mức rigor

| Gate | Kết quả audit hiện tại |
|---|---|
| 3: Signature bỏ danh từ ngành và giữ cơ chế | Tài liệu đã có signature trung lập; chưa được chuyên gia lĩnh vực nguồn xác nhận, nên chưa coi gate đạt độc lập |
| 4: ≥1 bằng chứng method và domain chỉ 0–2 bài | Có bằng chứng nguồn; novelty/domain breadth chưa được chứng minh. Uplift/coupon đã có nhiều công trình; gate novelty học thuật chưa đạt |
| 5: mapping, fit, simplicity và novelty | Mapping cụ thể đã viết; fit còn phụ thuộc dữ liệu quán/khách. Không chấm số tự tạo để tuyên bố đạt22/30; chưa đạt nghiệm thu học thuật |

Vì người dùng đang phát triển proposal kinh doanh, bộ hồ sơ cung cấp cải tiến ứng dụng và thiết kế kiểm chứng, không quảng cáo đề tài đã đạt gate nghiên cứu công bố. Không triển khai ResearchClaw hay huấn luyện model trong lần này.

## 7. Khảo sát và phỏng vấn cần thay đổi

Survey sinh viên (~70 mục tiêu): hỏi bữa gần nhất ở đâu, món gì, giá cuối/ship và giờ; tiếp theo là lựa chọn giữa offer có món/portion rõ và phương án thực họ đang dùng. Mỗi scenario hiển thị giá final, số đồng tiết kiệm, phút/quãng đường và giờ nhận; thay đổi thứ tự. Không chỉ hỏi “giảm10/20/30/40% bạn có mua không”, dễ nhầm voucher với totaldiscount và ép câu trả lời.

Đo cụ thể: choice cuối, vì sao từ chối, thời gian sẵn sàng dành, trust/ingredient nhu cầu, có tủ lạnh/định dùng ngay hay mua dư. Không thu địa chỉ nhà/thẻ sinh viên đầy đủ cho survey nếu không cần. Survey convenience qua các group không đại diện toàn bộ sinh viên; báo sample và recruiting limits, không gắn margin-of-error population giả.

Shop interviews 10–20 mục tiêu: quan sát nhiều ca; ghi SKU/portion dư có thể bán, finalprice thường, baseline recovery, sốphút staff, điều kiện bảo quản, cutoff, ai xử lý no-show, Fnet theoSKU, khả năng chấp nhận giữspread. Chốt văn bản 3–5partnerpilot trước khi phát hành offer. Nếu không tìm được quán có nguồn hàng đều, sửa phân khúc hoặc dừng pilot chứ không làm thêm đồ “surplus”.

Đăng ký tiêu chí trước: sản lượng dư tối thiểu phù hợp quán; tỷ lệ listing dùng20%; minnet settlement; thời gian staff; completedpickup; contribution; repeat; wastebaseline. Mốc50/80/30% không tự chọn chỉ vì dễ báo đẹp; dùng baseline và business target có giải thích.

## 8. Giới hạn tìm kiếm và kiểm tra

Đã mở nguồn chính thức cuộc thi bằng browser, các trang sản phẩm, toàn HTML ba bài (surplus clearance, coupon robust allocation, uplift promotion), và abstract hai bài marketplace/switchback. Đây là khảo sát có mục tiêu, không systematic review, không nghiên cứu tính mới toàn cầu, không tư vấn pháp lý hoặc kiểm toán dữ liệu công ty. Paper versions và nhóm độc lập ghi trong [evidence/papers.jsonl](evidence/papers.jsonl); assumptions/future directions có locator trong [evidence/limitations.jsonl](evidence/limitations.jsonl).

Rà soát D1–D6: bằng chứng khách hàng chưa có; causal outcome đã xác định; scope một campus giữ được; tính tiền đã sửa và có sensitivity; exploration có baseline/ba transfer nhưng novelty chưa qua gate; design experiment còn phụ thuộc supply/cluster số thật. Đây là tự review, chưa có phản biện độc lập.

Mã [verify-proposal-math.cjs](verify-proposal-math.cjs) kiểm tra các điểm sửa và ghi [math-audit.json](math-audit.json). Mã đã có từ lượt trước kiểm tra252case được chạy lại; chúng xác nhận phép tính, không chứng minh demand, ML hoặc impact.

**Bước ưu tiên:** lấy menu và net settlement thực của vài quán, rồi kiểm tra đơn giá thấp có dùng20% được không. Khi vùng giá khả thi tồn tại mới có lý do đầu tư vào bonus/ML.
