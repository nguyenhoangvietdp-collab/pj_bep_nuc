# Xuất bản Bếp Núc MVP với dịch vụ 0đ

## Tình trạng bàn giao

Mã frontend tĩnh, API Edge Functions, migration database và CI đã được chuẩn bị. Chưa có tài khoản Cloudflare/Supabase hoặc cấu hình Google OAuth của chủ dự án, nên chưa thể tạo ứng dụng online, kiểm tra Google login thật hay xác nhận database từ xa. Không có quán thật được nhập tự động và không mở nhận tiền. GitHub Pages chỉ còn là trang giới thiệu.

Không cần mua domain, không bật gói trả phí, không thêm thẻ để vượt hạn mức. Tài khoản/dự án phải thuộc bạn. Bạn tự chấp nhận điều khoản khi đăng ký; không gửi mật khẩu Google, database password, service_role key, secret key hay access token vào chat hoặc repo.

## 1. Tạo hai tài khoản miễn phí

- Cloudflare: https://dash.cloudflare.com/sign-up . Đăng ký tài khoản cá nhân; không cần mua domain.
- Supabase: https://supabase.com/dashboard . Đăng ký bằng tài khoản bạn sở hữu, tạo organization Free, rồi tạo project Bếp Núc; chọn vùng gần Việt Nam như Singapore nếu có. Lưu database password trong trình quản lý mật khẩu của bạn.
- Supabase Free cho tối đa hai project hoạt động. Dành project thứ hai cho staging nếu cần; không dùng chung database thử và database nhận tiền.

## 2. Tạo website Cloudflare Pages trước ở trạng thái chưa mở bán

Trong Cloudflare chọn Workers & Pages → Create → Pages → kết nối GitHub, chọn repo `nguyenhoangvietdp-collab/pj_bep_nuc`. Chỉ cấp quyền repo này.

Cấu hình:

| Trường | Giá trị |
|---|---|
| Branch | `main` |
| Root directory | `bep-nuc` |
| Framework | Next.js static export hoặc None |
| Build command | `npm run build:mvp` |
| Build output directory | `mvp-site/out` |
| Environment | `NODE_VERSION=22` |

Để trống cấu hình Supabase trong lần đầu. Website phải hiển thị “Đang chuẩn bị mở bán”, không có đơn hoặc ngân hàng giả. Ghi lại URL HTTPS được Cloudflare trả về; không tự đoán tên miền. Giữ auto-deploy theo main.

## 3. Chuẩn bị công cụ Supabase

Cài Node.js 22 nếu máy chưa có. Trong thư mục `bep-nuc`, dùng Supabase CLI chính thức qua npm:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

`YOUR_PROJECT_REF` lấy từ project thực tế. Hoàn thành đăng nhập trên tài khoản của bạn. Migration tạo dữ liệu trống, RLS, khóa quyền anon/authenticated và role runtime hạn chế. Không chạy seed demo trên project này.

Nếu CLI hỏi database password, nhập trong terminal của bạn. Không dán giá trị vào cuộc trò chuyện. Có thể dùng SQL Editor để chạy file `supabase/migrations/202610270001_initial.sql` nếu không dùng CLI; chỉ chạy trên project mới dành cho Bếp Núc.

## 4. Cấp kết nối database cho API, không cho browser

Migration tạo role `bep_nuc_runtime` ở trạng thái NOLOGIN. Trong SQL Editor riêng, đặt password mạnh và bật LOGIN cho role đó; thực hiện trực tiếp bằng thông tin bạn quản lý, không lưu câu lệnh chứa password vào Git. Role này chỉ được đọc/insert/update bảng `bc_state`, không được xóa bảng hoặc quản lý schema.

Lấy transaction-pooler connection string từ Connect của Supabase. Dùng role `bep_nuc_runtime` thay cho tài khoản owner; username pooler gồm role và project ref theo định dạng Supabase cung cấp. URL-encode password nếu có ký tự đặc biệt. Không dùng URL/role này trên Cloudflare frontend.

Sao chép `supabase/functions/.env.example` thành `supabase/functions/.env` (đã bị Git bỏ qua):

- `APP_ORIGIN`: đúng origin Cloudflare vừa được cấp, HTTPS, không có dấu `/` cuối.
- `MVP_DATABASE_URL`: connection string runtime qua pooler.
- `REAL_PILOT_ENABLED=false`, `ACCEPTING_ORDERS=false`.
- Hỗ trợ và ngân hàng để trống cho đến khi có thông tin được vận hành xác nhận.

```powershell
npx supabase secrets set --env-file supabase/functions/.env
npx supabase functions deploy bep-nuc --use-api
```

Function dùng auth/project URL do Supabase cấp sẵn; không cần đưa service_role vào frontend. `verify_jwt=false` ở gateway chỉ để catalogue/health công khai; mọi nhánh hồ sơ/giao dịch/export tự xác minh Bearer token, duyệt tài khoản và quyền phía server. Không tắt lớp xác minh đó.

## 5. Bật Google login

Tạo/chọn project miễn phí tại https://console.cloud.google.com/ . Không cần bật billing cho bước cấu hình Google sign-in.

