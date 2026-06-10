const BUILDS_URL = '../js/data/heroBuilds.json';

let buildsCache = null;

function normalizeBuildKeys(data) {
    const fixed = { ...data };
    Object.keys(data).forEach((key) => {
        if (key.includes('cio') && key !== 'Lúcio' && !fixed['Lúcio']) {
            fixed['Lúcio'] = data[key];
            delete fixed[key];
        }
    });
    return fixed;
}

export async function loadHeroBuilds() {
    if (buildsCache) {
        return buildsCache;
    }
    const response = await fetch(BUILDS_URL);
    if (!response.ok) {
        buildsCache = {};
        return buildsCache;
    }
    const data = await response.json();
    buildsCache = normalizeBuildKeys(data);
    return buildsCache;
}

export function getHeroBuilds(heroName, builds = buildsCache) {
    return builds?.[heroName] || [];
}

export function getDefaultBuild(heroName, builds = buildsCache) {
    const list = getHeroBuilds(heroName, builds);
    return list.find((b) => b.tier === 'recommended') || list[0] || null;
}
