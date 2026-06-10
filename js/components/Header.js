import { SITE_INFO } from '../data/constants.js';
import { createElement, clearNode } from '../utils/helpers.js';
import { t, getNavLinks, getThemeLabel } from '../utils/i18n.js';

export class Header {
    constructor(containerId = 'header-container', lang = 'ru') {
        this.container = document.getElementById(containerId);
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.lang = lang;
    }

    render() {
        const siteHeader = createElement('header', 'site-header hots-header');
        const inner = createElement('div', 'container header-inner');
        const headerTop = createElement('div', 'header-top');

        const brand = createElement('a', 'brand-block');
        brand.href = 'index.html';
        brand.innerHTML = `
            <img class="brand-logo" src="../img/hots-logo.svg" alt="HoTS" width="42" height="42" loading="eager">
            <div class="brand-text">
                <h1 class="site-title">${SITE_INFO.title}</h1>
                <p class="site-subtitle">${t('siteSubtitle', this.lang)}</p>
            </div>
        `;
        headerTop.appendChild(brand);

        const buttons = createElement('div', 'header-buttons');
        const themeLabel = document.createElement('label');
        themeLabel.className = 'theme-btn hots-btn';
        themeLabel.htmlFor = 'themeSwitch';
        themeLabel.textContent = getThemeLabel(this.lang);
        const langBtn = createElement('button', 'lang-btn hots-btn', this.lang === 'en' ? 'EN' : 'RU');
        langBtn.id = 'lang-btn';
        langBtn.type = 'button';
        const burgerLabel = document.createElement('label');
        burgerLabel.className = 'burger hots-btn';
        burgerLabel.htmlFor = 'navToggle';
        burgerLabel.textContent = t('menu', this.lang);
        buttons.appendChild(themeLabel);
        buttons.appendChild(langBtn);
        buttons.appendChild(burgerLabel);
        headerTop.appendChild(buttons);

        const navToggle = document.createElement('input');
        navToggle.type = 'checkbox';
        navToggle.className = 'nav-toggle';
        navToggle.id = 'navToggle';

        const nav = createElement('nav', 'site-nav');
        const ul = createElement('ul', 'nav-list');

        getNavLinks(this.lang).forEach(({ href, title }) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = href;
            a.className = 'nav-link';
            a.textContent = title;
            if (this.currentPage === href) {
                a.classList.add('active');
            }
            li.appendChild(a);
            ul.appendChild(li);
        });

        const donateLi = document.createElement('li');
        const donateA = document.createElement('a');
        donateA.href = SITE_INFO.donateUrl;
        donateA.target = '_blank';
        donateA.rel = 'noopener noreferrer';
        donateA.className = 'nav-link nav-link-donate';
        donateA.textContent = t('donate', this.lang);
        donateLi.appendChild(donateA);
        ul.appendChild(donateLi);

        nav.appendChild(ul);
        inner.appendChild(headerTop);
        inner.appendChild(navToggle);
        inner.appendChild(nav);
        siteHeader.appendChild(inner);

        return siteHeader;
    }

    init() {
        if (this.container) {
            clearNode(this.container);
            this.container.appendChild(this.render());
        }
    }
}
