// Admin Panel JavaScript

// Login credentials (in production, this should be handled by a backend)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'terrenos2024'
};

let terrains = [];
let currentEditingTerrain = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const fileInput = document.getElementById('file-input');
    const uploadBox = document.getElementById('upload-box');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // File upload handlers
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    if (uploadBox) {
        // Drag and drop functionality
        uploadBox.addEventListener('dragover', handleDragOver);
        uploadBox.addEventListener('dragleave', handleDragLeave);
        uploadBox.addEventListener('drop', handleDrop);
    }

    // Load terrains if admin panel is visible
    if (document.getElementById('admin-panel').style.display !== 'none') {
        loadTerrains();
    }
});

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadTerrains();
        showNotification('¡Bienvenido al panel de administración!', 'success');
    } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
        errorDiv.style.display = 'block';
    }
}

// Logout function
function logout() {
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').style.display = 'none';
    showNotification('Sesión cerrada correctamente', 'info');
}

// Show different sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });

    // Remove active class from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName + '-section').style.display = 'block';
    document.getElementById(sectionName + '-btn').classList.add('active');
    
    // Load users data when switching to users section
    if (sectionName === 'users') {
        loadUsers();
    }
}

// Load terrains from JSON
async function loadTerrains() {
    try {
        const response = await fetch('public/terrains.json');
        terrains = await response.json();
        displayTerrains();
        
        // Also load users if on users section
        if (document.getElementById('users-section').style.display !== 'none') {
            loadUsers();
        }
    } catch (error) {
        console.error('Error loading terrains:', error);
        showNotification('Error al cargar los terrenos', 'error');
    }
}

// Display terrains in admin grid
function displayTerrains() {
    const grid = document.getElementById('admin-terrains-grid');
    grid.innerHTML = '';

    terrains.forEach(terrain => {
        const terrainCard = document.createElement('div');
        terrainCard.className = 'admin-terrain-card';
        terrainCard.innerHTML = `
            <div class="admin-terrain-image">
                <img src="${terrain.mainImage.replace('../', '')}" alt="${terrain.name}">
                ${terrain.badge ? `<div class="property-badge">${terrain.badge}</div>` : ''}
            </div>
            <div class="admin-terrain-info">
                <h3>${terrain.name}</h3>
                <div class="price">${terrain.price}</div>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${terrain.location}
                </div>
                <div class="admin-terrain-actions">
                    <button class="btn-edit" onclick="editTerrain(${terrain.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-toggle ${terrain.enabled !== false ? 'btn-disable' : 'btn-enable'}" onclick="toggleTerrain(${terrain.id})">
                        <i class="fas fa-${terrain.enabled !== false ? 'eye-slash' : 'eye'}"></i> ${terrain.enabled !== false ? 'Deshabilitar' : 'Habilitar'}
                    </button>
                    <button class="btn-delete" onclick="deleteTerrain(${terrain.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(terrainCard);
    });
}

// Edit terrain
function editTerrain(terrainId) {
    const terrain = terrains.find(t => t.id === terrainId);
    if (!terrain) return;

    currentEditingTerrain = terrain;

    // Fill form with current data
    document.getElementById('edit-terrain-id').value = terrain.id;
    document.getElementById('edit-name').value = terrain.name;
    document.getElementById('edit-price').value = terrain.price;
    document.getElementById('edit-location').value = terrain.location;
    document.getElementById('edit-size').value = terrain.size;
    document.getElementById('edit-badge').value = terrain.badge || '';
    document.getElementById('edit-description').value = terrain.description;

    // Show modal
    document.getElementById('edit-modal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditingTerrain = null;
}

// Handle edit form submission
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', function(event) {
            event.preventDefault();
            saveTerrainChanges();
        });
    }
});

// Save terrain changes
function saveTerrainChanges() {
    const terrainId = parseInt(document.getElementById('edit-terrain-id').value);
    const terrainIndex = terrains.findIndex(t => t.id === terrainId);

    if (terrainIndex === -1) return;

    // Update terrain data
    terrains[terrainIndex] = {
        ...terrains[terrainIndex],
        name: document.getElementById('edit-name').value,
        price: document.getElementById('edit-price').value,
        location: document.getElementById('edit-location').value,
        size: document.getElementById('edit-size').value,
        badge: document.getElementById('edit-badge').value,
        description: document.getElementById('edit-description').value
    };

    // In a real application, you would send this data to a backend
    // For now, we'll simulate saving to localStorage
    localStorage.setItem('terrains', JSON.stringify(terrains));

    // Update display
    displayTerrains();
    closeEditModal();
    showNotification('Terreno actualizado correctamente', 'success');

    // Note: In production, you would need to update the actual JSON file
    console.log('Updated terrain data:', terrains[terrainIndex]);
}

// Delete terrain
function deleteTerrain(terrainId) {
    if (confirm('¿Estás seguro de que quieres eliminar este terreno?')) {
        terrains = terrains.filter(t => t.id !== terrainId);
        
        // Save to localStorage (in production, update backend)
        localStorage.setItem('terrains', JSON.stringify(terrains));
        
        displayTerrains();
        showNotification('Terreno eliminado correctamente', 'success');
    }
}

// File upload handlers
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    handleFiles(files);
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
}

function handleFiles(files) {
    const preview = document.getElementById('upload-preview');
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button class="remove-btn" onclick="this.parentElement.remove()">×</button>
                    <p style="padding: 5px; font-size: 12px; text-align: center;">${file.name}</p>
                `;
                preview.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }
    });

    // In production, you would upload these files to your server
    showNotification(`${files.length} imagen(es) preparada(s) para subir`, 'info');
}

