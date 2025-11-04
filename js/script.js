/* ============================================
   🎯 CABINET SOPHIE DUDOUIT - JAVASCRIPT
   Design System Implementation
   ============================================ */

'use strict';

/* ============================================
   THEME MANAGEMENT - MODE SOMBRE
   ============================================ */
const ThemeManager = {
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.currentTheme = localStorage.getItem('theme') || 'light';

        // Appliquer le thème sauvegardé
        this.applyTheme(this.currentTheme);

        // Event listener
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateIcon(theme);
        this.currentTheme = theme;
    },

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Animation du toggle
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.themeToggle.style.transform = '';
            }, 350);
        }
    },

    updateIcon(theme) {
        if (this.themeIcon) {
            // Retirer les anciennes classes
            this.themeIcon.classList.remove('fa-moon', 'fa-sun');

            // Ajouter la nouvelle classe selon le thème
            if (theme === 'light') {
                this.themeIcon.classList.add('fa-moon');
            } else {
                this.themeIcon.classList.add('fa-sun');
            }
        }
    }
};

/* ============================================
   NAVIGATION
   ============================================ */
const Navigation = {
    init() {
        this.header = document.querySelector('header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navItems = document.querySelectorAll('.nav-links a');
        this.sections = document.querySelectorAll('section[id]');

        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupScrollDetection();
        this.setupActiveLink();
    },

    setupMobileMenu() {
        if (!this.navToggle || !this.navLinks) return;

        // Toggle menu
        this.navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Fermer le menu au clic sur un lien
        this.navItems.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Fermer le menu au clic extérieur
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
        this.navToggle.setAttribute('aria-expanded', !isExpanded);
        this.navLinks.classList.toggle('active');

        // Empêcher le scroll du body quand le menu est ouvert
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },

    closeMobileMenu() {
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    },

    setupSmoothScroll() {
        this.navItems.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Ignorer les liens vers les modales
                if (href === '#mentions-legales' || href === '#politique-confidentialite') {
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    setupScrollDetection() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Ajouter classe "scrolled" au header
            if (currentScroll > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },

    setupActiveLink() {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 150;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            this.navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }
};

/* ============================================
   ACCORDIONS
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

        // Scroll vers l'accordéon si nécessaire
        setTimeout(() => {
            const rect = header.getBoundingClientRect();
            if (rect.top < 100) {
                header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 350);
    }
}

/* ============================================
   ANIMATIONS - INTERSECTION OBSERVER
   ============================================ */
const AnimationManager = {
    init() {
        // Vérifier le support de Intersection Observer
        if (!('IntersectionObserver' in window)) {
            // Fallback : afficher tous les éléments
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionnel : arrêter d'observer après animation
                    // observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observer tous les éléments avec la classe fade-in
        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });
    }
};

/* ============================================
   MODALS
   ============================================ */
const ModalManager = {
    init() {
        this.setupModalTriggers();
        this.setupModalClose();
        this.setupKeyboardShortcuts();
    },

    setupModalTriggers() {
        document.addEventListener('click', (e) => {
            // Mentions légales
            if (e.target.matches('a[href="#mentions-legales"]')) {
                e.preventDefault();
                this.openModal('mentionsModal');
            }

            // Politique de confidentialité
            if (e.target.matches('a[href="#politique-confidentialite"]')) {
                e.preventDefault();
                this.openModal('confidentialiteModal');
            }
        });
    },

    setupModalClose() {
        // Fermer en cliquant sur le backdrop
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Boutons de fermeture
        document.querySelectorAll('.modal button').forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    ModalManager.closeModal(modal.id);
                }
            });
        });
    },

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape pour fermer les modales
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'flex') {
                        this.closeModal(modal.id);
                    }
                });
            }
        });
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Focus sur le modal pour accessibilité
            setTimeout(() => {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.focus();
                }
            }, 100);
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
};

/* ============================================
   UTILITIES
   ============================================ */
const Utils = {
    // Calcul automatique des années d'expérience
    updateExperience() {
        const experienceElement = document.getElementById('experience-years');
        if (!experienceElement) return;

        const startDate = new Date('1999-09-01');
        const currentDate = new Date();
        const years = currentDate.getFullYear() - startDate.getFullYear();

        experienceElement.textContent = years;
    },

    // Gestion des erreurs d'images
    handleImageErrors() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
                this.style.filter = 'grayscale(100%)';
                this.alt = 'Image non disponible';
            });
        });
    },

    // Lazy loading natif des images
    enableLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img').forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }
    },

    // Amélioration de l'accessibilité pour navigation clavier
    improveKeyboardNavigation() {
        let isUsingKeyboard = false;

        // Détecter utilisation clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                isUsingKeyboard = true;
                document.body.classList.add('user-is-tabbing');
            }
        });

        // Détecter utilisation souris
        document.addEventListener('mousedown', () => {
            isUsingKeyboard = false;
            document.body.classList.remove('user-is-tabbing');
        });
    }
};

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */
const Performance = {
    init() {
        // Mesurer le temps de chargement
        window.addEventListener('load', () => {
            const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Page chargée en ${loadTime}ms`);
        });
    }
};

/* ============================================
   INITIALISATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✨ Cabinet Sophie Dudouit', 'font-size: 20px; font-weight: 700; color: #2670c7; font-family: Inter;');
    console.log('%cDesign moderne et accessible', 'font-size: 14px; color: #6b7280; font-family: Inter;');

    // Initialiser tous les modules
    ThemeManager.init();
    Navigation.init();
    AnimationManager.init();
    ModalManager.init();

    // Utilitaires
    Utils.updateExperience();
    Utils.handleImageErrors();
    Utils.enableLazyLoading();
    Utils.improveKeyboardNavigation();

    // Performance monitoring (dev only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        Performance.init();
    }
});

/* ============================================
   SERVICE WORKER (optionnel - PWA)
   ============================================ */
if ('serviceWorker' in navigator && 'production' === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(err => console.log('SW registration failed:', err));
    });
}

/* ============================================
   EXPORTS (pour tests éventuels)
   ============================================ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        Navigation,
        AnimationManager,
        ModalManager,
        Utils
    };
}
