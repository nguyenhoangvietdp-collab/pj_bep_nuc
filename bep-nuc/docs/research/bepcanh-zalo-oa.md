# BếpCanh qua Zalo OA

Ngày rà soát: 05/10/2026.

## Kết luận điều hành

Zalo OA **khả thi cho MVP BếpCanh**, nếu dùng OA như giao diện hội thoại để nhân viên quán ghi số liệu và nhận lại đề xuất khi họ chủ động tương tác. Cách này hợp thói quen nhắn tin và tránh cài thêm ứng dụng.

Không nên đặt sản phẩm vào mô hình gửi dự báo chủ động mỗi ngày qua OA. Tin Tư vấn qua OpenAPI chỉ gửi được trong 7 ngày từ lần tương tác gần nhất; miễn phí trong 48 giờ, sau đó phát sinh phí theo lượt. Tin Broadcast chịu hạn mức gói và không phù hợp để gửi riêng dự báo vận hành cho từng quán. ZBS Template Message cần đăng ký/duyệt và chỉ dùng đúng mục đích. Không nên gắn nhãn dự báo là tin giao dịch hoặc hậu mãi nếu nội dung không đáp ứng định nghĩa đó. [Chính sách Tin Tư vấn và loại tin](https://oa.zalo.me/home/documents/vie/guides/tong-quan-cac-loai-tin-nhan-tren-zalo-official-account-_3651713298729094511), [điều kiện tin Truyền thông](https://docs.zaloplatforms.com/docs/OA/tin-nhan/tin-truyen-thong/dieu-kien-gui-tin-truyen-thong), [điều kiện tin Giao dịch](https://docs.zaloplatforms.com/docs/OA/tin-nhan/tin-giao-dich/dieu-kien-gui-tin-giao-dich).

**Khuyến nghị kiến trúc dài hạn:** một OA trung tâm BếpCanh cho nhiều quán. Chủ quán hoặc nhân viên nhấn menu “Chốt ca”, nhập số phần, rồi nhận xác nhận và dự báo trong cùng luồng. Một backend giữ dữ liệu nhiều quán; ánh xạ từng Zalo UID vào đúng cửa hàng và vai trò. Nếu cần nhắc ca, dùng lịch vận hành phía cửa hàng và để nhân viên mở OA, hoặc gửi link web/app do quán chủ động đăng ký nhận. Không phụ thuộc vào tin nhắn OA chủ động ngoài cửa sổ hợp lệ.

**Rào cản trước mắt:** OA doanh nghiệp xác thực yêu cầu doanh nghiệp/hộ kinh doanh có giấy đăng ký kinh doanh. OA Test yêu cầu đã có ít nhất một OA doanh nghiệp xác thực. Vì vậy đội sinh viên chưa có pháp nhân hoặc hộ kinh doanh không nên giả định tự tạo được OA thử nghiệm có đủ tính năng API. [Điều kiện tạo và xác thực OA](https://oa.zalo.me/home/documents/vie/guides/khoi-tao-zalo-official-account_61), [điều kiện OA Test](https://oa.zalo.me/home/documents/vie/guides/tao-tai-khoan-oa-thu-nghiem-ky-thuat_4023591696049457534).

**Khuyến nghị cho pilot sớm:** chạy dưới OA đã xác thực của quán/căn tin đối tác, nếu họ đồng ý cấp quyền App và dùng đúng gói; hoặc kiểm chứng dự báo bằng form/PWA gửi từ kênh Zalo hiện có. Cách thứ hai kiểm chứng BếpCanh, nhưng chưa chứng minh tích hợp OA API.

Phân biệt thuật ngữ: tài liệu này hiểu “OA” là **Zalo Official Account**. Telegram có bot và channel, nhưng không có cùng sản phẩm Official Account của Zalo. Nếu ý định là Telegram, cần thiết kế nhánh khác.

## Vì sao OA hợp bài toán

- Chủ quán và nhân viên có thể dùng giao diện chat sẵn có, thay vì cài app mới.
- Menu, chatbot flow, nút lựa chọn và bước nhập liệu có sẵn trong OA Chatbot. Rule có thể kích hoạt theo tin nhắn, quan tâm OA, nhấn nút, từ khóa hoặc giờ cụ thể. [Tài liệu thành phần chatbot](https://chatbot.zalo.me/oa/docs/getting-started/basic-components), [rule tự động](https://chatbot.zalo.me/oa/docs/getting-started/create-rule), [flow nâng cao và bước nhập liệu](https://chatbot.zalo.me/oa/docs/intermediate/intermediate-flow).
- OpenAPI hỗ trợ webhook sự kiện, gửi tin nhắn, quản lý hội thoại và tích hợp hệ thống ngoài. Zalo mô tả mô hình server nhận webhook POST, xử lý rồi gọi API gửi trả lời. [Tổng quan OpenAPI](https://docs.zaloplatforms.com/docs/OA), [mô hình tích hợp OA](https://docs.zaloplatforms.com/docs/OA/bat-dau/kham-pha).
- Có thể dùng cùng OA Manager để nhân viên xử lý ngoại lệ bằng tay, trong khi dữ liệu vẫn về backend.

OA là kênh giao tiếp, không phải cơ sở dữ liệu dự báo. Dữ liệu chuẩn, lịch sử sửa và mô hình vẫn nằm trong backend BếpCanh.

## Hai kiến trúc triển khai

| Phương án | Ưu điểm | Chi phí và rủi ro | Đánh giá |
|---|---|---|---|
| Một OA trung tâm BếpCanh cho nhiều quán | Một lần cấu hình OAuth/webhook; quán không cần có OA riêng; chi phí OA tập trung; quản lý sản phẩm nhất quán | BếpCanh phải tạo tài khoản cửa hàng, mời nhân viên, kiểm soát phân quyền và bảo vệ dữ liệu nhiều tenant; cần hồ sơ hợp lệ để xác thực OA | Kiến trúc đích; dùng cho MVP khi đủ điều kiện |
| Tích hợp OA riêng của từng quán | Thương hiệu và quan hệ khách hàng thuộc quán; có thể đưa luồng vào kênh sẵn có của họ | Mỗi OA phải được xác thực, cấp quyền, cấu hình App và webhook; gói hỗ trợ API/chatbot tính theo từng OA; onboarding và token rotation lặp lại | Chỉ làm khi khách hàng lớn yêu cầu |

Tuy nhiên, đội sinh viên có thể chưa đủ điều kiện đứng tên OA xác thực. Khi đó đường vào pilot khác với kiến trúc dài hạn:

| Trạng thái pháp lý/đối tác | Cách thử | Điều chứng minh được |
|---|---|---|
| Có quán đối tác với OA xác thực | Xin đối tác cấp quyền cho App thử nghiệm; dùng OA họ trong một cửa hàng | Luồng Chatbot/OpenAPI thật và mức chấp nhận của nhân viên |
| Chưa có pháp nhân và chưa có OA đối tác | PWA/form nhập dữ liệu; gửi link qua kênh Zalo mà quán đang dùng; đội trả forecast thủ công hoặc trên web | Nỗi đau, khả năng ghi dữ liệu và giá trị forecast; **không** chứng minh OA API |
| BếpCanh đã có doanh nghiệp/hộ kinh doanh đủ hồ sơ | Mở OA trung tâm, xác thực, mua gói phù hợp, tạo App/OAuth | Kiến trúc SaaS nhiều cửa hàng và onboarding thật |

Tài liệu Zalo nói mỗi OA cấp quyền cho ứng dụng để vận hành API; OA, Zalo App và tài khoản quản lý chi phí ZCA cần được thiết lập/liên kết phù hợp. Một ZCA có thể liên kết nhiều OA và App. [Khám phá mô hình OA OpenAPI](https://docs.zaloplatforms.com/docs/OA/bat-dau/kham-pha).

### Ràng buộc nhiều cửa hàng trên một OA

Zalo UID là định danh người dùng **đối với một OA**, không phải mã cửa hàng. Backend phải ánh xạ cặp `(oa_id, user_id)` sang `shop_id`, `role` và trạng thái thành viên. Khi nhân viên bắt đầu:

1. Chủ quán tạo mã mời dùng một lần trong BếpCanh.
2. Nhân viên mở OA, gửi mã mời.
3. Chủ quán duyệt UID và chọn quyền.
4. Mọi truy vấn phía server suy ra `shop_id` từ danh tính đã liên kết; không nhận `shop_id` tùy ý từ nội dung người dùng nhập.

Như vậy giảm nguy cơ nhân viên xem nhầm dữ liệu quán khác. Ghi log ai thêm người, ai sửa số và ai duyệt dự báo.

## Luồng hội thoại MVP

Thiết kế để mỗi ca ghi sổ mất dưới 60–90 giây. Tránh bắt đầu bằng hội thoại AI tự do.

**Menu OA:**

- Chốt ca
- Xem dự báo ca tới
- Sửa món/lượng chuẩn
- Báo lỗi hoặc gặp hỗ trợ

**Chốt ca:**

1. Chọn cửa hàng và ca đã được liên kết sẵn.
2. Chọn món trong danh sách quán.
3. Nhập số phần đã nấu.
4. Nhập số bán; hệ thống kiểm tra `sold <= prepared`.
5. Chọn phần dư: 0, 1–2, 3–5, trên 5; hoặc nhập số chính xác nếu nhân viên có thể cân/đếm.
6. Báo số lần khách hỏi món sau khi hết.
7. Xác nhận bản tóm tắt trước khi lưu.

Người dùng không cần lặp lại dữ liệu mặc định như địa chỉ và tên cửa hàng. Cho nhập theo nhóm món hoặc danh sách bán chạy. Luôn có nút “bỏ qua món”, “sửa” và “hoàn tất”.

**Phản hồi:** “Đã ghi 4 món. Ca sau dự kiến: gà 32–38 phần; cá 18–22 phần. Đây là ước lượng từ 3 ngày tương tự. Xác nhận hoặc sửa trước khi nấu.” Câu trả lời phải thể hiện mức bất định, không tạo cảm giác con số chắc chắn.

**Cơ chế tương tác:** user khởi tạo “Chốt ca” hoặc “Dự báo”. Backend trả lời trong luồng OA. Lịch nhắc có thể hiển thị như lịch công việc trong PWA hoặc gửi qua một kênh đã có đồng ý; không giả định OA API có thể gửi tự do hằng ngày.

## Kiến trúc kỹ thuật

```text
Zalo OA Chatbot / Menu
          │ user message, button, webhook
          ▼
Webhook API ── xác thực chữ ký, chống gửi lặp, kiểm tra sự kiện
          │
          ├── Identity & tenant mapping (OA UID → shop, role)
          ├── Conversation state machine
          ├── Input validation and unit normalization
          ▼
Operational database ── raw event, shift record, dish, forecast, correction
          │
          ├── Forecast worker (baseline first)
          └── Audit log and metrics
          │
          ▼
OA OpenAPI reply / web dashboard / CSV export
```

**Webhook:** HTTPS công khai; kiểm tra chữ ký theo hướng dẫn sự kiện; xác nhận OA/App ID; dùng `msg_id` hoặc event ID để idempotency; trả 2xx nhanh rồi xử lý bất đồng bộ nếu tác vụ chậm. Không tin nội dung webhook trước khi kiểm tra nguồn.

**OAuth/token:** App cần được OA liên kết và cấp quyền. Access token có hiệu lực 25 giờ; refresh token 3 tháng và chỉ dùng một lần, sau refresh token cũ bị vô hiệu. Backend cần lưu refresh token mã hóa, xoay token nguyên tử, ghi nhận token mới trước khi cho worker tiếp tục, cảnh báo khi refresh lỗi. Không nhúng token vào client hoặc spreadsheet. [OAuth và cấp quyền OA](https://docs.zaloplatforms.com/docs/OA/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung).

**Dữ liệu tối thiểu:** `shop`, `oa_user_binding`, `dish`, `shift`, `prepared_qty`, `sold_qty`, `waste_qty`, `stockout_requests`, `forecast`, `owner_override`, `event_id`, `created_at`. Tách dữ liệu nhận từ Zalo khỏi dữ liệu định danh. Không cần thu số điện thoại, vị trí chính xác, danh bạ hoặc thông tin khách mua.

**Dự báo:** bắt đầu bằng median cùng thứ trong tuần hoặc median các ngày tương tự. Lưu phiên bản mô hình, dữ liệu đầu vào và thời điểm tạo dự báo. Backend không cần gửi thông tin dữ liệu nhạy cảm tới mô hình ngôn ngữ. Nếu thêm AI tạo câu, chỉ dùng để diễn đạt dự báo đã có; không để LLM tự tính số phần.

## Khả thi, chi phí và chính sách tin

Trang giá Zalo áp dụng gói mới từ 01/06/2026. Gói Tăng trưởng được niêm yết **2.500.000 đồng/năm** hoặc **1.400.000 đồng/6 tháng**; mô tả có Chatbot, tự động hóa và tích hợp API. Hạn mức OpenAPI niêm yết 100 request/phút cho Tăng trưởng; cao hơn nhiều nhu cầu pilot. [Bảng giá OA hiện hành](https://zalo.solutions/oa/pricing), [thông báo gói mới](https://oa.zalo.me/home/resources/news/chinh-thuc-quyen-loi-va-bieu-phi-cac-goi-dich-vu-zalo-oa-moi-tu-162026-_5100578039811031184).

| Khoản | Một OA trung tâm | OA riêng từng quán |
|---|---:|---:|
| Gói Growth | 2,5 triệu/năm tổng | 2,5 triệu/năm/quán nếu mỗi OA cần API và Chatbot |
| API tích hợp | Zalo nói không thu phí riêng tích hợp; vẫn cần hosting và vận hành | Tương tự, cộng onboarding từng OA |
| Tin Tư vấn | Miễn phí trong 48 giờ từ tương tác cuối; ngoài khung hiện niêm yết 55đ/tin | Tương tự trên từng OA |
| Tin Broadcast | Hạn mức theo gói; tối đa theo chính sách hiện hành | Hạn mức riêng từng OA |
| ZBS Template | Giá riêng; phải đăng ký/duyệt, đúng mục đích | Giá và quy trình lặp lại theo OA/app |

Ví dụ, 10 OA riêng theo gói Growth tiêu tốn 25 triệu đồng/năm chỉ tiền gói OA, chưa gồm máy chủ, phát triển, hỗ trợ, VAT/điều kiện giá nếu thay đổi và phí gửi tin khác. Một OA trung tâm ở cùng gói là 2,5 triệu đồng/năm. Đây là so sánh niêm yết, chưa phải báo giá cuối cùng.

Tin Tư vấn miễn phí trong 48 giờ sau tương tác. OA OpenAPI có thể gửi trong vòng 7 ngày kể từ tương tác gần nhất; OA Manager có cửa sổ khác nhưng vận hành thủ công. Nếu cửa hàng tương tác đều mỗi ca, phản hồi sẽ thường nằm trong cửa sổ miễn phí. Nếu quán ngừng tương tác, không có bảo đảm rằng hệ thống có thể tiếp tục nhắc bằng OA API. [Hướng dẫn loại tin và cửa sổ gửi](https://oa.zalo.me/home/documents/vie/guides/tong-quan-cac-loai-tin-nhan-tren-zalo-official-account-_3651713298729094511).

**Không nên dùng Broadcast để nhắc từng quán chốt ca:** đây là tin truyền thông, phụ thuộc quota, có giới hạn số tin/ngày và khung giờ. **Không nên dùng ZBS giao dịch/hậu mãi làm lối tắt:** cần template được duyệt và nội dung phải đúng loại. Tin đề xuất lượng nấu là nội dung vận hành; hỏi Zalo trước khi đăng ký template nếu muốn gửi ngoài cửa sổ.

## Tính kinh tế của OA trong BếpCanh

Nếu một OA trung tâm Growth phục vụ 20 quán, chi phí gói OA quy đổi khoảng 10.400 đồng/quán/tháng. Nếu mỗi quán có OA riêng, chi phí gói quy đổi khoảng 208.300 đồng/quán/tháng. Chưa gồm cloud, thời gian hỗ trợ, phát triển và tin tính phí.

Mô hình đơn vị cho OA trung tâm:

```text
Biên gộp mỗi quán = doanh thu thuê bao
                    - cloud/database phân bổ
                    - tin nhắn tính phí
                    - hỗ trợ vận hành
                    - chi phí nhập/chuẩn hóa dữ liệu
```

OA trung tâm rẻ hơn nhưng BếpCanh chịu trách nhiệm bảo vệ dữ liệu nhiều quán và xây luồng onboarding. OA riêng có thể bán enterprise sau này; không phù hợp giả định micro-SMB trả thêm gói OA để thử công cụ.

## Kế hoạch pilot

### Giai đoạn 0: xác minh quyền truy cập nền tảng

- Xác định pháp nhân/hộ kinh doanh đứng tên OA hoặc tìm đối tác có OA xác thực.
- Xác nhận OA có thể được cấp quyền và gói nào mở Chatbot + API tại thời điểm triển khai.
- Tạo Zalo App trong môi trường thử nghiệm, kiểm tra luồng OAuth và quyền webhook.
- Gửi tin thử trong cửa sổ tương tác, kiểm tra phản hồi ngoài 48 giờ và chi phí.
- Xác nhận nội dung dự báo có thể gửi bằng Tin Tư vấn; không dùng template giao dịch khi chưa được duyệt.
- Kiểm tra chatbot question có đẩy dữ liệu về endpoint bên ngoài theo gói đang dùng hay phải tự xử lý webhook.

### Giai đoạn 1: usability, 3–5 quán, 14 ngày

Không tối ưu thuật toán. Kiểm tra ghi nhận 5–10 món bán chạy.

Ngưỡng đề xuất để qua:

- Ít nhất 80% ca pilot được ghi.
- Trung vị nhập liệu dưới 90 giây mỗi ca.
- Sai số nhập/sửa dưới 5% trường số sau xác nhận.
- Ít nhất 3/5 chủ quán xem và dùng đề xuất lặp lại.
- Không có lỗi rò dữ liệu tenant; 100% sự kiện được gắn đúng cửa hàng.

Ngưỡng này là tiêu chí nội bộ của pilot, không phải chuẩn ngành.

### Giai đoạn 2: kiểm tra giá trị dự báo, 4–6 tuần

So sánh cùng-thứ-tuần-trước, median ngày tương tự và mô hình quantile đơn giản theo thời gian. Báo cáo sai số dự báo cùng hàng dư, stockout requests, phút nhập và override. Dùng chi phí thực tế của quán để tính giá trị. Chỉ thử thu phí sau khi quy trình đủ nhẹ.

## Rủi ro và biện pháp

| Rủi ro | Hệ quả | Biện pháp MVP |
|---|---|---|
| OA không thể nhắn chủ động sau thời gian im lặng | Bỏ lỡ nhắc ca và dự báo | Thiết kế user-initiated; thêm PWA/export làm đường dự phòng |
| Nhập nhiều món tạo ma sát | Thiếu dữ liệu, bỏ dùng | Bắt đầu 5–10 món, nút chọn, lưu mặc định, đo thời gian |
| Zalo đổi giá/quota/chính sách | Unit economics đổi | Không gắn giá trị cốt lõi vào broadcast; rà soát giá trước mỗi pilot |
| Một UID bị gắn nhầm cửa hàng | Lộ dữ liệu | Mã mời dùng một lần, duyệt của chủ, phân quyền backend, audit log |
| Nhân viên nhập số không chính xác | Dự báo sai | Tóm tắt xác nhận, kiểm tra ràng buộc, lưu sửa đổi |
| Quán dùng nhiều thiết bị/người | Trùng hoặc thiếu ca | Mã ca duy nhất, trạng thái draft/submitted, idempotency |
| Dự báo bị hiểu như chỉ thị bắt buộc | Hết món hoặc lãng phí | Hiển thị khoảng, độ chắc chắn, chủ quán quyết định cuối |
| Access/refresh token lỗi | Tích hợp ngừng | Mã hóa, xoay nguyên tử, theo dõi expiry, cảnh báo và quy trình re-auth |

## Quyết định và tiêu chí mở rộng

**Quyết định hiện tại:** sản phẩm nên hỗ trợ Zalo OA như một giao diện, với OA trung tâm nhiều quán là kiến trúc dài hạn. Nếu đội chưa đủ hồ sơ OA, bắt đầu trên OA đối tác hoặc dùng PWA/form để kiểm chứng nhu cầu trong khi tìm đối tác hợp lệ. PWA hoặc CSV cũng là đường dự phòng và kênh dashboard. Không xây Mini App ngay; chỉ cân nhắc khi chat flow không xử lý tốt danh sách món dài hoặc nhập hàng loạt.

Mở rộng sang tích hợp OA riêng khi ít nhất một chuỗi có nhiều chi nhánh yêu cầu thương hiệu riêng, sẵn sàng trả chi phí Growth cho OA, cấp quyền App và có người phụ trách hệ thống. Mở rộng sang Mini App khi phép thử cho thấy nhập liệu qua chat vượt 90 giây hoặc tỷ lệ hoàn tất thấp vì danh sách món.

Tiêu chí dừng: không tìm được OA đối tác hoặc pháp nhân hợp lệ để kiểm tra API; không mở được OA/App/API trong chi phí chấp nhận; luồng nhập không đạt ngưỡng thời gian; chủ quán không quay lại; hoặc chính sách gửi tin khiến use case chủ động trở thành bắt buộc nhưng không có kênh hợp lệ.

## A-Evolve — ghi nhận bài học cho dự án

### OBS-4: nhầm kênh với sản phẩm

- Phạm vi: BếpCanh trước khi đánh giá OA.
- Nguyên nhân: mô tả PWA/bot như lựa chọn giao diện, chưa xử lý chính sách outbound, package cost và onboarding nhiều OA.
- Tần suất: một lần trong hồ sơ hiện có.
- Mức độ: degrading; có thể làm MVP phụ thuộc vào tin chủ động không đảm bảo.

### Mutation áp dụng

Mọi quyết định tích hợp nền tảng nhắn tin cần có bảng capability, cửa sổ outbound, giá theo gói/tin, luồng cấp quyền, tenant mapping, fallback và chi phí/khách trước khi nền tảng trở thành kiến trúc cốt lõi.

### Gate

Specific với BếpCanh và OA; kiểm tra được bằng spike 1–2 ngày và pilot; blast radius thấp vì áp dụng cho phần tích hợp; không mâu thuẫn với mô hình dự báo baseline-first. Chưa tạo skill toàn cục vì chưa có tần suất qua nhiều dự án.

## Nguồn chính

- [Zalo OA gói dịch vụ và giá](https://zalo.solutions/oa/pricing)
- [Điều kiện tạo và xác thực OA doanh nghiệp](https://oa.zalo.me/home/documents/vie/guides/khoi-tao-zalo-official-account_61)
- [Điều kiện tạo OA Test](https://oa.zalo.me/home/documents/vie/guides/tao-tai-khoan-oa-thu-nghiem-ky-thuat_4023591696049457534)
- [Công bố gói OA mới từ 01/06/2026](https://oa.zalo.me/home/resources/news/chinh-thuc-quyen-loi-va-bieu-phi-cac-goi-dich-vu-zalo-oa-moi-tu-162026-_5100578039811031184)
- [Tổng quan loại tin và điều kiện gửi OA](https://oa.zalo.me/home/documents/vie/guides/tong-quan-cac-loai-tin-nhan-tren-zalo-official-account-_3651713298729094511)
- [Điều kiện tin Truyền thông](https://docs.zaloplatforms.com/docs/OA/tin-nhan/tin-truyen-thong/dieu-kien-gui-tin-truyen-thong)
- [Điều kiện tin Giao dịch](https://docs.zaloplatforms.com/docs/OA/tin-nhan/tin-giao-dich/dieu-kien-gui-tin-giao-dich)
- [OA OpenAPI và webhook](https://docs.zaloplatforms.com/docs/OA/bat-dau/kham-pha)
- [OAuth và token OA](https://docs.zaloplatforms.com/docs/OA/bat-dau/xac-thuc-va-uy-quyen-cho-ung-dung)
- [Zalo Chatbot: flow, rule, question](https://chatbot.zalo.me/oa/docs/intermediate/intermediate-flow)
- [Zalo Chatbot: rule tự động](https://chatbot.zalo.me/oa/docs/getting-started/create-rule)
- [Zalo OA menu](https://oa.zalo.me/home/documents/vie/guides/thanh-menu_29)

## Chưa xác minh bằng thử nghiệm

- Chủ quán có sẵn lòng dùng OA trung tâm thay OA quán.
- Chatbot endpoint có đủ linh hoạt để lưu từng dòng ca trong cấu hình gói dự định mua.
- Người làm bếp có thể nhập dưới 90 giây bằng menu, button và số.
- Dự báo giúp giảm tổng tổn thất thay vì chỉ dịch chuyển từ dư sang hết món.
- Giá 2,5 triệu đồng/năm và mức phí tin tại thời điểm mua vẫn đúng; kiểm tra lại trang giá trước khi triển khai.
