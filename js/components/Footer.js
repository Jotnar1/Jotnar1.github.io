import { SITE_INFO } from '../data/constants.js';
import { createElement, clearNode } from '../utils/helpers.js';
import { t } from '../utils/i18n.js';

export class Footer {
    constructor(containerId = 'footer-container', lang = 'ru') {
        this.container = document.getElementById(containerId);
        this.lang = lang;
    }

    render() {
        const footer = createElement('footer', 'site-footer hots-footer');
        const container = createElement('div', 'container footer-inner');
        container.innerHTML = `
            <img class="footer-logo" src="../img/hots-logo.svg" alt="" width="28" height="28" loading="lazy">
            <span class="small-text">© ${SITE_INFO.year} ${SITE_INFO.footerName} | Discord: waanori</span>
            <span class="footer-tagline small-text">${t('footerTagline', this.lang)}</span>
        `;
        footer.appendChild(container);
        return footer;
    }

    init() {
        if (this.container) {
            clearNode(this.container);
            this.container.appendChild(this.render());
        }
    }
}
