/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ⚡ Xuất site tĩnh (bắt buộc để chạy trên Amplify)
  reactStrictMode: false, // Tắt Strict Mode để kiểm tra lỗi gọi API 2 lần
  trailingSlash: true, // ⚡ Giúp đường dẫn hoạt động đúng trên Amplify
  images: {
    domains: ['localhost'], // Thêm domain của server backend
    unoptimized: true, // ⚡ Bắt buộc vì `next export` không hỗ trợ tối ưu ảnh
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
