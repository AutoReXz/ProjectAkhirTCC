# Dokumentasi API Platform Pembelajaran Bahasa

Dokumen ini menyediakan informasi detail tentang semua endpoint API yang tersedia dalam Platform Pembelajaran Bahasa.

## Base URL

```
http://localhost:3000/api
```

## Autentikasi

API menggunakan JWT untuk autentikasi dengan kombinasi access token (berumur pendek) dan refresh token (berumur panjang).

### Headers

Untuk rute yang dilindungi, sertakan header Authorization:

```
Authorization: Bearer <access_token>
```

## Penanganan Error

Semua endpoint mengembalikan kode status HTTP yang sesuai:

- `200` - Berhasil
- `201` - Resource berhasil dibuat
- `400` - Request tidak valid (error validasi)
- `401` - Tidak terotorisasi (token hilang atau tidak valid)
- `403` - Terlarang (izin tidak cukup)
- `404` - Resource tidak ditemukan
- `500` - Error server

Response error menyertakan pesan:

```json
{
  "message": "Deskripsi error"
}
```

Error validasi menyertakan array errors:

```json
{
  "errors": [
    {
      "msg": "Email diperlukan",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Endpoint Autentikasi

### Register

Membuat akun pengguna baru dan mengembalikan token.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** Tidak

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "message": "Pengguna berhasil didaftarkan",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

### Login

Melakukan login pengguna dan mengembalikan token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** Tidak

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

### Refresh Token

Mendapatkan access token baru menggunakan refresh token.

- **URL:** `/auth/refresh`
- **Method:** `POST`
- **Auth Required:** Tidak

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Success Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1..."
}
```

### Logout

Mencabut refresh token.

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Auth Required:** Tidak

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Success Response (200):**

```json
{
  "message": "Berhasil logout"
}
```

## Endpoint Pelajaran

### Dapatkan Semua Pelajaran

Mengambil semua pelajaran yang tersedia.

- **URL:** `/lessons`
- **Method:** `GET`
- **Auth Required:** Tidak

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Salam Dasar Bahasa Spanyol",
    "content": "Dalam pelajaran ini, Anda akan belajar...",
    "language": "Spanish",
    "created_at": "2025-05-01T12:00:00Z",
    "creator": {
      "id": 1,
      "name": "Admin User"
    }
  },
  ...
]
```

### Dapatkan Pelajaran Berdasarkan ID

Mengambil pelajaran tertentu dengan detailnya.

- **URL:** `/lessons/:id`
- **Method:** `GET`
- **Auth Required:** Tidak

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Salam Dasar Bahasa Spanyol",
  "content": "Dalam pelajaran ini, Anda akan belajar...",
  "language": "Spanish",
  "created_at": "2025-05-01T12:00:00Z",
  "creator": {
    "id": 1,
    "name": "Admin User"
  }
}
```

### Buat Pelajaran

Membuat pelajaran baru (khusus admin).

- **URL:** `/lessons`
- **Method:** `POST`
- **Auth Required:** Ya (Role Admin)

**Request Body:**

```json
{
  "title": "Salam Dasar Bahasa Spanyol",
  "content": "Dalam pelajaran ini, Anda akan belajar...",
  "language": "Spanish"
}
```

**Success Response (201):**

```json
{
  "message": "Pelajaran berhasil dibuat",
  "lesson": {
    "id": 1,
    "title": "Salam Dasar Bahasa Spanyol",
    "content": "Dalam pelajaran ini, Anda akan belajar...",
    "language": "Spanish",
    "created_by": 1,
    "created_at": "2025-05-01T12:00:00Z"
  }
}
```

### Update Pelajaran

Memperbarui pelajaran yang sudah ada (khusus admin).

- **URL:** `/lessons/:id`
- **Method:** `PUT`
- **Auth Required:** Ya (Role Admin)

**Request Body:**

```json
{
  "title": "Salam Bahasa Spanyol yang Diperbarui",
  "content": "Konten yang diperbarui...",
  "language": "Spanish"
}
```

**Success Response (200):**

```json
{
  "message": "Pelajaran berhasil diperbarui",
  "lesson": {
    "id": 1,
    "title": "Salam Bahasa Spanyol yang Diperbarui",
    "content": "Konten yang diperbarui...",
    "language": "Spanish",
    "created_by": 1,
    "created_at": "2025-05-01T12:00:00Z"
  }
}
```

### Hapus Pelajaran

Menghapus pelajaran (khusus admin).

- **URL:** `/lessons/:id`
- **Method:** `DELETE`
- **Auth Required:** Ya (Role Admin)

**Success Response (200):**

```json
{
  "message": "Pelajaran berhasil dihapus"
}
```

## Endpoint Kuis

### Dapatkan Kuis Berdasarkan ID Pelajaran

Mengambil semua kuis untuk pelajaran tertentu.

- **URL:** `/lessons/:lessonId/quizzes`
- **Method:** `GET`
- **Auth Required:** Ya

**Success Response (200):**

```json
[
  {
    "id": 1,
    "question": "Bagaimana cara mengatakan 'Halo' dalam bahasa Spanyol?",
    "options": {
      "A": "Hola",
      "B": "Adiós",
      "C": "Gracias",
      "D": "Por favor"
    }
  },
  ...
]
```

### Buat Kuis

Membuat kuis baru untuk pelajaran (khusus admin).

- **URL:** `/lessons/:lessonId/quizzes`
- **Method:** `POST`
- **Auth Required:** Ya (Role Admin)

**Request Body:**

