// Admin Dashboard JavaScript

// Global variables
let currentTab = 'users';
let users = [];
let lessons = [];
let quizzes = [];
let comments = [];

// Pagination configuration
const ITEMS_PER_PAGE = 10;
let currentPage = {
    users: 1,
    lessons: 1,
    quizzes: 1,
    comments: 1
};

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    if (!requireAdminAuth()) return;
    
    // Update navigation
    updateAdminNavigation();
    
    // Load dashboard stats
    await loadDashboardStats();
    
    // Load initial tab content
    await loadTabContent('users');
    
    // Setup form handlers
    setupFormHandlers();
});

// Check admin authentication
function requireAdminAuth() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    
    const user = AuthService.getCurrentUser();
    if (!user || user.role !== 'admin') {
        showError('adminAlert', 'Anda tidak memiliki akses admin');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return false;
    }
    
    return true;
}

// Update admin navigation
function updateAdminNavigation() {
    const navAuthItems = document.getElementById('navAuthItems');
    if (!navAuthItems) return;
    
    const user = AuthService.getCurrentUser();
    navAuthItems.innerHTML = `
        <li><a href="index.html" class="nav-link">Beranda</a></li>
        <li><span class="nav-greeting">Admin: ${user.name}</span></li>
        <li><a href="#" id="btnLogout" class="nav-link">Logout</a></li>
    `;
    
    // Event handler untuk logout
    document.getElementById('btnLogout').addEventListener('click', async (e) => {
        e.preventDefault();
        await AuthService.logout();
        window.location.href = 'index.html';
    });
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Load all data to get counts
        const [usersData, lessonsData, quizzesData, commentsData] = await Promise.all([
            AdminService.getUsersWithFilters({ limit: 1000 }),
            AdminService.getLessonsWithFilters({ limit: 1000 }),
            AdminService.getQuizzesWithFilters({ limit: 1000 }),
            AdminService.getCommentsWithFilters({ limit: 1000 })
        ]);
        
        document.getElementById('totalUsers').textContent = usersData.length;
        document.getElementById('totalLessons').textContent = lessonsData.length;
        document.getElementById('totalQuizzes').textContent = quizzesData.length;
        document.getElementById('totalComments').textContent = commentsData.length;
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showError('adminAlert', 'Gagal memuat statistik dashboard');
    }
}

// Show specific tab
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Load tab content
    currentTab = tabName;
    loadTabContent(tabName);
}

