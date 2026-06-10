import { BasePage } from './BasePage.js';
import { heroesData } from '../data/heroesDatabase.js';
import { MAP_NAMES_RU } from '../data/mapNames.js';
import { CATEGORY_LABELS } from '../data/constants.js';
import { createElement } from '../utils/helpers.js';
import { getHeroDisplayName } from '../utils/helpers.js';
import { setupHeroAutocomplete, setupMapAutocomplete } from '../utils/autocomplete.js';
import { calculateRecommendations, formatReason, getSelectedHeroes, getSelectedMap } from '../utils/pickAnalyzer.js';
import { pickBestBuild } from '../utils/buildAdvisor.js';
import { renderBuildPanel } from '../utils/buildDisplay.js';
import { StatsBar } from '../components/StatsBar.js';
import { getHeroIcon, getHeroPortrait } from '../utils/heroImages.js';

export class AnalyzerPage extends BasePage {
    constructor() {
        super();
        this.categories = ['tanks', 'bruisers', 'healers', 'damage', 'specialists'];
        this.savedForm = null;
        this.lastDraft = { allies: [], enemies: [], map: '' };
    }

    saveFormState() {
        const mapInput = document.getElementById('mapSelect');
        this.savedForm = {
            allies: getSelectedHeroes('ally'),
            enemies: getSelectedHeroes('enemy'),
            mapEng: mapInput?.dataset.mapEng || getSelectedMap(mapInput, heroesData, MAP_NAMES_RU)
        };
    }

    restoreFormState() {
        if (!this.savedForm) {
            return;
        }
        this.savedForm.allies.forEach((hero, i) => {
            const input = document.getElementById(`ally${i + 1}`);
            if (input) {
                input.value = hero;
                input.dispatchEvent(new Event('change'));
            }
        });
        this.savedForm.enemies.forEach((hero, i) => {
            const input = document.getElementById(`enemy${i + 1}`);
            if (input) {
                input.value = hero;
                input.dispatchEvent(new Event('change'));
            }
        });
        if (this.savedForm.mapEng) {
            const mapInput = document.getElementById('mapSelect');
            if (mapInput) {
                mapInput.dataset.mapEng = this.savedForm.mapEng;
                mapInput.value = this.lang === 'en'
                    ? this.savedForm.mapEng
                    : (MAP_NAMES_RU[this.savedForm.mapEng] || this.savedForm.mapEng);
            }
        }
    }

    render() {
        this.saveFormState();
        super.render();

        this.contentRoot.appendChild(new StatsBar(this.lang).render());

        const intro = createElement('section', 'hots-panel intro-panel reveal');
        intro.id = 'analyzer-start';
        intro.appendChild(createElement('h2', 'section-title hots-title', this.translate('pickAnalyzer')));
        intro.appendChild(createElement('p', 'panel-text', this.translate('pickAnalyzerDesc')));
        this.contentRoot.appendChild(intro);

        this.contentRoot.appendChild(this.buildPickSection('ally', this.translate('allyPicks'), 'ally'));
        this.contentRoot.appendChild(this.buildPickSection('enemy', this.translate('enemyPicks'), 'enemy'));
        this.contentRoot.appendChild(this.buildMapSection());

        const actions = createElement('div', 'actions-row');
        const analyzeBtn = createElement('button', 'hots-action-btn', this.translate('analyzePicks'));
        analyzeBtn.id = 'analyze-btn';
        analyzeBtn.type = 'button';
        analyzeBtn.addEventListener('click', () => this.analyze());
        actions.appendChild(analyzeBtn);
        this.contentRoot.appendChild(actions);

        const results = createElement('section', 'results-section reveal');
        results.id = 'results';
        results.appendChild(createElement('h2', 'section-title hots-title', this.translate('recommendedHeroes')));

        const grid = createElement('div', 'category-grid');
        this.categories.forEach((cat) => {
            const block = createElement('div', 'hots-card category-card');
            const label = CATEGORY_LABELS[cat];
            block.appendChild(createElement('h3', 'category-title', label[this.lang] || label.ru));
            const list = createElement('div', 'category-list');
            list.id = `${cat}List`;
            block.appendChild(list);
            grid.appendChild(block);
        });
        results.appendChild(grid);
        this.contentRoot.appendChild(results);

        setupHeroAutocomplete(heroesData, this.lang);
        setupMapAutocomplete(heroesData, this.lang);
        this.restoreFormState();
    }

    buildPickSection(prefix, title, modifier) {
        const section = createElement('section', `hots-panel pick-panel reveal pick-${modifier}`);
        section.appendChild(createElement('h3', 'section-title hots-title-sm', title));

        const grid = createElement('div', 'picks-grid');
        const labelKey = prefix === 'ally' ? 'allyN' : 'enemyN';

        for (let i = 1; i <= 5; i++) {
            const field = createElement('div', 'pick-field');
            field.appendChild(createElement('label', 'pick-label', `${this.translate(labelKey)} ${i}`));

            const slot = createElement('div', 'pick-slot');
            const avatar = document.createElement('img');
            avatar.className = 'pick-avatar';
            avatar.src = '../img/hots-logo.svg';
            avatar.alt = '';
            avatar.width = 36;
            avatar.height = 36;

            const wrapper = createElement('div', 'autocomplete-wrapper');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'hero-autocomplete hots-input';
            input.id = `${prefix}${i}`;
            input.placeholder = this.translate('searchHero');
            input.addEventListener('change', () => this.updatePickAvatar(input, avatar));
            input.addEventListener('blur', () => this.updatePickAvatar(input, avatar));
            const list = createElement('div', 'autocomplete-list');
            list.id = `${prefix}${i}-list`;
            wrapper.appendChild(input);
            wrapper.appendChild(list);
            slot.appendChild(avatar);
            slot.appendChild(wrapper);
            field.appendChild(slot);
            grid.appendChild(field);
        }
        section.appendChild(grid);
        return section;
    }