```json
{
  "question": "Bagaimana cara mengatakan 'Halo' dalam bahasa Spanyol?",
  "options": {
    "A": "Hola",
    "B": "Adiós",
    "C": "Gracias",
    "D": "Por favor"
  },
  "answer": "A"
}
```

**Success Response (201):**

```json
{
  "message": "Kuis berhasil dibuat",
  "quiz": {
    "id": 1,
    "lesson_id": 1,
    "question": "Bagaimana cara mengatakan 'Halo' dalam bahasa Spanyol?",
    "options": {
      "A": "Hola",
      "B": "Adiós",
      "C": "Gracias",
      "D": "Por favor"
    }
  }
}
```

### Submit Jawaban Kuis

Mengirimkan jawaban untuk kuis dan memperbarui progress pengguna.

- **URL:** `/quizzes/:id/submit`
- **Method:** `POST`
- **Auth Required:** Ya

**Request Body:**

```json
{
  "answer": "A"
}
```

**Success Response (200):**

```json
{
  "correct": true,
  "correctAnswer": null,
  "progress": {
    "is_completed": true,
    "score": 1
  }
}
```

atau jika salah:

```json
{
  "correct": false,
  "correctAnswer": "A",
  "progress": {
    "is_completed": false,
    "score": 0
  }
}
```

## Endpoint Komentar

### Dapatkan Komentar Berdasarkan ID Pelajaran

Mengambil semua komentar untuk pelajaran tertentu.

- **URL:** `/lessons/:id/comments`
- **Method:** `GET`
- **Auth Required:** Tidak

**Success Response (200):**

```json
[
  {
    "id": 1,
    "comment": "Pelajaran yang bagus! Saya belajar banyak.",
    "created_at": "2025-05-01T14:30:00Z",
    "user": {
      "id": 2,
      "name": "Jane Smith"
    }
  },
  ...
]
```

### Buat Komentar

Menambahkan komentar baru ke pelajaran.

- **URL:** `/lessons/:id/comments`
- **Method:** `POST`
- **Auth Required:** Ya

**Request Body:**

```json
{
  "comment": "Pelajaran yang bagus! Saya belajar banyak."
}
```

**Success Response (201):**

```json
{
  "message": "Komentar berhasil ditambahkan",
  "comment": {
    "id": 1,
    "comment": "Pelajaran yang bagus! Saya belajar banyak.",
    "created_at": "2025-05-01T14:30:00Z",
    "user": {
      "id": 2,
      "name": "Jane Smith"
    }
  }
}
```

## Endpoint Progress

### Dapatkan Progress Pengguna

Mengambil progress pembelajaran untuk pengguna saat ini.

- **URL:** `/progress`
- **Method:** `GET`
- **Auth Required:** Ya

**Success Response (200):**

```json
{
  "progress": [
    {
      "id": 1,
      "lesson_id": 1,
      "is_completed": true,
      "score": 3,
      "lesson": {
        "id": 1,
        "title": "Salam Dasar Bahasa Spanyol",
        "language": "Spanish"
      }
    },
    ...
  ],
  "summary": {
    "totalCompleted": 5,
    "totalLessons": 10,
    "completionRate": 50
  }
}
```

## Endpoint Admin

Endpoint admin tersedia untuk pengguna dengan role `admin`. Semua endpoint admin memerlukan autentikasi dan otorisasi yang tepat.

### Base URL untuk API Admin

```
/api/admin
```

### Endpoint Admin yang Tersedia

#### Statistik Dashboard
- `GET /api/admin/stats` - Dapatkan statistik dashboard

#### Manajemen Pengguna
- `GET /api/admin/users` - Daftar semua pengguna dengan pagination
- `GET /api/admin/users/:id` - Dapatkan pengguna berdasarkan ID
- `PUT /api/admin/users/:id` - Perbarui pengguna
- `DELETE /api/admin/users/:id` - Nonaktifkan pengguna (soft delete)

#### Manajemen Kuis
- `GET /api/admin/quizzes` - Daftar semua kuis dengan pagination
- `POST /api/admin/quizzes` - Buat kuis baru
- `PUT /api/admin/quizzes/:id` - Perbarui kuis
- `DELETE /api/admin/quizzes/:id` - Hapus kuis

#### Manajemen Komentar
- `GET /api/admin/comments` - Daftar semua komentar dengan pagination
- `PUT /api/admin/comments/:id` - Perbarui komentar
- `DELETE /api/admin/comments/:id` - Hapus komentar

#### Manajemen Pelajaran
- `GET /api/admin/lessons` - Daftar semua pelajaran dengan pagination
- `POST /api/admin/lessons` - Buat pelajaran baru
- `PUT /api/admin/lessons/:id` - Perbarui pelajaran
- `DELETE /api/admin/lessons/:id` - Hapus pelajaran (cascade delete)

### Autentikasi Admin

Endpoint admin memerlukan:
- Token akses JWT yang valid di header Authorization
- Pengguna harus memiliki role `admin`

**Contoh:**
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer <admin_access_token>"
```

### Format Response Admin

Endpoint list admin mengembalikan array secara langsung dengan informasi pagination di header response:

**Response Headers:**
- `X-Total-Count`: Total jumlah item
- `X-Page`: Nomor halaman saat ini  
- `X-Limit`: Item per halaman
- `X-Total-Pages`: Total jumlah halaman

**Contoh Response:**
```json
[
  {
    "id": 1,
    "name": "Pengguna 1",
    // ... field lainnya
  },
  {
    "id": 2,
    "name": "Pengguna 2", 
    // ... field lainnya
  }
]
```
