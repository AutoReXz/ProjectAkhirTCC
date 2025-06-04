// Initialize authentication when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize authentication - coba refresh token jika perlu
        await AuthService.initAuth();
        
        // Update UI sesuai status login
        updateAuthUI();
    } catch (error) {
        console.error('Error during auth initialization:', error);
    }
});

// Update UI berdasarkan status authentication
function updateAuthUI() {
    const isLoggedIn = AuthService.isAuthenticated();
    const user = AuthService.getCurrentUser();
    
    // Update navigation atau UI elements lainnya
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (isLoggedIn && user) {
        // User sudah login
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userInfo) userInfo.textContent = `Selamat datang, ${user.name}`;
    } else {
        // User belum login
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) userInfo.textContent = '';
    }
}

// Handle logout button
function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            try {
                await AuthService.logout();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
}

// Setup logout handler when DOM is ready
document.addEventListener('DOMContentLoaded', setupLogoutHandler);
