import { heroesData } from '../data/heroesDatabase.js';
import { createElement } from '../utils/helpers.js';
import { getUniqueHeroes } from '../utils/helpers.js';
import { t } from '../utils/i18n.js';

export class StatsBar {
    constructor(lang = 'ru') {
        this.lang = lang;
    }

    render() {
        const bar = createElement('div', 'stats-bar reveal');
        const heroCount = getUniqueHeroes(heroesData).length;
        const mapCount = heroesData.maps.length;
        const synergyCount = Object.keys(heroesData.synergies).length;

        const items = [
            { value: heroCount, label: t('statHeroes', this.lang), href: 'heroes.html' },
            { value: mapCount, label: t('statMaps', this.lang), href: 'maps.html' },
            { value: synergyCount, label: t('statSynergies', this.lang), href: 'heroes.html' },
            { value: 'S–C', label: t('statTiers', this.lang), href: 'tierlist.html' }
        ];

        items.forEach((item) => {
            const card = document.createElement('a');
            card.className = 'stat-card stat-card-link';
            card.href = item.href;
            card.innerHTML = `<span class="stat-value">${item.value}</span><span class="stat-label">${item.label}</span>`;
            bar.appendChild(card);
        });

        return bar;
    }
}
