import { MAP_NAMES_RU } from '../data/mapNames.js';

export function getMapDisplayName(mapName, lang = 'ru') {
    if (lang === 'en') {
        return mapName;
    }
    return MAP_NAMES_RU[mapName] || mapName;
}

export function getHeroesForMap(mapName, heroesData) {
    const validMaps = new Set(heroesData.maps);
    if (!validMaps.has(mapName)) {
        return [];
    }

    const heroes = [];
    Object.entries(heroesData.bestMaps || {}).forEach(([hero, maps]) => {
        if (Array.isArray(maps) && maps.includes(mapName)) {
            heroes.push(hero);
        }
    });

    return heroes.sort((a, b) => a.localeCompare(b, 'en'));
}