// Load content for specific tab
async function loadTabContent(tabName) {
    try {
        switch (tabName) {
            case 'users':
                await loadUsers();
                break;
            case 'lessons':
                await loadLessons();
                break;
            case 'quizzes':
                await loadQuizzes();
                break;
            case 'comments':
                await loadComments();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${tabName}:`, error);
        showError('adminAlert', `Gagal memuat data ${tabName}`);
    }
}

// Load users data
async function loadUsers() {
    try {
        showLoading('usersContent');
        // Load all users without pagination limit for client-side handling
        users = await AdminService.getUsersWithFilters({ limit: 1000 });
        displayUsers(users);
    } catch (error) {
        document.getElementById('usersContent').innerHTML = `
            <p class="empty-state">Gagal memuat data pengguna: ${error.message}</p>
        `;
    }
}

// Display users table
function displayUsers(userData) {
    const usersContent = document.getElementById('usersContent');
    
    if (!userData || userData.length === 0) {
        usersContent.innerHTML = '<p class="empty-state">Tidak ada data pengguna</p>';
        return;
    }
    
    // Paginate user data
    const paginatedUsers = paginate(userData, currentPage.users);
      usersContent.innerHTML = `
        <div class="admin-filters">
            <div class="filter-group">
                <label for="userSearch">Pencarian:</label>
                <input type="text" id="userSearch" class="form-control search-box" placeholder="Cari pengguna...">
            </div>
            <div class="filter-group">
                <label for="roleFilter">Filter Role:</label>
                <select id="roleFilter" class="form-control filter-select">
                    <option value="">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>
        </div>
        <table class="admin-table">
            <thead>
                <tr>
                    <th class="select-all-header">
                        <input type="checkbox" id="selectAllUsers" onchange="toggleSelectAll('Users')">
                    </th>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Tanggal Daftar</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedUsers.map(user => `
                    <tr>
                        <td>
                            <input type="checkbox" name="UsersCheckbox" value="${user.id}" onchange="updateBulkActionButtons('Users')">
                        </td>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td><span class="status-badge status-${user.role}">${user.role}</span></td>
                        <td>${formatDate(user.created_at)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-edit" onclick="editUser(${user.id})">Edit</button>
                                <button class="btn btn-small btn-delete" onclick="deleteUser(${user.id})">Hapus</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        ${createPagination(userData.length, currentPage.users, 'users')}
    `;
    
    // Add search functionality
    document.getElementById('userSearch').addEventListener('input', debounce(() => filterUsers(), 300));
    document.getElementById('roleFilter').addEventListener('change', filterUsers);
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    
    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(searchTerm) || 
                           user.email.toLowerCase().includes(searchTerm);
        const matchRole = !roleFilter || user.role === roleFilter;
        return matchSearch && matchRole;
    });
    
    displayUsers(filteredUsers);
}

// Load lessons data
async function loadLessons() {
    try {
        showLoading('lessonsContent');
        // Load all lessons without pagination limit for client-side handling
        lessons = await AdminService.getLessonsWithFilters({ limit: 1000 });
        displayLessons(lessons);
    } catch (error) {
        document.getElementById('lessonsContent').innerHTML = `
            <p class="empty-state">Gagal memuat data materi: ${error.message}</p>
        `;
    }
}

// Display lessons table
function displayLessons(lessonData) {
    const lessonsContent = document.getElementById('lessonsContent');
    
    if (!lessonData || lessonData.length === 0) {
        lessonsContent.innerHTML = '<p class="empty-state">Tidak ada data materi</p>';
        return;
    }
    
    // Paginate lesson data
    const paginatedLessons = paginate(lessonData, currentPage.lessons);
      lessonsContent.innerHTML = `
        <div class="admin-filters">
            <div class="filter-group">
                <label for="lessonSearch">Pencarian:</label>
                <input type="text" id="lessonSearch" class="form-control search-box" placeholder="Cari materi...">
            </div>
            <div class="filter-group">
                <label for="languageFilter">Filter Bahasa:</label>
                <select id="languageFilter" class="form-control filter-select">
                    <option value="">Semua Bahasa</option>
                    ${[...new Set(lessonData.map(lesson => lesson.language))].map(lang => 
                        `<option value="${lang}">${lang}</option>`
                    ).join('')}
                </select>
            </div>
        </div>
        <table class="admin-table">
            <thead>
                <tr>
                    <th class="select-all-header">
                        <input type="checkbox" id="selectAllLessons" onchange="toggleSelectAll('Lessons')">
                    </th>
                    <th>ID</th>
                    <th>Judul</th>
                    <th>Bahasa</th>
                    <th>Pembuat</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedLessons.map(lesson => `
                    <tr>
                        <td>
                            <input type="checkbox" name="LessonsCheckbox" value="${lesson.id}" onchange="updateBulkActionButtons('Lessons')">
                        </td>
                        <td>${lesson.id}</td>
                        <td>${lesson.title}</td>
                        <td>${lesson.language}</td>
                        <td>${lesson.creator?.name || 'Admin'}</td>
                        <td>${formatDate(lesson.created_at)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-view" onclick="viewLesson(${lesson.id})">Lihat</button>
                                <button class="btn btn-small btn-edit" onclick="editLesson(${lesson.id})">Edit</button>
                                <button class="btn btn-small btn-delete" onclick="deleteLesson(${lesson.id})">Hapus</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        ${createPagination(lessonData.length, currentPage.lessons, 'lessons')}
    `;
    
    // Add search functionality
    document.getElementById('lessonSearch').addEventListener('input', debounce(() => filterLessons(), 300));
    document.getElementById('languageFilter').addEventListener('change', filterLessons);
}

// Filter lessons
function filterLessons() {
    const searchTerm = document.getElementById('lessonSearch').value.toLowerCase();
    const languageFilter = document.getElementById('languageFilter').value;
    
    const filteredLessons = lessons.filter(lesson => {
        const matchSearch = lesson.title.toLowerCase().includes(searchTerm) || 
                           lesson.language.toLowerCase().includes(searchTerm);
        const matchLanguage = !languageFilter || lesson.language === languageFilter;
        return matchSearch && matchLanguage;
    });
    
    displayLessons(filteredLessons);
}

// Load quizzes data
async function loadQuizzes() {
    try {
        showLoading('quizzesContent');
        // Load all quizzes without pagination limit for client-side handling
        quizzes = await AdminService.getQuizzesWithFilters({ limit: 1000 });
        displayQuizzes(quizzes);
    } catch (error) {
        document.getElementById('quizzesContent').innerHTML = `
            <p class="empty-state">Gagal memuat data kuis: ${error.message}</p>
        `;
    }
}

// Display quizzes table
function displayQuizzes(quizData) {
    const quizzesContent = document.getElementById('quizzesContent');
    
    if (!quizData || quizData.length === 0) {
        quizzesContent.innerHTML = '<p class="empty-state">Tidak ada data kuis</p>';
        return;
    }
    
    // Paginate quiz data
    const paginatedQuizzes = paginate(quizData, currentPage.quizzes);      quizzesContent.innerHTML = `
        <div class="admin-filters">
            <div class="filter-group">
                <label for="quizSearch">Pencarian:</label>
                <input type="text" id="quizSearch" class="form-control search-box" placeholder="Cari kuis...">
            </div>
        </div>
        
        <div class="bulk-actions" id="quizzesBulkActions" style="display: none;">
            <button class="btn btn-danger" onclick="bulkDelete('Quizzes')">
                <i class="fas fa-trash"></i> Hapus Terpilih
            </button>
            <span class="selected-count" id="quizzesSelectedCount">0 item terpilih</span>
        </div>
        
        <table class="admin-table">
            <thead>
                <tr>
                    <th class="select-all-header">
                        <input type="checkbox" id="selectAllQuizzes" onchange="toggleSelectAll('Quizzes')">
                    </th>
                    <th>ID</th>
                    <th>Pertanyaan</th>
                    <th>Materi</th>
                    <th>Jawaban</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedQuizzes.map(quiz => `
                    <tr>
                        <td>
                            <input type="checkbox" name="QuizzesCheckbox" value="${quiz.id}" onchange="updateBulkActionButtons('Quizzes')">
                        </td>
                        <td>${quiz.id}</td>
                        <td>${quiz.question.substring(0, 50)}${quiz.question.length > 50 ? '...' : ''}</td>
                        <td>${quiz.lesson?.title || 'Tidak diketahui'}</td>
                        <td><span class="status-badge status-active">${quiz.answer}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-edit" onclick="editQuiz(${quiz.id})">Edit</button>
                                <button class="btn btn-small btn-delete" onclick="deleteQuiz(${quiz.id})">Hapus</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        ${createPagination(quizData.length, currentPage.quizzes, 'quizzes')}
    `;
    
    // Add search functionality
    document.getElementById('quizSearch').addEventListener('input', debounce(() => filterQuizzes(), 300));
}

// Filter quizzes
function filterQuizzes() {
    const searchTerm = document.getElementById('quizSearch').value.toLowerCase();
    
    const filteredQuizzes = quizzes.filter(quiz => {
        return quiz.question.toLowerCase().includes(searchTerm) ||
               (quiz.lesson?.title || '').toLowerCase().includes(searchTerm);
    });
    
    displayQuizzes(filteredQuizzes);
}

// Load comments data
async function loadComments() {
    try {
        showLoading('commentsContent');
        // Load all comments without pagination limit for client-side handling
        comments = await AdminService.getCommentsWithFilters({ limit: 1000 });
        displayComments(comments);
    } catch (error) {
        document.getElementById('commentsContent').innerHTML = `
            <p class="empty-state">Gagal memuat data komentar: ${error.message}</p>
        `;
    }
}

// Display comments table
function displayComments(commentData) {
    const commentsContent = document.getElementById('commentsContent');
    
    if (!commentData || commentData.length === 0) {
        commentsContent.innerHTML = '<p class="empty-state">Tidak ada data komentar</p>';
        return;
    }
    
    // Paginate comment data
    const paginatedComments = paginate(commentData, currentPage.comments);      commentsContent.innerHTML = `
        <div class="admin-filters">
            <div class="filter-group">
                <label for="commentSearch">Pencarian:</label>
                <input type="text" id="commentSearch" class="form-control search-box" placeholder="Cari komentar...">
            </div>
        </div>
        
        <div class="bulk-actions" id="commentsBulkActions" style="display: none;">
            <button class="btn btn-danger" onclick="bulkDelete('Comments')">
                <i class="fas fa-trash"></i> Hapus Terpilih
            </button>
            <span class="selected-count" id="commentsSelectedCount">0 item terpilih</span>
        </div>
        
        <table class="admin-table">
            <thead>
                <tr>
                    <th class="select-all-header">
                        <input type="checkbox" id="selectAllComments" onchange="toggleSelectAll('Comments')">
                    </th>
                    <th>ID</th>
                    <th>Pengguna</th>
                    <th>Materi</th>
                    <th>Komentar</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                ${paginatedComments.map(comment => `
                    <tr>
                        <td>
                            <input type="checkbox" name="CommentsCheckbox" value="${comment.id}" onchange="updateBulkActionButtons('Comments')">
                        </td>
                        <td>${comment.id}</td>
                        <td>${comment.user?.name || 'Tidak diketahui'}</td>
                        <td>${comment.lesson?.title || 'Tidak diketahui'}</td>
                        <td>${comment.comment.substring(0, 50)}${comment.comment.length > 50 ? '...' : ''}</td>
                        <td>${formatDate(comment.created_at)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-small btn-delete" onclick="deleteComment(${comment.id})">Hapus</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        ${createPagination(commentData.length, currentPage.comments, 'comments')}
    `;
    
    // Add search functionality
    document.getElementById('commentSearch').addEventListener('input', debounce(() => filterComments(), 300));
}

// Filter comments
function filterComments() {
    const searchTerm = document.getElementById('commentSearch').value.toLowerCase();
    
    const filteredComments = comments.filter(comment => {
        return comment.comment.toLowerCase().includes(searchTerm) ||
               (comment.user?.name || '').toLowerCase().includes(searchTerm) ||
               (comment.lesson?.title || '').toLowerCase().includes(searchTerm);
    });
    
    displayComments(filteredComments);
}

// Modal functions
function showCreateUserModal() {
    document.getElementById('userModalTitle').textContent = 'Tambah Pengguna';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('userModal').style.display = 'block';
}

function showCreateLessonModal() {
    document.getElementById('lessonModalTitle').textContent = 'Tambah Materi';
    document.getElementById('lessonForm').reset();
    document.getElementById('lessonId').value = '';
    document.getElementById('lessonModal').style.display = 'block';
}

async function showCreateQuizModal() {
    document.getElementById('quizModalTitle').textContent = 'Tambah Kuis';
    document.getElementById('quizForm').reset();
    document.getElementById('quizId').value = '';
    
    // Load lessons for dropdown using admin service for consistency
    try {
        const lessons = await AdminService.getLessonsWithFilters({ limit: 1000 });
        const lessonSelect = document.getElementById('quizLessonId');
        lessonSelect.innerHTML = '<option value="">Pilih Materi</option>' +
            lessons.map(lesson => `<option value="${lesson.id}">${lesson.title}</option>`).join('');
    } catch (error) {
        console.error('Error loading lessons for quiz:', error);
    }
    
    document.getElementById('quizModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Edit functions
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    document.getElementById('userModalTitle').textContent = 'Edit Pengguna';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userPassword').required = false;
    document.getElementById('userModal').style.display = 'block';
}

function editLesson(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    document.getElementById('lessonModalTitle').textContent = 'Edit Materi';
    document.getElementById('lessonId').value = lesson.id;
    document.getElementById('lessonTitle').value = lesson.title;
    document.getElementById('lessonLanguage').value = lesson.language;
    document.getElementById('lessonContent').value = lesson.content;
    document.getElementById('lessonModal').style.display = 'block';
}

async function editQuiz(quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    document.getElementById('quizModalTitle').textContent = 'Edit Kuis';
    document.getElementById('quizId').value = quiz.id;
    document.getElementById('quizQuestion').value = quiz.question;
    
    // Parse options
    let options = quiz.options;
    if (typeof options === 'string') {
        try {
            options = JSON.parse(options);
        } catch (e) {
            console.error('Error parsing quiz options:', e);
            return;
        }
    }
    
    document.getElementById('quizOptionA').value = options.A || '';
    document.getElementById('quizOptionB').value = options.B || '';
    document.getElementById('quizOptionC').value = options.C || '';
    document.getElementById('quizOptionD').value = options.D || '';
    document.getElementById('quizAnswer').value = quiz.answer;
      // Load lessons for dropdown using admin service for consistency
    try {
        const lessons = await AdminService.getLessonsWithFilters({ limit: 1000 });
        const lessonSelect = document.getElementById('quizLessonId');
        lessonSelect.innerHTML = '<option value="">Pilih Materi</option>' +
            lessons.map(lesson => `<option value="${lesson.id}"${lesson.id === quiz.lesson_id ? ' selected' : ''}>${lesson.title}</option>`).join('');
    } catch (error) {
        console.error('Error loading lessons for quiz:', error);
    }
    
    document.getElementById('quizModal').style.display = 'block';
}

function viewLesson(lessonId) {
    window.open(`lesson.html?id=${lessonId}`, '_blank');
}

// Delete functions
async function deleteUser(userId) {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    
    try {
        await AdminService.deleteUser(userId);
        showSuccess('adminAlert', 'Pengguna berhasil dihapus');
        await loadUsers();
        await loadDashboardStats();
    } catch (error) {
        showError('adminAlert', `Gagal menghapus pengguna: ${error.message}`);
    }
}

async function deleteLesson(lessonId) {
    if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;
    
    try {
        await AdminService.deleteLesson(lessonId);
        showSuccess('adminAlert', 'Materi berhasil dihapus');
        await loadLessons();
        await loadDashboardStats();
    } catch (error) {
        showError('adminAlert', `Gagal menghapus materi: ${error.message}`);
    }
}

async function deleteQuiz(quizId) {
    if (!confirm('Apakah Anda yakin ingin menghapus kuis ini?')) return;
    
    try {
        await AdminService.deleteQuiz(quizId);
        showSuccess('adminAlert', 'Kuis berhasil dihapus');
        await loadQuizzes();
        await loadDashboardStats();
    } catch (error) {
        showError('adminAlert', `Gagal menghapus kuis: ${error.message}`);
    }
}

async function deleteComment(commentId) {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;
    
    try {
        await AdminService.deleteComment(commentId);
        showSuccess('adminAlert', 'Komentar berhasil dihapus');
        await loadComments();
        await loadDashboardStats();
    } catch (error) {
        showError('adminAlert', `Gagal menghapus komentar: ${error.message}`);
    }
}

// Setup form handlers
function setupFormHandlers() {
    // User form handler
    document.getElementById('userForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const userData = {
            name: document.getElementById('userName').value.trim(),
            email: document.getElementById('userEmail').value.trim(),
            role: document.getElementById('userRole').value
        };
          const password = document.getElementById('userPassword').value;
        if (password && password.trim() !== '') {
            userData.password = password.trim();
        }
        
        // Validate form data
        const userErrors = validateUserForm(userData);
        if (userErrors.length > 0) {
            return showError('adminAlert', userErrors.join(', '));
        }
        
        try {
            if (userId) {
                await AdminService.updateUser(userId, userData);
                showSuccess('adminAlert', 'Pengguna berhasil diperbarui');
            } else {
                await AdminService.createUser(userData);
                showSuccess('adminAlert', 'Pengguna berhasil ditambahkan');
            }
            
            closeModal('userModal');
            await loadUsers();
            await loadDashboardStats();
        } catch (error) {
            showError('adminAlert', `Gagal menyimpan pengguna: ${error.message}`);
        }
    });
    
    // Lesson form handler
    document.getElementById('lessonForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const lessonId = document.getElementById('lessonId').value;
        const lessonData = {
            title: document.getElementById('lessonTitle').value.trim(),
            language: document.getElementById('lessonLanguage').value.trim(),
            content: document.getElementById('lessonContent').value.trim()
        };
        
        // Validate form data
        const lessonErrors = validateLessonForm(lessonData);
        if (lessonErrors.length > 0) {
            return showError('adminAlert', lessonErrors.join(', '));
        }
        
        try {
            if (lessonId) {
                await AdminService.updateLesson(lessonId, lessonData);
                showSuccess('adminAlert', 'Materi berhasil diperbarui');
            } else {
                await AdminService.createLesson(lessonData);
                showSuccess('adminAlert', 'Materi berhasil ditambahkan');
            }
            
            closeModal('lessonModal');
            await loadLessons();
            await loadDashboardStats();
        } catch (error) {
            showError('adminAlert', `Gagal menyimpan materi: ${error.message}`);
        }
    });
    
    // Quiz form handler
    document.getElementById('quizForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const quizId = document.getElementById('quizId').value;
        const quizData = {
            lesson_id: parseInt(document.getElementById('quizLessonId').value),
            question: document.getElementById('quizQuestion').value.trim(),
            options: {
                A: document.getElementById('quizOptionA').value.trim(),
                B: document.getElementById('quizOptionB').value.trim(),
                C: document.getElementById('quizOptionC').value.trim(),
                D: document.getElementById('quizOptionD').value.trim()
            },
            answer: document.getElementById('quizAnswer').value
        };
        
        // Validate form data
        const quizErrors = validateQuizForm(quizData);
        if (quizErrors.length > 0) {
            return showError('adminAlert', quizErrors.join(', '));
        }
        
        try {
            if (quizId) {
                await AdminService.updateQuiz(quizId, quizData);
                showSuccess('adminAlert', 'Kuis berhasil diperbarui');
            } else {
                await AdminService.createQuiz(quizData);
                showSuccess('adminAlert', 'Kuis berhasil ditambahkan');
            }
            
            closeModal('quizModal');
            await loadQuizzes();
            await loadDashboardStats();
        } catch (error) {
            showError('adminAlert', `Gagal menyimpan kuis: ${error.message}`);
        }
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ========== UTILITY FUNCTIONS ==========

// Show loading state
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading-state"><p>Memuat data...</p></div>';
    }
}

// Format date helper specifically for admin
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format DateTime helper
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Truncate text helper
function truncateText(text, maxLength = 50) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Validate form data
function validateUserForm(userData) {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
        errors.push('Nama harus minimal 2 karakter');
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        errors.push('Email harus valid');
    }
    
    if (userData.password && userData.password.length < 6) {
        errors.push('Password harus minimal 6 karakter');
    }
    
    return errors;
}

function validateLessonForm(lessonData) {
    const errors = [];
    
    if (!lessonData.title || lessonData.title.trim().length < 3) {
        errors.push('Judul materi harus minimal 3 karakter');
    }
    
    if (!lessonData.language || lessonData.language.trim().length < 2) {
        errors.push('Bahasa harus diisi');
    }
    
    if (!lessonData.content || lessonData.content.trim().length < 10) {
        errors.push('Konten materi harus minimal 10 karakter');
    }
    
    return errors;
}

function validateQuizForm(quizData) {
    const errors = [];
    
    if (!quizData.lesson_id) {
        errors.push('Materi harus dipilih');
    }
    
    if (!quizData.question || quizData.question.trim().length < 5) {
        errors.push('Pertanyaan harus minimal 5 karakter');
    }
    
    if (!quizData.options.A || !quizData.options.B || !quizData.options.C || !quizData.options.D) {
        errors.push('Semua pilihan jawaban harus diisi');
    }
    
    if (!quizData.answer || !['A', 'B', 'C', 'D'].includes(quizData.answer)) {
        errors.push('Jawaban yang benar harus dipilih');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== EXPORT/IMPORT FUNCTIONS ==========

// Export data to CSV
function exportToCSV(data, filename, headers) {
    if (!data || data.length === 0) {
        showError('adminAlert', 'Tidak ada data untuk diekspor');
        return;
    }
    
    let csvContent = '';
    
    // Add headers
    if (headers) {
        csvContent += headers.join(',') + '\n';
    }
    
    // Add data rows
    data.forEach(row => {
        const values = Object.values(row).map(value => {
            // Handle nested objects
            if (typeof value === 'object' && value !== null) {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value || '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvContent += values.join(',') + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().getTime()}.csv`;
    link.click();
    
    showSuccess('adminAlert', `Data berhasil diekspor ke ${filename}.csv`);
}

// Export users data
function exportUsers() {
    const headers = ['ID', 'Nama', 'Email', 'Role', 'Tanggal Daftar'];
    const userData = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: formatDate(user.created_at)
    }));
    
    exportToCSV(userData, 'users_data', headers);
}

// Export lessons data
function exportLessons() {
    const headers = ['ID', 'Judul', 'Bahasa', 'Pembuat', 'Tanggal'];
    const lessonData = lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        language: lesson.language,
        creator: lesson.creator?.name || 'Admin',
        created_at: formatDate(lesson.created_at)
    }));
    
    exportToCSV(lessonData, 'lessons_data', headers);
}

