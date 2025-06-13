// ===== NOSOTROS PAGE JAVASCRIPT =====

// Initialize nosotros page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('nosotros') || document.querySelector('.about-hero')) {
        initializeNosotrosPage();
    }
});

function initializeNosotrosPage() {
    // Add specific styles for nosotros page
    addNosotrosPageStyles();
    
    // Initialize animations and interactions
    initializeAboutAnimations();
    
    // Add scroll effects
    initializeScrollEffects();
    
    console.log('Nosotros page initialized');
}

// ===== ANIMATIONS AND INTERACTIONS =====
function initializeAboutAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.story-text, .story-visual, .mission-card, .team-card, .process-step, .award-card'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Stagger animations for process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover effects to team cards
    initializeTeamCardEffects();
    
    // Add counter animation for statistics
    animateCounters();
}

function initializeTeamCardEffects() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('team-card--hovered');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('team-card--hovered');
        });
    });
}

function animateCounters() {
    const counters = [
        { element: '.years-experience', target: 10, suffix: '+' },
        { element: '.products-created', target: 500, suffix: '+' },
        { element: '.happy-customers', target: 50000, suffix: '+' },
        { element: '.awards-won', target: 25, suffix: '+' }
    ];
    
    counters.forEach(counter => {
        const element = document.querySelector(counter.element);
        if (element) {
            animateNumber(element, 0, counter.target, 2000, counter.suffix);
        }
    });
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOutCubic);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Parallax effect for hero section
    const aboutHero = document.querySelector('.about-hero');
    
    if (aboutHero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            aboutHero.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Progress indicator for reading
    createReadingProgressBar();
}

