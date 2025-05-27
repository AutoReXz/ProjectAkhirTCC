# Language Learning Platform API

A backend API for a language learning platform built with Node.js, Express, and MySQL.

## Features

- User authentication with JWT (access and refresh tokens)
- Lessons management
- Quizzes with automatic scoring
- Comments on lessons
- User progress tracking
- Role-based access control (user/admin)

## Tech Stack

- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Argon2
- **Validation**: Express-validator

## Directory Structure

```
├── server.js             # Entry point
├── .env                  # Environment variables (create from .env.example)
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── utils/            # Utility functions
│   ├── migrations/       # Database migrations
│   ├── seeders/          # Database seeders
│   └── docs/             # API documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL

### Installation

1. Clone the repository

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```

4. Update the environment variables in the `.env` file with your MySQL credentials and JWT secrets.

5. Create the database:
   ```
   npm run db:create
   ```

6. Run migrations:
   ```
   npm run db:migrate
   ```

7. Seed the database with sample data:
   ```
   npm run db:seed
   ```

### Running the Application

Development mode with auto-reload:
```
npm run dev
```

Production mode:
```
npm start
```

## API Documentation

API documentation is available at `src/docs/api.md`

## Default Users

After running the seeders, the following users will be available:

1. Admin User:
   - Email: admin@example.com
   - Password: admin123

2. Regular User:
   - Email: user@example.com
   - Password: user123
