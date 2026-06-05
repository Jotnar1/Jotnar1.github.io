import { BasePage } from './BasePage.js';
import { heroesData } from '../data/heroesDatabase.js';
import { CATEGORY_LABELS } from '../data/constants.js';
import { createElement } from '../utils/helpers.js';
import { getUniqueHeroes, getHeroCategory, getHeroDisplayName } from '../utils/helpers.js';
import { getMapDisplayName } from '../utils/mapHelpers.js';
import { buildHeroProfile } from '../utils/heroProfile.js';
import { getHeroIcon, getHeroPortrait, getHeroTitle, getHeroShortDescription } from '../utils/heroImages.js';

export class HeroesPage extends BasePage {
    constructor() {
        super();
        this.selectedHero = null;
        this.activeCategory = 'all';
        this.searchQuery = '';
    }

    render() {
        super.render();

        const layout = createElement('div', 'heroes-layout reveal');
        const sidebar = createElement('aside', 'heroes-sidebar hots-panel');
        sidebar.appendChild(createElement('h2', 'section-title hots-title', this.translate('heroesTitle')));

        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'hots-input heroes-search';
        search.value = this.searchQuery;
        search.placeholder = this.translate('searchHeroPage');
        search.addEventListener('input', () => {
            this.searchQuery = search.value.toLowerCase();
            this.renderHeroList(sidebar);
        });
        sidebar.appendChild(search);

        const filters = createElement('div', 'category-filters');
        const allBtn = createElement('button', `filter-btn${this.activeCategory === 'all' ? ' active' : ''}`, this.translate('all'));
        allBtn.type = 'button';
        allBtn.dataset.category = 'all';
        filters.appendChild(allBtn);

        Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
            const btn = createElement('button', `filter-btn${this.activeCategory === key ? ' active' : ''}`, label[this.lang] || label.ru);
            btn.type = 'button';
            btn.dataset.category = key;
            filters.appendChild(btn);
        });

        filters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) {
                return;
            }
            this.activeCategory = btn.dataset.category;
            filters.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            this.renderHeroList(sidebar);
        });
        sidebar.appendChild(filters);

        const list = createElement('div', 'heroes-list');
        list.id = 'heroes-list';
        sidebar.appendChild(list);

        const detail = createElement('section', 'hero-detail hots-panel');
        detail.id = 'hero-detail';
        layout.appendChild(sidebar);
        layout.appendChild(detail);
        this.contentRoot.appendChild(layout);

        const urlHero = new URLSearchParams(window.location.search).get('hero');
        if (urlHero && getUniqueHeroes(heroesData).includes(urlHero)) {
            this.selectedHero = urlHero;
        } else if (!this.selectedHero) {
            this.selectedHero = getUniqueHeroes(heroesData)[0] || null;
        }

        this.renderHeroList(sidebar);
        if (this.selectedHero) {
            this.renderHeroDetail(this.selectedHero);
        } else {
            detail.appendChild(createElement('p', 'placeholder-text', this.translate('selectHero')));
        }
    }

    renderHeroList(sidebar) {
        const list = sidebar.querySelector('#heroes-list');
        if (!list) {
            return;
        }
        list.innerHTML = '';

        const heroes = getUniqueHeroes(heroesData).filter((hero) => {
            const category = getHeroCategory(hero, heroesData);
            if (this.activeCategory !== 'all' && category !== this.activeCategory) {
                return false;
            }
            const ru = (heroesData.heroNamesRu?.[hero] || '').toLowerCase();
            return !this.searchQuery || hero.toLowerCase().includes(this.searchQuery) || ru.includes(this.searchQuery);
        });

        heroes.forEach((hero) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `hero-list-item${this.selectedHero === hero ? ' active' : ''}`;
            const category = getHeroCategory(hero, heroesData);
            const catLabel = CATEGORY_LABELS[category];
            btn.innerHTML = `
                <img class="hero-list-icon" src="${getHeroIcon(hero)}" alt="" width="32" height="32" loading="lazy">
                <span class="hero-list-info">
                    <span class="hero-list-name">${getHeroDisplayName(hero, heroesData, this.lang)}</span>
                    <span class="hero-list-role">${catLabel[this.lang] || catLabel.ru}</span>
                </span>
            `;
            btn.addEventListener('click', () => {
                this.selectedHero = hero;
                this.renderHeroList(sidebar);
                this.renderHeroDetail(hero);
            });
            list.appendChild(btn);
        });

        if (heroes.length === 0) {
            list.appendChild(createElement('p', 'empty-text', this.translate('nothingFound')));
        }
    }

    renderHeroDetail(heroName) {
        const detail = document.getElementById('hero-detail');
        if (!detail) {
            return;
        }

        const profile = buildHeroProfile(heroName, heroesData, this.lang);
        const portrait = getHeroPortrait(heroName);
        const title = getHeroTitle(heroName);
        const shortDesc = getHeroShortDescription(heroName);
        detail.innerHTML = '';

        if (portrait) {
            const showcase = createElement('div', 'hero-showcase');
            showcase.innerHTML = `
                <div class="hero-showcase-bg" style="background-image:url('${portrait}')"></div>
                <div class="hero-showcase-overlay"></div>
                <div class="hero-showcase-content">
                    <img class="hero-showcase-icon" src="${getHeroIcon(heroName)}" alt="${heroName}" width="72" height="72">
                    <div>
                        <h2 class="hero-detail-name">${profile.displayName}</h2>
                        ${title ? `<p class="hero-detail-title">${title}</p>` : ''}
                    </div>
                </div>
            `;
            detail.appendChild(showcase);
        } else {
            detail.appendChild(createElement('h2', 'hero-detail-name', profile.displayName));
        }

        const meta = createElement('div', 'hero-detail-meta');
        meta.innerHTML = `
            <span class="meta-badge">${profile.categoryLabel}</span>
            ${profile.metaTier ? `<span class="meta-badge tier-${profile.metaTier}">Tier ${profile.metaTier}</span>` : ''}
        `;
        detail.appendChild(meta);

        const descText = this.lang === 'en' && shortDesc ? shortDesc : profile.description;
        detail.appendChild(createElement('p', 'hero-description', descText));
        if (this.lang === 'en' && shortDesc && profile.description !== shortDesc) {
            detail.appendChild(createElement('p', 'hero-description-secondary', profile.description));
        }

        detail.appendChild(this.buildListSection(this.translate('pros'), profile.pros, 'pros'));
        detail.appendChild(this.buildListSection(this.translate('cons'), profile.cons, 'cons'));
        detail.appendChild(this.buildHeroChipSection(this.translate('synergizesWith'), profile.synergies, 'synergy'));
        detail.appendChild(this.buildHeroChipSection(this.translate('counters'), profile.counters, 'counter'));
        detail.appendChild(this.buildHeroChipSection(this.translate('weakAgainst'), profile.counteredBy, 'weak'));

        if (profile.bestMaps.length > 0) {
            const mapsSection = createElement('section', 'detail-block');
            mapsSection.appendChild(createElement('h3', 'detail-title', this.translate('bestMaps')));
            const ul = document.createElement('ul');
            profile.bestMaps.forEach((map) => {
                const li = document.createElement('li');
                li.textContent = getMapDisplayName(map, this.lang);
                ul.appendChild(li);
            });
            mapsSection.appendChild(ul);
            detail.appendChild(mapsSection);
        }
    }

    buildHeroChipSection(title, heroNames, modifier) {
        const section = createElement('section', `detail-block ${modifier}-block`);
        section.appendChild(createElement('h3', 'detail-title', title));
        if (!heroNames.length) {
            section.appendChild(createElement('p', 'empty-text', this.translate('noData')));
            return section;
        }
        const chips = createElement('div', 'hero-chips');
        heroNames.forEach((hero) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'hero-chip';
            chip.innerHTML = `<img src="${getHeroIcon(hero)}" alt="" width="20" height="20">${getHeroDisplayName(hero, heroesData, this.lang)}`;
            chip.addEventListener('click', () => {
                this.selectedHero = hero;
                this.renderHeroList(document.querySelector('.heroes-sidebar'));
                this.renderHeroDetail(hero);
            });
            chips.appendChild(chip);
        });
        section.appendChild(chips);
        return section;
    }

    buildListSection(title, items, modifier) {
        const section = createElement('section', `detail-block ${modifier}-block`);
        section.appendChild(createElement('h3', 'detail-title', title));
        if (!items.length) {
            section.appendChild(createElement('p', 'empty-text', this.translate('noData')));
            return section;
        }
        const ul = document.createElement('ul');
        items.forEach((text) => ul.appendChild(createElement('li', '', text)));
        section.appendChild(ul);
        return section;
    }

    getBannerOptions() {
        return {
            lang: this.lang,
            subtitle: this.translate('heroDatabase'),
            ctaText: this.translate('browseHeroes'),
            ctaHref: '#heroes-list'
        };
    }
}
