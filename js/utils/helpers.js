import { MAP_NAMES_RU } from '../data/mapNames.js';

export function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (text !== undefined && text !== null && text !== '') {
        element.textContent = text;
    }
    return element;
}

export function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

export function sortByText(list, field, locale = 'ru') {
    return [...list].sort((a, b) => a[field].localeCompare(b[field], locale));
}

export function getUniqueHeroes(heroesData) {
    const seen = new Set();
    const result = [];
    heroesData.heroes.forEach((hero) => {
        if (!seen.has(hero)) {
            seen.add(hero);
            result.push(hero);
        }
    });
    return result.sort((a, b) => a.localeCompare(b, 'en'));
}

export function getHeroCategory(heroName, heroesData) {
    for (const [category, heroes] of Object.entries(heroesData.heroCategories)) {
        if (heroes.includes(heroName)) {
            return category;
        }
    }
    return 'damage';
}

export function getHeroMetaTier(heroName, heroesData) {
    if (!heroesData.metaTiers) {
        return null;
    }
    for (const [tier, heroes] of Object.entries(heroesData.metaTiers)) {
        if (heroes.includes(heroName)) {
            return tier;
        }
    }
    return null;
}

export function getHeroCounters(heroName, heroesData) {
    const counters = [];
    Object.entries(heroesData.counteredBy || {}).forEach(([enemy, heroes]) => {
        if (heroes.includes(heroName)) {
            counters.push(enemy);
        }
    });
    return counters.sort((a, b) => a.localeCompare(b, 'en'));
}

export function getHeroDisplayName(heroName, heroesData, lang = 'ru') {
    const ru = heroesData.heroNamesRu?.[heroName];
    if (lang === 'en') {
        return heroName;
    }
    return ru && ru !== heroName ? `${ru} (${heroName})` : heroName;
}

export function getMapDisplayName(mapName, lang = 'ru') {
    const ru = MAP_NAMES_RU?.[mapName];
    if (lang === 'en') {
        return mapName;
    }
    return ru || mapName;
}
