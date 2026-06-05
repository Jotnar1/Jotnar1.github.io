import { FEATURED_HEROES } from '../data/constants.js';
import { getHeroPortrait, getHeroTitle, getHeroShortDescription } from '../utils/heroImages.js';
import { createElement } from '../utils/helpers.js';
import { t } from '../utils/i18n.js';

export class HeroBanner {
    constructor(containerId = 'hero-banner-container', options = {}) {
        this.container = document.getElementById(containerId);
        this.lang = options.lang || 'ru';
        this.title = options.title || 'Heroes of the Storm';
        this.subtitle = options.subtitle || '';
        this.ctaText = options.ctaText || '';
        this.ctaHref = options.ctaHref || '#page-content';
        this.index = 0;
        this.timer = null;
    }

    render() {
        const banner = createElement('section', 'hero-banner');
        banner.innerHTML = `
            <div class="hero-banner-bg" data-parallax="0.25"></div>
            <div class="hero-banner-glow" data-parallax="0.15"></div>
            <div class="hero-banner-inner container wide-container">
                <div class="hero-banner-text">
                    <span class="hero-banner-tag"></span>
                    <h2 class="hero-banner-title"></h2>
                    <p class="hero-banner-subtitle"></p>
                    <p class="hero-banner-desc"></p>
                    ${this.ctaText ? `<a class="hero-banner-cta hots-action-btn" href="${this.ctaHref}">${this.ctaText}</a>` : ''}
                </div>
                <div class="hero-banner-visual">
                    <div class="hero-portrait-frame">
                        <img class="hero-banner-portrait" src="" alt="" loading="eager">
                        <div class="hero-portrait-shine"></div>
                    </div>
                </div>
            </div>
            <div class="hero-banner-dots"></div>
        `;

        this.bannerEl = banner;
        this.tagEl = banner.querySelector('.hero-banner-tag');
        this.titleEl = banner.querySelector('.hero-banner-title');
        this.subtitleEl = banner.querySelector('.hero-banner-subtitle');
        this.descEl = banner.querySelector('.hero-banner-desc');
        this.portraitEl = banner.querySelector('.hero-banner-portrait');
        this.dotsEl = banner.querySelector('.hero-banner-dots');

        FEATURED_HEROES.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `hero-dot${i === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Hero ${i + 1}`);
            dot.addEventListener('click', () => this.showSlide(i));
            this.dotsEl.appendChild(dot);
        });

        return banner;
    }

    showSlide(index) {
        this.index = index;
        const hero = FEATURED_HEROES[index];
        const portrait = getHeroPortrait(hero);
        const title = getHeroTitle(hero);
        const desc = getHeroShortDescription(hero);

        // fade слайда css transition https://www.youtube.com/watch?v=zHUpx90NerM
        this.bannerEl.classList.add('switching');
        setTimeout(() => {
            if (this.tagEl) {
                this.tagEl.textContent = t('nexus', this.lang);
            }
            this.titleEl.textContent = hero;
            this.subtitleEl.textContent = title;
            this.descEl.textContent = desc || `${hero} — ${t('heroFallback', this.lang)}`;
            if (portrait) {
                this.portraitEl.src = portrait;
                this.portraitEl.alt = hero;
            }
            this.dotsEl.querySelectorAll('.hero-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
            this.bannerEl.classList.remove('switching');
        }, 200);
    }

    startAutoplay() {
        this.stopAutoplay();
        this.timer = setInterval(() => {
            const next = (this.index + 1) % FEATURED_HEROES.length;
            this.showSlide(next);
        }, 5500);
    }

    stopAutoplay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    init() {
        if (!this.container) {
            return;
        }
        this.container.innerHTML = '';
        this.container.appendChild(this.render());
        this.showSlide(0);
        this.startAutoplay();
        this.bannerEl.addEventListener('mouseenter', () => this.stopAutoplay());
        this.bannerEl.addEventListener('mouseleave', () => this.startAutoplay());
    }
}