// Export quizzes data
function exportQuizzes() {
    const headers = ['ID', 'Pertanyaan', 'Materi', 'Jawaban'];
    const quizData = quizzes.map(quiz => ({
        id: quiz.id,
        question: quiz.question,
        lesson: quiz.lesson?.title || 'Tidak diketahui',
        answer: quiz.answer
    }));
    
    exportToCSV(quizData, 'quizzes_data', headers);
}

// Export comments data
function exportComments() {
    const headers = ['ID', 'Pengguna', 'Materi', 'Komentar', 'Tanggal'];
    const commentData = comments.map(comment => ({
        id: comment.id,
        user: comment.user?.name || 'Tidak diketahui',
        lesson: comment.lesson?.title || 'Tidak diketahui',
        comment: comment.comment,
        created_at: formatDate(comment.created_at)
    }));
    
    exportToCSV(commentData, 'comments_data', headers);
}

// ========== BULK OPERATIONS ==========

// Select all checkboxes for bulk operations
function toggleSelectAll(tableName) {
    const selectAllCheckbox = document.getElementById(`selectAll${tableName}`);
    const checkboxes = document.querySelectorAll(`input[name="${tableName}Checkbox"]:not(#selectAll${tableName})`);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActionButtons(tableName);
}

// Update bulk action buttons based on selection
function updateBulkActionButtons(tableName) {
    const checkboxes = document.querySelectorAll(`input[name="${tableName}Checkbox"]:not(#selectAll${tableName}):checked`);
    const bulkActionsDiv = document.getElementById(`bulk${tableName}Actions`);
    
    if (checkboxes.length > 0) {
        if (bulkActionsDiv) {
            bulkActionsDiv.style.display = 'block';
            bulkActionsDiv.innerHTML = `
                <button class="btn btn-danger btn-small" onclick="bulkDelete('${tableName}')">
                    Hapus Terpilih (${checkboxes.length})
                </button>
            `;
        }
    } else {
        if (bulkActionsDiv) {
            bulkActionsDiv.style.display = 'none';
        }
    }
}

