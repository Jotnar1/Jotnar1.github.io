import { BasePage } from './BasePage.js';
import { heroesData } from '../data/heroesDatabase.js';
import { createElement } from '../utils/helpers.js';
import { getUniqueHeroes, getHeroDisplayName, getHeroCategory } from '../utils/helpers.js';
import { CATEGORY_LABELS } from '../data/constants.js';
import { getHeroIcon } from '../utils/heroImages.js';
import { getHeroBuilds, getDefaultBuild } from '../utils/heroBuildsLoader.js';
import { pickBestBuild } from '../utils/buildAdvisor.js';
import { renderBuildCard } from '../utils/buildDisplay.js';

export class BuildsPage extends BasePage {
    constructor() {
        super();
        this.selectedHero = null;
        this.activeCategory = 'all';
        this.searchQuery = '';
    }

    render() {
        super.render();

        const intro = createElement('section', 'hots-panel intro-panel reveal');
        intro.appendChild(createElement('h2', 'section-title hots-title', this.translate('buildsTitle')));
        intro.appendChild(createElement('p', 'panel-text', this.translate('buildsDesc')));
        this.contentRoot.appendChild(intro);

        const layout = createElement('div', 'builds-layout reveal');
        const sidebar = createElement('aside', 'builds-sidebar hots-panel');
        sidebar.appendChild(createElement('h2', 'section-title hots-title-sm', this.translate('buildsHeroList')));

        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'hots-input heroes-search';
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
        list.id = 'builds-hero-list';
        sidebar.appendChild(list);

        const detail = createElement('section', 'builds-detail hots-panel');
        detail.id = 'builds-detail';
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
            this.renderHeroBuilds(this.selectedHero);
        } else {
            detail.appendChild(createElement('p', 'placeholder-text', this.translate('selectHero')));
        }
    }

    renderHeroList(sidebar) {
        const list = sidebar.querySelector('#builds-hero-list');
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
            const builds = getHeroBuilds(hero, this.builds);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `hero-list-item${this.selectedHero === hero ? ' active' : ''}`;
            const category = getHeroCategory(hero, heroesData);
            const catLabel = CATEGORY_LABELS[category];
            btn.innerHTML = `
                <img class="hero-list-icon" src="${getHeroIcon(hero)}" alt="" width="32" height="32" loading="lazy">
                <span class="hero-list-info">
                    <span class="hero-list-name">${getHeroDisplayName(hero, heroesData, this.lang)}</span>
                    <span class="hero-list-role">${catLabel[this.lang] || catLabel.ru} · ${builds.length} ${this.translate('buildsCount')}</span>
                </span>
            `;
            btn.addEventListener('click', () => {
                this.selectedHero = hero;
                this.renderHeroList(sidebar);
                this.renderHeroBuilds(hero);
            });
            list.appendChild(btn);
        });

        if (heroes.length === 0) {
            list.appendChild(createElement('p', 'empty-text', this.translate('nothingFound')));
        }
    }

    renderHeroBuilds(heroName) {
        const detail = document.getElementById('builds-detail');
        if (!detail) {
            return;
        }
        detail.innerHTML = `<p class="loading-text">${this.translate('buildLoading')}</p>`;
        this.renderHeroBuildsAsync(heroName);
    }

    async renderHeroBuildsAsync(heroName) {
        const detail = document.getElementById('builds-detail');
        if (!detail) {
            return;
        }
        detail.innerHTML = '';

        const header = createElement('div', 'builds-detail-header');
        header.innerHTML = `
            <img class="result-icon" src="${getHeroIcon(heroName)}" alt="${heroName}" width="48" height="48">
            <div>
                <h2 class="hero-detail-name">${getHeroDisplayName(heroName, heroesData, this.lang)}</h2>
                <p class="builds-detail-sub">${this.translate('buildsFromSites')}</p>
            </div>
        `;
        detail.appendChild(header);

        const builds = getHeroBuilds(heroName, this.builds);
        if (builds.length === 0) {
            detail.appendChild(createElement('p', 'empty-text', this.translate('buildNotFound')));
            return;
        }

        const recommended = getDefaultBuild(heroName, this.builds);
        if (recommended) {
            const bestSection = createElement('section', 'builds-section');
            bestSection.appendChild(createElement('h3', 'detail-title', this.translate('buildRecommended')));
            bestSection.appendChild(await renderBuildCard(recommended, heroName, this.lang));
            detail.appendChild(bestSection);
        }

        const allSection = createElement('section', 'builds-section');
        allSection.appendChild(createElement('h3', 'detail-title', this.translate('buildAllVariants')));
        const grid = createElement('div', 'builds-grid');
        for (const build of builds.filter((b) => b.tier !== 'aram')) {
            grid.appendChild(await renderBuildCard(build, heroName, this.lang, true));
        }
        allSection.appendChild(grid);
        detail.appendChild(allSection);
    }

    getBannerOptions() {
        return {
            lang: this.lang,
            subtitle: this.translate('buildsTitle'),
            ctaText: this.translate('browseBuilds'),
            ctaHref: '#builds-hero-list'
        };
    }
}
