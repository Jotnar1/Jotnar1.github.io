import { getTalentList, getHeroesFireUrl } from './buildAdvisor.js';
import { createElement } from './helpers.js';
import { t, translateBuildTier } from './i18n.js';
import { preloadHeroTalents, resolveTalentIcon, createTalentIcon } from './talentIcons.js';

function appendTalentGrid(container, build, talentMap, lang, compact = false) {
    const grid = createElement('div', `build-talent-grid${compact ? ' build-talent-grid-compact' : ''}`);

    getTalentList(build).forEach(({ level, name, icon }) => {
        const tier = createElement('div', 'build-talent-tier');
        tier.appendChild(createElement('span', 'build-talent-level', `${level}`));

        const iconWrap = createElement('div', 'build-talent-icon-wrap');
        iconWrap.appendChild(createTalentIcon(resolveTalentIcon(talentMap, name, icon), name));
        tier.appendChild(iconWrap);

        tier.appendChild(createElement('span', 'build-talent-name', name));
        grid.appendChild(tier);
    });

    container.appendChild(grid);
}

function appendBuildLinks(container, build, hero, lang) {
    const links = createElement('div', 'build-source-links');
    if (build.source) {
        const icyLink = document.createElement('a');
        icyLink.href = build.source;
        icyLink.target = '_blank';
        icyLink.rel = 'noopener noreferrer';
        icyLink.className = 'build-source-link';
        icyLink.textContent = t('buildSourceIcy', lang);
        links.appendChild(icyLink);
    }
    const hfLink = document.createElement('a');
    hfLink.href = getHeroesFireUrl(hero);
    hfLink.target = '_blank';
    hfLink.rel = 'noopener noreferrer';
    hfLink.className = 'build-source-link';
    hfLink.textContent = t('buildSourceHF', lang);
    links.appendChild(hfLink);
    container.appendChild(links);
}

export async function renderBuildPanel(buildResult, hero, lang = 'ru') {
    const panel = createElement('div', 'build-panel');
    const talentMap = await preloadHeroTalents(hero);

    if (!buildResult?.build) {
        panel.appendChild(createElement('p', 'build-empty', t('buildNotFound', lang)));
        return panel;
    }

    const { build, reason } = buildResult;
    const header = createElement('div', 'build-panel-header');
    header.appendChild(createElement('span', 'build-panel-name', build.name));
    header.appendChild(createElement('span', `build-tier build-tier-${build.tier}`, translateBuildTier(build.tier, lang)));
    panel.appendChild(header);

    if (reason) {
        panel.appendChild(createElement('p', 'build-reason', reason));
    }

    appendTalentGrid(panel, build, talentMap, lang);

    if (build.description) {
        const desc = build.description.replace(/\s+/g, ' ').trim();
        panel.appendChild(createElement('p', 'build-description', desc));
        if (lang === 'ru') {
            panel.appendChild(createElement('p', 'build-description-note', t('buildDescNote', lang)));
        }
    }

    appendBuildLinks(panel, build, hero, lang);
    return panel;
}

export async function renderBuildCard(build, hero, lang = 'ru', compact = false) {
    const card = createElement('div', `build-card${compact ? ' build-card-compact' : ''}`);
    const talentMap = await preloadHeroTalents(hero);

    const top = createElement('div', 'build-card-top');
    top.appendChild(createElement('h4', 'build-card-name', build.name));
    top.appendChild(createElement('span', `build-tier build-tier-${build.tier}`, translateBuildTier(build.tier, lang)));
    card.appendChild(top);

    appendTalentGrid(card, build, talentMap, lang, compact);

    if (!compact && build.description) {
        card.appendChild(createElement('p', 'build-description', build.description.replace(/\s+/g, ' ').trim()));
        if (lang === 'ru') {
            card.appendChild(createElement('p', 'build-description-note', t('buildDescNote', lang)));
        }
    }

    appendBuildLinks(card, build, hero, lang);
    return card;
}
