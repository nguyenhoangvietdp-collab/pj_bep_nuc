# Đặc tả Bếp Núc: ăn uống và hoa cắm nhà

Ngày01/11/2026. Đây là đặc tả để triển khai sau nghiên cứu; chưa thay code, API, DB hoặc giao dịch. Mọi nội dung mẫu bên dưới là dữ liệu minh họa, không được đưa lên như lô/đối tác thật.

## Định vị và lời hứa

Định vị: nơi tìm đồ ăn và hoa còn dùng tốt từ cửa hàng quanh khu vực, với lý do giảm, tình trạng và giờ nhận rõ ràng.

Lời hứa đề xuất: “Biết mình mua gì, vì sao giá giảm và khi nào nhận được.” Giá trị tự nhận là một lựa chọn phù hợp hành trình; khách xa có thể được hỗ trợ trong vùng đủ điều kiện. Không hứa mọi sản phẩm đều rẻ nhất hoặc mọi khoảng cách đều được bù đủ.

Nguyên tắc kể chuyện: bắt đầu bằng món hàng có thật; giải thích điều kiện dùng; đưa giá cuối và hành động cạnh nhau. Chỉ dùng câu chuyện người bán khi người bán đồng ý và có thông tin kiểm chứng. Không dựng lời tâm sự hoặc số lượng bỏ đi. Nội dung môi trường nằm sau lợi ích dùng và thông tin giao dịch.

## Hành trình và nội dung

| Bề mặt | Người dùng cần hiểu | Thành phần và hành động |
|---|---|---|
| Trang chủ | Hàng gì, vì sao giảm, mình có nhận được không | Hero, chọn khu vực, hai nhóm Đồ ăn/Hoa cắm nhà, lô đang có và khung nhận; CTA “Xem hàng có thể nhận hôm nay” |
| Khám phá | Giá nào chắc chắn và giá nào còn điều kiện | Giá lô trước voucher luôn hiện; giá sau voucher chỉ khi đã xác định đủ điều kiện. Bộ lọc nhóm hàng, giờ, ngân sách, cách nhận; nhãn gần/thuận đường là ước tính |
| Chi tiết lô | Chính xác được nhận gì và tình trạng ra sao | Bằng chứng lô, giá tham chiếu, lý do giảm, tồn, giờ nhận, bảo quản/hoa, điều kiện báo sai; CTA giữ suất sau đủ thông tin |
| Hồ sơ tiệm | Ai bán và ai chịu trách nhiệm | Thông tin tiệm thật, địa chỉ, giờ bàn giao, cách kiểm lô, lịch sử hoàn tất sau khi có dữ liệu; không dựng đánh giá hoặc nhãn “đã kiểm định” |
| Cách nhận | Tổng tiền và công di chuyển | Tự nhận/ship đủ điều kiện; điểm xuất phát, giờ đến ước tính, khoản hỗ trợ và phí cuối. Không tự bật định vị liên tục |
| Giải thích giá | Vì sao có giá này và ai tài trợ | Giá tham chiếu tương đương, giá lô, voucher tiền hàng, hỗ trợ tự nhận hoặc ship, các khoản phí và tổng phải trả |
| Voucher | Mình có lượt nào dùng được | 2lượt15%,2lượt10%/tuần theo hướng đã chốt;9k cố định với số lượt chưa chốt. Hiện điều kiện, tiền giảm thực và lý do không áp dụng |
| Kiểm tra đơn | Cam kết trước thanh toán | Thành phần/tình trạng, khung nhận, địa chỉ, bảng tiền, chính sách hủy/hoàn và đầu mối hỗ trợ |
| Sau mua | Khi nào có thể nhận, làm gì nếu sai | Mã nhận một lần, trạng thái xác nhận/nhận, hướng dẫn bảo quản, báo sai lô, theo dõi hoàn tiền |

Cho phép xem giá lô và danh mục trước khi lưu nơi ở; trước khi hiển thị và chọn voucher theo vị trí, khách chọn điểm đã lưu như yêu cầu. Nếu thiếu định tuyến, hiển thị “chưa ước tính được đường đi”, không gán0km hay tự cấp trợ giá. Đổi địa chỉ, cách nhận, số lượng hoặc lô phải tính lại ưu đãi và xác nhận thay đổi tổng tiền trước đặt.

