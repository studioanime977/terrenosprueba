// Authentication System for Terrenos Premium

// User management
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users') || '[]');

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserDashboard();
    }

    // Setup form handlers
    setupAuthHandlers();
});

function setupAuthHandlers() {
    // User login form
    const userLoginForm = document.getElementById('user-login-form');
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', handleUserLogin);
    }

    // User register form
    const userRegisterForm = document.getElementById('user-register-form');
    if (userRegisterForm) {
        userRegisterForm.addEventListener('submit', handleUserRegister);
    }

    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
}

// Modal functions
function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'block';
    showLoginForm();
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('login-form-container').style.display = 'block';
    document.getElementById('register-form-container').style.display = 'none';
    document.getElementById('admin-login-container').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';
    document.getElementById('admin-login-container').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'none';
    document.getElementById('admin-login-container').style.display = 'block';
}

// Handle user login
function handleUserLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Find user
    const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeAuthModal();
        showUserDashboard();
        showNotification(`¡Bienvenido, ${user.name}!`, 'success');
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
}

// Handle user registration
function handleUserRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    // Validation
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('Ya existe un usuario con este email', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        username: email, // Use email as username
        password: password,
        role: 'user',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login the new user
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    closeAuthModal();
    showUserDashboard();
    showNotification(`¡Cuenta creada exitosamente! Bienvenido, ${name}!`, 'success');
}

// Handle admin login
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Admin credentials
    if (username === 'admin' && password === 'terrenos2024') {
        // Redirect to admin panel
        window.location.href = 'admin.html';
    } else {
        showNotification('Credenciales de administrador incorrectas', 'error');
    }
}

// Show user dashboard
function showUserDashboard() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-dashboard').style.display = 'block';
        
        // Update login button to show user name
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name}`;
            loginBtn.onclick = showUserMenu;
        }
    }
}

// Show user menu
function showUserMenu() {
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                <strong>${currentUser.name}</strong>
                <small>${currentUser.email}</small>
            </div>
            <hr>
            <a href="#" onclick="showUserProfile()"><i class="fas fa-user"></i> Mi Perfil</a>
            <a href="#" onclick="showUserFavorites()"><i class="fas fa-heart"></i> Favoritos</a>
            <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
        </div>
    `;
    
    // Position menu
    menu.style.cssText = `
        position: absolute;
        top: 60px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        min-width: 200px;
    `;
    
    // Style menu content
    const style = document.createElement('style');
    style.textContent = `
        .user-menu-content {
            padding: 15px;
        }
        .user-menu-content .user-info {
            margin-bottom: 10px;
        }
        .user-menu-content .user-info strong {
            display: block;
            color: #333;
        }
        .user-menu-content .user-info small {
            color: #666;
        }
        .user-menu-content hr {
            margin: 10px 0;
            border: none;
            border-top: 1px solid #eee;
        }
        .user-menu-content a {
            display: block;
            padding: 8px 0;
            color: #333;
            text-decoration: none;
            transition: color 0.3s;
        }
        .user-menu-content a:hover {
            color: #667eea;
        }
        .user-menu-content a i {
            margin-right: 8px;
            width: 16px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('user-dashboard').style.display = 'none';
    
    // Reset login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Iniciar Sesión';
        loginBtn.onclick = openAuthModal;
    }
    
    // Remove any user menus
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.remove();
    }
    
    showNotification('Sesión cerrada correctamente', 'info');
}

// User profile functions (placeholder)
function showUserProfile() {
    showNotification('Función de perfil en desarrollo', 'info');
}

function showUserFavorites() {
    showNotification('Función de favoritos en desarrollo', 'info');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('auth-modal');
    if (event.target === modal) {
        closeAuthModal();
    }
});

// Notification function (reuse from main.js if available)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
