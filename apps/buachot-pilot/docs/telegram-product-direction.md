# BữaChốt trên Telegram — định hướng sản phẩm và kỹ thuật

Ngày đối chiếu: 05/10/2026. Đây là thiết kế đề xuất, chưa triển khai bot, chưa tạo tài khoản Telegram hoặc gửi thông báo.

## 1. Quyết định sản phẩm

Đề xuất một bot BữaChốt phục vụ sinh viên và quán trong chat riêng; Mini App mở catalogue/checkout từ bot; web vận hành quản lý tiền và hồ sơ. Cả ba dùng một backend và một sổ PostgreSQL. Telegram là kênh tiếp cận bổ sung cho cụm trường, cần đo mức sử dụng thực tế trước khi yêu cầu toàn bộ sinh viên chuyển kênh.

Giá trị cần thử: thông báo đúng thời điểm hàng dư, ít bước quay lại đặt bữa, quán thao tác giao hàng nhanh. Không coi việc đưa website vào Telegram là đổi mới đã được chứng minh; lợi thế phải nằm ở nguồn hàng đáng tin, mật độ quán, mức tiết kiệm thực và vận hành chính xác.

Ba lựa chọn:

| Phương án | Phù hợp | Hạn chế | Quyết định |
|---|---|---|---|
| Bot chat hoàn toàn | Demo rất ít món, ít trường thông tin | Nhiều bước chọn món/voucher; thông tin và nút cũ dễ gây nhầm | Dùng cho phép thử luồng, chưa là trải nghiệm cuối |
| Bot + Mini App | Catalogue, voucher, giá cuối, vị trí tùy chọn | Cần HTTPS và lớp xác thực Telegram | Hướng sản phẩm đề xuất |
| Bot thông báo + mở web ngoài | Kiểm tra người dùng có phản hồi thông báo hay không | Có bước chuyển app/đăng nhập web | Bước đầu ít thay đổi nhất |

## 2. Phân chia ba giao diện

**Sinh viên:** `/start` tham gia; nút “Bữa hôm nay”, “Voucher của tôi”, “Đơn của tôi”, “Nhắc bữa tối”, “Trợ giúp”. Catalogue/checkout nằm trong Mini App; bot trả trạng thái tiền và mã nhận riêng cho khách. Không công khai đơn, mã nhận, số tài khoản hoàn tiền hoặc vị trí trong group.

**Quán:** menu theo vai trò gồm tồn bán được, đăng lô bằng mẫu, đơn chờ giao, nhập mã nhận, khoản được đối soát. Bot phù hợp cập nhật tồn và xác nhận giao; đăng món mới có giá, bảo quản, dị ứng và giờ nhận nên dùng form Mini App hoặc web. Quán chỉ thấy dữ liệu của mình.

**Vận hành:** giữ web cho duyệt tài khoản/quán, ghi nhận tiền thực thu, kiểm tra tiền muộn, hoàn, đối soát, xuất dữ liệu. Bot ban đầu chỉ báo có việc cần xử lý và dẫn vào trang đã đăng nhập. Chưa đặt nút duyệt tiền/hoàn/payout trực tiếp trong chat ở bản đầu.

## 3. Luồng sinh viên

1. Sinh viên quét QR đường dẫn bot theo cụm trường và chủ động Start. Mã cụm dùng phân loại tuyển người, không chứng minh tư cách sinh viên.
2. Liên kết Telegram với tài khoản sinh viên đã duyệt, hoặc đăng ký chờ duyệt. Một người dùng nội bộ có một bộ voucher dùng chung cho web và bot.
3. Người dùng bật nhắc bữa. Từ18:00 có bộ7/10/20%; hệ thống nhắc một lần khi có món phù hợp. Không hứa thông báo đồng loạt chính xác từng giây.
4. Mở Mini App, chọn món, số lượng1–3 và một voucher. Hiển thị giá menu, tiền cuối, đồng tiết kiệm, khung nhận, bảo quản/dị ứng. Cho phép bỏ qua vị trí.
5. Backend báo giá, giữ tồn và voucher10phút, không vượt23:59. Màn hình hiển thị hạn cụ thể. Tin nhắn catalogue hoặc nút cũ phải kiểm tra lại dữ liệu server.
6. Tạo đơn, nhận thông tin chuyển khoản và nội dung chính xác. Nút “Tôi đã chuyển” chỉ ghi nhận yêu cầu kiểm tra, tuyệt đối không đổi đơn sang đã thanh toán. Ảnh chuyển khoản không phải chứng cứ tự động đủ điều kiện.
7. Sau khi vận hành xác nhận hợp lệ, bot gửi mã nhận một lần và khung nhận. Quán nhập/quét mã; backend kiểm tra quán, trạng thái và thời gian.
8. Quán hủy/no-show/tiền muộn xử lý đúng chính sách MVP. Bot báo kết quả; chỉ báo “Đã hoàn tiền” sau khi vận hành đã ghi nhận chuyển khoản hoàn.

