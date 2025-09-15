// Main JavaScript functionality for the real estate website

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#fff';
            header.style.backdropFilter = 'none';
        }
    });
});

// Property viewing functionality
function viewProperty(propertyId) {
    // Redirect to the specific property page
    window.location.href = `public/${propertyId}.html`;
}

// Contact form functionality
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    const property = formData.get('property');
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Por favor, complete todos los campos requeridos.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor, ingrese un email válido.', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
    form.reset();
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', { name, email, phone, message, property });
}

// Notification system
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

// Property search functionality
function searchProperties() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('.location').textContent.toLowerCase();
        const description = card.querySelector('.description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || location.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Property filter functionality
function filterProperties(filterType, filterValue) {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        let shouldShow = true;
        
        if (filterType === 'price') {
            const priceText = card.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            
            switch(filterValue) {
                case 'low':
                    shouldShow = price < 80000;
                    break;
                case 'medium':
                    shouldShow = price >= 80000 && price <= 120000;
                    break;
                case 'high':
                    shouldShow = price > 120000;
                    break;
            }
        } else if (filterType === 'area') {
            const areaText = card.querySelector('.area').textContent;
            const area = parseInt(areaText.replace(/[^0-9]/g, ''));
            
            switch(filterValue) {
                case 'small':
                    shouldShow = area < 700;
                    break;
                case 'medium':
                    shouldShow = area >= 700 && area <= 1000;
                    break;
                case 'large':
                    shouldShow = area > 1000;
                    break;
            }
        }
        
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Reset filters
function resetFilters() {
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        card.style.display = 'block';
    });
    
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.property-card, .service-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.property-card, .service-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger animation on load
    animateOnScroll();
});

// Check user session and update UI
function checkUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const loginBtn = document.querySelector('.login-btn');
    
    if (currentUser && loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.fullName}`;
        loginBtn.href = '#';
        loginBtn.onclick = showUserMenu;
    }
}

// Show user menu
function showUserMenu() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                <strong>${currentUser.fullName}</strong>
                <small>${currentUser.email}</small>
            </div>
            <hr>
            <a href="#" onclick="showUserProfile()"><i class="fas fa-user"></i> Mi Perfil</a>
            <a href="#" onclick="showUserFavorites()"><i class="fas fa-heart"></i> Favoritos</a>
            ${currentUser.role === 'admin' ? '<a href="admin.html"><i class="fas fa-cog"></i> Panel Admin</a>' : ''}
            <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
        </div>
    `;
    
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
    
    document.body.appendChild(menu);
    
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
    localStorage.removeItem('currentUser');
    window.location.href = 'public/iniciarcesion.html';
}

// User profile functions (placeholder)
function showUserProfile() {
    alert('Función de perfil en desarrollo');
}

function showUserFavorites() {
    alert('Función de favoritos en desarrollo');
}

// Load properties dynamically
document.addEventListener('DOMContentLoaded', function() {
    checkUserSession();
    loadTerrains();
    
    // Listen for real-time updates from admin panel
    window.addEventListener('storage', function(e) {
        if (e.key === 'terrainUpdate') {
            console.log('Real-time terrain update detected');
            loadTerrains();
        }
    });
    
    // Poll for updates every 30 seconds as backup
    setInterval(loadTerrains, 30000);
});

// Load terrains from API
async function loadTerrains() {
    try {
        // For Vercel deployment, use JSON file directly
        loadTerrainsFromJSON();
    } catch (error) {
        console.error('Error loading terrains:', error);
        loadTerrainsFromJSON();
    }
}

// Fallback function to load from JSON file
function loadTerrainsFromJSON() {
    fetch('public/terrains.json')
        .then(response => response.json())
        .then(data => {
            properties = data.filter(terrain => terrain.enabled !== false);
            displayProperties();
        })
        .catch(error => console.error('Error fetching properties from JSON:', error));
}

function viewProperty(detailPage) {
    window.location.href = `public/${detailPage}`;
}
