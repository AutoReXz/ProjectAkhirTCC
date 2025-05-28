# Deployment Notes

## Cloud Run Environment Variables

### Reserved Variables
Cloud Run secara otomatis mengatur beberapa environment variables yang tidak boleh di-override:

- **PORT**: Secara otomatis di-set oleh Cloud Run (biasanya 8080)
- Variables lain yang mungkin reserved (perlu dicek jika ada error)

### Variables yang Di-deploy
Dari file `.env`, variables berikut yang akan di-deploy ke Cloud Run:

1. `CORS_ORIGIN` - URL frontend untuk CORS
2. `DB_HOST` - Database host
3. `DB_USER` - Database username
4. `DB_PASS` - Database password
5. `DB_NAME` - Database name
6. `DB_DIALECT` - Database dialect (mysql)
7. `ACCESS_TOKEN_SECRET` - JWT access token secret
8. `REFRESH_TOKEN_SECRET` - JWT refresh token secret
9. `ACCESS_TOKEN_EXPIRY` - JWT access token expiry time
10. `REFRESH_TOKEN_EXPIRY` - JWT refresh token expiry time
11. `NODE_ENV` - Automatically set to 'production'

### Variables yang Di-skip
- `PORT` - Reserved oleh Cloud Run, akan diatur otomatis

## Cloud Build Process

1. **Environment Setup**: Copy .env file dari Google Cloud Storage
2. **Docker Build**: Build container image
3. **Docker Push**: Push ke Container Registry
4. **Environment Verification**: Verify .env file dan list variables yang akan di-deploy
5. **Cloud Run Deploy**: Deploy dengan environment variables yang sudah di-filter

## Error Handling

### Common Errors:
1. **Reserved variable error**: Jika mencoba set PORT atau reserved variables lain
2. **Invalid variable names**: Variables harus format `[A-Z_][A-Z0-9_]*`
3. **Empty values**: Variables dengan key kosong akan di-skip
4. **Parsing errors**: Masalah dengan format .env file

### Solutions:
- Reserved variables di-skip otomatis
- Invalid names di-filter
- Better error logging untuk debugging
