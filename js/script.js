// Calcul automatique des années d'expérience
function updateExperience() {
    const installationDate = new Date('1999-09-01');
    const currentDate = new Date();
    const years = currentDate.getFullYear() - installationDate.getFullYear();
    document.getElementById('experience-years').textContent = years;
}

// Menu mobile toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
}

// Accordéons
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('span:last-child');
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.textContent = '+';
    } else {
        // Fermer tous les autres accordéons
        document.querySelectorAll('.accordion-content').forEach(acc => {
            acc.classList.remove('active');
        });
        document.querySelectorAll('.accordion-header span:last-child').forEach(icon => {
            icon.textContent = '+';
        });
        
        // Ouvrir l'accordéon cliqué
        content.classList.add('active');
        icon.textContent = '−';
    }
}

// Animation des cartes au défilement
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Gestion RGPD
function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!localStorage.getItem('cookieConsent')) {
        banner.classList.add('show');
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieBanner').classList.remove('show');
}

function refuseCookies() {
    localStorage.setItem('cookieConsent', 'refused');
    document.getElementById('cookieBanner').classList.remove('show');
}

// Gestion des modales
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Empêche le scroll de la page
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Remet le scroll
}

// Navigation fluide
function smoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Mise en évidence du lien actif
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 150 && sectionTop + sectionHeight > 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateExperience();
    showCookieBanner();
    
    // Menu mobile
    document.querySelector('.nav-toggle').addEventListener('click', toggleMobileMenu);
    
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });
    
    // Liens modales
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href="#mentions-legales"]')) {
            e.preventDefault();
            openModal('mentionsModal');
        }
        
        if (e.target.matches('a[href="#politique-confidentialite"]')) {
            e.preventDefault();
            openModal('confidentialiteModal');
        }
    });
    
    // Fermeture des modales en cliquant à l'extérieur
    document.getElementById('mentionsModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal('mentionsModal');
    });
    
    document.getElementById('confidentialiteModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal('confidentialiteModal');
    });
    
    // Fermeture avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal('mentionsModal');
            closeModal('confidentialiteModal');
        }
    });
});

// Événements de scroll
document.addEventListener('scroll', function() {
    animateOnScroll();
    updateActiveLink();
});

// Gestion des erreurs d'images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        // Ou remplacer par une image par défaut
        // this.src = 'images/placeholder.svg';
    });
});

// Validation simple pour le futur formulaire de contact (si ajouté)
function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    // Reset des erreurs précédentes
    document.querySelectorAll('.error').forEach(error => error.remove());
    
    // Validation du nom
    if (!name.value.trim()) {
        showError(name, 'Le nom est requis');
        isValid = false;
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'L\'email est requis');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'L\'email n\'est pas valide');
        isValid = false;
    }
    
    // Validation du message
    if (!message.value.trim()) {
        showError(message, 'Le message est requis');
        isValid = false;
    }
    
    return isValid;
}

function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.style.color = 'red';
    error.style.fontSize = '0.8em';
    error.style.marginTop = '5px';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

// Performance : Lazy loading des images (pour une future implémentation)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Google Analytics (à implémenter si nécessaire)
function initGoogleAnalytics() {
    // À implémenter avec le code de suivi GA4
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');
}

// Accessibility helper
function improveFocus() {
    // Améliore la visibilité du focus pour l'accessibilité
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('user-is-tabbing');
    });
}

// Initialisation des améliorations d'accessibilité
document.addEventListener('DOMContentLoaded', improveFocus);