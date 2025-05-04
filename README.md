## Deployment
# Deploy backend lên trước
- Mở docker desktop 
- chạy cd vào backend chạy docker build -t yourdockerhubusername/your-image-name:lastest .
- chạy docker login
- chạy docker push yourdockerhubusername/your-image-name:lastest
- Truy cập Docker Hub tại: https://hub.docker.com/
- Tìm image bạn vừa push lên và copy
- vào https://dashboard.render.com/
- add new -> web service -> existing image -> paste -> đợi cửa sổ bật lên chạy xong copy cái ấy (web backend)
# Deploy frontend 
- Copy link web trên vào .env của t
- Mở tạo repo github (chỉ chứa frontend) 
- Mở vercel (quan trọng) copy biến .env vào trong mục tạo web (có mục để .env)
- xong, mở web và thưởng thức 
