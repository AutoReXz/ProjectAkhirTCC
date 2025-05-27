# Menggunakan Node.js 18 Alpine untuk ukuran image yang lebih kecil
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Buat user non-root untuk keamanan
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set ownership dari /app ke user nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start aplikasi
CMD ["npm", "start"]
