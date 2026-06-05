// canvas частицы https://www.youtube.com/watch?v=vAJEHf92tV0
export function initStormCanvas() {
    const canvas = document.getElementById('storm-canvas');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let rafId = null;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const createParticles = (count) => {
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: Math.random() * 0.5 + 0.1,
            alpha: Math.random() * 0.5 + 0.2,
            hue: Math.random() > 0.5 ? 45 : 195
        }));
    };

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
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
    createParticles(Math.min(80, Math.floor(window.innerWidth / 20)));
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles(Math.min(80, Math.floor(window.innerWidth / 20)));
    });

    return () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
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
