FROM node:20-alpine

WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install --production

# Copy toàn bộ source code vào container
COPY . .

# Mở cổng Node app
EXPOSE 8086

# Chạy ứng dụng
CMD ["npm", "start"]
