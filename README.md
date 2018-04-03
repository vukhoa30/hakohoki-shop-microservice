# hakohoki-shop-microservice

## Sử dụng:
- Cài pm2 globally
```
npm i -g pm2
```
- Cài module từng service, ví dụ:
```
cd ./account-service
npm i
```
- Khởi chạy tất cả service:
```
pm2 start process.yml
```
