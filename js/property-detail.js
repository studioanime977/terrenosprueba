// Property Detail Page JavaScript

// Image gallery functionality
function changeMainImage(src) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = src;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail-gallery img').forEach(img => {
        img.classList.remove('active');
    });
    
    document.querySelector(`[src="${src}"]`).classList.add('active');
}

// Contact modal functionality
function openContactModal() {
    document.getElementById('contactModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target == modal) {
        closeContactModal();
    }
}

// Schedule visit functionality
function scheduleVisit() {
    const propertyTitle = document.querySelector('.property-header h1').textContent;
    const message = `Hola, me gustaría agendar una visita para ver el ${propertyTitle}. ¿Cuándo sería posible?`;
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Request more info functionality
function requestInfo() {
    const propertyTitle = document.querySelector('.property-header h1').textContent;
    
    // Pre-fill contact form
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('contactMessage').value = `Hola, me gustaría recibir más información sobre ${propertyTitle}. Por favor envíenme detalles adicionales, planos, y cualquier documentación disponible.`;
    
    openContactModal();
}

// Submit property contact form
function submitPropertyContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        property: formData.get('property')
    };
    
    // Validation
    if (!contactData.name || !contactData.email || !contactData.message) {
        showNotification('Por favor, complete todos los campos requeridos.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        showNotification('Por favor, ingrese un email válido.', 'error');
        return;
    }
    
    // Simulate sending data
    console.log('Contact form submitted:', contactData);
    
    // Show success message
    showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.', 'success');
    
    // Close modal and reset form
    closeContactModal();
    form.reset();
}

// Property comparison functionality
function compareProperties() {
    // This would integrate with a comparison system
    const propertyId = window.location.pathname.split('/').pop().replace('.html', '');
    
    let comparisonList = JSON.parse(localStorage.getItem('propertyComparison') || '[]');
    
    if (!comparisonList.includes(propertyId)) {
        comparisonList.push(propertyId);
        localStorage.setItem('propertyComparison', JSON.stringify(comparisonList));
        showNotification('Propiedad agregada a comparación', 'success');
    } else {
        showNotification('Esta propiedad ya está en su lista de comparación', 'info');
    }
}

// Save property to favorites
function saveToFavorites() {
    const propertyId = window.location.pathname.split('/').pop().replace('.html', '');
    
    let favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
    
    if (!favorites.includes(propertyId)) {
        favorites.push(propertyId);
        localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
        showNotification('Propiedad guardada en favoritos', 'success');
    } else {
        showNotification('Esta propiedad ya está en sus favoritos', 'info');
    }
}

// Share property functionality
function shareProperty() {
    const propertyTitle = document.querySelector('.property-header h1').textContent;
    const propertyUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: propertyTitle,
            text: 'Mira esta excelente propiedad en Terrenos Premium',
            url: propertyUrl
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(propertyUrl).then(() => {
            showNotification('Enlace copiado al portapapeles', 'success');
        });
    }
}

// Calculate mortgage estimate
function calculateMortgage() {
    const priceText = document.querySelector('.property-price').textContent;
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));
    
    // Simple mortgage calculation (this would be more sophisticated in real app)
    const downPayment = price * 0.2; // 20% down payment
    const loanAmount = price - downPayment;
    const monthlyRate = 0.05 / 12; // 5% annual rate
    const months = 30 * 12; // 30 years
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    
    const result = `
        <div class="mortgage-estimate">
            <h4>Estimación de Financiamiento</h4>
            <p><strong>Precio:</strong> $${price.toLocaleString()} USD</p>
            <p><strong>Enganche (20%):</strong> $${downPayment.toLocaleString()} USD</p>
            <p><strong>Monto del préstamo:</strong> $${loanAmount.toLocaleString()} USD</p>
            <p><strong>Pago mensual estimado:</strong> $${Math.round(monthlyPayment).toLocaleString()} USD</p>
            <small>*Estimación basada en 5% de interés anual a 30 años</small>
        </div>
    `;
    
    // Create modal for mortgage info
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            ${result}
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Initialize property detail page
document.addEventListener('DOMContentLoaded', function() {
    // Add additional action buttons
    const contactButtons = document.querySelector('.contact-buttons');
    
    const additionalButtons = `
        <button class="btn-secondary" onclick="saveToFavorites()">
            <i class="fas fa-heart"></i> Guardar en Favoritos
        </button>
        <button class="btn-secondary" onclick="shareProperty()">
            <i class="fas fa-share"></i> Compartir
        </button>
        <button class="btn-secondary" onclick="calculateMortgage()">
            <i class="fas fa-calculator"></i> Calcular Financiamiento
        </button>
    `;
    
    contactButtons.insertAdjacentHTML('beforeend', additionalButtons);
    
    // Initialize image gallery
    const thumbnails = document.querySelectorAll('.thumbnail-gallery img');
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
    }
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.property-gallery, .property-info-detail, .location-section, .similar-properties').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