Ví dụ thông báo: “Tối nay có cơm gà tại quán A. Giá menu50.000đ; dùng voucher20% còn38.000đ trước thưởng tự nhận. Nhận18:30–20:00. Bấm xem món để kiểm tra tồn và giữ giá.” Không quảng cáo giá thưởng tối đa cho mọi khách.

## 4. Kiến trúc cần thêm

```text
Telegram chat → webhook → inbox/worker → service nghiệp vụ → PostgreSQL
                                            ↓
                                     outbox → Telegram
Mini App → xác thực initData → phiên người dùng → cùng service nghiệp vụ
Web sinh viên/quán/ops → Supabase Auth → cùng service nghiệp vụ
```

MVP hiện có `lib/domain.ts`, `lib/store.ts`, `lib/routes.ts`; giữ engine giá, transaction, phân quyền và DTO. Tách phần điều phối trong `app/api/pilot/route.ts` thành service nhận Actor đã xác thực. Web adapter tiếp tục kiểm tra Origin; webhook dùng xác thực riêng, không bỏ kiểm tra Origin của web để bot gọi được.

Các phần đề xuất:

- `lib/services/pilot.ts`: điều phối báo giá, quota Routes và thao tác nghiệp vụ dùng chung.
- `lib/telegram/client.ts`: gửi/sửa tin nhắn, xử lý lỗi Telegram.
- `lib/telegram/identity.ts`: xác minh Mini App, liên kết tài khoản, phiên ngắn hạn.
- `lib/telegram/handlers.ts`: lệnh, nút bấm, chuyển bước và phân quyền.
- `app/api/telegram/webhook/route.ts`: nhận update hợp lệ, ghi inbox rồi trả nhanh.
- `app/api/telegram/session/route.ts`: đổi initData đã kiểm tra thành phiên riêng.
- `app/mini/page.tsx`: catalogue/checkout theo màn hình Telegram.
- Worker/job riêng: xử lý inbox, gửi outbox, nhắc18:00, giải phóng giữ hàng và nhắc nhận.

Thêm dữ liệu `telegram_identity` (Telegram user ID dạng chuỗi, user nội bộ, private chat ID), `bot_preferences`, `bot_session`, `telegram_inbox`, `notification_outbox`, `notification_delivery`. Session phải nằm trong database để restart/serverless không làm mất bước. Không nhân đôi orders/vouchers/ledger theo kênh.

Đối với pilot nhỏ có thể mở rộng aggregate hiện có, nhưng inbox/outbox cần khóa và uniqueness rõ. Khi tăng lưu lượng nên tách các bảng này khỏi JSONB tổng để thông báo không tranh một khóa với giao dịch mua.

## 5. Xác thực và giao nhận tin

Telegram username không phải khóa danh tính hoặc bằng chứng sinh viên. Dùng user ID Telegram sau khi kiểm tra nguồn yêu cầu; gắn với user nội bộ. Vai trò merchant/ops lấy từ database, không lấy từ câu lệnh, tên nhóm hoặc tham số đường dẫn.

Liên kết tài khoản hiện có bằng mã một lần, ngắn hạn do phiên web đã đăng nhập sinh ra; bot kiểm tra và tiêu mã trong transaction. Chặn liên kết Telegram vào tài khoản khác hoặc tạo thêm ví voucher. Trường hợp đổi tài khoản Telegram cần quy trình hủy liên kết có kiểm tra.

Mini App phải xác minh `initData` ở server, giới hạn tuổi `auth_date` (đề xuất5phút cho trao đổi phiên) và bảo vệ chống phát lại. Không dùng `initDataUnsafe` để quyết định danh tính. Cơ chế này cần viết thêm; Supabase session hiện có không tự xác thực Telegram. [Tài liệu Mini Apps](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app).

