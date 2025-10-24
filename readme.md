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
