# Language Learning Platform 🌐

Platform pembelajaran bahasa asing yang komprehensif dengan fitur quiz interaktif, tracking progress, dan sistem komentar. Dibangun dengan arsitektur modern menggunakan Node.js untuk backend dan vanilla JavaScript untuk frontend, siap untuk deployment di Google Cloud Platform.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Arsitektur Project](#-arsitektur-project)
- [Quick Start](#-quick-start)
- [Instalasi dan Setup](#-instalasi-dan-setup)
- [Deployment ke Google Cloud](#-deployment-ke-google-cloud)
- [API Documentation](#-api-documentation)
- [Struktur Database](#-struktur-database)
- [Kontribusi](#-kontribusi)

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- Sistem login dan registrasi dengan enkripsi password (Argon2)
- JWT-based authentication dengan refresh token
- Role-based access control (User/Admin)
- Auto-logout saat token expired

### 📚 Manajemen Pembelajaran
- **Lessons**: Materi pembelajaran dengan konten yang kaya
- **Quizzes**: Quiz interaktif dengan multiple choice dan scoring otomatis
- **Progress Tracking**: Pelacakan kemajuan belajar pengguna
- **Comments**: Sistem komentar untuk diskusi pada setiap lesson

### 👨‍💼 Panel Admin
- Dashboard admin untuk mengelola konten
- Manajemen user dan progress monitoring
- Analytics dan reporting

### 🌟 User Experience
- Interface yang responsive dan user-friendly
- Real-time progress updates
- Interactive quiz dengan immediate feedback
- Comment system untuk community engagement

## 🛠 Teknologi yang Digunakan

### Backend
- **Framework**: Node.js dengan Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT (jsonwebtoken) + Refresh Token
- **Password Security**: Argon2
- **Validation**: Express-validator
- **CORS**: Configured untuk multi-origin support
- **Logging**: Morgan untuk request logging

### Frontend
- **Core**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS modern dengan Flexbox/Grid
- **API Communication**: Fetch API
- **State Management**: LocalStorage untuk session persistence

### DevOps & Cloud
- **Containerization**: Docker
- **CI/CD**: Google Cloud Build
- **Hosting**: Google Cloud Run (Backend) & App Engine (Frontend)
- **Database**: Cloud SQL (MySQL)
- **Storage**: Google Cloud Storage untuk assets

## 🏗 Arsitektur Project

```
📁 TugasAkhir/
├── 📁 be/ (Backend - Node.js API)
│   ├── 📄 server.js                    # Entry point
│   ├── 📄 Dockerfile                   # Container configuration
│   ├── 📄 package.json                 # Dependencies & scripts
│   └── 📁 src/
│       ├── 📁 config/                  # Database & app configuration
│       ├── 📁 controllers/             # Request handlers
│       ├── 📁 models/                  # Sequelize models
│       ├── 📁 routes/                  # API routes
│       ├── 📁 middlewares/             # Custom middlewares
│       ├── 📁 migrations/              # Database schema migrations
│       ├── 📁 seeders/                 # Sample data
│       └── 📁 utils/                   # Helper utilities
│
├── 📁 fe/ (Frontend - Static Web App)
│   ├── 📄 index.html                   # Landing page
│   ├── 📄 login.html                   # Authentication pages
│   ├── 📄 lesson.html                  # Learning interface
│   ├── 📄 progress.html                # Progress tracking
│   ├── 📄 admin.html                   # Admin dashboard
│   ├── 📄 app.yaml                     # App Engine config
│   └── 📁 assets/
│       ├── 📁 css/                     # Stylesheets
│       └── 📁 js/                      # JavaScript modules
│
├── 📄 cloudbuild.backend.yaml          # Backend CI/CD pipeline
├── 📄 cloudbuild.frontend.yaml         # Frontend CI/CD pipeline
└── 📄 DEPLOYMENT_NOTES.md              # Deployment documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- MySQL (v8.0+)
- Git
- Google Cloud SDK (untuk deployment)

### 1. Clone Repository
```bash
git clone <repository-url>
cd TugasAkhir
```

### 2. Setup Backend
```bash
cd be
npm install
cp .env.example .env  # Edit dengan konfigurasi database Anda
npm run db:create
npm run db:migrate
npm run db:seed
npm run dev  # Jalankan di development mode
```

### 3. Setup Frontend
```bash
cd ../fe
# Untuk development local
python -m http.server 8080
# Atau gunakan Live Server di VS Code
```

### 4. Access Application
- Backend API: `http://localhost:3000`
- Frontend: `http://localhost:8080`
- API Documentation: `http://localhost:3000/api/docs`

## 🔧 Instalasi dan Setup

### Backend Setup Detail

1. **Environment Configuration**
   ```bash
   cd be
   cp .env.example .env
   ```
   
   Edit file `.env` dengan konfigurasi Anda:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASS=your_mysql_password
   DB_NAME=language_learning_db
   DB_DIALECT=mysql
   
   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:8080
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

2. **Database Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Create database
   npm run db:create
   
   # Run migrations
   npm run db:migrate
   
   # Seed sample data
   npm run db:seed
   
   # Verify database connection
   npm run db:check
   ```

3. **Available Scripts**
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with nodemon
   npm run db:reset   # Reset database (drop, create, migrate, seed)
   npm run db:check   # Test database connection
   ```

### Frontend Setup Detail

1. **Configuration**
   Edit `fe/assets/js/config.js` untuk mengatur endpoint API:
   ```javascript
   const API_CONFIG = {
       BASE_URL: "http://localhost:3000/api",
       TIMEOUT: 30000
   };
   ```

2. **Local Development Server Options**
   
   **Option 1: Python HTTP Server**
   ```bash
   cd fe
   python -m http.server 8080
   ```
   
   **Option 2: Node.js http-server**
   ```bash
   npm install -g http-server
   cd fe
   http-server -p 8080 -c-1
   ```
   
   **Option 3: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click pada `index.html`
   - Select "Open with Live Server"

## ☁️ Deployment ke Google Cloud

### Setup Google Cloud Project

1. **Create & Configure Project**
   ```bash
   # Login to Google Cloud
   gcloud auth login
   
   # Create new project (optional)
   gcloud projects create your-project-id
   
   # Set active project
   gcloud config set project your-project-id
   
   # Enable required APIs
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   gcloud services enable appengine.googleapis.com
   ```

2. **Setup Cloud SQL Database**
   ```bash
   # Create Cloud SQL instance
   gcloud sql instances create language-learning-db \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=asia-southeast2
   
   # Set root password
   gcloud sql users set-password root \
     --host=% \
     --instance=language-learning-db \
     --password=your-secure-password
   
   # Create application database
   gcloud sql databases create language_learning_db \
     --instance=language-learning-db
   ```

3. **Upload Environment Configuration**
   ```bash
   # Upload .env file to Cloud Storage
   gsutil mb gs://your-project-id-config
   gsutil cp be/.env gs://your-project-id-config/
   ```

### Backend Deployment (Cloud Run)

1. **Setup Cloud Build**
   ```bash
   # Submit build dengan custom environment
   gcloud builds submit \
     --config=cloudbuild.backend.yaml \
     --substitutions=_ENV=gs://your-project-id-config/.env \
     .
   ```

2. **Deploy to Cloud Run**
   ```bash
   # Deploy akan otomatis dilakukan via Cloud Build
   # Atau manual deploy:
   gcloud run deploy bahasa-app-backend \
     --image=gcr.io/your-project-id/bahasa-app-backend \
     --platform=managed \
     --region=asia-southeast2 \
     --allow-unauthenticated
   ```

### Frontend Deployment (App Engine)

1. **Configure app.yaml**
   ```yaml
   runtime: python39
   
   handlers:
   - url: /assets
     static_dir: assets
   
   - url: /.*
     static_files: index.html
     upload: index.html
   ```

2. **Deploy Frontend**
   ```bash
   cd fe
   # Update config.js dengan backend URL produksi
   # Edit assets/js/config.js
   
   gcloud app deploy
   ```

### Post-Deployment

1. **Update CORS Configuration**
   Update environment variable `CORS_ORIGIN` di Cloud Run dengan URL frontend produksi.

2. **Database Migration di Production**
   ```bash
   # Connect to Cloud Run instance untuk migration
   gcloud run services proxy bahasa-app-backend --port=8080
   
   # Atau setup Cloud Build untuk auto-migration
   ```

## 📖 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/refresh     # Refresh access token
POST /api/auth/logout      # User logout
```

### Lesson Endpoints
```
GET    /api/lessons        # Get all lessons
GET    /api/lessons/:id    # Get lesson by ID
POST   /api/lessons        # Create lesson (Admin)
PUT    /api/lessons/:id    # Update lesson (Admin)
DELETE /api/lessons/:id    # Delete lesson (Admin)
```

### Quiz Endpoints
```
GET  /api/quizzes/lesson/:lessonId    # Get quiz for lesson
POST /api/quizzes/:id/submit          # Submit quiz answers
GET  /api/quizzes/:id/result          # Get quiz result
```

### Progress Endpoints
```
GET  /api/progress              # Get user progress
POST /api/progress/lesson/:id   # Mark lesson as completed
GET  /api/progress/stats        # Get progress statistics
```

### Comment Endpoints
```
GET    /api/comments/lesson/:lessonId    # Get lesson comments
POST   /api/comments                     # Create comment
PUT    /api/comments/:id                 # Update comment
DELETE /api/comments/:id                 # Delete comment
```

### Admin Endpoints
```
GET    /api/admin/users           # Get all users
GET    /api/admin/stats           # Get platform statistics
PUT    /api/admin/users/:id       # Update user status
DELETE /api/admin/users/:id       # Delete user
```

**📄 Dokumentasi lengkap tersedia di:**
- Backend: `be/src/docs/api.md`
- Frontend: `fe/api.md`

## 🗄 Struktur Database

### Users Table
- `id`, `username`, `email`, `password`, `role`, `active`
- Relasi: hasMany Progress, Comments

### Lessons Table
- `id`, `title`, `content`, `level`, `order`, `createdAt`
- Relasi: hasMany Comments, Progress, hasOne Quiz

### Quizzes Table
- `id`, `lessonId`, `questions` (JSON), `createdAt`
- Relasi: belongsTo Lesson

### Progress Table
- `id`, `userId`, `lessonId`, `completed`, `score`, `completedAt`
- Relasi: belongsTo User, Lesson

### Comments Table
- `id`, `userId`, `lessonId`, `content`, `createdAt`
- Relasi: belongsTo User, Lesson

### RefreshTokens Table
- `id`, `token`, `userId`, `expiresAt`
- Relasi: belongsTo User

## 🤝 Kontribusi

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone <your-fork-url>
   cd TugasAkhir
   git remote add upstream <original-repo-url>
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/nama-fitur
   ```

3. **Development**
   ```bash
   # Backend changes
   cd be
   npm run dev
   
   # Frontend changes
   cd ../fe
   # Test dengan live server
   ```

4. **Testing**
   ```bash
   # Test API endpoints
   npm run db:check
   
   # Test frontend integration
   # Pastikan semua fitur berfungsi dengan baik
   ```

5. **Submit Pull Request**
   ```bash
   git add .
   git commit -m "feat: menambahkan fitur X"
   git push origin feature/nama-fitur
   ```

### Coding Standards

- **Backend**: Follow Node.js best practices, use ESLint
- **Frontend**: Use modern JavaScript (ES6+), semantic HTML
- **Database**: Use meaningful table/column names, proper indexing
- **Git**: Use conventional commit messages

### Issue Reporting

Jika menemukan bug atau memiliki ide fitur baru:

1. Cek existing issues terlebih dahulu
2. Buat issue baru dengan template yang sesuai
3. Sertakan langkah reproduksi untuk bug
4. Sertakan mockup/wireframe untuk fitur request

---

## 📞 Support

- **Email**: [your-email@example.com]
- **Documentation**: Lihat folder `docs/` untuk dokumentasi teknis
- **Issues**: Gunakan GitHub Issues untuk bug report dan feature request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**⭐ Jika project ini membantu, jangan lupa berikan star di repository!**