// Bulk delete operation
async function bulkDelete(tableName) {
    const checkboxes = document.querySelectorAll(`input[name="${tableName}Checkbox"]:not(#selectAll${tableName}):checked`);
    const ids = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (ids.length === 0) {
        showError('adminAlert', 'Pilih data yang ingin dihapus');
        return;
    }
    
    if (!confirm(`Apakah Anda yakin ingin menghapus ${ids.length} item yang dipilih?`)) {
        return;
    }
    
    try {
        let successMessage = '';
        switch (tableName.toLowerCase()) {
            case 'users':
                await AdminService.bulkDeleteUsers(ids);
                successMessage = 'Pengguna berhasil dihapus';
                await loadUsers();
                break;
            case 'lessons':
                await AdminService.bulkDeleteLessons(ids);
                successMessage = 'Materi berhasil dihapus';
                await loadLessons();
                break;
            case 'quizzes':
                await AdminService.bulkDeleteQuizzes(ids);
                successMessage = 'Kuis berhasil dihapus';
                await loadQuizzes();
                break;
            case 'comments':
                await AdminService.bulkDeleteComments(ids);
                successMessage = 'Komentar berhasil dihapus';
                await loadComments();
                break;
        }
        
        showSuccess('adminAlert', successMessage);
        await loadDashboardStats();
        updateBulkActionButtons(tableName);
    } catch (error) {
        showError('adminAlert', `Gagal menghapus data: ${error.message}`);
    }
}

