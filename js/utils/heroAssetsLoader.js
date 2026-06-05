import { HERO_ASSETS } from '../data/heroAssets.js';

export function loadHeroAssets() {
    return Promise.resolve(HERO_ASSETS);
}

export function getHeroAssetsSync() {
    return HERO_ASSETS;
}
