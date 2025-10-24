# Express.js API

API read-only untuk integrasi dengan sistem eksternaluntuk membaca status permintaan.

## 🚀 Instalasi

1. Clone repository
2. Install dependencies:
```bash
npm install
```

3. Jalankan aplikasi:
```bash
# Development
npm run dev

# Production
npm start
```

## 📋 Endpoints

### Health Check
```
GET /api/v1/health
```

### Get Request Status
```
GET /api/v1/request-status/:id
Headers: Authorization: Bearer <token>
```

### Get Request List
```
GET /api/v1/request-list?user_id=1&page=1&limit=10&status=approved
Headers: Authorization: Bearer <token>
```

## ⚠️ Contoh Testing Menggunakan Postman
<img width="1980" height="804" alt="image" src="https://github.com/user-attachments/assets/44a873e5-3a2f-413e-961a-3d49fdd52684" />

1. Pilih **Auth type** → JWT Bearer
2. Pilih **Algorithm** → HS256
3. Masukkan **Secret** → ABCDE12345

