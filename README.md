# Giải đấu Esports - hướng dẫn deploy Vercel

## 1. Đưa code lên GitHub
Tạo repo mới, đẩy 4 mục: `index.html`, `api/state.js`, `package.json`, `README.md`.

## 2. Import vào Vercel
Vercel Dashboard → Add New → Project → chọn repo → Deploy (không cần chỉnh Build settings).

## 3. Tạo database
Project → tab **Storage** → **Create Database** (hoặc Marketplace) → chọn **Upstash Redis** → gói Free → Connect to Project.
Vercel tự thêm biến môi trường `KV_REST_API_URL` và `KV_REST_API_TOKEN`.

## 4. Đặt mật khẩu admin
Project → Settings → Environment Variables → thêm:
- Name: `ADMIN_PASSWORD`
- Value: mật khẩu bạn chọn (dài, khó đoán)
- Áp dụng cho Production, Preview, Development

## 5. Deploy lại
Deployments → ba chấm ở bản mới nhất → **Redeploy** (để nhận biến môi trường).

## 6. Dùng
Mở trang → bấm **🔑 Đăng nhập admin** → nhập mật khẩu → tab **⚙️ Quản trị** xuất hiện.
Người xem không đăng nhập chỉ đọc được. Trang tự làm mới mỗi 15 giây.
