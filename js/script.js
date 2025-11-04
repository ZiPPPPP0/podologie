/* ============================================
   MODE SOMBRE - THEME TOGGLE
   ============================================ */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Appliquer le thème sauvegardé
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    // Toggle theme au clic
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, icon) {
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

/* ============================================
   CALCUL AUTOMATIQUE DES ANNÉES D'EXPÉRIENCE
   ============================================ */
function updateExperience() {
    const experienceElement = document.getElementById('experience-years');
    if (!experienceElement) return;

    const installationDate = new Date('1999-09-01');
    const currentDate = new Date();
    const years = currentDate.getFullYear() - installationDate.getFullYear();
    experienceElement.textContent = years;
}

/* ============================================
   MENU MOBILE
   ============================================ */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Fermer le menu lors du clic sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        });
    });

    // Fermer le menu lors du clic en dehors
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        }
    });
}

/* ============================================
   ACCORDÉONS
   ============================================ */
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('span:last-child');
    const isActive = content.classList.contains('active');

    // Fermer tous les accordéons
    document.querySelectorAll('.accordion-content').forEach(acc => {
        acc.classList.remove('active');
    });
    document.querySelectorAll('.accordion-header span:last-child').forEach(i => {
        i.textContent = '+';
    });

    // Ouvrir l'accordéon cliqué s'il était fermé
    if (!isActive) {
        content.classList.add('active');
        icon.textContent = '−';
    }
}

/* ============================================
   ANIMATIONS AU DÉFILEMENT
   ============================================ */
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

/* ============================================
   NAVIGATION ACTIVE
   ============================================ */
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

/* ============================================
   NAVIGATION FLUIDE
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorer les liens vers les modales
            if (href === '#mentions-legales' || href === '#politique-confidentialite') {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   MODALES
   ============================================ */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function initModals() {
    // Liens vers les modales
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href="#mentions-legales"]')) {
            e.preventDefault();
            openModal('mentionsModal');
        }

        if (e.target.matches('a[href="#politique-confidentialite"]')) {
            e.preventDefault();
            openModal('confidentialiteModal');
        }
    });

    // Fermeture en cliquant à l'extérieur
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Fermeture avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

/* ============================================
   GESTION DES ERREURS D'IMAGES
   ============================================ */
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.3';
            this.alt = 'Image non disponible';
        });
    });
}

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   INTERSECTION OBSERVER POUR ANIMATIONS
   ============================================ */
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

/* ============================================
   INITIALISATION AU CHARGEMENT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le thème
    initTheme();

    // Mettre à jour l'expérience
    updateExperience();

    // Menu mobile
    initMobileMenu();

    // Navigation fluide
    initSmoothScroll();

    // Modales
    initModals();

    // Gestion des erreurs d'images
    handleImageErrors();

    // Header scroll effect
    initHeaderScroll();

    // Intersection Observer pour animations
    if ('IntersectionObserver' in window) {
        initIntersectionObserver();
    } else {
        // Fallback pour navigateurs anciens
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }
});

/* ============================================
   ÉVÉNEMENTS DE SCROLL
   ============================================ */
let scrollTimeout;
window.addEventListener('scroll', () => {
    // Debounce pour optimiser les performances
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveLink();

        // Fallback si Intersection Observer n'est pas supporté
        if (!('IntersectionObserver' in window)) {
            animateOnScroll();
        }
    });
});

/* ============================================
   ACCESSIBILITÉ - FOCUS VISIBLE
   ============================================ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
});

/* ============================================
   PERFORMANCE - LAZY LOADING (optionnel)
   ============================================ */
if ('loading' in HTMLImageElement.prototype) {
    // Le navigateur supporte loading="lazy" nativement
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */
console.log('%c👋 Cabinet de Podologie Sophie Dudouit', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cSite web moderne et accessible', 'font-size: 14px; color: #64748b;');
