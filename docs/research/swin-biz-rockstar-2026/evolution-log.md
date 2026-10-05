# Evolution log cho quy trình chọn ý tưởng

## Batch 1 — 04/10/2026

### OBS-1: Lệch phiên bản

- Phạm vi: mục “Tám ứng viên”, bảng xếp hạng và phép tính trong báo cáo gốc.
- Nguyên nhân: bản điều chỉnh công nghệ được tách sang tệp mới nhưng báo cáo chính vẫn chứa ứng viên cũ.
- Tần suất: xuất hiện ở ba phần liên kết với nhau.
- Mức độ: degrading; người đọc có thể chọn nhầm phiên bản.

### OBS-2: Độ sâu không đồng đều

- Phạm vi: 8/8 ứng viên.
- Nguyên nhân: mỗi ý tưởng có mô tả nhưng thiếu một schema chung cho dữ liệu, baseline, người mua và điều kiện dừng.
- Tần suất: lặp lại trên toàn danh sách.
- Mức độ: degrading; khó so sánh và khó quyết định.

### OBS-3: Nguy cơ trang trí công nghệ

- Phạm vi: các ý tưởng từng dựa chủ yếu vào marketplace, QR hoặc AI tổng quát.
- Nguyên nhân: chưa bắt buộc chứng minh quyết định nào được cải thiện khi bật công nghệ.
- Tần suất: nhiều ứng viên đời đầu.
- Mức độ: blocking đối với định hướng Technology.

## Mutation được chấp nhận

Áp dụng schema bắt buộc: người dùng; người mua; quyết định cần cải thiện; dữ liệu; kiến trúc MVP; baseline; chỉ số kỹ thuật; kết quả người dùng; kinh tế đơn vị; lợi thế; rủi ro; kill criteria.

Thêm cửa kiểm chứng trước code. Chỉ ứng viên có quyền tiếp cận dữ liệu hoặc chuyên gia mới vào MVP.

## Gate

- Specificity: chỉ thay quy trình chọn ý tưởng cho cuộc thi.
- Testability: có thể kiểm tra bằng việc mọi ứng viên đều nêu người dùng, người mua, quyết định, dữ liệu, MVP, baseline, chỉ số, kinh tế, lợi thế, rủi ro và kill criteria.
- Blast radius: thấp; không thay đổi tiêu chí chính thức của cuộc thi.
- Consistency: phù hợp lean startup và yêu cầu bằng chứng của báo cáo.

Không tạo skill mới. Đây là kiến thức theo dự án, chưa có bằng chứng từ nhiều dự án độc lập để biện minh cho mutation cấp hệ thống.

## Reload

Tài liệu hiện hành: `dao-sau-tam-ung-vien.md`. `bao-cao-y-tuong.md` giữ nguồn và lịch sử phân tích. `dinh-huong-cong-nghe.md` là bước trung gian.

## Batch 2 — 05/10/2026

### OBS-4: Kênh nhắn tin có chính sách outbound

- Phạm vi: BếpCanh qua Zalo OA.
- Nguyên nhân: mô hình trước đó để bot nhắc dự báo theo lịch mà chưa đối chiếu cửa sổ gửi tin, loại tin và quota.
- Tần suất: một use case trọng yếu.
- Mức độ: degrading; có thể thiết kế MVP phụ thuộc vào tin không gửi được.

### OBS-5: Điều kiện OA ảnh hưởng khả năng pilot

- Phạm vi: đội sinh viên chưa biết đã có pháp nhân/hộ kinh doanh hay OA đối tác hay chưa.
- Nguyên nhân: giả định quyền tạo OA và App chưa được kiểm tra.
- Tần suất: một rào cản mở đầu.
- Mức độ: blocking cho thử nghiệm OA thật nếu không có chủ thể đủ điều kiện.

### Mutation áp dụng

Thêm kiểm tra platform capability, chi phí, quota outbound, quyền OA/App, điều kiện pháp lý, ánh xạ tenant và kênh dự phòng trước khi chốt kiến trúc.

### Gate

Specific với tích hợp nền tảng nhắn tin; kiểm tra được bằng spike API và một pilot đối tác; blast radius thấp; không tạo skill toàn cục vì đây là một trường hợp dự án duy nhất.

### Reload

Tài liệu khả thi OA: `bepcanh-zalo-oa.md`. Nguồn chính sách cập nhật trong `sources.csv` S39–S47.
