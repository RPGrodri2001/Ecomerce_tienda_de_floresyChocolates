// ===== CONTACTO PAGE JAVASCRIPT =====

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contacto') || document.querySelector('.contact-hero')) {
        initializeContactPage();
    }
});

function initializeContactPage() {
    // Add specific styles for contact page
    addContactPageStyles();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize animations
    initializeContactAnimations();
    
    // Initialize FAQ functionality
    initializeFAQSection();
    
    console.log('Contact page initialized');
}

// ===== FORM HANDLING =====
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return false;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
        // Send data to analytics or backend
        console.log('Form submitted:', data);
        
        // Show notification
        if (window.ThreeSenses && window.ThreeSenses.showNotification) {
            window.ThreeSenses.showNotification('Mensaje enviado exitosamente', 'success');
        }
    }, 2000);
    
    return false;
}

function validateForm(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Por favor ingresa un email válido');
    }
    
    if (!data.subject) {
        errors.push('Por favor selecciona un asunto');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('El mensaje debe tener al menos 10 caracteres');
    }
    
    if (!data.privacy) {
        errors.push('Debes aceptar la política de privacidad');
    }
    
    // Phone validation (optional but if provided, should be valid)
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Por favor ingresa un número de teléfono válido');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-errors';
    errorContainer.innerHTML = `
        <div class="error-icon">⚠️</div>
        <div class="error-content">
            <h4>Por favor corrige los siguientes errores:</h4>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Insert before form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(errorContainer, form);
    
    // Scroll to errors
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove errors after 5 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.parentNode.removeChild(errorContainer);
        }
    }, 5000);
}

function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Validation based on field type
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
            break;
        case 'phone':
            if (value && !isValidPhone(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un número válido';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('field-error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error-message';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('field-error');
    
    const errorMessage = field.parentNode.querySelector('.field-error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ===== NEWSLETTER HANDLING =====
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!isValidEmail(email)) {
        if (window.ThreeSenses && window.ThreeSenses.showNotification) {
            window.ThreeSenses.showNotification('Por favor ingresa un email válido', 'error');
        }
        return;
    }
    
    // Show loading
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Suscribiendo...';
    submitBtn.disabled = true;
    
    // Simulate subscription
    setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (window.ThreeSenses && window.ThreeSenses.showNotification) {
            window.ThreeSenses.showNotification('¡Suscripción exitosa!', 'success');
        }
        
        console.log('Newsletter subscription:', email);
    }, 1500);
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQSection() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
    });
}

function toggleFAQ(button) {
    const faqItem = button.parentNode;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');
    
    const isOpen = faqItem.classList.contains('faq-open');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('faq-open');
            item.querySelector('.faq-answer').style.maxHeight = '0';
            item.querySelector('.faq-icon').textContent = '+';
        }
    });
    
    // Toggle current FAQ
    if (isOpen) {
        faqItem.classList.remove('faq-open');
        answer.style.maxHeight = '0';
        icon.textContent = '+';
    } else {
        faqItem.classList.add('faq-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '−';
    }
}

// ===== MODAL HANDLING =====
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// ===== ANIMATIONS =====
function initializeContactAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(
        '.contact-card, .form-container, .map-container, .faq-item, .social-section, .newsletter-section'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Stagger contact cards animation
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== CONTACT PAGE STYLES =====
function addContactPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Contact page specific styles */
        .contact-hero {
            padding: 8rem 0 4rem;
            background: var(--surface);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .contact-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 25% 75%, var(--primary-medium) 0%, transparent 50%),
                radial-gradient(circle at 75% 25%, var(--primary-light) 0%, transparent 50%);
            opacity: 0.3;
            z-index: -1;
        }
        
        /* Contact Information */
        .contact-info {
            padding: var(--section-padding);
            background: var(--background);
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }
        
        .contact-card {
            background: var(--surface);
            padding: 3rem 2rem;
            border-radius: var(--border-radius-large);
            text-align: center;
            border: 1px solid var(--surface-light);
            transition: var(--transition-normal);
            opacity: 0;
            transform: translateY(30px);
        }
        
        .contact-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .contact-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-heavy);
        }
        
        .contact-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            opacity: 0.8;
        }
        
        .contact-card h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .contact-card p {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .contact-link {
            color: var(--accent-gold);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition-normal);
        }
        
        .contact-link:hover {
            color: var(--text-primary);
        }
        
        /* Contact Form Section */
        .contact-form-section {
            padding: var(--section-padding);
            background: var(--surface);
        }
        
        .contact-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 4rem;
            align-items: start;
        }
        
        .form-container {
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.8s ease;
        }
        
        .form-container.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        
        .form-container h2 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .form-description {
            color: var(--text-secondary);
            margin-bottom: 3rem;
            line-height: 1.6;
        }
        
        .contact-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            background: var(--background);
            border: 1px solid var(--surface-light);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
            font-family: var(--font-secondary);
            transition: var(--transition-normal);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent-gold);
            box-shadow: 0 0 0 2px rgba(212, 165, 116, 0.2);
        }
        
        .form-group input.field-error,
        .form-group select.field-error,
        .form-group textarea.field-error {
            border-color: var(--error);
        }
        
        .field-error-message {
            color: var(--error);
            font-size: 0.85rem;
            margin-top: 0.25rem;
        }
        
        .checkbox-group {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            color: var(--text-secondary);
        }
        
        .checkbox-label input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        
        .privacy-link {
            color: var(--accent-gold);
            text-decoration: none;
        }
        
        .privacy-link:hover {
            text-decoration: underline;
        }
        
        .form-errors {
            background: rgba(231, 76, 60, 0.1);
            border: 1px solid var(--error);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            gap: 1rem;
        }
        
        .error-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }
        
        .error-content h4 {
            color: var(--error);
            margin-bottom: 0.5rem;
        }
        
        .error-content ul {
            color: var(--error);
            margin-left: 1rem;
        }
        
        /* Map Container */
        .map-container {
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.8s ease;
        }
        
        .map-container.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        
        .map-container h3 {
            color: var(--text-primary);
            margin-bottom: 2rem;
        }
        
        .map-placeholder {
            background: var(--background);
            border: 1px solid var(--surface-light);
            border-radius: var(--border-radius-large);
            height: 250px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            cursor: pointer;
            transition: var(--transition-normal);
        }
        
        .map-placeholder:hover {
            border-color: var(--accent-gold);
            box-shadow: var(--shadow-light);
        }
        
        .map-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.6;
        }
        
        .map-address {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        .location-details,
        .emergency-contact {
            background: var(--background);
            padding: 2rem;
            border-radius: var(--border-radius);
            border: 1px solid var(--surface-light);
            margin-bottom: 2rem;
        }
        
        .location-details h4,
        .emergency-contact h4 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .location-details ul {
            list-style: none;
            padding: 0;
        }
        
        .location-details li {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .emergency-contact p {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }
        
        .emergency-phone {
            color: var(--accent-gold);
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        /* FAQ Section */
        .faq-section {
            padding: var(--section-padding);
            background: var(--background);
        }
        
        .faq-grid {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .faq-item {
            background: var(--surface);
            border-radius: var(--border-radius);
            border: 1px solid var(--surface-light);
            margin-bottom: 1rem;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .faq-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .faq-question {
            width: 100%;
            background: none;
            border: none;
            padding: 1.5rem 2rem;
            text-align: left;
            color: var(--text-primary);
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: var(--transition-normal);
        }
        
        .faq-question:hover {
            background: var(--background);
        }
        
        .faq-icon {
            font-size: 1.5rem;
            color: var(--accent-gold);
            transition: var(--transition-normal);
        }
        
        .faq-open .faq-icon {
            transform: rotate(45deg);
        }
        
        .faq-answer {
            padding: 0 2rem 1.5rem;
            color: var(--text-secondary);
            line-height: 1.7;
        }
        
        /* Social & Newsletter */
        .social-newsletter {
            padding: var(--section-padding);
            background: var(--surface);
        }
        
        .social-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;
        }
        
        .social-section,
        .newsletter-section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .social-section.animate-in,
        .newsletter-section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .social-section h3,
        .newsletter-section h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .social-section p,
        .newsletter-section p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .social-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .social-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--background);
            border: 1px solid var(--surface-light);
            border-radius: var(--border-radius);
            color: var(--text-secondary);
            text-decoration: none;
            transition: var(--transition-normal);
        }
        
        .social-link:hover {
            border-color: var(--accent-gold);
            color: var(--accent-gold);
            transform: translateX(5px);
        }
        
        .social-icon {
            font-size: 1.5rem;
        }
        
        .newsletter-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .newsletter-input-group {
            display: flex;
            gap: 0.5rem;
        }
        
        .newsletter-input-group input {
            flex: 1;
            background: var(--background);
            border: 1px solid var(--surface-light);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
        }
        
        .newsletter-input-group input:focus {
            outline: none;
            border-color: var(--accent-gold);
        }
        
        .newsletter-terms {
            color: var(--text-muted);
            font-size: 0.85rem;
            line-height: 1.5;
        }
        
        /* Success Modal */
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .success-modal__backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .success-modal__content {
            position: relative;
            background: var(--surface);
            border-radius: var(--border-radius-large);
            padding: 3rem;
            text-align: center;
            max-width: 400px;
            border: 1px solid var(--surface-light);
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            color: var(--success);
        }
        
        .success-modal__content h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .success-modal__content p {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
            .contact-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
            
            .social-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
        }
        
        @media (max-width: 768px) {
            .contact-hero {
                padding: 6rem 0 3rem;
            }
            
            .contact-grid {
                grid-template-columns: 1fr;
            }
            
            .contact-card {
                padding: 2rem 1.5rem;
            }
            
            .newsletter-input-group {
                flex-direction: column;
            }
            
            .social-links {
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
            
            .success-modal__content {
                margin: 1rem;
                padding: 2rem;
            }
        }
        
        @media (max-width: 480px) {
            .faq-question {
                padding: 1rem;
                font-size: 1rem;
            }
            
            .faq-answer {
                padding: 0 1rem 1rem;
            }
            
            .social-links {
                grid-template-columns: 1fr;
            }
            
            .location-details,
            .emergency-contact {
                padding: 1.5rem;
            }
        }
        
        /* Animation delays for staggered effects */
        .contact-card:nth-child(1) { animation-delay: 0.1s; }
        .contact-card:nth-child(2) { animation-delay: 0.2s; }
        .contact-card:nth-child(3) { animation-delay: 0.3s; }
        .contact-card:nth-child(4) { animation-delay: 0.4s; }
        
        .faq-item:nth-child(1) { transition-delay: 0.1s; }
        .faq-item:nth-child(2) { transition-delay: 0.2s; }
        .faq-item:nth-child(3) { transition-delay: 0.3s; }
        .faq-item:nth-child(4) { transition-delay: 0.4s; }
        .faq-item:nth-child(5) { transition-delay: 0.5s; }
        .faq-item:nth-child(6) { transition-delay: 0.6s; }
    `;
    
    document.head.appendChild(style);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Close success modal with Escape key
    if (e.key === 'Escape') {
        const successModal = document.getElementById('successModal');
        if (successModal && !successModal.classList.contains('hidden')) {
            closeSuccessModal();
        }
    }
    
    // Quick focus on form with 'f' key
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.focus();
        }
    }
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initializeAccessibility() {
    // Add ARIA labels and roles
    const form = document.getElementById('contactForm');
    if (form) {
        form.setAttribute('role', 'form');
        form.setAttribute('aria-label', 'Formulario de contacto');
    }
    
    // Add ARIA attributes to FAQ items
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question, index) => {
        const answer = question.parentNode.querySelector('.faq-answer');
        const questionId = `faq-question-${index}`;
        const answerId = `faq-answer-${index}`;
        
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answerId);
        question.id = questionId;
        
        answer.setAttribute('aria-labelledby', questionId);
        answer.id = answerId;
    });
}

// Initialize accessibility when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contacto')) {
        initializeAccessibility();
    }
});

// ===== UTILITY FUNCTIONS =====
function formatPhoneNumber(phoneNumber) {
    // Simple phone formatting for display
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        if (window.ThreeSenses && window.ThreeSenses.showNotification) {
            window.ThreeSenses.showNotification('Copiado al portapapeles', 'success');
        }
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (window.ThreeSenses && window.ThreeSenses.showNotification) {
            window.ThreeSenses.showNotification('Copiado al portapapeles', 'success');
        }
    });
}

// Add click handlers for copying contact info
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('contact-link')) {
        const text = e.target.previousElementSibling.textContent;
        if (text.includes('@') || text.includes('+')) {
            e.preventDefault();
            copyToClipboard(text);
        }
    }
});

console.log('📞 Contact page JavaScript loaded successfully!');