// Contact Page JavaScript

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
            item.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ
    answer.classList.toggle('active');
    
    if (answer.classList.contains('active')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// Contact Form Submission
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get form values
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        property: formData.get('property'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    // Validation
    if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.subject || !contactData.message) {
        showNotification('Por favor, complete todos los campos requeridos.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        showNotification('Por favor, ingrese un email válido.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Contact form submitted:', contactData);
        
        // Show success message
        showNotification('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Store contact in localStorage for follow-up
        storeContactSubmission(contactData);
        
    }, 2000);
}

// Store contact submission for tracking
function storeContactSubmission(contactData) {
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    const submission = {
        ...contactData,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
    };
    
    submissions.push(submission);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// Open directions to office
function openDirections() {
    const address = "Av. Principal 123, Centro, Ciudad";
    const encodedAddress = encodeURIComponent(address);
    
    // Try to open in Google Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
}

// Auto-fill form based on URL parameters
function autoFillForm() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('property')) {
        const propertySelect = document.getElementById('propertyInterest');
        const propertyValue = urlParams.get('property');
        
        // Find matching option
        for (let option of propertySelect.options) {
            if (option.value.includes(propertyValue)) {
                option.selected = true;
                break;
            }
        }
    }
    
    if (urlParams.get('subject')) {
        document.getElementById('subject').value = urlParams.get('subject');
    }
}

// Form field animations and enhancements
function enhanceFormFields() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove previous error states
    field.classList.remove('error');
    
    // Validation rules
    switch(fieldName) {
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                field.classList.add('error');
                return false;
            }
            break;
        case 'phone':
            if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                field.classList.add('error');
                return false;
            }
            break;
    }
    
    return true;
}

// Character counter for textarea
function addCharacterCounter() {
    const textarea = document.getElementById('message');
    const maxLength = 500;
    
    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #666;
        margin-top: 5px;
    `;
    
    textarea.parentElement.appendChild(counter);
    
    // Update counter
    function updateCounter() {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} caracteres restantes`;
        
        if (remaining < 50) {
            counter.style.color = '#f44336';
        } else {
            counter.style.color = '#666';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    // Auto-fill form if URL parameters exist
    autoFillForm();
    
    // Enhance form fields
    enhanceFormFields();
    
    // Add character counter
    addCharacterCounter();
    
    // Add smooth scrolling to FAQ section
    const faqItems = document.querySelectorAll('.faq-question');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            // Small delay to allow FAQ to expand, then scroll
            setTimeout(() => {
                this.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        });
    });
    
    // Add form submission tracking
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function() {
        // Track form submission for analytics
        console.log('Contact form submission tracked');
    });
    
    // Add loading animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe elements for animation
    document.querySelectorAll('.contact-form-section, .contact-info-card, .quick-contact, .social-media, .faq-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group.focused label {
        color: #4CAF50;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #f44336;
        box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
    }
    
    .character-counter {
        transition: color 0.3s ease;
    }
`;
document.head.appendChild(style);
