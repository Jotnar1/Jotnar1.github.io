import { BasePage } from './BasePage.js';
import { heroesData } from '../data/heroesDatabase.js';
import { MAP_IMAGES, MAP_PLACEHOLDER } from '../data/mapImages.js';
import { createElement } from '../utils/helpers.js';
import { getHeroDisplayName } from '../utils/helpers.js';
import { getMapDisplayName, getHeroesForMap } from '../utils/mapHelpers.js';
import { getHeroIcon } from '../utils/heroImages.js';

export class MapsPage extends BasePage {
    constructor() {
        super();
        this.selectedMap = null;
        this.searchQuery = '';
    }

    render() {
        super.render();

        const layout = createElement('div', 'maps-layout reveal');
        const sidebar = createElement('aside', 'maps-sidebar hots-panel');
        sidebar.appendChild(createElement('h2', 'section-title hots-title', this.translate('mapsTitle')));

        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'hots-input maps-search';
        search.value = this.searchQuery;
        search.placeholder = this.translate('searchMapPage');
        search.addEventListener('input', () => {
            this.searchQuery = search.value.toLowerCase();
            this.renderMapList(sidebar);
        });
        sidebar.appendChild(search);

        const list = createElement('div', 'maps-list');
        list.id = 'maps-list';
        sidebar.appendChild(list);

        const detail = createElement('section', 'map-detail hots-panel');
        detail.id = 'map-detail';
        layout.appendChild(sidebar);
        layout.appendChild(detail);
        this.contentRoot.appendChild(layout);

        const urlMap = new URLSearchParams(window.location.search).get('map');
        if (urlMap && heroesData.maps.includes(urlMap)) {
            this.selectedMap = urlMap;
        } else if (!this.selectedMap) {
            this.selectedMap = heroesData.maps[0] || null;
        }

        this.renderMapList(sidebar);
        if (this.selectedMap) {
            this.renderMapDetail(this.selectedMap);
        } else {
            detail.appendChild(createElement('p', 'placeholder-text', this.translate('selectMap')));
        }
    }

    renderMapList(sidebar) {
        const list = sidebar.querySelector('#maps-list');
        if (!list) {
            return;
        }
        list.innerHTML = '';

        const maps = heroesData.maps.filter((map) => {
            const ru = (getMapDisplayName(map, 'ru') || '').toLowerCase();
            return !this.searchQuery || map.toLowerCase().includes(this.searchQuery) || ru.includes(this.searchQuery);
        });

        maps.forEach((map) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `map-list-item${this.selectedMap === map ? ' active' : ''}`;
            const heroCount = getHeroesForMap(map, heroesData).length;
            const thumb = MAP_IMAGES[map] || MAP_PLACEHOLDER;
            btn.innerHTML = `
                <img class="map-list-thumb" src="${thumb}" alt="" loading="lazy" onerror="this.src='${MAP_PLACEHOLDER}'">
                <span class="map-list-info">
                    <span class="map-list-name">${getMapDisplayName(map, this.lang)}</span>
                    <span class="map-list-count">${heroCount} ${this.translate('heroesCount')}</span>
                </span>
            `;
            btn.addEventListener('click', () => {
                this.selectedMap = map;
                this.renderMapList(sidebar);
                this.renderMapDetail(map);
            });
            list.appendChild(btn);
        });

        if (maps.length === 0) {
            list.appendChild(createElement('p', 'empty-text', this.translate('nothingFound')));
        }
    }

    renderMapDetail(mapName) {
        const detail = document.getElementById('map-detail');
        if (!detail) {
            return;
        }

        const heroes = getHeroesForMap(mapName, heroesData);
        const image = MAP_IMAGES[mapName] || MAP_PLACEHOLDER;
        detail.innerHTML = '';

        const showcase = createElement('div', 'map-showcase');
        showcase.innerHTML = `
            <img class="map-showcase-img" src="${image}" alt="${getMapDisplayName(mapName, this.lang)}" loading="lazy" onerror="this.src='${MAP_PLACEHOLDER}'">
            <div class="map-showcase-overlay"></div>
            <div class="map-showcase-content">
                <h2 class="map-detail-name">${getMapDisplayName(mapName, this.lang)}</h2>
                <p class="map-detail-en">${mapName}</p>
            </div>
        `;
        detail.appendChild(showcase);

        const heroesSection = createElement('section', 'map-heroes-section');
        heroesSection.appendChild(createElement(
            'h3',
            'detail-title',
            `${this.translate('suitableHeroes')} (${heroes.length})`
        ));

        if (heroes.length === 0) {
            heroesSection.appendChild(createElement('p', 'empty-text', this.translate('noMapHeroes')));
        } else {
            const grid = createElement('div', 'map-heroes-grid');
            heroes.forEach((hero) => {
                const link = document.createElement('a');
                link.className = 'map-hero-card';
                link.href = `heroes.html?hero=${encodeURIComponent(hero)}`;
                link.innerHTML = `
                    <img class="map-hero-icon" src="${getHeroIcon(hero)}" alt="${hero}" width="44" height="44" loading="lazy">
                    <span class="map-hero-name">${getHeroDisplayName(hero, heroesData, this.lang)}</span>
                `;
                grid.appendChild(link);
            });
            heroesSection.appendChild(grid);
        }
        detail.appendChild(heroesSection);

        const analyzeLink = document.createElement('a');
        analyzeLink.className = 'hots-action-btn map-analyze-link';
        analyzeLink.href = 'index.html#map-section';
        analyzeLink.textContent = this.translate('analyzeOnMap');
        detail.appendChild(analyzeLink);
    }

    getBannerOptions() {
        return {
            lang: this.lang,
            subtitle: this.translate('battlegrounds'),
            ctaText: this.translate('browseMaps'),
            ctaHref: '#maps-list'
        };
    }
}
