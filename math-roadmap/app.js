// ==========================================
// Math OS — Interactive Learning Roadmap
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize KaTeX rendering
    initKaTeX();

    // Navigation
    initNavigation();

    // Scroll reveal for phase blocks
    initScrollReveal();
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
// Initialize toggle buttons for practice problem hints and solutions
function initToggleButtons() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      const isHidden = targetEl.hasAttribute('hidden');
      if (isHidden) {
        targetEl.removeAttribute('hidden');
        btn.textContent = 'Hide ' + (targetId.startsWith('hint') ? 'Hint' : 'Solution');
      } else {
        targetEl.setAttribute('hidden', '');
        btn.textContent = 'Show ' + (targetId.startsWith('hint') ? 'Hint' : 'Solution');
      }
    });
  });
}

// Call initToggleButtons after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  initToggleButtons();
});