// ========== SEARCH AND FILTER ENHANCEMENTS ==========

// Advanced search function
function performAdvancedSearch(searchTerm, data, searchFields) {
    if (!searchTerm) return data;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return data.filter(item => {
        return searchFields.some(field => {
            const fieldValue = getNestedProperty(item, field);
            return fieldValue && fieldValue.toString().toLowerCase().includes(lowerSearchTerm);
        });
    });
}

// Helper to get nested property value
function getNestedProperty(obj, path) {
    return path.split('.').reduce((curr, prop) => curr && curr[prop], obj);
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Pagination functions
function paginate(data, page, itemsPerPage = ITEMS_PER_PAGE) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
}

function createPagination(totalItems, currentPageNum, tableName) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) return '';
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPageNum > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage('${tableName}', ${currentPageNum - 1})">‹ Sebelumnya</button>`;
    }
    
    // Page numbers
    let startPage = Math.max(1, currentPageNum - 2);
    let endPage = Math.min(totalPages, currentPageNum + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage('${tableName}', 1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPageNum ? 'active' : '';
        paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="goToPage('${tableName}', ${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="pagination-dots">...</span>';
        }
        paginationHTML += `<button class="pagination-btn" onclick="goToPage('${tableName}', ${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPageNum < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage('${tableName}', ${currentPageNum + 1})">Selanjutnya ›</button>`;
    }
    
    paginationHTML += '</div>';
    
    // Add pagination info
    const startItem = (currentPageNum - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPageNum * ITEMS_PER_PAGE, totalItems);
    paginationHTML += `<div class="pagination-info">Menampilkan ${startItem}-${endItem} dari ${totalItems} item</div>`;
    
    return paginationHTML;
}

