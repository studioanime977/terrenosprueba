// Authentication Pages JavaScript

// User data storage
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupAuthHandlers();
    checkUserSession();
});

function setupAuthHandlers() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Admin login form
    const adminForm = document.getElementById('admin-login-form');
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminLogin);
    }
}

// Check if user is already logged in
function checkUserSession() {
    if (currentUser) {
        // Redirect to index if already logged in
        if (window.location.pathname.includes('iniciarcesion.html') || 
            window.location.pathname.includes('registro.html')) {
            window.location.href = '../index.html';
        }
    }
}

// Handle user login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Find user
    const user = users.find(u => 
        (u.email === username || u.username === username) && u.password === password
    );

    if (user) {
        // Login successful
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('rememberUser', 'true');
        }

        showMessage('login-success', `¡Bienvenido, ${user.firstName}!`);
        
        // Redirect to index after 1 second
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    } else {
        showMessage('login-error', 'Usuario o contraseña incorrectos');
    }
}

// Handle user registration
async function handleUserRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        birthDate: formData.get('birthDate'),
        occupation: formData.get('occupation'),
        monthlyIncome: formData.get('monthlyIncome'),
        investmentBudget: formData.get('investmentBudget'),
        preferredLocation: formData.get('preferredLocation'),
        propertyType: formData.get('propertyType'),
        financingNeeded: formData.get('financingNeeded') === 'on',
        newsletterSubscription: formData.get('newsletterSubscription') === 'on',
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value)
    };
    
    // Validate password confirmation
    const confirmPassword = formData.get('confirmPassword');
    if (userData.password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    // For Vercel deployment, store locally (in production, use backend API)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(user => user.email === userData.email)) {
        showNotification('El email ya está registrado', 'error');
        return;
    }
    
    if (users.find(user => user.username === userData.username)) {
        showNotification('El nombre de usuario ya existe', 'error');
        return;
    }
    
    // Add user
    userData.id = Date.now();
    userData.createdAt = new Date().toISOString();
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Registro exitoso. Redirigiendo...', 'success');
    
    // Redirect to login page
    // Auto-login and redirect
    setTimeout(() => {
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = '../index.html';
    }, 1500);
}

// Handle admin login
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    if (username === 'admin' && password === 'terrenos2024') {
        // Admin login successful
        const adminUser = {
            id: 'admin',
            fullName: 'Administrador',
            email: 'admin@terrenospremium.com',
            role: 'admin'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.location.href = '../admin.html';
    } else {
        showMessage('login-error', 'Credenciales de administrador incorrectas');
        closeAdminModal();
    }
}

// Show admin login modal
function adminLogin() {
    document.getElementById('admin-modal').style.display = 'block';
}

// Close admin modal
function closeAdminModal() {
    document.getElementById('admin-modal').style.display = 'none';
}

// Toggle password visibility
function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

// Show messages
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // Hide other messages
        const otherMessage = elementId.includes('error') ? 
            document.getElementById(elementId.replace('error', 'success')) :
            document.getElementById(elementId.replace('success', 'error'));
        
        if (otherMessage) {
            otherMessage.style.display = 'none';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('admin-modal');
    if (event.target === modal) {
        closeAdminModal();
    }
});

// Export users data for admin panel
window.getUsersData = function() {
    return users;
};

// Update user data
window.updateUserData = function(updatedUsers) {
    users = updatedUsers;
    localStorage.setItem('users', JSON.stringify(users));
};