// Notification system (reuse from main.js)
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

// Terrain creation functionality
let terrainFeatures = [];
let terrainImages = [];

// Initialize create terrain form
document.addEventListener('DOMContentLoaded', function() {
    const createForm = document.getElementById('create-terrain-form');
    const terrainImagesInput = document.getElementById('terrain-images');
    
    if (createForm) {
        createForm.addEventListener('submit', handleCreateTerrain);
    }
    
    if (terrainImagesInput) {
        terrainImagesInput.addEventListener('change', handleTerrainImages);
    }
});

// Add feature to terrain
function addFeature() {
    const input = document.getElementById('feature-input');
    const feature = input.value.trim();
    
    if (feature && !terrainFeatures.includes(feature)) {
        terrainFeatures.push(feature);
        displayFeatures();
        input.value = '';
    }
}

// Display features
function displayFeatures() {
    const container = document.getElementById('features-list');
    container.innerHTML = '';
    
    terrainFeatures.forEach((feature, index) => {
        const tag = document.createElement('div');
        tag.className = 'feature-tag';
        tag.innerHTML = `
            ${feature}
            <button class="remove-feature" onclick="removeFeature(${index})" type="button">×</button>
        `;
        container.appendChild(tag);
    });
}

// Remove feature
function removeFeature(index) {
    terrainFeatures.splice(index, 1);
    displayFeatures();
}