function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// ===== NOSOTROS PAGE SPECIFIC STYLES =====
function addNosotrosPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* About page specific styles */
        .about-hero {
            padding: 8rem 0 4rem;
            background: var(--surface);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .about-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 30% 70%, var(--primary-medium) 0%, transparent 50%),
                radial-gradient(circle at 70% 30%, var(--primary-light) 0%, transparent 50%);
            opacity: 0.3;
            z-index: -1;
        }
        
        .breadcrumb {
            margin-bottom: 2rem;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        .breadcrumb a {
            color: var(--accent-gold);
            text-decoration: none;
            transition: var(--transition-normal);
        }
        
        .breadcrumb a:hover {
            color: var(--text-primary);
        }
        
        .page-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            font-weight: 700;
        }
        
        .page-description {
            font-size: 1.2rem;
            color: var(--text-secondary);
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.7;
        }
        
        /* Story Section */
        .our-story {
            padding: var(--section-padding);
            background: var(--background);
        }
        
        .story-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 4rem;
            align-items: center;
        }
        
        .story-intro {
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--text-secondary);
            margin-bottom: 3rem;
        }
        
        .story-intro strong {
            color: var(--accent-gold);
            font-weight: 600;
        }
        
        .story-details {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        
        .story-block {
            background: var(--surface);
            padding: 2rem;
            border-radius: var(--border-radius-large);
            border: 1px solid var(--surface-light);
            transition: var(--transition-normal);
        }
        
        .story-block:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-medium);
        }
        
        .story-block h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .story-block p {
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        .story-visual {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .story-image {
            text-align: center;
        }
        
        .chocolate-art {
            font-size: clamp(8rem, 15vw, 12rem);
            margin-bottom: 2rem;
            animation: float 4s ease-in-out infinite;
        }
        
        .story-caption {
            color: var(--text-muted);
            font-style: italic;
            font-size: 1.1rem;
        }
        
        /* Mission & Values */
        .mission-values {
            padding: var(--section-padding);
            background: var(--surface);
        }
        
        .mission-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 3rem;
        }
        
        .mission-card {
            background: var(--background);
            padding: 3rem;
            border-radius: var(--border-radius-large);
            text-align: center;
            border: 1px solid var(--surface-light);
            transition: var(--transition-normal);
        }
        
        .mission-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-heavy);
        }
        
        .mission-icon {
            font-size: 4rem;
            margin-bottom: 2rem;
            opacity: 0.8;
        }
        
        .mission-card h3 {
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }
        
        .mission-card p {
            color: var(--text-secondary);
            line-height: 1.7;
            margin-bottom: 0;
        }
        
        .mission-card ul {
            list-style: none;
            padding: 0;
            text-align: left;
        }
        
        .mission-card li {
            color: var(--text-secondary);
            margin-bottom: 0.8rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .mission-card li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent-gold);
            font-weight: bold;
        }
        
        /* Team Section */
        .our-team {
            padding: var(--section-padding);
            background: var(--background);
        }
        
        .section-subtitle {
            text-align: center;
            color: var(--text-secondary);
            font-size: 1.1rem;
            margin-bottom: 4rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 3rem;
        }
        
        .team-card {
            background: var(--surface);
            border-radius: var(--border-radius-large);
            overflow: hidden;
            border: 1px solid var(--surface-light);
            transition: var(--transition-normal);
            cursor: pointer;
        }
        
        .team-card:hover,
        .team-card--hovered {
            transform: translateY(-10px);
            box-shadow: var(--shadow-heavy);
        }
        
        .team-photo {
            height: 200px;
            background: linear-gradient(135deg, var(--primary-medium), var(--primary-light));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5rem;
            color: var(--accent-cream);
        }
        
        .team-info {
            padding: 2rem;
        }
        
        .team-info h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .team-role {
            color: var(--accent-gold);
            font-weight: 500;
            margin-bottom: 1rem;
        }
        
        .team-description {
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        /* Process Section */
        .our-process {
            padding: var(--section-padding);
            background: var(--surface);
        }
        
        .process-timeline {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .process-step {
            display: flex;
            gap: 2rem;
            margin-bottom: 3rem;
            align-items: flex-start;
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.6s ease;
        }
        
        .process-step.animate-in {
            opacity: 1;
            transform: translateX(0);
        }
        
        .step-number {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--accent-gold), #B8934A);
            color: var(--primary-dark);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .step-content {
            flex: 1;
            padding-top: 0.5rem;
        }
        
        .step-content h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .step-content p {
            color: var(--text-secondary);
            line-height: 1.7;
        }
        
        /* Certifications */
        .certifications {
            padding: var(--section-padding);
            background: var(--background);
        }
        
        .awards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .award-card {
            background: var(--surface);
            padding: 3rem 2rem;
            border-radius: var(--border-radius-large);
            text-align: center;
            border: 1px solid var(--surface-light);
            transition: var(--transition-normal);
        }
        
        .award-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-medium);
        }
        
        .award-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            opacity: 0.8;
        }
        
        .award-card h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            font-size: 1.2rem;
        }
        
        .award-card p {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        /* CTA Section */
        .about-cta {
            padding: var(--section-padding);
            background: var(--surface);
            text-align: center;
        }
        
        .about-cta .cta-content {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .about-cta h2 {
            color: var(--text-primary);
            margin-bottom: 1.5rem;
        }
        
        .about-cta p {
            color: var(--text-secondary);
            font-size: 1.1rem;
            margin-bottom: 3rem;
            line-height: 1.7;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        /* Reading Progress Bar */
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(to right, var(--accent-gold), #B8934A);
            z-index: 9999;
            transition: width 0.3s ease;
        }
        
        /* Animation Classes */
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .story-text,
        .story-visual,
        .mission-card,
        .team-card,
        .award-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
            .story-content {
                grid-template-columns: 1fr;
                gap: 3rem;
                text-align: center;
            }
            
            .process-step {
                flex-direction: column;
                text-align: center;
                gap: 1rem;
            }
        }
        
        @media (max-width: 768px) {
            .about-hero {
                padding: 6rem 0 3rem;
            }
            
            .mission-grid {
                grid-template-columns: 1fr;
            }
            
            .team-grid {
                grid-template-columns: 1fr;
            }
            
            .awards-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .chocolate-art {
                font-size: 6rem;
            }
        }
        
        @media (max-width: 480px) {
            .awards-grid {
                grid-template-columns: 1fr;
            }
            
            .story-block,
            .mission-card,
            .team-info,
            .award-card {
                padding: 2rem 1.5rem;
            }
            
            .step-number {
                width: 50px;
                height: 50px;
                font-size: 1.2rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== INTERACTIVE FEATURES =====

// Smooth scroll to sections from navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add click handlers for internal navigation
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        showEasterEgg();
        konamiCode = [];
    }
});

function showEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.innerHTML = '🍫 ¡Has desbloqueado el chocolate secreto! 🍫';
    easterEgg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent-gold);
        color: var(--primary-dark);
        padding: 2rem;
        border-radius: var(--border-radius-large);
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 10000;
        animation: bounce 0.5s ease;
    `;
    
    document.body.appendChild(easterEgg);
    
    setTimeout(() => {
        document.body.removeChild(easterEgg);
    }, 3000);
}

console.log('👥 About page JavaScript loaded successfully!');