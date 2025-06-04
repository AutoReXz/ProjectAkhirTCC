// Utilitas untuk menangani API dan autentikasi

// Cookie utility functions
const CookieManager = {
    // Set cookie dengan opsi keamanan
    setCookie: (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        
        // HttpOnly tidak bisa diset dari JavaScript, tapi kita set SameSite dan Secure
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${location.protocol === 'https:'}`;
    },
    
    // Get cookie
    getCookie: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    // Delete cookie
    deleteCookie: (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
    }
};

// Token handler
const TokenManager = {
    // Simpan token - access token di localStorage saja
    // Refresh token dihandle otomatis oleh HttpOnly cookie dari backend
    saveTokens: (accessToken) => {
        // Access token disimpan di localStorage untuk akses cepat
        localStorage.setItem('accessToken', accessToken);
        
        // Refresh token tidak perlu disimpan manual karena sudah di HttpOnly cookie
    },
    
    // Ambil access token
    getAccessToken: () => {
        return localStorage.getItem('accessToken');
    },
    
    // Refresh token tidak bisa diakses dari JavaScript (HttpOnly)
    getRefreshToken: () => {
        // HttpOnly cookie tidak bisa diakses dari JavaScript
        // Browser akan otomatis mengirim cookie ini ke server
        return null;
    },
    
    // Hapus token (logout)
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        // HttpOnly cookie akan dihapus oleh server saat logout
    },
    
    // Simpan data user
    saveUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Ambil data user
    getUser: () => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Hapus data user
    clearUser: () => {
        localStorage.removeItem('user');
    },      // Cek apakah user sudah login - cek access token saja
    // Refresh token ada di HttpOnly cookie yang otomatis dikirim browser
    isLoggedIn: () => {
        const accessToken = localStorage.getItem('accessToken');
        
        // User dianggap login jika ada access token
        // Jika access token expired, sistem akan otomatis coba refresh
        return !!accessToken;
    }
};

// API handler
const ApiService = {
    // Metode untuk panggil API tanpa authentication
    async fetch(endpoint, options = {}) {
        try {
            // Tambahkan credentials untuk memastikan cookie dikirim
            const defaultOptions = {
                credentials: 'include' // Penting untuk HttpOnly cookies
            };
            
            const mergedOptions = {
                ...defaultOptions,
                ...options
            };
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, mergedOptions);
            const data = await response.json();
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan pada server',
                    errors: data.errors
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
      // Metode untuk panggil API dengan authentication
    async fetchAuth(endpoint, options = {}) {
        const accessToken = TokenManager.getAccessToken();
        
        if (!accessToken) {
            throw { message: 'Anda harus login terlebih dahulu' };
        }
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            credentials: 'include' // Penting untuk HttpOnly cookies
        };
        
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...(options.headers || {})
            }
        };
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, mergedOptions);
            
            // Jika token expired, coba refresh token
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Coba request lagi dengan token baru
                    mergedOptions.headers['Authorization'] = `Bearer ${TokenManager.getAccessToken()}`;
                    return this.fetchAuth(endpoint, options);
                } else {
                    // Gagal refresh, harus login ulang
                    TokenManager.clearTokens();
                    TokenManager.clearUser();
                    window.location.href = '/login.html';
                    throw { message: 'Sesi anda telah berakhir, silahkan login kembali' };
                }
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Terjadi kesalahan pada server',
                    errors: data.errors
                };
            }
            
            return data;
        } catch (error) {
            console.error('API Auth Error:', error);
            throw error;
        }
    },
      // Method untuk refresh token
    async refreshToken() {
        try {
            // Tidak perlu kirim refreshToken di body karena sudah di HttpOnly cookie
            // Browser akan otomatis mengirim cookie dengan credentials: 'include'
            const response = await this.fetch(API_CONFIG.AUTH.REFRESH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Penting: sertakan cookies
            });
            
            if (response.accessToken) {
                TokenManager.saveTokens(response.accessToken);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Refresh Token Error:', error);
            return false;
        }
    }
};

// Auth service
const AuthService = {    // Initialize authentication - cek dan refresh token jika perlu
    async initAuth() {
        const accessToken = TokenManager.getAccessToken();
        
        // Jika tidak ada access token, coba refresh dari HttpOnly cookie
        if (!accessToken) {
            try {
                const refreshed = await ApiService.refreshToken();
                if (refreshed) {
                    console.log('Token berhasil di-refresh saat inisialisasi');
                } else {
                    console.log('Tidak ada session yang valid');
                }
            } catch (error) {
                console.error('Error saat refresh token:', error);
                TokenManager.clearTokens();
                TokenManager.clearUser();
            }
        }
    },    // Register user baru
    async register(name, email, password) {
        try {
            const response = await ApiService.fetch(API_CONFIG.AUTH.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include' // Untuk menerima HttpOnly cookie
            });
            
            // Hanya simpan accessToken, refreshToken sudah di HttpOnly cookie
            TokenManager.saveTokens(response.accessToken);
            TokenManager.saveUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    // Login user
    async login(email, password) {
        try {
            const response = await ApiService.fetch(API_CONFIG.AUTH.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Untuk menerima HttpOnly cookie
            });
            
            // Hanya simpan accessToken, refreshToken sudah di HttpOnly cookie
            TokenManager.saveTokens(response.accessToken);
            TokenManager.saveUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    },
      // Logout user
    async logout() {
        try {
            // Tidak perlu kirim refreshToken di body, backend akan baca dari cookie
            await ApiService.fetch(API_CONFIG.AUTH.LOGOUT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Untuk mengirim HttpOnly cookie
            });
        } catch (error) {
            console.error('Logout Error:', error);
        } finally {
            // Hapus token dari localStorage
            TokenManager.clearTokens();
            TokenManager.clearUser();
        }
    },
    
    // Cek status login
    isAuthenticated() {
        return TokenManager.isLoggedIn();
    },
    
    // Ambil user yang sedang login
    getCurrentUser() {
        return TokenManager.getUser();
    }
};

// Lesson Service
const LessonService = {
    // Ambil semua lesson
    async getAllLessons() {
        return ApiService.fetch(API_CONFIG.LESSONS.GET_ALL);
    },
    
    // Ambil lesson by ID
    async getLessonById(id) {
        return ApiService.fetch(API_CONFIG.LESSONS.GET_BY_ID(id));
    },
    
    // Ambil komentar lesson
    async getLessonComments(id) {
        return ApiService.fetch(API_CONFIG.LESSONS.COMMENTS(id));
    },
    
    // Tambah komentar
    async addComment(lessonId, comment) {
        return ApiService.fetchAuth(API_CONFIG.LESSONS.COMMENTS(lessonId), {
            method: 'POST',
            body: JSON.stringify({ comment })
        });
    },
    
    // Ambil quiz lesson
    async getLessonQuizzes(lessonId) {
        return ApiService.fetchAuth(API_CONFIG.LESSONS.QUIZZES(lessonId));
    }
};

// Quiz Service
const QuizService = {
    // Submit jawaban quiz
    async submitQuizAnswer(quizId, answer) {
        return ApiService.fetchAuth(API_CONFIG.QUIZZES.SUBMIT(quizId), {
            method: 'POST',
            body: JSON.stringify({ answer })
        });
    }
};

// Progress Service
const ProgressService = {
    // Ambil progress belajar user
    async getUserProgress() {
        return ApiService.fetchAuth(API_CONFIG.PROGRESS);
    }
};

// Admin Service untuk CRUD operations
const AdminService = {
    // === USER MANAGEMENT ===
    // Get all users (admin only)
    async getAllUsers() {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.USERS);
    },
    
    // Create new user (admin only)
    async createUser(userData) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.USERS, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    
    // Update user (admin only)
    async updateUser(userId, userData) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.USER_BY_ID(userId), {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },
    
    // Delete user (admin only)
    async deleteUser(userId) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.USER_BY_ID(userId), {
            method: 'DELETE'
        });
    },
    
    // === LESSON MANAGEMENT ===
    // Create new lesson (admin only)
    async createLesson(lessonData) {
        return ApiService.fetchAuth(API_CONFIG.LESSONS.CREATE, {
            method: 'POST',
            body: JSON.stringify(lessonData)
        });
    },
    
    // Update lesson (admin only)
    async updateLesson(lessonId, lessonData) {
        return ApiService.fetchAuth(API_CONFIG.LESSONS.UPDATE(lessonId), {
            method: 'PUT',
            body: JSON.stringify(lessonData)
        });
    },
    
    // Delete lesson (admin only)
    async deleteLesson(lessonId) {
        return ApiService.fetchAuth(API_CONFIG.LESSONS.DELETE(lessonId), {
            method: 'DELETE'
        });
    },
    
    // === QUIZ MANAGEMENT ===
    // Get all quizzes (admin only)
    async getAllQuizzes() {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.QUIZZES);
    },
    
    // Create new quiz (admin only)
    async createQuiz(quizData) {
        return ApiService.fetchAuth(`/lessons/${quizData.lesson_id}/quizzes`, {
            method: 'POST',
            body: JSON.stringify({
                question: quizData.question,
                options: quizData.options,
                answer: quizData.answer
            })
        });
    },
    
    // Update quiz (admin only)
    async updateQuiz(quizId, quizData) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.QUIZ_BY_ID(quizId), {
            method: 'PUT',
            body: JSON.stringify(quizData)
        });
    },
    
    // Delete quiz (admin only)
    async deleteQuiz(quizId) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.QUIZ_BY_ID(quizId), {
            method: 'DELETE'
        });
    },
    
    // === COMMENT MANAGEMENT ===
    // Get all comments (admin only)
    async getAllComments() {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.COMMENTS);
    },
    
    // Delete comment (admin only)
    async deleteComment(commentId) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.COMMENT_BY_ID(commentId), {
            method: 'DELETE'
        });
    },
    
    // === DASHBOARD STATS ===
    // Get dashboard statistics (admin only)
    async getDashboardStats() {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.STATS);
    },
    
    // Get users with pagination and filters (admin only)
    async getUsersWithFilters(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return ApiService.fetchAuth(`${API_CONFIG.ADMIN.USERS}${queryString ? `?${queryString}` : ''}`);
    },
    
    // Get lessons with pagination and filters (admin only)
    async getLessonsWithFilters(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return ApiService.fetchAuth(`${API_CONFIG.ADMIN.LESSONS}${queryString ? `?${queryString}` : ''}`);
    },
    
    // Get quizzes with pagination and filters (admin only)
    async getQuizzesWithFilters(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return ApiService.fetchAuth(`${API_CONFIG.ADMIN.QUIZZES}${queryString ? `?${queryString}` : ''}`);
    },
    
    // Get comments with pagination and filters (admin only)
    async getCommentsWithFilters(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return ApiService.fetchAuth(`${API_CONFIG.ADMIN.COMMENTS}${queryString ? `?${queryString}` : ''}`);
    },
    
    // Bulk delete operations (admin only)
    async bulkDeleteUsers(userIds) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.BULK_DELETE_USERS, {
            method: 'DELETE',
            body: JSON.stringify({ ids: userIds })
        });
    },
    
    async bulkDeleteLessons(lessonIds) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.BULK_DELETE_LESSONS, {
            method: 'DELETE',
            body: JSON.stringify({ ids: lessonIds })
        });
    },
    
    async bulkDeleteQuizzes(quizIds) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.BULK_DELETE_QUIZZES, {
            method: 'DELETE',
            body: JSON.stringify({ ids: quizIds })
        });
    },
    
    async bulkDeleteComments(commentIds) {
        return ApiService.fetchAuth(API_CONFIG.ADMIN.BULK_DELETE_COMMENTS, {
            method: 'DELETE',
            body: JSON.stringify({ ids: commentIds })
        });
    }
};
