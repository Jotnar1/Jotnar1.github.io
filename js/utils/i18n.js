import { LANG_KEY } from '../data/constants.js';

const STRINGS = {
    siteSubtitle: {
        ru: 'Анализатор пиков и база героев',
        en: 'Pick analyzer and hero database'
    },
    theme: { ru: 'Тема', en: 'Theme' },
    themeLight: { ru: 'Светлая', en: 'Light' },
    themeDark: { ru: 'Тёмная', en: 'Dark' },
    menu: { ru: 'Меню', en: 'Menu' },
    donate: { ru: 'Поддержать', en: 'Support' },
    footerTagline: { ru: 'За Нексус', en: 'For the Nexus' },
    nexus: { ru: 'НЕКСУС', en: 'NEXUS' },
    heroFallback: { ru: 'герой Нексуса', en: 'Nexus Hero' },

    navAnalyzer: { ru: 'Анализ пиков', en: 'Pick Analyzer' },
    navHeroes: { ru: 'Герои', en: 'Heroes' },
    navMaps: { ru: 'Карты', en: 'Maps' },
    navTierlist: { ru: 'Тирлист', en: 'Tier List' },
    navBuilds: { ru: 'Билды', en: 'Builds' },

    statHeroes: { ru: 'Героев', en: 'Heroes' },
    statMaps: { ru: 'Карт', en: 'Maps' },
    statSynergies: { ru: 'Синергий', en: 'Synergies' },
    statTiers: { ru: 'Мета-тиры', en: 'Meta tiers' },
    statBuilds: { ru: 'Билды', en: 'Builds' },

    noMatches: { ru: 'Нет совпадений', en: 'No matches' },
    all: { ru: 'Все', en: 'All' },
    nothingFound: { ru: 'Ничего не найдено', en: 'Nothing found' },
    noData: { ru: 'Нет данных', en: 'No data' },
    heroesCount: { ru: 'героев', en: 'heroes' },

    pickAnalyzer: { ru: 'Анализатор пиков', en: 'Pick Analyzer' },
    pickAnalyzerDesc: {
        ru: 'Выберите пики союзников и противников, укажите карту — анализатор подберёт лучших героев по синергиям, контрам и мете из базы данных.',
        en: 'Select ally and enemy picks, choose a map — the analyzer recommends heroes by synergies, counters and meta from the database.'
    },
    allyPicks: { ru: 'Пик союзников', en: 'Ally picks' },
    enemyPicks: { ru: 'Пик противников', en: 'Enemy picks' },
    allyN: { ru: 'Союзник', en: 'Ally' },
    enemyN: { ru: 'Противник', en: 'Enemy' },
    map: { ru: 'Карта', en: 'Map' },
    searchHero: { ru: 'Найти героя...', en: 'Search hero...' },
    searchMap: { ru: 'Найти карту...', en: 'Search map...' },
    analyzePicks: { ru: 'Анализировать пики', en: 'Analyze picks' },
    recommendedHeroes: { ru: 'Рекомендуемые герои', en: 'Recommended heroes' },
    startAnalysis: { ru: 'Начать анализ', en: 'Start analysis' },
    analyzing: { ru: 'Анализируем...', en: 'Analyzing...' },
    selectHeroOrMap: {
        ru: 'Выберите хотя бы одного героя или карту',
        en: 'Select at least one hero or map'
    },
    noSuitableHeroes: { ru: 'Нет подходящих героев', en: 'No suitable heroes' },
    score: { ru: 'Очки', en: 'Score' },

    heroesTitle: { ru: 'Герои HoTS', en: 'HoTS Heroes' },
    heroDatabase: { ru: 'База героев', en: 'Hero Database' },
    browseHeroes: { ru: 'Смотреть героев', en: 'Browse heroes' },
    searchHeroPage: { ru: 'Поиск героя...', en: 'Search hero...' },
    selectHero: { ru: 'Выберите героя из списка', en: 'Select a hero from the list' },
    pros: { ru: 'Плюсы', en: 'Pros' },
    cons: { ru: 'Минусы', en: 'Cons' },
    synergizesWith: { ru: 'Сочетается с', en: 'Synergizes with' },
    counters: { ru: 'Контрит', en: 'Counters' },
    weakAgainst: { ru: 'Слаб против', en: 'Weak against' },
    bestMaps: { ru: 'Лучшие карты', en: 'Best maps' },

    mapsTitle: { ru: 'Карты HoTS', en: 'HoTS Maps' },
    battlegrounds: { ru: 'Поля битвы', en: 'Battlegrounds' },
    browseMaps: { ru: 'Смотреть карты', en: 'Browse maps' },
    searchMapPage: { ru: 'Поиск карты...', en: 'Search map...' },
    selectMap: { ru: 'Выберите карту из списка', en: 'Select a map from the list' },
    suitableHeroes: { ru: 'Подходящие герои', en: 'Suitable heroes' },
    noMapHeroes: { ru: 'Нет данных о героях для этой карты', en: 'No hero data for this map' },
    analyzeOnMap: { ru: 'Анализировать пик на карте', en: 'Analyze picks for this map' },
    clickToZoom: { ru: 'Нажмите для увеличения', en: 'Click to zoom' },

    tierListTitle: { ru: 'Тирлист героев', en: 'Hero Tier List' },
    metaTierList: { ru: 'Мета-тирлист', en: 'Meta Tier List' },
    viewTiers: { ru: 'Смотреть тиры', en: 'View tiers' },
    tierListDesc: {
        ru: 'Рейтинг героев по текущей мете. Нажмите на героя, чтобы открыть подробный профиль.',
        en: 'Hero ranking by current meta. Click a hero to open their profile.'
    },
    noTierHeroes: { ru: 'Нет героев', en: 'No heroes' },

    buildBtn: { ru: 'Билд', en: 'Build' },
    buildLoading: { ru: 'Подбираем билд...', en: 'Loading build...' },
    buildNotFound: { ru: 'Билды для этого героя пока не найдены', en: 'No builds found for this hero' },
    buildReasonMeta: { ru: 'Стандартный мета-билд по данным Icy Veins', en: 'Standard meta build from Icy Veins data' },
    buildReasonDraft: { ru: 'Под текущий драфт: {tags}', en: 'Fits current draft: {tags}' },
    buildSourceIcy: { ru: 'Icy Veins', en: 'Icy Veins' },
    buildSourceHF: { ru: 'HeroesFire', en: 'HeroesFire' },
    buildsTitle: { ru: 'Билды героев', en: 'Hero Builds' },
    buildsDesc: {
        ru: 'Лучшие билды из гайдов Icy Veins и HeroesFire. Рекомендуемый вариант и все альтернативы для каждого героя.',
        en: 'Top builds from Icy Veins and HeroesFire guides. Recommended variant and all alternatives for each hero.'
    },
    buildsHeroList: { ru: 'Выбор героя', en: 'Pick a hero' },
    buildsFromSites: { ru: 'Данные с Icy Veins и HeroesFire', en: 'Data from Icy Veins and HeroesFire' },
    buildRecommended: { ru: 'Рекомендуемый билд', en: 'Recommended build' },
    buildAllVariants: { ru: 'Все варианты', en: 'All variants' },
    buildsCount: { ru: 'билдов', en: 'builds' },
    browseBuilds: { ru: 'Смотреть билды', en: 'Browse builds' },
    buildTier_recommended: { ru: 'Мета', en: 'Meta' },
    buildTier_advanced: { ru: 'Продвинутый', en: 'Advanced' },
    buildTier_situational: { ru: 'Ситуативный', en: 'Situational' },
    buildTier_aram: { ru: 'ARAM', en: 'ARAM' },
    buildTier_standard: { ru: 'Стандарт', en: 'Standard' },
    buildTag_vsRanged: { ru: 'против дальнего урона', en: 'vs ranged damage' },
    buildTag_vsMelee: { ru: 'против мили', en: 'vs melee' },
    buildTag_vsBurst: { ru: 'против бурста', en: 'vs burst' },
    buildTag_vsHealer: { ru: 'против хилов', en: 'vs healers' },
    buildTag_vsAssassin: { ru: 'против ассасинов', en: 'vs assassins' },
    buildTag_vsTank: { ru: 'против танков', en: 'vs tanks' },
    buildTag_survival: { ru: 'выживаемость', en: 'survival' },
    buildTag_teamfight: { ru: 'тимфайты', en: 'team fights' },
    buildTag_macro: { ru: 'макро', en: 'macro' },
    buildDescNote: { ru: 'Описание билда на английском (источник: Icy Veins)', en: '' },
    buildLevel: { ru: 'Ур.', en: 'Lv.' },

    reasonSynergy: { ru: 'Синергия с {name} (+10)', en: 'Synergy with {name} (+10)' },
    reasonCounter: { ru: 'Контрит {name} (+15)', en: 'Counters {name} (+15)' },
    reasonMap: { ru: 'Отлично подходит для карты {name} (+8)', en: 'Great on map {name} (+8)' },
    reasonTierS: { ru: 'Tier S мета (+10)', en: 'Tier S meta (+10)' },
    reasonTierA: { ru: 'Tier A мета (+5)', en: 'Tier A meta (+5)' },
    reasonTierB: { ru: 'Tier B мета (+3)', en: 'Tier B meta (+3)' },
    reasonTierC: { ru: 'Tier C мета (+1)', en: 'Tier C meta (+1)' },
    reasonMultiSynergy: { ru: 'Множественные синергии ({count}) (+5)', en: 'Multiple synergies ({count}) (+5)' },
    reasonMultiCounter: { ru: 'Множественные контры ({count}) (+8)', en: 'Multiple counters ({count}) (+8)' }
};

