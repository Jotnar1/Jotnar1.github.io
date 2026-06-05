import { t } from './i18n.js';
import { getMapDisplayName, getHeroDisplayName } from './helpers.js';

export function calculateRecommendations(allies, enemies, map, heroesData, lang = 'ru') {
    const heroScores = {};

    heroesData.heroes.forEach((hero) => {
        let score = 0;
        const reasons = [];

        allies.forEach((ally) => {
            if (heroesData.synergies[ally]?.includes(hero)) {
                score += 10;
                reasons.push({ key: 'reasonSynergy', params: { name: getHeroDisplayName(ally, heroesData, lang) } });
            }
        });

        enemies.forEach((enemy) => {
            if (heroesData.counteredBy[enemy]?.includes(hero)) {
                score += 15;
                reasons.push({ key: 'reasonCounter', params: { name: getHeroDisplayName(enemy, heroesData, lang) } });
            }
        });

        if (map && heroesData.bestMaps[hero]?.includes(map)) {
            score += 8;
            const mapName = getMapDisplayName(map, lang);
            reasons.push({ key: 'reasonMap', params: { name: mapName } });
        }

        if (heroesData.metaTiers) {
            if (heroesData.metaTiers.S?.includes(hero)) {
                score += 10;
                reasons.push({ key: 'reasonTierS' });
            } else if (heroesData.metaTiers.A?.includes(hero)) {
                score += 5;
                reasons.push({ key: 'reasonTierA' });
            } else if (heroesData.metaTiers.B?.includes(hero)) {
                score += 3;
                reasons.push({ key: 'reasonTierB' });
            } else if (heroesData.metaTiers.C?.includes(hero)) {
                score += 1;
                reasons.push({ key: 'reasonTierC' });
            }
        }

        const synergyCount = allies.filter((ally) => heroesData.synergies[ally]?.includes(hero)).length;
        if (synergyCount >= 2) {
            score += 5;
            reasons.push({ key: 'reasonMultiSynergy', params: { count: synergyCount } });
        }

        const counterCount = enemies.filter((enemy) => heroesData.counteredBy[enemy]?.includes(hero)).length;
        if (counterCount >= 2) {
            score += 8;
            reasons.push({ key: 'reasonMultiCounter', params: { count: counterCount } });
        }

        if (allies.includes(hero) || enemies.includes(hero)) {
            score = -1000;
        }

        if (score > 0) {
            heroScores[hero] = { score, reasons };
        }
    });

    return Object.entries(heroScores).sort(([, a], [, b]) => b.score - a.score);
}

export function formatReason(reason, lang = 'ru') {
    if (typeof reason === 'string') {
        return reason;
    }
    return t(reason.key, lang, reason.params || {});
}

export function getSelectedHeroes(prefix) {
    const heroes = [];
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`${prefix}${i}`);
        if (input?.value) {
            heroes.push(input.value);
        }
    }
    return heroes;
}

export function getSelectedMap(mapInput, heroesData, mapNamesRu) {
    const val = mapInput?.value || '';
    if (!val) {
        return '';
    }
    for (const eng of heroesData.maps) {
        const ru = mapNamesRu[eng] || '';
        if (val === eng || val === ru) {
            return eng;
        }
    }
    return '';
}
