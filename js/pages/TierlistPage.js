import { BasePage } from './BasePage.js';
import { heroesData } from '../data/heroesDatabase.js';
import { TIER_ORDER, TIER_LABELS } from '../data/constants.js';
import { createElement } from '../utils/helpers.js';
import { getHeroDisplayName } from '../utils/helpers.js';
import { getHeroIcon } from '../utils/heroImages.js';

export class TierlistPage extends BasePage {
    constructor() {
        super();
    }

    render() {
        super.render();

        const intro = createElement('section', 'hots-panel intro-panel reveal');
        intro.id = 'tierlist-start';
        intro.appendChild(createElement('h2', 'section-title hots-title', this.translate('tierListTitle')));
        intro.appendChild(createElement('p', 'panel-text', this.translate('tierListDesc')));
        this.contentRoot.appendChild(intro);

        const board = createElement('div', 'tierlist-board reveal');

        TIER_ORDER.forEach((tier) => {
            const heroes = [...new Set(heroesData.metaTiers?.[tier] || [])].sort((a, b) =>
                a.localeCompare(b, 'en')
            );

            const row = createElement('section', `tier-row tier-row-${tier}`);
            const header = createElement('div', 'tier-row-header');
            const tierLabel = TIER_LABELS[tier];
            header.innerHTML = `
                <span class="tier-badge tier-badge-${tier}">${tier}</span>
                <h3 class="tier-row-title">${tierLabel[this.lang] || tierLabel.ru}</h3>
                <span class="tier-count">${heroes.length} ${this.translate('heroesCount')}</span>
            `;
            row.appendChild(header);

            const grid = createElement('div', 'tier-heroes-grid');
            if (heroes.length === 0) {
                grid.appendChild(createElement('p', 'empty-text', this.translate('noTierHeroes')));
            } else {
                heroes.forEach((hero) => {
                    const link = document.createElement('a');
                    link.className = 'tier-hero-card';
                    link.href = `heroes.html?hero=${encodeURIComponent(hero)}`;
                    link.innerHTML = `
                        <img class="tier-hero-icon" src="${getHeroIcon(hero)}" alt="${hero}" width="48" height="48" loading="lazy">
                        <span class="tier-hero-name">${getHeroDisplayName(hero, heroesData, this.lang)}</span>
                    `;
                    grid.appendChild(link);
                });
            }
            row.appendChild(grid);
            board.appendChild(row);
        });

        this.contentRoot.appendChild(board);
    }

    getBannerOptions() {
        return {
            lang: this.lang,
            subtitle: this.translate('metaTierList'),
            ctaText: this.translate('viewTiers'),
            ctaHref: '#tierlist-start'
        };
    }
}
