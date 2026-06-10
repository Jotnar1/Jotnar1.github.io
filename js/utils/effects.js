// canvas частицы https://www.youtube.com/watch?v=vAJEHf92tV0
let stormCleanup = null;

function isLightTheme() {
    return document.documentElement.dataset.theme === 'light'
        || document.getElementById('themeSwitch')?.checked;
}

export function initStormCanvas() {
    const canvas = document.getElementById('storm-canvas');
    if (!canvas) {
        return;
    }

    if (stormCleanup) {
        stormCleanup();
        stormCleanup = null;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let rafId = null;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const createParticles = (count) => {
        const light = isLightTheme();
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * (light ? 1.8 : 2) + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: Math.random() * 0.5 + 0.1,
            alpha: Math.random() * (light ? 0.35 : 0.5) + (light ? 0.15 : 0.2),
            hue: light
                ? (Math.random() > 0.55 ? 42 : 205)
                : (Math.random() > 0.5 ? 45 : 195)
        }));
    };

    const applyThemeToCanvas = () => {
        const light = isLightTheme();
        canvas.style.opacity = light ? '0.22' : '0.55';
        canvas.classList.toggle('storm-canvas-light', light);
        createParticles(Math.min(80, Math.floor(window.innerWidth / 20)));
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, ${isLightTheme() ? 65 : 80}%, ${isLightTheme() ? 55 : 70}%, ${p.alpha})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.y > canvas.height) {
                p.y = -5;
                p.x = Math.random() * canvas.width;
            }
            if (p.x < 0 || p.x > canvas.width) {
                p.vx *= -1;
            }
        });
        rafId = requestAnimationFrame(draw);
    };

    resize();
    applyThemeToCanvas();
    draw();

    const onResize = () => {
        resize();
        createParticles(Math.min(80, Math.floor(window.innerWidth / 20)));
    };

    const onThemeChange = () => applyThemeToCanvas();

    window.addEventListener('resize', onResize);
    window.addEventListener('hots-theme-change', onThemeChange);

    stormCleanup = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        window.removeEventListener('resize', onResize);
        window.removeEventListener('hots-theme-change', onThemeChange);
    };
}

// параллакс на scroll https://www.youtube.com/watch?v=IbxzBa--N4E
export function initParallax() {
    const layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length) {
        return;
    }

    let ticking = false;
    const onScroll = () => {
        if (ticking) {
            return;
        }
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            layers.forEach((layer) => {
                const speed = parseFloat(layer.dataset.parallax) || 0.3;
                layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
            });
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// scroll reveal intersection observer https://www.youtube.com/watch?v=huVJW23JHKQ
export function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
}

export function initHeaderScroll() {
    const header = document.querySelector('.hots-header');
    if (!header) {
        return;
    }

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

export function initEffects() {
    initStormCanvas();
    initParallax();
    initScrollReveal();
    initHeaderScroll();
}
