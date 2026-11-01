# Giao dịch và website Bếp Núc — 01/11/2026

## Thay đổi đang có trong mã

Website mở phạm vi đồ ăn và hoa cắm nhà. Trang chủ giải thích giá lô, tình trạng và cách nhận; danh mục/chi tiết phân biệt hàng còn lại cuối phiên và khuyến mãi cửa hàng. Hoa có số cành dùng được, loại, tình trạng và gói cơ bản. Các lô mới bắt buộc đủ thông tin, ảnh và hướng dẫn trước khi mở.

Giao dịch mới dùng giá lô trực tiếp, không tự trừ thêm5%; khoản tiệm nhận cố định theo lô. Lô đã đăng và duyệt được đặt đến giờ cắt, không áp mốc18h chung cho mọi tiệm; bàn giao vẫn đúng khung riêng. Giữ tối đa10phút và không quá cuối khung lô hoặc ranh giới tuần. Đây là lựa chọn triển khai theo đặc tả, cần ký xác nhận với tiệm trước mở bán. Các báo giá/đơn cũ vẫn giữ giá, payout và cách xử lý thanh toán đã lưu; không di chuyển hoặc tính lại tiền đơn cũ.

Voucher: hai lượt15%, hai lượt10% mỗi tuần giờ Việt Nam, bắt đầu thứ Hai00:00. 9k giảm cố định9.000đ; số lượt và cap do vận hành cấu hình. Khi bật bộ ưu đãi,9k phải có ít nhất3lượt để nhiều hơn từng loại phần trăm; cả hai loại phần trăm phải có cap dương. Chỉ một voucher tiền hàng/đơn; có lựa chọn không voucher. Giữ lượt khi giữ lô, tiêu lượt lúc bàn giao. Giữ/đã dùng được tính vào ngân sách tuần; bỏ giữ hoặc hết hạn trả lại tồn/lượt/ngân sách. Quán hủy hoặc xử lý sai lô có thể phục hồi lượt còn trong tuần; no-show vẫn theo chính sách pilot không trả lượt.

Khách lưu điểm nơi ở/địa danh gần nhà trước khi dùng voucher. Tọa độ được lưu trong tài khoản để làm điểm quy chiếu, không phải chứng minh cư trú/hành trình. API tính tuyến từ điểm lưu, bỏ qua tọa độ/km gửi kèm quote. Đổi điểm trong lúc giữ lô bị chặn; đổi điểm khi máy chủ đang tính tuyến khiến khách phải báo giá lại. Không định vị liên tục. UI nhắc cân nhắc khứ hồi hoặc đi vòng; chưa có bộ tối ưu hành trình qua điểm đến thứ hai.

Các vùng hỗ trợ xa phải tăng theo khoảng cách và không giảm tiền hỗ trợ. Máy chủ không tính được tuyến thì không thưởng khoảng cách. Next dùng Routes key nếu có; Edge có provider tùy chọn, tối đa20 lượt định tuyến/ngày ở tầng ứng dụng. Đây không thay quota/ngân sách Google Cloud.

Ship: hỗ trợ30% phí vận chuyển gốc, tối đa cap đã cấu hình và đủ biên/ngân sách. Khi chạm cap, phần khách trả có thể hơn70%. Ops báo phí gốc, máy chủ tính phần hỗ trợ và phần khách trả; sửa phí tạo revision mới và khách phải đồng ý đúng revision. Đơn tự nhận không đồng thời nhận trợ ship. Mặc định không cộng voucher với hỗ trợ nhận; vận hành chỉ bật cộng khi có tiền và đủ biên.

## Vận hành, ảnh và hoàn tiền

Form đăng lô dùng khoản tiệm nhận cố định, chi phí đầy đủ và biên tối thiểu. Chi phí phải có công, lỗi, phí và CAC phù hợp, không chỉ đóng gói. Lô do merchant đăng chờ ops duyệt chất lượng, ảnh, F và chi phí trước khi xuất hiện/đặt được; merchant không tự phê duyệt chi phí nền tảng. Mốc tham chiếu tùy chọn nhưng có giá thì phải kèm bằng chứng. Giờ nhận form là giờ Việt Nam; thời điểm kiểm lô do server ghi. Mỗi khách chỉ có một lô đang giữ hoặc đơn chưa trả tiền trong hạn, để hạn chế giữ tồn bằng nhiều yêu cầu.

Ảnh nhận JPEG/PNG/WebP tối đa2MB; chỉ ops hoặc merchant đã duyệt được tải. Kiểm chữ ký file, giới hạn20 lượt/người/ngày và100 lượt toàn hệ thống/ngày. Ảnh sản phẩm được lưu public trong bucket bep-nuc-lots; không tải giấy tờ, ảnh khách hoặc dữ liệu riêng tư. Không tự xóa EXIF: cần loại thông tin vị trí cá nhân trước khi tải. Tên file UUID không ghi đè; ảnh không đưa vào JSONB. Tính năng cần bucket và khóa server; thiếu cấu hình sẽ báo chưa sẵn sàng, không báo lưu thành công.

Khách tự hủy đơn chưa trả tiền. Đơn đã trả tiền có luồng báo sai lô/hỗ trợ; vận hành ghi quyết định, tạo khoản hoàn bằng số thực thu còn chưa hoàn. Đây là quy trình thủ công, không tự động hoàn ngân hàng. Hoàn sau tiệm bàn giao không xóa nghĩa vụ trả tiệm; chi phí lỗi cần quy trách nhiệm ngoài app theo thỏa thuận. Không tự đưa hàng đã giao trở lại tồn.

