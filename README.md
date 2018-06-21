# hakohoki-shop-microservice

## Mô tả:
- Sử dụng cấu trúc microservices, đáp ứng một số đặc điểm cơ bản: mỗi service độc lập về tính năng, dữ liệu; các service giao tiếp theo cơ chế Messaging, RPC, có health-check trước khi thực hiện giao tiếp request/response; API Gateway proxy request đến service cần thiết.
- Các công nghệ, thư viện sử dụng: NodeJS/Express, PostgreSQL/knexJS, MongoDB/mongoose, socket.IO, RabbitMQ, Redis, pm2, ReactJS, React Native, Redux.
- Yêu cầu nghiệp vụ cơ bản: Tra cứu sản phẩm, đặt/mua hàng, bình luận, theo dõi sản phẩm, quản lý sản phẩm, đơn hàng, notification, email, SMS.

## Phần mềm yêu cầu:
- NodeJS
- RabbitMQ (đang chạy local dạng server hoặc service)
- Redis (đang chạy local dạng server hoặc service)

## Sử dụng:
- Cài pm2 globally
```
npm i -g pm2
```
- Cài đặt toàn bộ module:
```
npm run ins
```
Hoặc cài module từng service và UI, ví dụ:
```
cd ./account-service
npm i
```
- Khởi chạy tất cả service:
```
pm2 start process.yml
```
