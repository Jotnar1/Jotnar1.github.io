import { CATEGORY_LABELS } from '../data/constants.js';
import {
    getHeroCategory,
    getHeroMetaTier,
    getHeroCounters,
    getHeroDisplayName
} from './helpers.js';

const ROLE_DESCRIPTIONS = {
    tanks: {
        ru: 'Танк — передняя линия команды. Защищает союзников, инициирует драки и контролирует пространство.',
        en: 'Tank — frontline hero who protects allies, initiates fights and controls space.'
    },
    bruisers: {
        ru: 'Брузер — бойец ближнего боя с высокой живучестью. Давит линию и создаёт давление на карте.',
        en: 'Bruiser — durable melee fighter who pressures lanes and creates map presence.'
    },
    healers: {
        ru: 'Хилер — поддержка команды. Лечит, спасает в критические моменты и усиливает союзников.',
        en: 'Healer — support hero who heals allies and enables the team in fights.'
    },
    damage: {
        ru: 'ДД — основной источник урона. Убивает цели, давит линию и забирает объективы.',
        en: 'Damage dealer — main source of burst and sustained damage for the team.'
    },
    specialists: {
        ru: 'Специалист — уникальный герой с нестандартной механикой. Меняет темп игры и стратегию.',
        en: 'Specialist — unique hero with unconventional mechanics that shifts game tempo.'
    }
};

const TIER_TEXT = {
    S: { ru: 'топ меты', en: 'top meta pick' },
    A: { ru: 'сильный выбор', en: 'strong pick' },
    B: { ru: 'ситуативный герой', en: 'situational pick' },
    C: { ru: 'нишевый герой', en: 'niche pick' }
};

export function buildHeroProfile(heroName, heroesData, lang = 'ru') {
    const category = getHeroCategory(heroName, heroesData);
    const metaTier = getHeroMetaTier(heroName, heroesData);
    const synergies = [...(heroesData.synergies[heroName] || [])].sort((a, b) => a.localeCompare(b, 'en'));
    const counteredBy = [...(heroesData.counteredBy[heroName] || [])].sort((a, b) => a.localeCompare(b, 'en'));
    const counters = getHeroCounters(heroName, heroesData);
    const bestMaps = [...(heroesData.bestMaps[heroName] || [])].filter((m) => heroesData.maps.includes(m));
    const categoryLabel = CATEGORY_LABELS[category]?.[lang] || category;

    const description = buildDescription(heroName, category, metaTier, bestMaps.length, lang, heroesData);
    const pros = buildPros(synergies, counters, metaTier, bestMaps, lang);
    const cons = buildCons(counteredBy, synergies, metaTier, lang);

    return {
        name: heroName,
        displayName: getHeroDisplayName(heroName, heroesData, lang),
        ruName: heroesData.heroNamesRu?.[heroName] || heroName,
        category,
        categoryLabel,
        metaTier,
        description,
        pros,
        cons,
        synergies,
        counteredBy,
        counters,
        bestMaps
    };
}

function buildDescription(heroName, category, metaTier, mapCount, lang, heroesData) {
    const ruName = heroesData.heroNamesRu?.[heroName] || heroName;
    const roleText = ROLE_DESCRIPTIONS[category]?.[lang] || '';
    const tierPart = metaTier
        ? (lang === 'ru'
            ? `Сейчас считается ${TIER_TEXT[metaTier].ru} (Tier ${metaTier}).`
            : `Currently considered a ${TIER_TEXT[metaTier].en} (Tier ${metaTier}).`)
        : '';
    const mapPart = mapCount > 0
        ? (lang === 'ru'
            ? ` Хорошо проявляет себя на ${mapCount} картах из базы.`
            : ` Performs well on ${mapCount} maps in the database.`)
        : '';

    if (lang === 'ru') {
        return `${ruName} — ${categoryLabelRu(category)}. ${roleText}${tierPart}${mapPart}`;
    }
    return `${heroName} is a ${category}. ${roleText}${tierPart}${mapPart}`;
}

function categoryLabelRu(category) {
    return CATEGORY_LABELS[category]?.ru || category;
}

function buildPros(synergies, counters, metaTier, bestMaps, lang) {
    const pros = [];
    if (metaTier === 'S' || metaTier === 'A') {
        pros.push(lang === 'ru' ? `Высокий мета-рейтинг (Tier ${metaTier})` : `High meta rating (Tier ${metaTier})`);
    }
    if (synergies.length >= 5) {
        pros.push(lang === 'ru' ? `Много синергий с другими героями (${synergies.length})` : `Many synergies (${synergies.length})`);
    } else if (synergies.length > 0) {
        pros.push(lang === 'ru' ? `Хорошо сочетается с ${synergies.length} героями` : `Synergizes with ${synergies.length} heroes`);
    }
    if (counters.length >= 4) {
        pros.push(lang === 'ru' ? `Контрит многих вражеских героев (${counters.length})` : `Counters many enemy heroes (${counters.length})`);
    } else if (counters.length > 0) {
        pros.push(lang === 'ru' ? `Эффективен против ${counters.length} героев` : `Effective against ${counters.length} heroes`);
    }
    if (bestMaps.length >= 5) {
        pros.push(lang === 'ru' ? 'Универсален на большинстве карт' : 'Versatile on most maps');
    } else if (bestMaps.length > 0) {
        pros.push(lang === 'ru' ? `Силён на ${bestMaps.length} картах` : `Strong on ${bestMaps.length} maps`);
    }
    if (pros.length === 0) {
        pros.push(lang === 'ru' ? 'Может быть полезен в правильном составе' : 'Can be useful in the right comp');
    }
    return pros;
}

function buildCons(counteredBy, synergies, metaTier, lang) {
    const cons = [];
    if (metaTier === 'C') {
        cons.push(lang === 'ru' ? 'Низкий приоритет в текущей мете' : 'Low priority in current meta');
    }
    if (counteredBy.length >= 4) {
        cons.push(lang === 'ru' ? `Уязвим к ${counteredBy.length} героям` : `Vulnerable to ${counteredBy.length} heroes`);
    } else if (counteredBy.length > 0) {
        cons.push(lang === 'ru' ? `Может быть законтрен ${counteredBy.length} героями` : `Can be countered by ${counteredBy.length} heroes`);
    }
    if (synergies.length === 0) {
        cons.push(lang === 'ru' ? 'Мало задокументированных синергий' : 'Few documented synergies');
    }
    if (cons.length === 0) {
        cons.push(lang === 'ru' ? 'Требует координации с командой' : 'Requires team coordination');
    }
    return cons;
}