function goToPage(tableName, page) {
    currentPage[tableName.toLowerCase()] = page;
    
    switch (tableName.toLowerCase()) {
        case 'users':
            filterUsers();
            break;
        case 'lessons':
            filterLessons();
            break;
        case 'quizzes':
            filterQuizzes();
            break;
        case 'comments':
            filterComments();
            break;
    }
}

// Advanced search and sort functionality
function addAdvancedFilters(tableName) {
    return `
        <div class="advanced-filters">
            <div class="filter-row">
                <select class="form-control" id="${tableName}SortBy">
                    <option value="">Urutkan berdasarkan</option>
                    <option value="id">ID</option>
                    <option value="created_at">Tanggal dibuat</option>
                    <option value="updated_at">Tanggal diperbarui</option>
                </select>
                <select class="form-control" id="${tableName}SortOrder">
                    <option value="desc">Terbaru</option>
                    <option value="asc">Terlama</option>
                </select>
                <button class="btn btn-secondary" onclick="applyAdvancedFilters('${tableName}')">
                    <i class="fas fa-filter"></i> Terapkan Filter
                </button>
                <button class="btn btn-secondary" onclick="resetFilters('${tableName}')">
                    <i class="fas fa-times"></i> Reset
                </button>
            </div>
        </div>
    `;
}