// Handle terrain images
function handleTerrainImages(event) {
    const files = Array.from(event.target.files);
    const preview = document.getElementById('terrain-images-preview');
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-preview-item';
                imageItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button class="remove-image" onclick="this.parentElement.remove()" type="button">×</button>
                `;
                preview.appendChild(imageItem);
            };
            reader.readAsDataURL(file);
            terrainImages.push(file);
        }
    });
}

// Handle create terrain form submission
async function handleCreateTerrain(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Create terrain data object
    const terrainData = {
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        currency: 'MXN',
        location: formData.get('location'),
        size: formData.get('size'),
        badge: formData.get('badge'),
        coordinates: formData.get('coordinates') || '19.4326, -99.1332',
        description: formData.get('description'),
        features: [...terrainFeatures],
        availability: 'Disponible inmediatamente',
        main_image: terrainImages.length > 0 ? `../img/terrain_${Date.now()}.jpg` : '../img/default.jpg',
        thumbnails: terrainImages.map((_, index) => `../img/terrain_${Date.now()}_${index}.jpg`),
        detail_page: `terreno${Date.now()}.html`,
        enabled: true // Auto-enable new terrains
    };
    
    try {
        // Send to backend API
        const response = await fetch('/api/admin/terrains', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(terrainData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local terrains array
            terrains.push(result.terrain);
            
            // Update display
            displayTerrains();
            
            // Reset form
            resetCreateForm();
            
            // Show success message
            showNotification('Terreno creado y habilitado exitosamente', 'success');
            
            // Switch to terrains view
            showSection('terrains');
            
            // Trigger real-time update for index.html
            await triggerRealTimeUpdate();
            
            // Auto-push to Git
            await autoGitPush('Nuevo terreno creado: ' + terrainData.name);
            
        } else {
            showNotification('Error al crear terreno: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error creating terrain:', error);
        showNotification('Error de conexión al crear terreno', 'error');
    }
}

// Reset create form
function resetCreateForm() {
    document.getElementById('create-terrain-form').reset();
    terrainFeatures = [];
    terrainImages = [];
    displayFeatures();
    document.getElementById('terrain-images-preview').innerHTML = '';
}

// Location picker functions
function openLocationPicker() {
    document.getElementById('location-modal').style.display = 'block';
    initSimpleMap();
}

function closeLocationModal() {
    document.getElementById('location-modal').style.display = 'none';
}

// Website preview functions
function openWebsite() {
    window.open('index.html', '_blank');
}

function refreshPreview() {
    const iframe = document.getElementById('website-iframe');
    iframe.src = iframe.src;
    showNotification('Vista previa actualizada', 'info');
}

// Users management functions
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    displayUsersStats(users);
    displayUsersTable(users);
}

function displayUsersStats(users) {
    const today = new Date().toDateString();
    const newUsersToday = users.filter(user => 
        new Date(user.createdAt).toDateString() === today
    ).length;
    
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('new-users').textContent = newUsersToday;
    document.getElementById('active-users').textContent = users.filter(u => u.lastLogin).length;
}

function displayUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'No especificado'}</td>
            <td>${user.interest || 'No especificado'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="user-actions">
                    <button class="btn-small-action btn-view" onclick="viewUser('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-small-action btn-delete-user" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewUser(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id == userId);
    if (user) {
        alert(`Información del Usuario:\n\nNombre: ${user.fullName}\nEmail: ${user.email}\nTeléfono: ${user.phone || 'No especificado'}\nInterés: ${user.interest || 'No especificado'}\nRegistro: ${new Date(user.createdAt).toLocaleString()}\nNewsletter: ${user.newsletter ? 'Sí' : 'No'}`);
    }
}

function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.id != userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        showNotification('Usuario eliminado correctamente', 'success');
    }
}

function exportUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const csvContent = 'data:text/csv;charset=utf-8,' + 
        'Nombre,Email,Teléfono,Interés,Registro,Newsletter\n' +
        users.map(user => 
            `"${user.fullName}","${user.email}","${user.phone || ''}","${user.interest || ''}","${new Date(user.createdAt).toLocaleString()}","${user.newsletter ? 'Sí' : 'No'}"`
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Usuarios exportados correctamente', 'success');
}

// Toggle terrain enabled/disabled
async function toggleTerrain(terrainId) {
    try {
        const response = await fetch(`/api/admin/terrains/${terrainId}/toggle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local terrain
            const terrainIndex = terrains.findIndex(t => t.id === terrainId);
            if (terrainIndex !== -1) {
                terrains[terrainIndex] = result.terrain;
            }
            
            // Update display
            displayTerrains();
            
            const status = result.terrain.enabled ? 'habilitado' : 'deshabilitado';
            showNotification(`Terreno ${status} correctamente`, 'success');
            
            // Trigger real-time update
            await triggerRealTimeUpdate();
            
            // Auto-push to Git
            await autoGitPush(`Terreno ${status}: ${result.terrain.name}`);
            
        } else {
            showNotification('Error al cambiar estado del terreno: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error toggling terrain:', error);
        showNotification('Error de conexión al cambiar estado', 'error');
    }
}

// Update terrains JSON (simulate file update)
function updateTerrainsJSON(terrainsData) {
    // In a real application, this would make an API call to update the JSON file
    // For now, we'll just update localStorage and show a message
    localStorage.setItem('terrainsJSON', JSON.stringify(terrainsData));
    console.log('Terrains JSON updated:', terrainsData);
}

// Trigger real-time update for index.html
async function triggerRealTimeUpdate() {
    try {
        // Broadcast update event to all open windows/tabs
        localStorage.setItem('terrainUpdate', Date.now().toString());
        
        // Also send update to backend to sync JSON file
        const response = await fetch('/api/admin/sync-terrains', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            console.log('Real-time update triggered successfully');
        }
    } catch (error) {
        console.error('Error triggering real-time update:', error);
    }
}

// Auto Git push functionality
async function autoGitPush(commitMessage) {
    try {
        const response = await fetch('/api/admin/git-push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({ message: commitMessage })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Cambios subidos a Git automáticamente', 'success');
        } else {
            console.log('Git push not configured or failed:', result.message);
        }
    } catch (error) {
        console.error('Error with auto Git push:', error);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('edit-modal');
    const locationModal = document.getElementById('location-modal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === locationModal) {
        closeLocationModal();
    }
}
