// Helper untuk UI komponen dan interaksi

// Menampilkan loading spinner
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        `;
    }
}

// Menampilkan pesan error
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }
}

// Menampilkan pesan sukses
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="alert alert-success">${message}</div>`;
    }
}

// Mendapatkan parameter dari URL
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Format tanggal
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Memperbarui tampilan navigasi berdasarkan status login
function updateNavigation() {
    const navAuthItems = document.getElementById('navAuthItems');
    if (!navAuthItems) return;
    
    if (AuthService.isAuthenticated()) {
        const user = AuthService.getCurrentUser();
        
        // Build navigation based on user role
        let navItems = `<li><span class="nav-greeting">${user.name}</span></li>`;
        
        // Add admin dashboard link for admin users
        if (user.role === 'admin') {
            navItems += `<li><a href="admin.html" class="nav-link">Dashboard Admin</a></li>`;
        }
        
        navItems += `
            <li><a href="progress.html" class="nav-link">Progress Belajar</a></li>
            <li><a href="#" id="btnLogout" class="nav-link">Logout</a></li>
        `;
        
        navAuthItems.innerHTML = navItems;
        
        // Event handler untuk logout
        document.getElementById('btnLogout').addEventListener('click', async (e) => {
            e.preventDefault();
            await AuthService.logout();
            window.location.href = 'index.html';
        });
    } else {
        navAuthItems.innerHTML = `
            <li><a href="login.html" class="nav-link">Login</a></li>
            <li><a href="register.html" class="nav-link">Daftar</a></li>
        `;
    }
}

// Redirect ke login jika tidak terautentikasi
function requireAuth() {
    if (!AuthService.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Redirect ke beranda jika sudah login (untuk halaman login/register)
function redirectIfLoggedIn() {
    if (AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
        return true;
    }
    return false;
}