function applyAdvancedFilters(tableName) {
    const sortBy = document.getElementById(`${tableName}SortBy`).value;
    const sortOrder = document.getElementById(`${tableName}SortOrder`).value;
    
    if (!sortBy) return;
    
    let dataArray;
    switch (tableName.toLowerCase()) {
        case 'users':
            dataArray = [...users];
            break;
        case 'lessons':
            dataArray = [...lessons];
            break;
        case 'quizzes':
            dataArray = [...quizzes];
            break;
        case 'comments':
            dataArray = [...comments];
            break;
    }
    
    dataArray.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'created_at' || sortBy === 'updated_at') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
    
    // Reset to first page and display sorted data
    currentPage[tableName.toLowerCase()] = 1;
    
    switch (tableName.toLowerCase()) {
        case 'users':
            displayUsers(dataArray);
            break;
        case 'lessons':
            displayLessons(dataArray);
            break;
        case 'quizzes':
            displayQuizzes(dataArray);
            break;
        case 'comments':
            displayComments(dataArray);
            break;
    }
}

function resetFilters(tableName) {
    document.getElementById(`${tableName}SortBy`).value = '';
    document.getElementById(`${tableName}SortOrder`).value = 'desc';
    currentPage[tableName.toLowerCase()] = 1;
    
    switch (tableName.toLowerCase()) {
        case 'users':
            filterUsers();
            break;
        case 'lessons':
            filterLessons();
            break;
        case 'quizzes':
            filterQuizzes();
            break;
        case 'comments':
            filterComments();
            break;
    }
}

