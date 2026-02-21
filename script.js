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

// ─────────────────────────────────────────────
// Image Slideshow – with AUTOPLAY
// ─────────────────────────────────────────────

const AUTOPLAY_INTERVAL = 3500; // ms between slides

function showSlide(slideshow, index) {
    const slides = slideshow.querySelectorAll('.slide');
    const dots   = slideshow.querySelectorAll('.dot');
    if (!slides.length) return;

    // Wrap index
    const total = slides.length;
    const i = ((index % total) + total) % total;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[i].classList.add('active');
    if (dots[i]) dots[i].classList.add('active');

    slideshow._currentIndex = i;
}

function changeSlide(button, direction) {
    const slideshow = button.closest('.project-image-slideshow');
    const current = slideshow._currentIndex ?? 0;

    // Pause autoplay briefly when user manually navigates
    clearInterval(slideshow._autoplay);
    showSlide(slideshow, current + direction);

    // Resume autoplay after a short pause
    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length > 1) {
        slideshow._autoplay = setInterval(() => {
            showSlide(slideshow, (slideshow._currentIndex ?? 0) + 1);
        }, AUTOPLAY_INTERVAL);
    }
}

function initSlideshows() {
    document.querySelectorAll('.project-image-slideshow').forEach(slideshow => {
        const slides       = slideshow.querySelectorAll('.slide');
        const dotsContainer = slideshow.querySelector('.slideshow-dots');
        const prevBtn      = slideshow.querySelector('.slideshow-prev');
        const nextBtn      = slideshow.querySelector('.slideshow-next');

        slideshow._currentIndex = 0;

        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        // Build dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (idx === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    clearInterval(slideshow._autoplay);
                    showSlide(slideshow, idx);
                    slideshow._autoplay = setInterval(() => {
                        showSlide(slideshow, (slideshow._currentIndex ?? 0) + 1);
                    }, AUTOPLAY_INTERVAL);
                });
                dotsContainer.appendChild(dot);
            });
        }

        // Start autoplay
        slideshow._autoplay = setInterval(() => {
            showSlide(slideshow, (slideshow._currentIndex ?? 0) + 1);
        }, AUTOPLAY_INTERVAL);

        // Pause on hover, resume on leave
        slideshow.addEventListener('mouseenter', () => clearInterval(slideshow._autoplay));
        slideshow.addEventListener('mouseleave', () => {
            slideshow._autoplay = setInterval(() => {
                showSlide(slideshow, (slideshow._currentIndex ?? 0) + 1);
            }, AUTOPLAY_INTERVAL);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSlideshows();
});

// ─────────────────────────────────────────────
// Fullscreen Project Panels — Scroll-snap logic
// ─────────────────────────────────────────────

function initProjectPanels() {
    const scrollEl = document.getElementById('projectsScroll');
    const progressEl = document.getElementById('projectsProgress');
    if (!scrollEl || !progressEl) return;

    const panels = scrollEl.querySelectorAll('.project-panel');
    if (!panels.length) return;

    // Build progress pips
    panels.forEach((panel, i) => {
        const pip = document.createElement('button');
        pip.className = 'progress-pip' + (i === 0 ? ' active' : '');
        pip.setAttribute('aria-label', `Go to project ${i + 1}`);
        pip.addEventListener('click', () => {
            panels[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        progressEl.appendChild(pip);
    });

    const pips = progressEl.querySelectorAll('.progress-pip');

    // Intersection observer to detect which panel is in view
    const panelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const idx = parseInt(entry.target.getAttribute('data-index'));

                // Activate in-view class for content animation
                panels.forEach(p => p.classList.remove('in-view'));
                entry.target.classList.add('in-view');

                // Update pip
                pips.forEach(p => p.classList.remove('active'));
                if (pips[idx]) pips[idx].classList.add('active');
            }
        });
    }, {
        root: scrollEl,
        threshold: 0.5
    });

    panels.forEach(panel => panelObserver.observe(panel));

    // Trigger first panel immediately
    panels[0].classList.add('in-view');

    // Keyboard arrow navigation within the scroll container
    scrollEl.setAttribute('tabindex', '0');
    document.addEventListener('keydown', (e) => {
        // Only hijack arrows when projects section is in viewport
        const rect = scrollEl.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        const current = Array.from(panels).findIndex(p => p.classList.contains('in-view'));
        if (e.key === 'ArrowDown' && current < panels.length - 1) {
            e.preventDefault();
            panels[current + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (e.key === 'ArrowUp' && current > 0) {
            e.preventDefault();
            panels[current - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initProjectPanels();
});
