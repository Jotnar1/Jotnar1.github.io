import { AnalyzerPage } from './pages/AnalyzerPage.js';
import { HeroesPage } from './pages/HeroesPage.js';
import { TierlistPage } from './pages/TierlistPage.js';
import { MapsPage } from './pages/MapsPage.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { THEME_KEY } from './data/constants.js';
import { getLang, setLang } from './utils/i18n.js';

function initTheme() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (!themeSwitch) {
        return;
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light') {
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', () => {
        const nextTheme = themeSwitch.checked ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, nextTheme);
    });
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

        default:
            new Header('header-container').init();
            new Footer('footer-container').init();
            break;
    }
});