Webhook cần HTTPS công khai và kiểm tra `X-Telegram-Bot-Api-Secret-Token`; token bot chỉ ở server. Callback chứa token tham chiếu ngắn, không chứa giá/role hoặc dữ liệu cá nhân. Kiểm tra người bấm và chủ sở hữu nghiệp vụ ở server. [Bot API](https://core.telegram.org/bots/api#setwebhook).

Inbox uniqueness theo bot+update_id; mutation vẫn dùng idempotency nghiệp vụ. Outbox ghi cùng transaction với sự kiện thanh toán/pickup để lỗi Telegram không làm mất thông báo hoặc rollback tiền. Gửi lại theo backoff, tôn trọng429/retry_after. Timeout gửi tin có thể tạo thông báo trùng; nội dung phải cùng một đơn và không tạo thêm mã nhận/thu tiền.

Thông báo cần người dùng chủ động tham gia/cho phép phù hợp, có bật/tắt nhắc. Cấp voucher và gửi nhắc là hai nghiệp vụ riêng: lỗi gửi không làm mất voucher. Thiết kế hàng đợi theo giới hạn gửi của Telegram; chưa cần paid broadcast cho pilot. [Bots FAQ](https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this).

## 6. Vị trí và thanh toán

Ưu tiên Mini App lấy vị trí một lần sau thao tác đồng ý, gửi trực tiếp về backend BữaChốt để gọi Routes, chỉ lưu kết quả khoảng cách/thưởng cần thiết. Telegram vẫn là nền tảng chạy giao diện; không hứa đây là môi trường tuyệt đối riêng tư.

Nếu dùng nút gửi location trong chat, phải thông báo tọa độ được gửi qua Telegram và có thể tồn tại trong lịch sử chat; không mô tả là “chỉ BữaChốt xử lý rồi không lưu ở đâu”. Không xin live location. Nếu lỗi/không đồng ý, vẫn dùng voucher gốc. [KeyboardButton request_location](https://core.telegram.org/bots/api#keyboardbutton).

Giai đoạn đầu giữ chuyển khoản ngân hàng và đối soát thủ công. Giao diện bot không biến Telegram thành bên xác nhận tiền ngân hàng. QR thanh toán nếu bổ sung phải tạo từ số tiền/nội dung server và thông tin ngân hàng đã cấu hình. Chỉ đánh giá Telegram Payments sau khi xác minh provider hỗ trợ thực tế, phí, hoàn tiền và đối soát phù hợp; chưa giả định hỗ trợ ngân hàng Việt Nam theo nhu cầu này.

## 7. Lộ trình và gate

**Chặng1 — kiểm tra kênh:** bot onboarding, liên kết tài khoản, bật/tắt nhắc, catalogue dẫn web và trạng thái đơn. Thử10 sinh viên, đo có sử dụng Telegram và phản hồi luồng hay không. Chưa cần đưa hết UI vào chat.

**Chặng2 — giao dịch trong Telegram:** Mini App checkout, xác thực Telegram, inbox/outbox, mã nhận trong private chat, nút nhận hàng của quán. Chạy đầy đủ tiền giả trên môi trường riêng trước giao dịch thật.

**Chặng3 — vận hành pilot:** lịch nhắc18:00, nhắc khung nhận, báo quán, bảng đo theo kênh; mở3–5quán khi đáp ứng gate thẩm định ban đầu. Chưa xây ML hoặc thí nghiệm thưởng trước khi luồng ổn.

Môi trường localhost hiện tại không nhận được webhook Telegram trực tiếp. Cần môi trường HTTPS riêng. Staging phải có xác thực Telegram thật nhưng dữ liệu và tiền giả, danh sách tài khoản thử rõ; không dùng chế độ demo localhost hiện tại rồi mở công khai. Không nới gate giao dịch thật để tiện test bot.

Ngân sách2triệu giữ nguyên: bot/worker dùng chung hạ tầng trong khoản400k; mọi chi phí mới cần nằm trong hạn mức này hoặc được điều chỉnh công khai. Chưa có báo giá dịch vụ nên không cam kết chi phí0đ hay hạ tầng chắc chắn đủ ngân sách.

## 8. Nghiệm thu và đo hiệu quả

Kiểm tra update trùng/sai secret; callback của người khác/nút cũ; initData giả/hết hạn; đổi role/liên kết thêm tài khoản; cùng voucher đặt từ web và bot; hai khách tranh suất; restart giữa các bước; thanh toán muộn; pickup trùng; bot bị chặn;429; lỗi gửi sau commit; một sự kiện retry không tăng receipts/refunds/payouts. Giữ toàn bộ test tài chính hiện có.

Đo riêng từng đoạn: được mời → Start → được duyệt → bật nhắc → bấm catalogue → báo giá → đơn trả tiền → nhận thành công → mua lại. Bot chat thông thường không cung cấp bằng chứng người dùng đã đọc tin; gửi thành công không phải đã đọc. Ghi click, lượt xem Mini App đủ điều kiện và tồn tại lúc xem; không trộn lượt gửi nhắc với lượt xem.

Gate thành công: cùng một sổ tiền giữa các kênh, không trùng tồn/voucher, quán thao tác được, sinh viên quay lại nhận bữa và mức tiết kiệm bù được chi phí thực tế. Nếu sinh viên ít dùng Telegram, giữ bot là kênh phụ; không kết luận sản phẩm thất bại chỉ từ mức sử dụng nền tảng.