## Nội dung mẫu để triển khai

Hero: “Cuối ngày ở tiệm. Vừa lúc bạn cần.”

Đoạn hỗ trợ: “Tìm đồ ăn và hoa cắm nhà còn dùng tốt, có thông tin tình trạng và khung nhận rõ ràng. Xem giá lô trước, rồi chọn ưu đãi phù hợp cách nhận.”

Thẻ giải thích: “Giá giảm có lý do” — “Mỗi lô ghi vì sao tiệm giảm, bạn nhận được gì và cần dùng trong điều kiện nào.”

Thẻ vai trò tiệm: “Tiệm xác nhận lô còn lại” — “Bạn xem thành phần hoặc tình trạng trước khi giữ suất. Nếu nhận sai thông tin, có quy trình báo và xử lý.” Chỉ hiển thị lời hứa sau khi quy trình thực sự vận hành.

Ví dụ đồ ăn, DỮ LIỆU MẪU: “Gói3bánh đã xác định. Còn lại từ mẻ bán hôm nay.” Trường mẫu: tên từng bánh và khối lượng; ảnh chụp lô lúc[giờ]; thành phần/dị ứng do tiệm xác nhận; bảo quản và hạn dùng theo hướng dẫn có căn cứ của tiệm; nhận[giờ bắt đầu–giờ kết thúc]. Giá các món tương đương80.000đ nếu có bằng chứng; giá lô45.000đ; voucher9.000đ nếu đủ điều kiện; tiền hàng36.000đ. Không tự thêm con số hạn dùng hoặc tuyên bố “an toàn tuyệt đối”.

Ví dụ hoa, DỮ LIỆU MẪU: “Hoa cắm nhà còn lại tại tiệm.” Trường mẫu: loại/màu; số cành dùng được; trạng thái từng phần quan trọng; ảnh đúng lô và giờ kiểm; có/không cần tỉa; gói giấy cơ bản; không phải bó thiết kế để tặng. Giá lô59.000đ chỉ là giả định trong mô hình, chưa phải giá thị trường xác nhận. Không hứa số ngày tươi nếu chưa có cam kết và điều kiện chăm được kiểm chứng.

Thông điệp hỗ trợ xa: “Hỗ trợ tự nhận cho lô này: [Xđ]. Áp dụng từ điểm đã chọn, trong vùng và khung nhận đủ điều kiện.” Không ghi “càng đi xa càng được tiền”.

Thông điệp ship: “Hỗ trợ30% phí giao đủ điều kiện, tối đa[Xđ]. Phí đã báo[Sđ], Bếp Núc hỗ trợ[Hđ], bạn trả[S−Hđ].” Phụ phí không được hỗ trợ phải hiện riêng trước xác nhận.

Empty state: “Tiệm chưa có lô phù hợp trong khung này. Bạn có thể đổi giờ hoặc theo dõi tiệm.” Không giả tạo đồng hồ hay tồn hàng để kích mua.

## Thông tin bắt buộc và nguồn chịu trách nhiệm

| Nhóm | Trường tối thiểu | Ai cung cấp/xác nhận |
|---|---|---|
| Loại ưu đãi | Hàng dư cuối phiên / khuyến mãi tiệm / tài trợ thu hút khách | Tiệm và người duyệt chương trình |
| Lô | Tên, nội dung, số lượng, giờ xác nhận tồn, lý do giảm, ảnh/giờ ảnh | Tiệm, kiểm tra xác suất bởi vận hành |
| Giá | Giá tham chiếu, bằng chứng/ngày/phạm vi so sánh, B trước voucher, F, bên tài trợ từng khoản | Tiệm xác nhận tham chiếu/F; nền tảng xác nhận hỗ trợ |
| Nhận | Địa điểm, khung nhận, thời điểm ngừng bán, cách đến, quyền nhận hộ | Tiệm và vận hành |
| Đồ ăn | Thành phần, dị ứng đã biết, thông tin còn thiếu, bảo quản và hạn dùng có căn cứ | Tiệm; không suy diễn bằng mô tả AI |
| Hoa | Loại, số cành dùng được, tình trạng, ảnh đúng lô, gói cơ bản, hướng dẫn chăm | Tiệm |
| Sai lệch | Tiêu chí báo sai, thời hạn tiếp nhận được công bố, kênh hỗ trợ, bằng chứng hợp lý, trạng thái hoàn | Nền tảng/tiệm thỏa thuận trước giao dịch |

