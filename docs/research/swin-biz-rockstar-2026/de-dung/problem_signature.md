# Problem signature của DễDùng

## Thực thể và quan hệ

- Người lớn tuổi muốn hoàn thành một tác vụ số có ý nghĩa.
- Giao diện và quy trình thay đổi theo thiết bị, phiên bản và thời gian.
- Người dùng khó mô tả trạng thái hiện tại bằng thuật ngữ kỹ thuật.
- Người hỗ trợ thiếu ngữ cảnh và phải chẩn đoán từ xa.
- Nhà cung cấp dịch vụ mất người dùng khi onboarding thất bại.

## Cơ chế gốc

Khoảng trống diễn đạt cộng trôi phiên bản làm hướng dẫn chung sai hoặc không đủ. Hỗ trợ gia đình bù khoảng trống nhưng không ổn định, khó mở rộng và có thể tạo gánh nặng. Mục tiêu là tăng khả năng hoàn thành và tự thực hiện lại, không chỉ xử lý hộ.

## Constraints

### Hard

- Không xin OTP, mật khẩu hoặc quyền điều khiển toàn thiết bị trong MVP.
- Không xử lý chuyển tiền, chẩn đoán hoặc quyết định y tế.
- Hướng dẫn không được coi `unknown` là thành công.
- Phải có consent rõ khi nhận ảnh màn hình.

### Soft

- Không cần ứng dụng native.
- Không cần AI trả lời mọi tình huống.
- Không cần phục vụ mọi ứng dụng hoặc mọi nhóm tuổi.
- Người mua không nhất thiết là người dùng.

### Hidden

- Niềm tin và kiên nhẫn có thể quan trọng hơn độ thông minh của mô hình.
- Hướng dẫn nhanh lỗi thời có thể là chi phí lớn nhất.
- Người lớn tuổi có thể là nhà cung cấp hỗ trợ, không chỉ người nhận trợ giúp.
- Đối tác chỉ trả tiền nếu onboarding thành công giảm chi phí hoặc tăng sử dụng.

## Estimand

Tác động cần ước lượng: thay đổi trong tỷ lệ tự hoàn thành tác vụ và thời gian hỗ trợ khi dùng DễDùng, so với hướng dẫn hình ảnh tốt hoặc hỗ trợ qua điện thoại thông thường.

