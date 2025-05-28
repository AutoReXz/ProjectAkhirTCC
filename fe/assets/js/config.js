// Konfigurasi API untuk Platform Belajar Bahasa
const API_CONFIG = {
    BASE_URL: "https://bahasa-app-backend-263444552508.us-central1.run.app/api",
    // Ganti dengan URL backend produksi saat deploy
    // BASE_URL: "https://<URL_BACKEND_PRODUKSI>/api",
    
    // Endpoint Auth
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout"
    },
    
    // Endpoint Lessons
    LESSONS: {
        GET_ALL: "/lessons",
        GET_BY_ID: (id) => `/lessons/${id}`,
        CREATE: "/lessons",
        UPDATE: (id) => `/lessons/${id}`,
        DELETE: (id) => `/lessons/${id}`,
        COMMENTS: (id) => `/lessons/${id}/comments`,
        QUIZZES: (id) => `/lessons/${id}/quizzes`
    },
    
    // Endpoint Quizzes
    QUIZZES: {
        SUBMIT: (id) => `/quizzes/${id}/submit`
    },
    
    // Endpoint Progress
    PROGRESS: "/progress",
    
    // Admin Endpoints
    ADMIN: {
        // User management
        USERS: "/admin/users",
        USER_BY_ID: (id) => `/admin/users/${id}`,
        BULK_DELETE_USERS: "/admin/users/bulk-delete",
        
        // Lesson management  
        LESSONS: "/admin/lessons",
        LESSON_BY_ID: (id) => `/admin/lessons/${id}`,
        BULK_DELETE_LESSONS: "/admin/lessons/bulk-delete",
        
        // Quiz management
        QUIZZES: "/admin/quizzes", 
        QUIZ_BY_ID: (id) => `/admin/quizzes/${id}`,
        BULK_DELETE_QUIZZES: "/admin/quizzes/bulk-delete",
        
        // Comment management
        COMMENTS: "/admin/comments",
        COMMENT_BY_ID: (id) => `/admin/comments/${id}`,
        BULK_DELETE_COMMENTS: "/admin/comments/bulk-delete",
        
        // Dashboard stats
        STATS: "/admin/stats",
        
        // Reports and analytics
        REPORTS: {
            USERS: "/admin/reports/users",
            LESSONS: "/admin/reports/lessons", 
            QUIZZES: "/admin/reports/quizzes",
            COMMENTS: "/admin/reports/comments",
            PROGRESS: "/admin/reports/progress"
        }
    }
};
