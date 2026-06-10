import { getHeroCategory } from './helpers.js';
import { t } from './i18n.js';

const RANGED_DAMAGE = new Set([
    'Chromie', 'Falstad', 'Gazlowe', 'Genji', 'Greymane', 'Hanzo', 'Jaina', 'Junkrat',
    'Kael\'thas', 'Kel\'Thuzad', 'Li-Ming', 'Lunara', 'Mephisto', 'Nazeebo', 'Nova',
    'Orphea', 'Raynor', 'Sgt. Hammer', 'Sylvanas', 'Tassadar', 'Tracer', 'Tychus',
    'Valla', 'Zagara', 'Zul\'jin', 'Gul\'dan', 'Azmodan', 'Probius', 'Xul', 'Qhira'
]);

const MELEE_DAMAGE = new Set([
    'Alarak', 'Butcher', 'The Butcher', 'Illidan', 'Kerrigan', 'Maiev', 'Samuro',
    'Sonya', 'Thrall', 'Varian', 'Zeratul', 'Valeera', 'Qhira', 'Deathwing'
]);

const BURST_ASSASSINS = new Set([
    'Alarak', 'Genji', 'Kerrigan', 'Li-Ming', 'Nova', 'Qhira', 'The Butcher',
    'Valeera', 'Zeratul', 'Kel\'Thuzad', 'Chromie', 'Junkrat'
]);

const MOBILE_ASSASSINS = new Set([
    'Genji', 'Illidan', 'Kerrigan', 'Maiev', 'Murky', 'Qhira', 'Samuro',
    'Tracer', 'Valeera', 'Zeratul', 'Deathwing', 'Hogger'
]);

const TALENT_LEVELS = [1, 4, 7, 10, 13, 16, 20];

export function analyzeEnemyThreats(enemies, heroesData) {
    const threats = new Set();

    enemies.forEach((enemy) => {
        const category = getHeroCategory(enemy, heroesData);

        if (category === 'healers') {
            threats.add('vsHealer');
        }
        if (category === 'tanks' || category === 'bruisers') {
            threats.add('vsTank');
            threats.add('vsMelee');
        }
        if (RANGED_DAMAGE.has(enemy)) {
            threats.add('vsRanged');
        }
        if (MELEE_DAMAGE.has(enemy)) {
            threats.add('vsMelee');
        }
        if (BURST_ASSASSINS.has(enemy)) {
            threats.add('vsBurst');
            threats.add('vsAssassin');
        }
        if (MOBILE_ASSASSINS.has(enemy)) {
            threats.add('vsAssassin');
        }
        if (category === 'damage' && !RANGED_DAMAGE.has(enemy)) {
            threats.add('vsMelee');
        }
    });

    return threats;
}

function tierScore(tier) {
    if (tier === 'recommended') {
        return 4;
    }
    if (tier === 'advanced') {
        return 3;
    }
    if (tier === 'situational') {
        return 2;
    }
    return 0;
}

function buildMatchReason(build, threats, lang) {
    const matched = (build.tags || []).filter((tag) => threats.has(tag));
    if (matched.length === 0) {
        return t('buildReasonMeta', lang);
    }
    const labels = matched.map((tag) => t(`buildTag_${tag}`, lang)).join(', ');
    return t('buildReasonDraft', lang, { tags: labels });
}

export function pickBestBuild(hero, enemies, allies, map, builds, heroesData, lang = 'ru') {
    const heroBuilds = builds?.[hero] || [];
    if (heroBuilds.length === 0) {
        return null;
    }

    const threats = analyzeEnemyThreats(enemies, heroesData);
    const candidates = heroBuilds.filter((b) => b.tier !== 'aram');

    let best = candidates.find((b) => b.tier === 'recommended') || candidates[0] || heroBuilds[0];
    let bestScore = -1;

    candidates.forEach((build) => {
        let score = tierScore(build.tier);
        (build.tags || []).forEach((tag) => {
            if (threats.has(tag)) {
                score += 6;
            }
        });
        if (score > bestScore) {
            bestScore = score;
            best = build;
        }
    });

    return {
        build: best,
        reason: buildMatchReason(best, threats, lang),
        threats: [...threats]
    };
}

export function getTalentList(build) {
    if (!build?.talents) {
        return [];
    }
    return TALENT_LEVELS
        .filter((level) => build.talents[String(level)])
        .map((level) => {
            const raw = build.talents[String(level)];
            if (typeof raw === 'string') {
                return { level, name: raw, icon: null };
            }
            return {
                level,
                name: raw.name || raw,
                icon: raw.icon || null
            };
        });
}

import { heroToSlug } from './heroSlugs.js';

export function getHeroesFireUrl(hero) {
    return `https://www.heroesfire.com/heroes/${heroToSlug(hero)}/talents`;
}
