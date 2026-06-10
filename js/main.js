import { AnalyzerPage } from './pages/AnalyzerPage.js';
import { HeroesPage } from './pages/HeroesPage.js';
import { TierlistPage } from './pages/TierlistPage.js';
import { MapsPage } from './pages/MapsPage.js';
import { BuildsPage } from './pages/BuildsPage.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { THEME_KEY } from './data/constants.js';
import { getLang, setLang, getThemeLabel } from './utils/i18n.js';

function updateThemeLabel() {
    const label = document.querySelector('label[for="themeSwitch"]');
    if (label) {
        label.textContent = getThemeLabel(getLang());
    }
}

function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (!themeSwitch) {
        return;
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light') {
        themeSwitch.checked = true;
    }

    const applyTheme = () => {
        const mode = themeSwitch.checked ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, mode);
        document.documentElement.dataset.theme = mode;
        updateThemeLabel();
        window.dispatchEvent(new CustomEvent('hots-theme-change', { detail: { mode } }));
    };

    themeSwitch.addEventListener('change', applyTheme);
    applyTheme();
}

document.addEventListener('DOMContentLoaded', async () => {
    setLang(getLang());
    initTheme();

    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'index.html':
        case '':
            await new AnalyzerPage().init();
            break;

        case 'heroes.html':
            await new HeroesPage().init();
            break;

        case 'tierlist.html':
            await new TierlistPage().init();
            break;

        case 'maps.html':
            await new MapsPage().init();
            break;

        case 'builds.html':
            await new BuildsPage().init();
            break;

        default:
            new Header('header-container').init();
            new Footer('footer-container').init();
            break;
    }
});
