import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { HeroBanner } from '../components/HeroBanner.js';
import { clearNode } from '../utils/helpers.js';
import { initEffects, initScrollReveal } from '../utils/effects.js';
import { loadHeroAssets } from '../utils/heroAssetsLoader.js';
import { getLang, setLang, t, updatePageTitle } from '../utils/i18n.js';

export class BasePage {
    constructor(bannerOptions = null) {
        this.lang = getLang();
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.header = new Header('header-container', this.lang);
        this.footer = new Footer('footer-container', this.lang);
        this.bannerOptions = bannerOptions;
        this.contentRoot = document.getElementById('page-content');
    }

    async init() {
        this.lang = getLang();
        document.documentElement.lang = this.lang;
        updatePageTitle(this.currentPage, this.lang);

        await loadHeroAssets();

        this.header.lang = this.lang;
        this.header.init();

        const bannerOpts = this.getBannerOptions?.() ?? this.bannerOptions;
        if (bannerOpts) {
            new HeroBanner('hero-banner-container', { ...bannerOpts, lang: this.lang }).init();
        } else {
            const bannerRoot = document.getElementById('hero-banner-container');
            if (bannerRoot) {
                clearNode(bannerRoot);
            }
        }

        this.footer.lang = this.lang;
        this.footer.init();
        this.render();
        this.bindLangButton();
        initEffects();
        requestAnimationFrame(() => initScrollReveal());
    }

    bindLangButton() {
        const btn = document.getElementById('lang-btn');
        if (!btn) {
            return;
        }
        btn.textContent = this.lang === 'en' ? 'EN' : 'RU';
        btn.onclick = () => {
            setLang(this.lang === 'ru' ? 'en' : 'ru');
            this.init();
        };
    }

    translate(key, params) {
        return t(key, this.lang, params);
    }

    render() {
        if (this.contentRoot) {
            clearNode(this.contentRoot);
        }
    }
}
