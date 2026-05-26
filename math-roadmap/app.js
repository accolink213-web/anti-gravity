// ==========================================
// Math OS — Interactive Learning Roadmap
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize KaTeX rendering
    initKaTeX();

    // Navigation
    initNavigation();

    // Phase pills navigation
    initPhasePills();

    // Scroll reveal for phase blocks
    initScrollReveal();

    // Intersection observer for active phase pill
    initPhaseObserver();
});

// ==========================================
// KaTeX Initialization
// ==========================================

function initKaTeX() {
    const checkKaTeX = setInterval(() => {
        if (typeof renderMathInElement !== 'undefined') {
            clearInterval(checkKaTeX);
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false,
                trust: true
            });
        }
    }, 100);
}

// ==========================================
// Navigation
// ==========================================

function initNavigation() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    });

    // Mobile toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle?.classList.remove('active');
        });
    });
}

// ==========================================
// Phase Pills Navigation
// ==========================================

function initPhasePills() {
    const pills = document.querySelectorAll('.phase-pill');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const targetId = pill.dataset.target;
            const target = document.getElementById(targetId);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Update active state
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            }
        });
    });
}

// ==========================================
// Scroll Reveal
// ==========================================

function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    document.querySelectorAll('.phase-block').forEach(block => {
        observer.observe(block);
    });
}

// ==========================================
// Phase Observer (Active pill tracking)
// ==========================================

function initPhaseObserver() {
    const phases = document.querySelectorAll('.phase-block');
    const pills = document.querySelectorAll('.phase-pill');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    pills.forEach(pill => {
                        pill.classList.toggle('active', pill.dataset.target === id);
                    });
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '-100px 0px -50% 0px'
        }
    );

    phases.forEach(phase => {
        observer.observe(phase);
    });
}

// ==========================================
// Scroll to phase from timeline
// ==========================================

function scrollToPhase(phaseIndex) {
    const target = document.getElementById(`phase-${phaseIndex}`);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
