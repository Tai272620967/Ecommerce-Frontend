# MUJI Frontend - Hướng dẫn cài đặt và chạy

Dự án Frontend sử dụng Next.js 14 với TypeScript và React 18.

## Yêu cầu hệ thống

- **Node.js**: 18.x hoặc cao hơn (khuyến nghị 20.x)
- **npm**: 9.x hoặc cao hơn (hoặc yarn/pnpm)
- **Backend API**: Backend phải đang chạy trên http://localhost:8080

## Cài đặt và chạy dự án

### Bước 1: Cài đặt dependencies

```bash
# Di chuyển vào thư mục frontend
cd muji-frontend-aws-cicd

# Cài đặt packages
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Bước 2: Cấu hình môi trường

Tạo file `.env.local` trong thư mục root của frontend:

```bash
# Tạo file .env.local
touch .env.local
```

Thêm các biến môi trường sau vào file `.env.local`:

```env
# API Base URL - URL của backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Domain (tùy chọn)
DOMAIN=localhost
```

**Lưu ý quan trọng:**
- File `.env.local` sẽ không được commit vào git (đã có trong .gitignore)
- Tất cả biến môi trường bắt đầu với `NEXT_PUBLIC_` sẽ được expose ra client-side
- Sau khi thay đổi `.env.local`, bạn cần restart development server

### Bước 3: Chạy development server

```bash
# Chạy development server
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Ứng dụng sẽ chạy tại: **http://localhost:3000**

### Bước 4: Kiểm tra ứng dụng

Mở trình duyệt và truy cập:
- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8080 (phải đang chạy)

## Cấu trúc dự án

```
muji-frontend-aws-cicd/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── auth/                 # Authentication pages
│   │   ├── cart/                 # Shopping cart
│   │   ├── components/           # Reusable components
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── product/              # Product pages
│   │   ├── profile/              # User profile
│   │   ├── redux/                # Redux store configuration
│   │   ├── storage/              # Local storage utilities
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Utility functions
│   ├── assets/                   # Assets (SCSS, images)
│   └── styles/                   # Global styles
├── public/                        # Static files
│   └── images/                   # Public images
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Scripts có sẵn

```bash
# Development
npm run dev          # Chạy development server (port 3000)

# Production
npm run build        # Build ứng dụng cho production
npm run start        # Chạy production server

# Linting
npm run lint         # Chạy ESLint để kiểm tra code
```

## Cấu hình quan trọng

### API Configuration

File: `src/app/utils/axiosConfig.ts`

Frontend sử dụng axios để gọi API. Base URL được lấy từ biến môi trường:

```typescript
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // ...
});
```

### Image Configuration

File: `next.config.mjs`

Next.js được cấu hình để load images từ backend:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: '/uploads/images/**',
    },
  ],
}
```

### Authentication

Frontend sử dụng JWT tokens được lưu trong cookies/localStorage. Token được tự động attach vào mỗi request (trừ các public endpoints).

## Tính năng chính

### Authentication
- Đăng nhập / Đăng ký
- Xác thực email
- JWT token management
- Protected routes

### Product Management
- Danh sách sản phẩm
- Chi tiết sản phẩm
- Tìm kiếm và lọc sản phẩm
- Phân trang

### Shopping Cart
- Thêm/xóa sản phẩm vào giỏ hàng
- Cập nhật số lượng
- Tính tổng tiền

### User Profile
- Xem và chỉnh sửa thông tin cá nhân
- Quản lý địa chỉ
- Lịch sử đơn hàng

### Admin Dashboard
- Quản lý sản phẩm
- Quản lý categories
- Quản lý users
- Quản lý orders
- Thống kê và báo cáo

### Chatbot
- Tích hợp OpenAI chatbot
- Gợi ý sản phẩm

## Dependencies chính

### UI Libraries
- **Ant Design**: Component library
- **Bootstrap & React Bootstrap**: CSS framework
- **Sass**: CSS preprocessor

### State Management
- **Redux Toolkit**: State management
- **React Redux**: React bindings cho Redux
- **Redux Persist**: Persist Redux state

### Forms & Validation
- **React Hook Form**: Form management
- **Yup**: Schema validation
- **@hookform/resolvers**: Yup resolver cho React Hook Form

### HTTP Client
- **Axios**: HTTP client để gọi API

### Charts
- **Chart.js & React Chart.js 2**: Charts cho dashboard
- **Recharts**: Alternative chart library

### Utilities
- **Lodash**: Utility functions
- **date-fns**: Date manipulation
- **classnames**: Conditional class names

## Troubleshooting

### Lỗi kết nối API

1. **Kiểm tra backend đang chạy:**
```bash
curl http://localhost:8080/actuator/health
```

2. **Kiểm tra biến môi trường:**
```bash
# Trong file .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

3. **Kiểm tra CORS trên backend:**
Đảm bảo backend cho phép requests từ http://localhost:3000

### Lỗi khi build

1. **Xóa cache và build lại:**
```bash
rm -rf .next
npm run build
```

2. **Kiểm tra TypeScript errors:**
```bash
npm run lint
```

### Lỗi port 3000 đã được sử dụng

Chạy trên port khác:

```bash
npm run dev -- -p 3001
```

Hoặc thay đổi trong `package.json`:

```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

### Lỗi module not found

1. **Xóa node_modules và cài lại:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Kiểm tra Node.js version:**
```bash
node -v
# Phải là 18.x hoặc cao hơn
```

### Lỗi images không hiển thị

1. **Kiểm tra Next.js image configuration** trong `next.config.mjs`
2. **Kiểm tra URL của images** từ backend
3. **Kiểm tra CORS** trên backend cho image endpoints

### Lỗi authentication

1. **Kiểm tra JWT token** trong browser DevTools (Application > Cookies/Local Storage)
2. **Kiểm tra token expiration** - có thể cần refresh token
3. **Kiểm tra API endpoint** `/auth/login` và `/auth/refresh`

## Development Tips

### Hot Reload

Next.js tự động reload khi bạn save file. Nếu không hoạt động:

1. Kiểm tra file đã được save
2. Kiểm tra console không có errors
3. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

### Debugging

1. **Browser DevTools:**
   - Console: Xem errors và logs
   - Network: Xem API requests
   - Application: Xem cookies và localStorage

2. **VS Code Debugging:**
   - Cài đặt extension "Debugger for Chrome"
   - Tạo `.vscode/launch.json` để debug

### Code Formatting

Sử dụng Prettier (nếu có cấu hình):

```bash
npx prettier --write .
```

## Production Build

### Build ứng dụng

```bash
npm run build
```

Build output sẽ ở trong thư mục `.next/`

### Chạy production server

```bash
npm run start
```

### Docker Build (nếu có Dockerfile)

```bash
docker build -t muji-frontend .
docker run -p 3000:3000 muji-frontend
```

## Environment Variables

### Development (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
DOMAIN=localhost
```

### Production (.env.production)

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
DOMAIN=yourdomain.com
```

**Lưu ý:** 
- Không commit file `.env.local` vào git
- Sử dụng `.env.example` để document các biến môi trường cần thiết
- Tất cả biến `NEXT_PUBLIC_*` sẽ được expose ra client-side

## Testing

### Manual Testing Checklist

- [ ] Đăng nhập/Đăng ký
- [ ] Xem danh sách sản phẩm
- [ ] Tìm kiếm sản phẩm
- [ ] Thêm sản phẩm vào giỏ hàng
- [ ] Checkout và tạo đơn hàng
- [ ] Xem profile và chỉnh sửa
- [ ] Admin dashboard (nếu là admin)

