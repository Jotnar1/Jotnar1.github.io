import { getHeroAssetsSync } from './heroAssetsLoader.js';

const FALLBACK_ICON = '../img/hots-logo.svg';

export function getHeroAsset(heroName) {
    return getHeroAssetsSync()[heroName] || null;
}

export function getHeroPortrait(heroName) {
    return getHeroAssetsSync()[heroName]?.portrait || '';
}

export function getHeroIcon(heroName) {
    return getHeroAssetsSync()[heroName]?.icon || FALLBACK_ICON;
}

export function getHeroTitle(heroName) {
    return getHeroAssetsSync()[heroName]?.title || '';
}

export function getHeroShortDescription(heroName) {
    return getHeroAssetsSync()[heroName]?.shortDescription || '';
}