const PAGE_TITLES = {
    'index.html': { ru: 'Heroes of the Storm — Анализ пиков', en: 'Heroes of the Storm — Pick Analyzer' },
    'heroes.html': { ru: 'Heroes of the Storm — Герои', en: 'Heroes of the Storm — Heroes' },
    'maps.html': { ru: 'Heroes of the Storm — Карты', en: 'Heroes of the Storm — Maps' },
    'tierlist.html': { ru: 'Heroes of the Storm — Тирлист', en: 'Heroes of the Storm — Tier List' },
    'builds.html': { ru: 'Heroes of the Storm — Билды', en: 'Heroes of the Storm — Builds' }
};

export function getLang() {
    return localStorage.getItem(LANG_KEY) || 'ru';
}

export function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
}

export function toggleLang() {
    const next = getLang() === 'ru' ? 'en' : 'ru';
    setLang(next);
    return next;
}

export function t(key, lang = getLang(), params = {}) {
    const entry = STRINGS[key];
    if (!entry) {
        return key;
    }
    let text = entry[lang] ?? entry.ru ?? entry.en ?? key;
    if (lang === 'en' && text === '') {
        return '';
    }
    Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
    });
    return text;
}

export function translateBuildTier(tier, lang = getLang()) {
    const key = `buildTier_${tier}`;
    const translated = t(key, lang);
    if (translated !== key) {
        return translated;
    }
    return tier.charAt(0).toUpperCase() + tier.slice(1);
}

export function getThemeLabel(lang = getLang()) {
    const isLight = document.getElementById('themeSwitch')?.checked;
    return t(isLight ? 'themeLight' : 'themeDark', lang);
}

export function updatePageTitle(page, lang = getLang()) {
    const titles = PAGE_TITLES[page];
    if (titles) {
        document.title = titles[lang] || titles.ru;
    }
}

export function getNavLinks(lang = getLang()) {
    return [
        { href: 'index.html', title: t('navAnalyzer', lang) },
        { href: 'heroes.html', title: t('navHeroes', lang) },
        { href: 'maps.html', title: t('navMaps', lang) },
        { href: 'tierlist.html', title: t('navTierlist', lang) },
        { href: 'builds.html', title: t('navBuilds', lang) }
    ];
}
