# Language Learning Platform API Documentation

This document provides detailed information about all API endpoints available in the Language Learning Platform.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT for authentication with a combination of access tokens (short-lived) and refresh tokens (long-lived).

### Headers

For protected routes, include the Authorization header:

```
Authorization: Bearer <access_token>
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Resource created
- `400` - Bad request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `500` - Server error

Error responses include a message:

```json
{
  "message": "Error description"
}
```

Validation errors include an errors array:

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Authentication Endpoints

### Register

Creates a new user account and returns tokens.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No

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
  "message": "User registered successfully",
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

Logs in a user and returns tokens.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No

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

Gets a new access token using a refresh token.

- **URL:** `/auth/refresh`
- **Method:** `POST`
- **Auth Required:** No

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

Revokes a refresh token.

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Auth Required:** No

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}
```

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

## Lessons Endpoints

### Get All Lessons

Retrieves all available lessons.

- **URL:** `/lessons`
- **Method:** `GET`
- **Auth Required:** No

**Success Response (200):**

```json
[
  {
    "id": 1,
    "title": "Basic Spanish Greetings",
    "content": "In this lesson, you will learn...",
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

### Get Lesson By ID

Retrieves a specific lesson with its details.

- **URL:** `/lessons/:id`
- **Method:** `GET`
- **Auth Required:** No

**Success Response (200):**

```json
{
  "id": 1,
  "title": "Basic Spanish Greetings",
  "content": "In this lesson, you will learn...",
  "language": "Spanish",
  "created_at": "2025-05-01T12:00:00Z",
  "creator": {
    "id": 1,
    "name": "Admin User"
  }
}
```

### Create Lesson

Creates a new lesson (admin only).

- **URL:** `/lessons`
- **Method:** `POST`
- **Auth Required:** Yes (Admin role)

**Request Body:**

```json
{
  "title": "Basic Spanish Greetings",
  "content": "In this lesson, you will learn...",
  "language": "Spanish"
}
```

**Success Response (201):**

```json
{
  "message": "Lesson created successfully",
  "lesson": {
    "id": 1,
    "title": "Basic Spanish Greetings",
    "content": "In this lesson, you will learn...",
    "language": "Spanish",
    "created_by": 1,
    "created_at": "2025-05-01T12:00:00Z"
  }
}
```

### Update Lesson

Updates an existing lesson (admin only).

- **URL:** `/lessons/:id`
- **Method:** `PUT`
- **Auth Required:** Yes (Admin role)

**Request Body:**

```json
{
  "title": "Updated Spanish Greetings",
  "content": "Updated content...",
  "language": "Spanish"
}
```

**Success Response (200):**

```json
{
  "message": "Lesson updated successfully",
  "lesson": {
    "id": 1,
    "title": "Updated Spanish Greetings",
    "content": "Updated content...",
    "language": "Spanish",
    "created_by": 1,
    "created_at": "2025-05-01T12:00:00Z"
  }
}
```

### Delete Lesson

Deletes a lesson (admin only).

- **URL:** `/lessons/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Admin role)

**Success Response (200):**

```json
{
  "message": "Lesson deleted successfully"
}
```

## Quizzes Endpoints

### Get Quizzes By Lesson ID

Retrieves all quizzes for a specific lesson.

- **URL:** `/lessons/:lessonId/quizzes`
- **Method:** `GET`
- **Auth Required:** Yes

**Success Response (200):**

```json
[
  {
    "id": 1,
    "question": "How do you say 'Hello' in Spanish?",
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

### Create Quiz

Creates a new quiz for a lesson (admin only).

- **URL:** `/lessons/:lessonId/quizzes`
- **Method:** `POST`
- **Auth Required:** Yes (Admin role)

**Request Body:**

```json
{
  "question": "How do you say 'Hello' in Spanish?",
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
  "message": "Quiz created successfully",
  "quiz": {
    "id": 1,
    "lesson_id": 1,
    "question": "How do you say 'Hello' in Spanish?",
    "options": {
      "A": "Hola",
      "B": "Adiós",
      "C": "Gracias",
      "D": "Por favor"
    }
  }
}
```

### Submit Quiz Answer

Submits an answer for a quiz and updates user progress.

- **URL:** `/quizzes/:id/submit`
- **Method:** `POST`
- **Auth Required:** Yes

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

or if incorrect:

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

## Comments Endpoints

### Get Comments By Lesson ID

Retrieves all comments for a specific lesson.

- **URL:** `/lessons/:id/comments`
- **Method:** `GET`
- **Auth Required:** No

**Success Response (200):**

```json
[
  {
    "id": 1,
    "comment": "Great lesson! I learned a lot.",
    "created_at": "2025-05-01T14:30:00Z",
    "user": {
      "id": 2,
      "name": "Jane Smith"
    }
  },
  ...
]
```

### Create Comment

Adds a new comment to a lesson.

- **URL:** `/lessons/:id/comments`
- **Method:** `POST`
- **Auth Required:** Yes

**Request Body:**

```json
{
  "comment": "Great lesson! I learned a lot."
}
```

**Success Response (201):**

```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": 1,
    "comment": "Great lesson! I learned a lot.",
    "created_at": "2025-05-01T14:30:00Z",
    "user": {
      "id": 2,
      "name": "Jane Smith"
    }
  }
}
```

## Progress Endpoints

### Get User Progress

Retrieves the learning progress for the current user.

- **URL:** `/progress`
- **Method:** `GET`
- **Auth Required:** Yes

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
        "title": "Basic Spanish Greetings",
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