Sổ tiền tách tiền còn giữ, nghĩa vụ hoàn, nghĩa vụ tiệm, tiền đơn đã trả chưa bàn giao và dự giữ phí giao chưa có chứng từ. cash chỉ là dòng tiền đơn hàng, chưa vốn đội hoặc chi phí chung ngoài đơn; không xem là số dư toàn bộ tài khoản ngân hàng. Khoản chưa phân bổ sau các phần này vẫn không đồng nghĩa lợi nhuận. Đóng góp trong sổ dựa chi phí lô đã cấu hình, không tự suy CAC/công còn thiếu. Xác nhận nguồn tài trợ là cam kết của ops; hệ thống không tự xác minh số dư ngân hàng.

## Triển khai thật theo thứ tự

1. Sao lưu JSONB bc_state bằng kênh quản trị hạn chế quyền. Không reset database, không seed demo vào production. Kiểm các đơn cũ cần tiếp tục thanh toán/bàn giao.
2. Áp migration 202611010001_lot_images.sql nếu dùng tải ảnh; chỉ tạo/cấu hình bucket, không sửa dữ liệu giao dịch. Bucket chỉ chứa ảnh sản phẩm công khai; không cấp ghi trực tiếp cho anon/authenticated. Rà policy Storage có sẵn để không có policy rộng từ trước.
3. Cấu hình SUPABASE_SERVICE_ROLE_KEY chỉ ở server Next nếu dùng Next upload; Supabase Edge lấy khóa server từ môi trường nền tảng. Không đặt khóa vào biến NEXT_PUBLIC. Với Edge, GOOGLE_ROUTES_API_KEY là tùy chọn; bỏ key thì không có hỗ trợ khoảng cách tự động.
4. Triển khai backend và frontend cùng đợt. Bản MVP tĩnh thêm origin Supabase đã cấu hình vào img-src để hiển thị ảnh lô, giữ CSP script bằng hash và geolocation=().
5. Đơn mới mặc định chưa cấp ưu đãi: cap, quota9k và ngân sách đều0; enabled=false. Ops nhập nguồn tiền, ngân sách tuần, cap, quota9k, giá trị đơn tối thiểu, vùng xa và lựa chọn cộng; xác nhận tiền đã bảo đảm rồi bật. Mặc định dữ liệu DEMO có giá trị giả định riêng, không dùng làm chính sách thật.
6. Đăng lại các lô mới với metadata/ảnh và F cố định đã được tiệm đồng ý. Lô cũ thiếu bằng chứng không đưa vào catalogue mới; đơn cũ vẫn xử lý theo snapshot. Không tự đổi hồ sơ quán giả thành thật.
7. Chỉ mở pilot khi có ba tiệm thật đủ điều kiện, ngân hàng sẵn sàng, REAL_PILOT_ENABLED và ACCEPTING_ORDERS đúng cấu hình. Mua không voucher vẫn cần lô đủ thông tin/biên/tồn; dừng cấp ưu đãi không xóa quyền xem và xử lý đơn cũ.

## Giới hạn còn lại

Một JSONB aggregate và advisory lock toàn cục phù hợp cụm pilot nhỏ; chưa tối ưu nhiều thành phố. Chưa có xác minh cư trú, chống đa tài khoản bằng định danh mạnh, tối ưu hành trình khứ hồi, tự động xác minh chất lượng hay tự động chuyển tiền. Các thông số thương mại do vận hành chốt, không biến giả định nghiên cứu thành quyền lợi thật. Chưa có bằng chứng giao dịch Hà Nội để coi các ngưỡng cost/CM là đã hiệu chỉnh.

Các tài liệu trước01/11 mô tả voucher tối và chia90% là lịch sử; dùng tài liệu này cho giao dịch mới. Không áp chính sách mới hồi tố lên đơn cũ.

## Kết quả kiểm tra cục bộ

- 81kiểm thử đạt: bảo toàn nghiệp vụ cũ, quota tuần,9k cố định, ngân sách/biên, tranh tồn/voucher/ngân sách trên PostgreSQL nhúng, địa chỉ phía server, ship và revision, duyệt lô, hoàn sau bàn giao, quyền/định dạng/kích thước ảnh.
- TypeScript, Deno check cho Supabase Edge, build Next.js, build MVP tĩnh, build Pages và kiểm CSP/artifact đều qua.
- Luồng trình duyệt bằng tiền giả: chọn hoa, lưu điểm, chọn9k, giữ/tạo đơn, xác nhận tiền giả, bàn giao, báo sai lô/hoàn và giữ nghĩa vụ tiệm; ship30k có hỗ trợ9k, khách trả21k. Chín ảnh/trạng thái có kiểm tràn ngang; thêm ảnh giao diện ops. Đã xem ở390/768/1440px, không ghi nhận lỗi JavaScript trong luồng đó.
- Kiểm bố cục tự động không còn lỗi chặn; còn cảnh báo mang tính thẩm mỹ về mức chuyển động ít. Không tăng animation chỉ để đáp ứng điểm số.
- Ảnh upload được kiểm bằng test với nơi lưu giả lập; chưa tải ảnh lên bucket thật. Chưa áp migration hoặc triển khai production, chưa xác minh ngân hàng, cửa hàng hoặc giao nhận thực tế. Các kiểm tra này không phải traction thương mại hay nghiệm thu tài chính thực địa.