Thông tin chất lượng trọng yếu chưa rõ thì lô không đủ điều kiện mở. Giá tham chiếu không có bằng chứng thì bỏ phần trăm tiết kiệm so menu, vẫn có thể hiển thị giá lô. Không chụp ảnh bó quà đẹp hơn lô thực để bán hoa cắm nhà.

## Quy tắc voucher và vòng đời đề xuất

Đã xác nhận:9.000đ cố định;2voucher15% và2voucher10%/tuần;9k nhiều hơn nhưng chưa chốt lượng; hỗ trợ xa nhiều hơn; ship30:70 theo phí đủ điều kiện khi chưa chạm cap.

Cần chốt trước triển khai: giữ/bỏ giảm nền5%; giá tính phần trăm; cap15/10; giá trị đơn tối thiểu; lượt9k; vùng/thời gian di chuyển; tiền hỗ trợ tự nhận; capship; ngân sách/người/chiến dịch; nguồn tài trợ; ngày reset; xử lý hủy và cộng dồn. Đề xuất tuần từ thứ Hai00:00 đến thứ Hai kế tiếp00:00, Asia/Ho_Chi_Minh; đây chưa phải lịch đã duyệt. Không thể hiện các con số chưa chốt như quyền lợi chắc chắn trên website.

Đề xuất một voucher tiền hàng/đơn. Hỗ trợ tự nhận và ship loại trừ nhau vì chỉ có một cách nhận. Cộng voucher tiền hàng với hỗ trợ nhận chỉ khi có điều kiện và ngân sách được duyệt; không mặc định có quyền cộng. Tổng giảm tiền hàng không vượt giá lô; mọi khoản tài trợ làm giảm tiền khách trả phải đi vào phép tính CM.

Vòng đời: đủ điều kiện → giữ lượt/ngân sách cùng giữ tồn → chờ thanh toán → xác nhận → hoàn tất thì tiêu lượt. Đơn hết hạn giải phóng giữ chỗ theo chính sách. Lỗi tiệm/hệ thống trả lại quyền lợi theo điều kiện đã công bố, không tự trừ lượt. Với khách hủy/no-show, phải chốt chính sách riêng; không thay chính sách pilot cũ bằng suy đoán. Chưa chốt thì chưa mở bán theo quy tắc mới.

Giá phải được xác nhận phía phục vụ giao dịch, không tin số tiền hoặc km do giao diện gửi. Đồng thời giữ tồn và giữ quota/ngân sách để hai thiết bị không dùng cùng lượt hoặc bán cùng lô. Retry thanh toán/xác nhận/hoàn tiền phải không tạo giao dịch trùng. Đơn cần lưu bản chụp giá, điều kiện và bên tài trợ tại thời điểm đặt để giải quyết tranh chấp; thay bảng ưu đãi sau đó không làm đổi đơn đã xác nhận.

Khoảng cách: điểm đã lưu để kiểm đủ điều kiện; route/time để hỗ trợ chọn cách nhận. Không dùng tọa độ nhà tự khai như bằng chứng đã di chuyển. Không yêu cầu giấy tờ cư trú hoặc GPS liên tục trong pilot. Không khóa chỉ vì chung Wi-Fi/thiết bị; có xử lý nhầm và đổi địa chỉ hợp lệ. Phạm vi lưu/xóa vị trí cần được chốt theo rà soát áp dụng trước mở bán, không tự công bố “đã tuân thủ” từ đặc tả này.

## Bản đồ thay đổi trên cấu trúc đang có

Kiểm tra mã nguồn ngày01/11/2026, không sửa. Có tuyến Next và bản static MVP dùng chung một phần component; cần kiểm cả hai khi triển khai.

