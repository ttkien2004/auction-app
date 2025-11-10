# Sử dụng base image Node.js (phiên bản 18, một bản LTS tốt)
FROM node:18-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt các dependencies
# RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục /app
COPY . .

# Generate Prisma Client sau khi cài đặt
# Điều này đảm bảo client được build trong môi trường của container
# RUN npx prisma generate

# Expose cổng mà ứng dụng sẽ chạy (lấy từ biến môi trường)
# Chúng ta sẽ định nghĩa nó trong .env
EXPOSE ${APP_PORT}

# Lệnh mặc định để chạy ứng dụng (sẽ bị ghi đè bởi docker-compose)
CMD ["npm", "start"]