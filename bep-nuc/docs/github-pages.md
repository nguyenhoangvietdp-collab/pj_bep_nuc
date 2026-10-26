# GitHub Pages — bản demo công khai

GitHub Pages chỉ phục vụ HTML/CSS/JS. Không triển khai API Next.js, cookie đăng nhập, PostgreSQL, xác nhận thanh toán hoặc pilot thật lên Pages.

## Build

```powershell
npm ci
npm test
npm run build:pages
```

Kết quả: `pages-site/out`. Mặc định đường dẫn `/pj_bep_nuc`; đổi `PAGES_BASE_PATH` thành `/ten-repo` hoặc chuỗi rỗng khi dùng domain gốc. Build staging `pages-site/public`, `.next`, `out` được bỏ qua trong Git. CSS, ảnh SVG minh họa và Inter kèm giấy phép được lấy từ ứng dụng chính. Không sao chép `.env`, database hoặc tài liệu riêng vào artifact.

Workflow `.github/workflows/pages.yml` ở gốc repo build và xuất bản khi push main. Settings → Pages → Source: GitHub Actions. URL công khai: https://nguyenhoangvietdp-collab.github.io/pj_bep_nuc/ . Không đặt Supabase service key hay thông tin ngân hàng trong workflow.

## Trải nghiệm demo

Trang chủ → chọn món/lọc theo ngân sách → chi tiết 1–3 suất → chọn một trong ba voucher → đơn chờ tiền giả → tự mô phỏng xác nhận tiền → tự mô phỏng nhận bữa. Mọi màn hình ghi rõ DEMO, không chuyển tiền. Món, địa chỉ, tồn và mã nhận đều giả. Không có tài khoản ngân hàng, đăng nhập, vận hành hoặc dữ liệu khách thật trên Pages.

Thời điểm catalogue cố định là 18:30 một tối minh họa; hạn giữ suất 10 phút tính theo đồng hồ trình duyệt. Voucher đã giữ/dùng không áp dụng vào đơn khác trong cùng lượt demo. Đơn lưu localStorage, khôi phục khi tải lại; nút bắt đầu lại xóa đơn và phục hồi lượt thử. Đây không phải hệ thống tồn chung giữa thiết bị hoặc bằng chứng đối soát/pilot. Người dùng có thể sửa dữ liệu trên thiết bị của họ.

Ứng dụng giao dịch chính và API vẫn được giữ riêng, không thay chính sách nghiệp vụ để chạy trên Pages. Muốn giao dịch thật cần backend/hosting thích hợp, kiểm tra vận hành và ngân sách riêng.

## Kiểm tra

`npm test` kiểm tra giá, stock/voucher, expiry, chống bấm lặp và khôi phục dữ liệu giả. Build phải có asset dưới basePath repo, không có API/env/database. Reload ở URL gốc và hash `#meals` / `#orders` không yêu cầu SPA fallback. Kiểm tra trực quan riêng khi trình duyệt cho phép; build thành công không chứng minh UX hoặc hiệu quả kinh doanh.

Nguồn: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages và https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages .

## Kết quả xuất bản 26/10/2026

GitHub Actions build/deploy thành công. Kiểm tra trực tiếp URL công khai: trang chủ tải được; lọc ngân sách 30.000đ còn bánh mì 22.800đ; chọn voucher 20%, tạo đơn giả, mô phỏng xác nhận tiền/nhận bữa và reload khôi phục đơn đã nhận. Đã reset lượt thử sau kiểm tra. 25 kiểm thử và TypeScript đã qua; artifact được kiểm tra basePath, font/giấy phép/ảnh và không chứa API/database/env. Chưa chạy thử với người dùng hoặc kiểm tra đầy đủ mọi viewport/thiết bị. Bản demo không thay cho kiểm chứng giao dịch thật.
