// Mobile Navigation Toggle
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

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
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

// Active navigation link on scroll
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

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.experience-item, .project-card, .education-item, .skills-category, .certification-item'
    );
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        observer.observe(el);
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        const mailtoLink = `mailto:merghaniosman21@gmail.com?subject=Contact from ${name}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
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

// Active class on nav click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Scroll to top button
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

// ═══════════════════════════════════════════════════════════
// PROJECT PANELS — slideshow + in-view animation + progress pips
// ═══════════════════════════════════════════════════════════

// FIX 1: The HTML uses .slide / .slideshow-prev / .slideshow-next / .slideshow-dots
//         and calls changeSlide(). This function was missing entirely.
//         Renamed helpers to match the actual HTML class names.

function getSlides(container) {
    return Array.from(container.querySelectorAll('.slide'));
}
function getSlideDots(container) {
    return Array.from(container.querySelectorAll('.slideshow-dot'));
}

function showSlide(container, idx) {
    const slides = getSlides(container);
    const dots = getSlideDots(container);
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[idx]) slides[idx].classList.add('active');
    if (dots[idx]) dots[idx].classList.add('active');
    container._curIdx = idx;
}

// Called by onclick="changeSlide(this, 1)" / "changeSlide(this, -1)" in HTML
function changeSlide(btn, dir) {
    const container = btn.closest('.slideshow-container');
    const slides = getSlides(container);
    if (slides.length <= 1) return;
    const cur = container._curIdx ?? 0;
    const next = ((cur + dir) + slides.length) % slides.length;
    showSlide(container, next);
    clearInterval(container._autoplay);
    startSlideAutoplay(container);
}

function startSlideAutoplay(container) {
    const slides = getSlides(container);
    if (slides.length <= 1) return;
    container._autoplay = setInterval(() => {
        const cur = container._curIdx ?? 0;
        showSlide(container, (cur + 1) % slides.length);
    }, 3500);
}

function initProjectPanels() {
    const scrollEl = document.getElementById('projectsScroll');
    const progressEl = document.getElementById('projectsProgress');
    if (!scrollEl || !progressEl) return;

    const panels = Array.from(scrollEl.querySelectorAll('.project-panel'));
    if (!panels.length) return;

    // ── Set up each panel's slideshow ────────────────────
    panels.forEach(panel => {
        const container = panel.querySelector('.slideshow-container');
        if (!container) return;

        const slides = getSlides(container);
        const dotsEl = container.querySelector('.slideshow-dots');
        const prevBtn = container.querySelector('.slideshow-prev');
        const nextBtn = container.querySelector('.slideshow-next');

        container._curIdx = 0;

        // Make sure first slide is active
        if (slides[0]) slides[0].classList.add('active');

        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsEl)  dotsEl.style.display  = 'none';
        } else {
            // Build dot buttons
            if (dotsEl) {
                dotsEl.innerHTML = '';
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.className = 'slideshow-dot' + (i === 0 ? ' active' : '');
                    dot.addEventListener('click', () => {
                        showSlide(container, i);
                        clearInterval(container._autoplay);
                        startSlideAutoplay(container);
                    });
                    dotsEl.appendChild(dot);
                });
            }
            startSlideAutoplay(container);

            // Pause on hover
            const panelImage = panel.querySelector('.panel-image');
            if (panelImage) {
                panelImage.addEventListener('mouseenter', () => clearInterval(container._autoplay));
                panelImage.addEventListener('mouseleave', () => startSlideAutoplay(container));
            }
        }
    });

    // ── Progress pips ────────────────────────────────────
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

    // FIX 2: Add 'in-view' class to panels so CSS staggered animations fire.
    //         Also update progress pips here.
    const panelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const idx = parseInt(entry.target.getAttribute('data-index'));
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                pips.forEach((p, i) => p.classList.toggle('active', i === idx));
            }
            // Note: we keep in-view once added so content stays visible on scroll back
        });
    }, { root: scrollEl, threshold: 0.45 });

    panels.forEach(p => panelObserver.observe(p));

    // ── Keyboard nav ─────────────────────────────────────
    document.addEventListener('keydown', (e) => {
        const rect = scrollEl.getBoundingClientRect();
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