| Điểm hiện có | Thay đổi cần làm ở bước triển khai |
|---|---|
| app/components/customer-home.tsx, app/page.tsx | Hero mới, hai ngành, cơ chế giá/nhận và trạng thái không có lô |
| app/meals/page.tsx, app/components/market.tsx | Danh mục hai ngành, thông tin lô, bộ lọc giờ/cách nhận; chưa buộc đổi URL công khai |
| app/meals/[id]/page.tsx, app/shops/[id]/page.tsx | Chi tiết chất lượng theo ngành, lý do giảm, bằng chứng tham chiếu, hồ sơ thật |
| app/offers/page.tsx, app/components/offers.tsx | Voucher tiền cố định và phần trăm, tuần/quota, tiền giảm thực, nguồn tài trợ |
| app/components/fulfillment-choice.tsx, app/checkout/page.tsx | Điểm đã lưu, tuyến/đi vòng, tự nhận/ship, bảng hỗ trợ và tổng tiền |
| app/orders/page.tsx, app/orders/[id]/page.tsx | Bản chụp điều kiện, giờ nhận, báo sai, trạng thái hoàn và xử lý lượt |
| app/internal/page.tsx | Tạo/xác nhận lô, bằng chứng, F, ngân sách tài trợ, đối soát nghĩa vụ |
| lib/commerce.ts | Hiện estimate giảm nền5%, DisplayVoucher chỉ rate/state/day; cần thiết kế hỗ trợ fixed/percent và tuần, không vá bằng rate giả |
| lib/routes.ts | Hiện walking trả km, thiếu thời gian/đi vòng; cần thiết kế route/time, phương tiện và fallback có ý nghĩa |
| mvp-site/app/mvp-app.tsx | Đồng bộ tuyến/tiêu đề, trạng thái ngành mới; phân biệt demo và giao dịch thật |

Các thay đổi có thể cần bổ sung hợp đồng API và mô hình dữ liệu ở giai đoạn triển khai. Đặc tả nêu nhu cầu nhưng không chọn migration hoặc chỉnh schema tại bước này. Không chỉ thay chữ “bữa ăn” thành “sản phẩm” rồi coi hoa đã được hỗ trợ đầy đủ.

## Pilot, dữ liệu và tiêu chí nghiệm thu triển khai

Sổ tối thiểu: mã lô/tiệm/ngành, số lượng đầu ca và đủ chuẩn, giá tham chiếu/F, số chào/bán/nhận, từng khoản trợ giá và bên chịu, giờ/công thao tác, lỗi/hoàn, phương án xử lý vốn có, nguồn khách, khách mới/cũ và lựa chọn thay thế. Vị trí chỉ lưu mức cần để kiểm điều kiện và tính tuyến; không đưa địa chỉ vào báo cáo công khai.

Chỉ số: CM sau trợ giá và CAC đúng kỳ; thu hồi tăng thêm của tiệm; lợi ích khách so thay thế; đúng giờ; sai lô; tiền bảo đảm đối soát; lượt dùng từng voucher và chi còn khả dụng. Mua lại phải có cửa sổ quan sát, không gán dự báo3đơn/khách thành retention. Phần mềm demo không tạo đơn vào traction.

Điều kiện tiếp tục/sửa/dừng và lịch pilot theo báo cáo chiến lược. Chấp nhận đủ trước mở giao dịch mới khi:

1. Voucher9k luôn giảm đúng9k trên đơn đủ điều kiện; phần trăm đúng B và cap, không làm tiền hàng âm.
2. Test giá đơn ngay dưới/bằng/trên60k và90k cho thấy số tiền giảm đúng, không dựa tên voucher để xếp bậc.
3. Chạm quota/ngân sách, hai phiên đồng thời, reset tuần và retry không tạo quyền lợi hoặc nghĩa vụ trùng.
4. Đổi địa chỉ/cách nhận/lô làm tính lại; thiếu route không tạo0km hoặc hỗ trợ sai.
5. Ship có cap hiển thị chính xác phần khách trả, không hứa70% khi thực tế cao hơn.
6. Lô thiếu bằng chứng trọng yếu, hết hàng hoặc quá giờ không đặt được; không giao hàng ngoài điều kiện chất lượng.
7. Sai lô/hủy/lỗi được xử lý đúng quy tắc đã chốt, lưu bản chụp điều kiện và có đối soát tiền.
8. Mobile/desktop đọc được giá cuối, khung nhận và điều kiện; bàn phím/nhãn form/thông báo lỗi hoạt động; không chỉ dùng màu để phân biệt voucher.

Đặc tả đủ để lập hạng mục triển khai; các tham số kinh doanh còn mở phải được quyết định trước khi bật giao dịch. Không có nội dung nào ở đây xác nhận website hiện đã đáp ứng các tiêu chí đó.
