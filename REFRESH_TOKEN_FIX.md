# Solusi Masalah Refresh Token di Cloud Deployment

## Masalah
Refresh token tersimpan di cookies saat local development, tapi tersimpan di localStorage saat deploy ke cloud.

## Penyebab
1. **SameSite Policy**: Setting `sameSite: 'strict'` memblokir cookies cross-domain
2. **Domain Mismatch**: Frontend (App Engine) dan Backend (Cloud Run) berada di domain berbeda
3. **Konfigurasi URL**: Frontend masih menggunakan localhost URL

## Solusi yang Diterapkan

### 1. Backend Changes (`auth.controller.js`)
```javascript
// Cookie configuration yang mendukung cross-domain
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
});
```

### 2. Frontend Changes (`config.js`)
```javascript
// Auto-detect environment berdasarkan hostname
BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? "http://localhost:3000/api"
    : "https://YOUR_BACKEND_CLOUD_RUN_URL/api"
```

### 3. Environment Variables
Tambahkan ke `.env` production:
```
NODE_ENV=production
COOKIE_DOMAIN=.your-domain.com  # Set domain yang sama untuk frontend dan backend
CORS_ORIGIN=https://your-frontend-url.appspot.com
```

## Langkah Deploy

1. **Update Backend Environment**:
   - Set `NODE_ENV=production`
   - Set `COOKIE_DOMAIN` jika menggunakan subdomain yang sama
   - Set `CORS_ORIGIN` ke URL frontend App Engine

2. **Update Frontend Config**:
   - Ganti `YOUR_BACKEND_CLOUD_RUN_URL` dengan URL Cloud Run yang sebenarnya

3. **Redeploy kedua service**

## Alternatif Jika Masih Bermasalah

Jika domain benar-benar berbeda dan tidak bisa menggunakan cookies cross-domain, gunakan pendekatan hybrid:

1. Simpan refresh token di localStorage (dengan enkripsi)
2. Tambahkan rotation refresh token untuk keamanan
3. Implementasi auto-logout jika detect suspicious activity

## Testing
- Local: Cookies harus bekerja normal
- Production: Cookies harus tersimpan cross-domain dengan sameSite='none'
