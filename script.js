// ── Mobile Navigation Toggle ─────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// ── Active nav link on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', scrollActive);

// ── Smooth scroll ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ── Navbar shadow on scroll ──────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ── Fade-in animations (non-project sections) ────────────────
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.experience-item, .education-item, .skills-category, .certification-item'
    );
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        fadeObserver.observe(el);
    });
});

// ── Active class on nav click ────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ── Scroll to top button ─────────────────────────────────────
(function createScrollTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.style.display = 'none';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
})();

// ═══════════════════════════════════════════════════════════════
// PROJECT PANELS — Slideshow + scroll-snap pips
// ═══════════════════════════════════════════════════════════════

/** Get all .slide elements inside a .slideshow-container */
function getSlides(container) {
    return Array.from(container.querySelectorAll('.slide'));
}

/** Get all dot buttons inside a .slideshow-container */
function getSlideDots(container) {
    return Array.from(container.querySelectorAll('.slideshow-dot'));
}

/**
 * Show a specific slide by index and update dots.
 * Stores current index on the container element.
 */
function showSlide(container, idx) {
    const slides = getSlides(container);
    const dots = getSlideDots(container);
    const total = slides.length;
    if (total === 0) return;

    // Clamp/wrap index
    idx = ((idx % total) + total) % total;

    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    container._curIdx = idx;
}

/**
 * Called by onclick="changeSlide(this, 1)" or changeSlide(this, -1) in HTML.
 * `btn` is the prev/next arrow button; `dir` is +1 or -1.
 */
function changeSlide(btn, dir) {
    const container = btn.closest('.slideshow-container');
    if (!container) return;
    const slides = getSlides(container);
    if (slides.length <= 1) return;

    const cur = container._curIdx ?? 0;
    const next = ((cur + dir) + slides.length) % slides.length;
    showSlide(container, next);

    // Reset autoplay timer on manual interaction
    clearInterval(container._autoplay);
    startSlideAutoplay(container);
}

/** Start 3.5-second autoplay for a given slideshow container */
function startSlideAutoplay(container) {
    const slides = getSlides(container);
    if (slides.length <= 1) return;
    container._autoplay = setInterval(() => {
        const cur = container._curIdx ?? 0;
        showSlide(container, (cur + 1) % slides.length);
    }, 3500);
}

/** Fully initialise all project panels: slideshows, dots, pips, observers */
function initProjectPanels() {
    const scrollEl = document.getElementById('projectsScroll');
    const progressEl = document.getElementById('projectsProgress');
    if (!scrollEl || !progressEl) return;

    const panels = Array.from(scrollEl.querySelectorAll('.project-panel'));
    if (!panels.length) return;

    // ── Set up each panel's slideshow ─────────────────────────
    panels.forEach(panel => {
        const container = panel.querySelector('.slideshow-container');
        if (!container) return;

        const slides = getSlides(container);
        const dotsEl = container.querySelector('.slideshow-dots');
        const prevBtn = container.querySelector('.slideshow-prev');
        const nextBtn = container.querySelector('.slideshow-next');

        // Initialise index and ensure first slide is active
        container._curIdx = 0;
        showSlide(container, 0);

        if (slides.length <= 1) {
            // Hide controls when there's only one image
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsEl)  dotsEl.style.display  = 'none';
        } else {
            // Build dot buttons dynamically
            if (dotsEl) {
                dotsEl.innerHTML = '';
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
                    dot.setAttribute('aria-label', `Slide ${i + 1}`);
                    dot.addEventListener('click', () => {
                        showSlide(container, i);
                        clearInterval(container._autoplay);
                        startSlideAutoplay(container);
                    });
                    dotsEl.appendChild(dot);
                });
            }
            startSlideAutoplay(container);

            // Pause autoplay while hovering the image side
            const panelImage = panel.querySelector('.panel-image');
            if (panelImage) {
                panelImage.addEventListener('mouseenter', () => clearInterval(container._autoplay));
                panelImage.addEventListener('mouseleave', () => startSlideAutoplay(container));
            }
        }
    });

    // ── Build progress pips ────────────────────────────────────
    progressEl.innerHTML = '';
    panels.forEach((_, i) => {
        const pip = document.createElement('button');
        pip.className = 'progress-pip' + (i === 0 ? ' active' : '');
        pip.setAttribute('aria-label', `Project ${i + 1}`);
        pip.addEventListener('click', () => {
            panels[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        progressEl.appendChild(pip);
    });

    const pips = Array.from(progressEl.querySelectorAll('.progress-pip'));

    // ── IntersectionObserver: update pips + trigger in-view animations ──
    const panelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const idx = parseInt(entry.target.getAttribute('data-index'), 10);
            if (entry.isIntersecting) {
                // Trigger staggered CSS animations on content elements
                entry.target.classList.add('in-view');
                // Update which pip is active
                pips.forEach((p, i) => p.classList.toggle('active', i === idx));
            }
            // Note: once 'in-view' is added we keep it so content stays
            // visible if the user scrolls back — we don't remove the class.
        });
    }, {
        root: scrollEl,
        threshold: 0.45   // fire when panel is nearly centered
    });

    panels.forEach(panel => panelObserver.observe(panel));

    // ── Keyboard navigation (Arrow Up / Down) ──────────────────
    document.addEventListener('keydown', (e) => {
        const rect = scrollEl.getBoundingClientRect();
        // Only intercept keys while the projects scroll area is visible
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        const curIdx = pips.findIndex(p => p.classList.contains('active'));
        if (e.key === 'ArrowDown' && curIdx < panels.length - 1) {
            e.preventDefault();
            panels[curIdx + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (e.key === 'ArrowUp' && curIdx > 0) {
            e.preventDefault();
            panels[curIdx - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

document.addEventListener('DOMContentLoaded', initProjectPanels);

// ── Contact form ─────────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name    = formData.get('name');
        const email   = formData.get('email');
        const message = formData.get('message');
        const mailtoLink = `mailto:merghaniosman21@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
        window.location.href = mailtoLink;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Message Sent!';
        submitButton.style.backgroundColor = '#e07b39';
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
            contactForm.reset();
        }, 3000);
    });
}
