# API Documentation - Simple Reference

Base URL: `http://localhost:3000/api`

## Authentication
- Use JWT Bearer token in Authorization header: `Authorization: Bearer <token>`
- Admin endpoints require `admin` role

## Error Responses
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## Authentication Endpoints

### POST `/auth/register`
```json
Body: {
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}

Response: {
  "user": {...},
  "accessToken": "...",
  "refreshToken": "..."
}
```

### POST `/auth/login`
```json
Body: {
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "user": {...},
  "accessToken": "...", 
  "refreshToken": "..."
}
```

### POST `/auth/refresh`
```json
Body: { "refreshToken": "..." }
Response: { "accessToken": "..." }
```

### POST `/auth/logout`
```json
Body: { "refreshToken": "..." }
Response: { "message": "Berhasil logout" }
```

---

## Lessons

### GET `/lessons` - Get all lessons
- No auth required
- Returns array of lessons with creator info

### GET `/lessons/:id` - Get lesson by ID
- No auth required
- Returns lesson details

### POST `/lessons` - Create lesson (Admin only)
```json
Body: {
  "title": "Lesson Title",
  "content": "Lesson content...",
  "language": "Spanish"
}
```

### PUT `/lessons/:id` - Update lesson (Admin only)
```json
Body: {
  "title": "Updated Title",
  "content": "Updated content...",
  "language": "Spanish"
}
```

### DELETE `/lessons/:id` - Delete lesson (Admin only)

---

## Quizzes

### GET `/lessons/:lessonId/quizzes` - Get quizzes for lesson
- Auth required
- Returns array of quizzes (without answers)

### POST `/lessons/:lessonId/quizzes` - Create quiz (Admin only)
```json
Body: {
  "question": "Question text?",
  "options": {
    "A": "Option 1",
    "B": "Option 2", 
    "C": "Option 3",
    "D": "Option 4"
  },
  "answer": "A"
}
```

### POST `/quizzes/:id/submit` - Submit quiz answer
```json
Body: { "answer": "A" }

Response: {
  "correct": true,
  "correctAnswer": null, // only shown if wrong
  "progress": {
    "is_completed": true,
    "score": 1
  }
}
```

---

## Comments

### GET `/lessons/:id/comments` - Get lesson comments
- No auth required
- Returns comments with user info

### POST `/lessons/:id/comments` - Add comment
```json
Body: { "comment": "Great lesson!" }
```

---

## Progress

### GET `/progress` - Get user progress
- Auth required
- Returns progress array and summary stats

---

## Admin Endpoints

Base: `/api/admin` (All require admin role)

### GET `/admin/stats` - Dashboard statistics

### Users
- `GET /admin/users` - List users (pagination)
- `GET /admin/users/:id` - Get user by ID
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Soft delete user

### Quizzes
- `GET /admin/quizzes` - List all quizzes (pagination)
- `POST /admin/quizzes` - Create quiz
- `PUT /admin/quizzes/:id` - Update quiz
- `DELETE /admin/quizzes/:id` - Delete quiz

### Comments
- `GET /admin/comments` - List all comments (pagination)
- `PUT /admin/comments/:id` - Update comment
- `DELETE /admin/comments/:id` - Delete comment

### Lessons
- `GET /admin/lessons` - List all lessons (pagination)
- `POST /admin/lessons` - Create lesson
- `PUT /admin/lessons/:id` - Update lesson
- `DELETE /admin/lessons/:id` - Delete lesson

## Pagination (Admin endpoints)
- Query params: `page` (default: 1), `limit` (default: 10)
- Response headers: `X-Total-Count`, `X-Page`, `X-Limit`, `X-Total-Pages`

## Example Usage

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get lessons
curl http://localhost:3000/api/lessons

# Submit quiz (with auth)
curl -X POST http://localhost:3000/api/quizzes/1/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"answer":"A"}'
```