// Enhanced export functionality with date range
function exportDataWithOptions(tableName) {
    const modal = document.getElementById('exportModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Export ${tableName}</h3>
            <span class="close" onclick="closeModal('exportModal')">&times;</span>
        </div>
        <div class="modal-body">
            <form id="exportForm">
                <div class="form-group">
                    <label>Format Export:</label>
                    <select class="form-control" id="exportFormat">
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                        <option value="xlsx">Excel</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Rentang Tanggal:</label>
                    <div class="date-range">
                        <input type="date" class="form-control" id="startDate">
                        <span>sampai</span>
                        <input type="date" class="form-control" id="endDate">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Kolom yang Disertakan:</label>
                    <div id="columnSelection" class="checkbox-group">
                        <!-- Will be populated based on table type -->
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal('exportModal')">Batal</button>
                    <button type="button" class="btn btn-primary" onclick="executeExport('${tableName}')">Export</button>
                </div>
            </form>
        </div>
    `;
    
    // Populate column selection based on table
    populateColumnSelection(tableName);
    modal.style.display = 'block';
}

function populateColumnSelection(tableName) {
    const columnDiv = document.getElementById('columnSelection');
    let columns = [];
    
    switch (tableName.toLowerCase()) {
        case 'users':
            columns = ['id', 'name', 'email', 'role', 'created_at', 'updated_at'];
            break;
        case 'lessons':
            columns = ['id', 'title', 'content', 'language', 'creator', 'created_at', 'updated_at'];
            break;
        case 'quizzes':
            columns = ['id', 'question', 'options', 'answer', 'lesson_id', 'created_at'];
            break;
        case 'comments':
            columns = ['id', 'comment', 'user_id', 'lesson_id', 'created_at'];
            break;
    }
    
    columnDiv.innerHTML = columns.map(col => `
        <label class="checkbox-label">
            <input type="checkbox" value="${col}" checked> ${col.replace('_', ' ').toUpperCase()}
        </label>
    `).join('');
}

function executeExport(tableName) {
    const format = document.getElementById('exportFormat').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const selectedColumns = Array.from(document.querySelectorAll('#columnSelection input:checked')).map(input => input.value);
    
    // Filter data based on date range and selected columns
    let dataToExport;
    switch (tableName.toLowerCase()) {
        case 'users':
            dataToExport = users;
            break;
        case 'lessons':
            dataToExport = lessons;
            break;
        case 'quizzes':
            dataToExport = quizzes;
            break;
        case 'comments':
            dataToExport = comments;
            break;
    }
    
    // Apply date filter
    if (startDate && endDate) {
        dataToExport = dataToExport.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
    }
    
    // Filter columns
    dataToExport = dataToExport.map(item => {
        const filteredItem = {};
        selectedColumns.forEach(col => {
            if (item.hasOwnProperty(col)) {
                filteredItem[col] = item[col];
            }
        });
        return filteredItem;
    });
    
    // Export based on format
    switch (format) {
        case 'csv':
            exportToCSV(dataToExport, `${tableName}_${getCurrentDate()}.csv`);
            break;
        case 'json':
            exportToJSON(dataToExport, `${tableName}_${getCurrentDate()}.json`);
            break;
        case 'xlsx':
            showError('adminAlert', 'Format Excel belum didukung. Silakan gunakan CSV.');
            break;
    }
    
    closeModal('exportModal');
    showSuccess('adminAlert', `Data ${tableName} berhasil diexport`);
}

function exportToJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}
