// ── Mobile Nav ───────────────────────────────────────────
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

// ── Scroll active nav ────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);
        if (scrollY > sectionTop && scrollY <= sectionTop + current.offsetHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', scrollActive);

// ── Smooth scroll ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// ── Navbar shadow on scroll ──────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 4px 20px rgba(0,0,0,0.4)'
        : 'none';
});

// ── Fade-in for non-project sections ────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.experience-item, .education-item, .skills-category, .certification-item')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            fadeObserver.observe(el);
        });
});

// ── Contact form ─────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(contactForm);
        const name = fd.get('name'), email = fd.get('email'), message = fd.get('message');
        window.location.href = `mailto:merghaniosman21@gmail.com?subject=Contact from ${name}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
        const btn = contactForm.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.style.backgroundColor = '#e07b39';
        setTimeout(() => { btn.textContent = orig; btn.style.backgroundColor = ''; contactForm.reset(); }, 3000);
    });
}

// ── Scroll-to-top ────────────────────────────────────────
(function() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.style.cssText = 'position:fixed;bottom:30px;right:30px;width:44px;height:44px;border-radius:4px;background:var(--bg-raised);color:var(--accent);border:1px solid rgba(224,123,57,0.3);cursor:pointer;font-size:1rem;box-shadow:0 4px 24px rgba(0,0,0,0.5);z-index:999;display:none;align-items:center;justify-content:center;transition:all 0.25s ease;';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => { btn.style.display = window.scrollY > 300 ? 'flex' : 'none'; });
})();

// ═══════════════════════════════════════════════════════════
// PROJECT PANELS — Scroll-snap + per-panel image slideshow
// ═══════════════════════════════════════════════════════════

// Per-panel image switcher (replaces old slideshow logic)
function panelSlide(btn, dir) {
    const panel = btn.closest('.panel-image');
    const imgs = Array.from(panel.querySelectorAll('.panel-img'));
    const dots = Array.from(panel.querySelectorAll('.panel-dot'));
    if (imgs.length <= 1) return;

    const cur = imgs.findIndex(i => i.classList.contains('active'));
    const next = ((cur + dir) + imgs.length) % imgs.length;

    imgs[cur].classList.remove('active');
    imgs[next].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === next));

    // Autoplay reset
    const scrollEl = document.getElementById('projectsScroll');
    if (panel._autoplay) clearInterval(panel._autoplay);
    startPanelAutoplay(panel, imgs, dots);
}

function startPanelAutoplay(panel, imgs, dots) {
    if (imgs.length <= 1) return;
    panel._autoplay = setInterval(() => {
        const cur = imgs.findIndex(i => i.classList.contains('active'));
        const next = (cur + 1) % imgs.length;
        imgs[cur].classList.remove('active');
        imgs[next].classList.add('active');
        dots.forEach((d, i) => d.classList.toggle('active', i === next));
    }, 3500);
}

function initProjectPanels() {
    const scrollEl = document.getElementById('projectsScroll');
    const progressEl = document.getElementById('projectsProgress');
    if (!scrollEl || !progressEl) return;

    const panels = Array.from(scrollEl.querySelectorAll('.project-panel'));
    if (!panels.length) return;

    // ── Build dots inside each panel-image ──────────────
    panels.forEach(panel => {
        const imgContainer = panel.querySelector('.panel-image');
        const imgs = Array.from(imgContainer.querySelectorAll('.panel-img'));
        const dotsEl = imgContainer.querySelector('.panel-dots');

        // Build dot buttons
        imgs.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'panel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                imgs.forEach(img => img.classList.remove('active'));
                imgs[i].classList.add('active');
                Array.from(dotsEl.querySelectorAll('.panel-dot'))
                    .forEach((d, di) => d.classList.toggle('active', di === i));
                clearInterval(imgContainer._autoplay);
                startPanelAutoplay(imgContainer, imgs, Array.from(dotsEl.querySelectorAll('.panel-dot')));
            });
            dotsEl.appendChild(dot);
        });

        // Hide nav if single image
        if (imgs.length <= 1) {
            const prev = imgContainer.querySelector('.panel-prev');
            const next = imgContainer.querySelector('.panel-next');
            if (prev) prev.style.display = 'none';
            if (next) next.style.display = 'none';
            if (dotsEl) dotsEl.style.display = 'none';
        }

        // Start autoplay
        startPanelAutoplay(imgContainer, imgs, Array.from(dotsEl.querySelectorAll('.panel-dot')));

        // Pause autoplay on hover
        imgContainer.addEventListener('mouseenter', () => clearInterval(imgContainer._autoplay));
        imgContainer.addEventListener('mouseleave', () => {
            startPanelAutoplay(imgContainer, imgs, Array.from(dotsEl.querySelectorAll('.panel-dot')));
        });
    });

    // ── Build progress pips ──────────────────────────────
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

    // ── IntersectionObserver on the SCROLL CONTAINER ─────
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.getAttribute('data-index'));
                pips.forEach((p, i) => p.classList.toggle('active', i === idx));
            }
        });
    }, {
        root: scrollEl,
        threshold: 0.55
    });

    panels.forEach(p => observer.observe(p));

    // ── Keyboard navigation ──────────────────────────────
    document.addEventListener('keydown', (e) => {
        const rect = scrollEl.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        // Find current active panel by pip
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
