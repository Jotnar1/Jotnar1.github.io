import { heroToSlug } from './heroSlugs.js';

const HERO_JSON_BASE = 'https://raw.githubusercontent.com/heroespatchnotes/heroes-talents/master/hero/';
const ICON_BASE = 'https://static.icy-veins.com/images/heroes/icons/large/';

const heroCache = new Map();

function normalizeTalentName(name) {
    return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function iconUrls(iconFile) {
    if (!iconFile) {
        return [];
    }
    const base = iconFile.replace(/\.(png|jpg)$/i, '');
    return [
        `${ICON_BASE}${base}.jpg`,
        `${ICON_BASE}${base}.png`,
        `https://raw.githubusercontent.com/heroespatchnotes/heroes-talents/master/images/${iconFile}`
    ];
}

export async function preloadHeroTalents(hero) {
    if (heroCache.has(hero)) {
        return heroCache.get(hero);
    }

    const slug = heroToSlug(hero);
    const map = new Map();

    try {
        const response = await fetch(`${HERO_JSON_BASE}${slug}.json`);
        if (response.ok) {
            const data = await response.json();
            Object.values(data.talents || {}).flat().forEach((talent) => {
                if (talent?.name && talent?.icon) {
                    map.set(normalizeTalentName(talent.name), iconUrls(talent.icon));
                }
            });
        }
    } catch {
        // offline or blocked — icons fall back to placeholder
    }

    heroCache.set(hero, map);
    return map;
}

export function resolveTalentIcon(talentMap, talentName, storedIcon) {
    if (storedIcon) {
        const url = storedIcon.startsWith('//') ? `https:${storedIcon}` : storedIcon;
        return [url, ...iconUrls(url.split('/').pop())];
    }
    return talentMap?.get(normalizeTalentName(talentName)) || [];
}

export function createTalentIcon(urls, name) {
    const img = document.createElement('img');
    img.className = 'build-talent-icon';
    img.alt = name;
    img.width = 36;
    img.height = 36;
    img.loading = 'lazy';

    let index = 0;
    const tryNext = () => {
        if (index < urls.length) {
            img.src = urls[index];
            index += 1;
        } else {
            img.src = '../img/hots-logo.svg';
            img.classList.add('build-talent-icon-fallback');
        }
    };

    img.addEventListener('error', tryNext);
    tryNext();
    return img;
}