    updatePickAvatar(input, avatar) {
        const icon = getHeroIcon(input.value);
        if (input.value && icon) {
            avatar.src = icon;
            avatar.classList.add('has-hero');
        } else {
            avatar.src = '../img/hots-logo.svg';
            avatar.classList.remove('has-hero');
        }
    }

    buildMapSection() {
        const section = createElement('section', 'hots-panel map-panel reveal');
        section.id = 'map-section';
        section.appendChild(createElement('h3', 'section-title hots-title-sm', this.translate('map')));

        const wrapper = createElement('div', 'autocomplete-wrapper map-wrapper');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'hero-autocomplete hots-input';
        input.id = 'mapSelect';
        input.placeholder = this.translate('searchMap');
        const list = createElement('div', 'autocomplete-list');
        list.id = 'mapSelect-list';
        wrapper.appendChild(input);
        wrapper.appendChild(list);
        section.appendChild(wrapper);
        return section;
    }

    analyze() {
        const allies = getSelectedHeroes('ally');
        const enemies = getSelectedHeroes('enemy');
        const mapInput = document.getElementById('mapSelect');
        const map = getSelectedMap(mapInput, heroesData, MAP_NAMES_RU);

        if (allies.length === 0 && enemies.length === 0 && !map) {
            this.showError();
            return;
        }

        this.showLoading();
        this.lastDraft = { allies, enemies, map };
        setTimeout(() => {
            const recommendations = calculateRecommendations(allies, enemies, map, heroesData, this.lang);
            this.showResults(recommendations);
        }, 600);
    }

    showLoading() {
        const results = document.getElementById('results');
        results.classList.add('show');
        this.categories.forEach((cat) => {
            const list = document.getElementById(`${cat}List`);
            if (list) {
                list.innerHTML = `<div class="loading-text">${this.translate('analyzing')}</div>`;
            }
        });
    }

    showError() {
        const results = document.getElementById('results');
        results.classList.add('show');
        const msg = this.translate('selectHeroOrMap');
        this.categories.forEach((cat) => {
            const list = document.getElementById(`${cat}List`);
            if (list) {
                list.innerHTML = `<div class="error-box">${msg}</div>`;
            }
        });
    }

    showResults(recommendations) {
        const results = document.getElementById('results');
        results.classList.add('show');

        this.categories.forEach((cat) => {
            const list = document.getElementById(`${cat}List`);
            if (!list) {
                return;
            }

            const categoryHeroes = heroesData.heroCategories[cat] || [];
            const top = recommendations
                .filter(([hero, data]) => categoryHeroes.includes(hero) && data.score > 0)
                .slice(0, 5);

            if (top.length === 0) {
                list.innerHTML = `<p class="empty-text">${this.translate('noSuitableHeroes')}</p>`;
                return;
            }

            list.innerHTML = top.map(([hero, data], index) => {
                const display = getHeroDisplayName(hero, heroesData, this.lang);
                const rankClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : index === 2 ? 'rank-bronze' : '';
                const reasons = data.reasons
                    .map((r) => `<li>${formatReason(r, this.lang)}</li>`)
                    .join('');
                const icon = getHeroIcon(hero);
                const portrait = getHeroPortrait(hero);
                const cardId = `result-${cat}-${index}`;
                return `
                    <div class="result-card ${rankClass}" id="${cardId}" data-hero="${hero}">
                        <div class="result-card-top">
                            <img class="result-icon" src="${icon}" alt="${hero}" loading="lazy">
                            <div class="result-card-info">
                                <div class="result-name">${display}</div>
                                <div class="result-score">${this.translate('score')}: ${data.score}</div>
                            </div>
                            <button type="button" class="build-btn hots-btn-sm" data-hero="${hero}" aria-expanded="false">${this.translate('buildBtn')}</button>
                        </div>
                        ${portrait ? `<div class="result-portrait-bg" style="background-image:url('${portrait}')"></div>` : ''}
                        ${reasons ? `<ul class="result-reasons">${reasons}</ul>` : ''}
                        <div class="result-build-slot" hidden></div>
                    </div>
                `;
            }).join('');

            list.querySelectorAll('.build-btn').forEach((btn) => {
                btn.addEventListener('click', () => this.toggleBuildPanel(btn));
            });
        });
    }

    async toggleBuildPanel(btn) {
        const card = btn.closest('.result-card');
        const hero = btn.dataset.hero;
        const slot = card?.querySelector('.result-build-slot');
        if (!slot) {
            return;
        }

        const isOpen = !slot.hidden;
        document.querySelectorAll('.result-build-slot').forEach((s) => {
            s.hidden = true;
            s.innerHTML = '';
        });
        document.querySelectorAll('.build-btn').forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-expanded', 'false');
        });

        if (isOpen) {
            return;
        }

        slot.hidden = false;
        slot.innerHTML = `<div class="loading-text">${this.translate('buildLoading')}</div>`;
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');

        const buildResult = pickBestBuild(
            hero,
            this.lastDraft.enemies,
            this.lastDraft.allies,
            this.lastDraft.map,
            this.builds,
            heroesData,
            this.lang
        );

        slot.innerHTML = '';
        slot.appendChild(await renderBuildPanel(buildResult, hero, this.lang));
    }

    getBannerOptions() {
        return {
            lang: this.lang,
            subtitle: this.translate('pickAnalyzer'),
            ctaText: this.translate('startAnalysis'),
            ctaHref: '#analyzer-start'
        };
    }
}
