# Problem Signature — Bếp Núc proposal review

## Signature trung lập

Một bên giữ tài nguyên sắp mất giá trị, một bên có nhu cầu nhưng phải chịu công sức để nhận, và một trung gian dùng phần chênh lệch thanh toán để trợ lực cho giao dịch. Quyền sử dụng tài nguyên có hạn và cạnh tranh giữa người nhận; tăng trợ lực có thể tạo giao dịch mới hoặc chỉ chuyển giá trị cho người vốn đã giao dịch. Cần chọn chính sách làm tăng giá trị hoàn tất ròng, bảo vệ khoản chuyển giao tối thiểu và ngân sách, đồng thời đo tác động lên các bên không được trợ lực.

## Primitive và quan hệ

- Holder: kiểm soát tài nguyên, có phương án thay thế và khoản chuyển giao tối thiểu.
- Recipient: có utility, outside option, effort và giới hạn nhu cầu tiêu thụ.
- Intermediary: xác định offer, settlement, phí và ngân sách.
- Resource: tồn hữu hạn, thời hạn, quality và trạng thái phân bổ.
- Incentive: chuyển tiền/giảm giá, chỉ cấp trong feasible set.
- Outcome: hoàn tất; financial contribution; thay đổi disposal/consumption; spillover.
- Constraint: protected transfer + cost + contribution ≤ payment; reservations ≤ available units; one redemption/order.
- Interference: allocation cho một recipient làm thay đổi availability/outcome của recipient khác.

## Nguyên mẫu

1. Phân bổ tài nguyên/ngân sách dưới ràng buộc payout và bất định response: optimal/robust allocation.
2. Đánh giá causal policy trong hệ thống nối nhau: constrained uplift + interference-aware experiment design.

## Estimand và đơn vị

Mục tiêu kinh doanh ban đầu: chênh lệch contribution/opportunity đủ điều kiện giữa policy bonus và no-extra-bonus. Xác định opportunity tại exposure trước can thiệp; không điều kiện vào purchase. Nếu randomize cluster/ca, estimand đổi sang contribution/cluster-ca với cửa sổ và normalizer đăng ký trước; không trộn các đơn vị.

Outcome phụ: completed pickup, recovered shop net revenue, residual eligible stock, regular sales, food consumed/discarded voluntarily reported. Không đổi pickup count thành net waste reduction.

## Điều giữ và điều nới

Giữ bộ ba voucher và một voucher/đơn theo người dùng. Fnet hard sau ký hợp đồng; an toàn/stock/pricing disclosure hard. b=5%, 8 điểm/km, giới hạn vùng, m và bonus budget là policy parameters có thể điều chỉnh sau dữ liệu. Không tự thay fixed payout thành commission hoặc thu GPS nền.

## Giả định phải kiểm định

Recurring eligible inventory; partner accepts settlement and staff burden; recipients actually collect; reliable origin/route proxy; offer-level costs measured; stock/carryover interference handled; post-pickup consumption does not offset shop waste improvement. Signature đã viết; chuyên gia nguồn chưa review, nên Gate3 chưa được nghiệm thu độc lập.