- Cấu hình Google Auth Platform/OAuth consent với tên Bếp Núc, email hỗ trợ có người quản lý.
- Tạo OAuth client loại Web application.
- Authorized redirect URI: dùng chính xác callback URL Supabase hiển thị trong Authentication → Sign In / Providers → Google. Thông thường là `https://PROJECT_REF.supabase.co/auth/v1/callback`, nhưng lấy từ dashboard thực tế.
- Điền Google Client ID và Client Secret vào provider Google của Supabase. Không đưa Client Secret vào Cloudflare hoặc repo.
- Supabase Authentication → URL Configuration: Site URL và allowed Redirect URL là URL gốc Cloudflare; chỉ cho phép domain staging riêng nếu có. Không dùng wildcard mọi `pages.dev`.
- Ở trạng thái Google consent testing, thêm các tài khoản pilot vào test users. Chỉ yêu cầu quyền nhận diện cơ bản, email và hồ sơ; không xin Gmail/Drive.

## 6. Nối frontend với Supabase

Cloudflare Pages → Settings → Environment variables (production):

```text
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PUBLIC_PUBLISHABLE_OR_ANON_KEY
```

Dùng Project URL và publishable key, hoặc legacy anon key, từ Supabase. Đây là cấu hình public; tuyệt đối không thay bằng secret/service_role key. Build có kiểm tra loại key và sẽ từ chối key đặc quyền.

Redeploy Cloudflare. Mở `#/login`, đăng nhập Google, kiểm tra callback quay lại đúng món/nháp. Người mới phải ở trạng thái chờ duyệt, không tự có quyền đặt hoặc vận hành. Trong bản này không dùng email OTP nên không cần SMTP/domain gửi thư.

## 7. Cấp tài khoản vận hành đầu tiên

Sau khi người phụ trách đăng nhập Google một lần, lấy UID từ Supabase Authentication. Trên máy riêng, cấu hình `APP_MODE=production` và `DATABASE_URL` bằng kết nối runtime trong `.env.local` (Git bỏ qua), rồi chạy:

```powershell
npm run db:staff -- SUPABASE_USER_ID ops
```

Đăng xuất/đăng nhập lại và mở `#/internal`. Giao diện quán/vận hành dùng cùng API với frontend nhưng backend quyết định quyền. Có thể cấp merchant bằng script hiện có sau khi tạo đúng shop. Không để UI đổi vai trò công khai và không cấp quyền ops dựa vào trường role do client gửi.

## 8. Bật liên kết từ GitHub Pages

GitHub repo → Settings → Secrets and variables → Actions → Variables: tạo `MVP_APP_URL` bằng URL Cloudflare đã kiểm tra. Chạy lại workflow “Publish Bep Nuc introduction to GitHub Pages”. Nút mở ứng dụng chỉ xuất hiện khi có URL HTTPS này; Pages không nhận đăng nhập/đặt hàng.

## 9. Trước ca nhận tiền đầu tiên

- Nhập và xác minh tối thiểu ba quán, nguồn dư lặp lại, điều khoản, menu, khoản quán nhận và món chịu được voucher 20%.
- 14 ảnh chỉ là tài sản giới thiệu/ứng viên menu; không tự tạo quán thật, tọa độ, tồn hoặc giá đã xác minh từ tên file.
- Kiểm tra hỗ trợ, ngân hàng, đối soát, quán giao một lần, hoàn tiền và backup/restore trên staging trước. Kiểm tra giới hạn gói Free trong dashboard.
- Chỉ khi đủ điều kiện mới đặt `REAL_PILOT_ENABLED=true`, `ACCEPTING_ORDERS=true` và thông tin ngân hàng/hỗ trợ thật trong secrets. Không bật chỉ để làm website hết trạng thái “chưa mở bán”.
- Maps không chạy, không xin geolocation, không có thưởng khoảng cách. Giữ voucher gốc và chuyển khoản xác nhận thủ công.

## 10. Vận hành miễn phí và sự cố

Kiểm tra usage database, egress và Edge invocations trước/sau mỗi ca. 70% hạn mức: rà soát; 85%: không tăng pilot, đặt `ACCEPTING_ORDERS=false` nếu cần ưu tiên các đơn hiện có. Không bật gói trả phí tự động hoặc dùng ping để lách chính sách tạm dừng.

Cuối ca, xuất đối soát trong khu vực ops. Backup đầy đủ database bằng `pg_dump` hoặc Supabase CLI về máy riêng, mã hóa và giữ bảy bản; file xuất đối soát đã ẩn mã nhận không thay thế backup phục hồi. Không lưu backup chứa khách hàng vào repo hoặc GitHub Actions artifact. Thử restore vào staging trước khi gọi đó là backup dùng được.

Supabase Free có thể tạm dừng sau thời gian ít hoạt động; kiểm tra và khôi phục từ dashboard khi cần trước ca. Khi hết quota hoặc backend không truy cập được, dừng đơn mới và dùng kênh hỗ trợ thật để xử lý đơn còn tồn. Không có cam kết uptime 24/7 từ cấu hình này.

## Kiểm tra cục bộ/CI

```powershell
npm test
npm run type-check
npx deno check --config supabase/functions/bep-nuc/deno.json supabase/functions/bep-nuc/index.ts
npm run build:mvp
npm run check:static
npm run build:pages
```

`mvp-site/out` là gói Cloudflare. Có thể điền public keys vào `.env.mvp.local` theo `.env.mvp.example` để build trên máy; script chỉ nạp file đó cho build:mvp. Bản không có keys là closed preview, không phải nghiệm thu kết nối thật. CSP hash script được sinh sau build, ảnh/font được phục vụ cục bộ.

Nguồn: https://developers.cloudflare.com/pages/platform/limits/ ; https://supabase.com/pricing ; https://supabase.com/docs/guides/functions/connect-to-postgres ; https://supabase.com/docs/guides/auth/social-sign-in/auth-google .
