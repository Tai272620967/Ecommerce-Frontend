# # Sử dụng hình ảnh Node.js chính thức
# FROM node:18-alpine

# # Thiết lập thư mục làm việc bên trong container
# WORKDIR /app

# # Copy package.json và package-lock.json vào container
# COPY package.json package-lock.json ./

# # Cài đặt các dependencies
# RUN npm install

# # Copy toàn bộ mã nguồn dự án vào container
# COPY . .

# # Build dự án Next.js
# RUN npm run build

# # Expose cổng mà Next.js sẽ chạy
# EXPOSE 3000

# # Command để khởi chạy ứng dụng Next.js
# CMD ["npm", "start"]

# Stage 1: Build ứng dụng Next.js
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file cần thiết để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file từ stage build (giai đoạn builder)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose cổng ứng dụng
EXPOSE 3000

# Command để khởi chạy ứng dụng
CMD ["npm", "start"]

