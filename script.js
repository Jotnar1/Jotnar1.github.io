// Основной скрипт для анализа пиков героев
let heroesData;

// Русские названия карт
const mapNamesRu = {
    "Alterac Pass": "Альтеракская долина",
    "Battlefield of Eternity": "Поле Битвы Вечности",
    "Blackheart's Bay": "Бухта Черносерда",
    "Braxis Holdout": "Форпост Браксис",
    "Cursed Hollow": "Проклятая Лощина",
    "Dragon Shire": "Драконий Погост",
    "Garden of Terror": "Сад Ужаса",
    "Hanamura Temple": "Ханамура",
    "Infernal Shrines": "Адские Святилища",
    "Sky Temple": "Небесный Храм",
    "Tomb of the Spider Queen": "Гробница Паучьей Королевы",
    "Towers of Doom": "Башни Рока",
    "Volskaya Foundry": "Завод Вольской",
    "Warhead Junction": "Ракетная Станция"
};

// Заполнение datalist для героев
function fillHeroDatalist() {
    const datalist = document.getElementById('heroesList');
    if (!datalist) return;
    datalist.innerHTML = '';
    heroesData.heroes.forEach(hero => {
        const option = document.createElement('option');
        let ru = heroesData.heroNamesRu ? heroesData.heroNamesRu[hero] : '';
        option.value = hero;
        if (ru && ru !== hero) option.label = ru;
        datalist.appendChild(option);
    });
}

// --- Кастомный autocomplete для героев ---
function setupHeroAutocomplete() {
    const heroInputs = document.querySelectorAll('.hero-autocomplete');
    heroInputs.forEach(input => {
        const listId = input.id + '-list';
        const listDiv = document.getElementById(listId);
        let currentFocus = -1;

        input.addEventListener('input', function() {
            const val = this.value.toLowerCase();
            listDiv.innerHTML = '';
            let matches = [];
            // Собираем уже выбранных героев (чтобы не дублировать)
            const allInputs = Array.from(document.querySelectorAll('.hero-autocomplete'));
            const selected = allInputs.filter(i => i !== input).map(i => i.value);
            const seen = new Set();
            heroesData.heroes.forEach(hero => {
                const ru = heroesData.heroNamesRu ? heroesData.heroNamesRu[hero] : '';
                const key = hero.toLowerCase();
                if (
                    (hero.toLowerCase().includes(val) || (ru && ru.toLowerCase().includes(val))) &&
                    !selected.includes(hero) &&
                    !seen.has(key)
                ) {
                    matches.push({eng: hero, ru: ru});
                    seen.add(key);
                }
            });
            if (matches.length === 0) {
                listDiv.innerHTML = '<div class="autocomplete-item">Нет совпадений</div>';
            } else {
                matches.forEach((h, idx) => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item' + (document.body.classList.contains('dark-theme') ? ' dark-theme' : '');
                    item.innerHTML = `<strong>${window.currentLang === 'en' ? h.eng : (h.ru || h.eng)}</strong> <span style='color:#aaa;font-size:0.9em;'>${h.eng}</span>`;
                    item.addEventListener('mousedown', function(e) {
                        input.value = h.eng;
                        listDiv.classList.remove('show');
                        input.blur();
                        input.dispatchEvent(new Event('change'));
                    });
                    listDiv.appendChild(item);
                });
            }
            listDiv.classList.add('show');
            currentFocus = -1;
        });
        input.addEventListener('focus', function() {
            this.dispatchEvent(new Event('input'));
        });
        input.addEventListener('blur', function() {
            setTimeout(() => listDiv.classList.remove('show'), 150);
        });
        input.addEventListener('keydown', function(e) {
            let items = listDiv.querySelectorAll('.autocomplete-item');
            if (!items.length) return;
            if (e.key === 'ArrowDown') {
                currentFocus++;
                if (currentFocus >= items.length) currentFocus = 0;
                setActive(items, currentFocus);
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                currentFocus--;
                if (currentFocus < 0) currentFocus = items.length - 1;
                setActive(items, currentFocus);
                e.preventDefault();
            } else if (e.key === 'Enter') {
                if (currentFocus > -1) {
                    items[currentFocus].dispatchEvent(new Event('mousedown'));
                    e.preventDefault();
                }
            }
        });
        function setActive(items, idx) {
            items.forEach(i => i.classList.remove('selected'));
            if (items[idx]) items[idx].classList.add('selected');
        }
    });
}

// --- Кастомный autocomplete для карт (как у героев) ---
function setupMapAutocomplete() {
    const mapInput = document.getElementById('mapSelect');
    const listDiv = document.getElementById('mapSelect-list');
    let currentFocus = -1;
    mapInput.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        listDiv.innerHTML = '';
        let matches = [];
        // Не дублируем выбранную карту
        const selected = [mapInput.value];
        const seen = new Set();
        (heroesData.maps || []).forEach(map => {
            const ru = window.mapNamesRu ? window.mapNamesRu[map] : '';
            const key = map.toLowerCase();
            if ((map.toLowerCase().includes(val) || (ru && ru.toLowerCase().includes(val))) && !selected.includes(map) && !seen.has(key)) {
                matches.push({eng: map, ru: ru});
                seen.add(key);
            }
        });
        if (matches.length === 0) {
            listDiv.innerHTML = '<div class="autocomplete-item">' + (window.currentLang === 'en' ? 'No matches' : 'Нет совпадений') + '</div>';
        } else {
            matches.forEach((m, idx) => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item' + (document.body.classList.contains('dark-theme') ? ' dark-theme' : '');
                let display = '';
                if (m.ru && m.ru !== m.eng) {
                    display = `<b style='color:#3498db;'>${m.ru}</b> <span style='color:#888;margin-left:6px;font-size:0.98em;opacity:0.7;'>${m.eng}</span>`;
                } else {
                    display = `<b style='color:#3498db;'>${m.eng}</b>`;
                }
                item.innerHTML = display;
                item.addEventListener('mousedown', function(e) {
                    let value = '';
                    value = m.ru || m.eng;
                    mapInput.value = value;
                    mapInput.setAttribute('data-map-eng', m.eng);
                    mapInput.setAttribute('data-map-ru', m.ru);
                    listDiv.classList.remove('show');
                    mapInput.blur();
                    mapInput.dispatchEvent(new Event('change'));
                });
                listDiv.appendChild(item);
            });
        }
        listDiv.classList.add('show');
        currentFocus = -1;
    });
    mapInput.addEventListener('focus', function() {
        this.dispatchEvent(new Event('input'));
    });
    mapInput.addEventListener('blur', function() {
        setTimeout(() => listDiv.classList.remove('show'), 150);
    });
    mapInput.addEventListener('keydown', function(e) {
        let items = listDiv.querySelectorAll('.autocomplete-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            setActive(items, currentFocus);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            setActive(items, currentFocus);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            if (currentFocus > -1) {
                items[currentFocus].dispatchEvent(new Event('mousedown'));
                e.preventDefault();
            }
        }
    });
    function setActive(items, idx) {
        items.forEach(i => i.classList.remove('selected'));
        if (items[idx]) items[idx].classList.add('selected');
    }
    // При смене языка обновлять отображение выбранной карты
    window.addEventListener('languageChanged', function() {
        const eng = mapInput.getAttribute('data-map-eng');
        const ru = mapInput.getAttribute('data-map-ru');
        if (eng) {
            let value = '';
            value = ru || eng;
            mapInput.value = value;
        }
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, загружены ли данные из database.js
    if (typeof window.heroesData !== 'undefined') {
        heroesData = window.heroesData;
    } else {
        // Если database.js не загружен, создаем базовые данные
        heroesData = {
            heroes: [
                "Abathur", "Anub'arak", "Arthas", "Blaze", "Cho", "Diablo", "E.T.C.", "Garrosh", "Johanna", "Mal'Ganis",
                "Medivh", "Muradin", "Stitches", "Tyrael", "Artanis", "Chen", "D.Va", "Dehaka", "Imperius", "Leoric",
                "Malthael", "Ragnaros", "Rexxar", "Sonya", "Thrall", "The Lost Vikings", "Varian", "Xul", "Yrel", "Zarya",
                "Azmodan", "Gazlowe", "Hogger", "Mei", "Cassia", "Chromie", "Falstad", "Fenix", "Gall", "Genji",
                "Greymane", "Gul'dan", "Hanzo", "Jaina", "Junkrat", "Kael'thas", "Kel'Thuzad", "Li-Ming", "Lunara", "Mephisto",
                "Nazeebo", "Nova", "Orphea", "Probius", "Raynor", "Sgt. Hammer", "Sylvanas", "Tassadar", "Tracer", "Tychus",
                "Valla", "Zagara", "Zul'jin", "Alarak", "Illidan", "Kerrigan", "Maiev", "Murky", "Qhira", "Samuro",
                "The Butcher", "Valeera", "Zeratul", "Alexstrasza", "Ana", "Anduin", "Auriel", "Brightwing", "Deckard Cain",
                "Kharazim", "Li Li", "Lt. Morales", "Lúcio", "Malfurion", "Rehgar", "Stukov", "Tyrande", "Uther", "Whitemane"
            ],
            maps: [
                "Alterac Pass", "Battlefield of Eternity", "Blackheart's Bay", "Braxis Holdout", "Cursed Hollow", 
                "Dragon Shire", "Garden of Terror", "Hanamura Temple", "Infernal Shrines", "Sky Temple", 
                "Tomb of the Spider Queen", "Towers of Doom", "Volskaya Foundry", "Warhead Junction"
            ],
            heroCategories: {
                tanks: ["Anub'arak", "Arthas", "Blaze", "Cho", "Diablo", "E.T.C.", "Garrosh", "Johanna", "Mal'Ganis"],
                healers: ["Alexstrasza", "Ana", "Anduin", "Auriel", "Brightwing", "Deckard Cain", "Kharazim", "Li Li"],
                damage: ["Abathur", "Alarak", "Azmodan", "Cassia", "Chromie", "Falstad", "Fenix", "Gall", "Genji"],
                specialists: ["Gazlowe", "Hogger", "Mei", "Murky", "Nazeebo", "Probius", "Qhira", "Samuro"]
            },
            synergies: {},
            counteredBy: {},
            bestMaps: {},
            metaTiers: {} // Добавляем поле для мета-уровней
        };
    }
    
    initializeSelects();
    initializeSearch();
    fillHeroDatalist();
    setupHeroAutocomplete();
    setupMapAutocomplete();
    fillHeroAndMapSelects();
});

// Инициализация выпадающих списков
function initializeSelects() {
    // Заполняем списки героев
    const heroSelects = document.querySelectorAll('select[id^="ally"], select[id^="enemy"]');
    heroSelects.forEach(select => {
        heroesData.heroes.forEach(hero => {
            const option = document.createElement('option');
            option.value = hero;
            option.textContent = hero;
            select.appendChild(option);
        });
    });

    // Заполняем список карт
    const mapSelect = document.getElementById('mapSelect');
    heroesData.maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map;
        option.textContent = map;
        mapSelect.appendChild(option);
    });
}

// Инициализация поиска в полях выбора
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const targetSelect = this.getAttribute('data-target');
            filterSelectOptions(targetSelect, searchTerm, this);
        });
        // Очистка поиска при фокусе
        input.addEventListener('focus', function() {
            this.select();
        });
    });
    // Сброс поиска при выборе героя/карты
    const selects = document.querySelectorAll('.pick-field select, .map-selector select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const input = select.parentElement.querySelector('.search-input') || select.closest('.map-selector')?.querySelector('.search-input');
            if (input) {
                input.value = '';
                filterSelectOptions(select.id, '', input);
            }
        });
    });
}

// Фильтрация опций в селекте
function filterSelectOptions(selectId, searchTerm, inputEl) {
    const select = document.getElementById(selectId);
    if (!select) return;
    let found = false;
    const options = select.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === '') return; // Пропускаем пустую опцию
        let engName = option.value.toLowerCase();
        let ruName = '';
        if (window.heroesData && window.heroesData.heroNamesRu) {
            ruName = (window.heroesData.heroNamesRu[option.value] || '').toLowerCase();
        }
        // Для карт ищем по русскому названию
        if (selectId === 'mapSelect') {
            const ruMap = (window.mapNamesRu && window.mapNamesRu[option.value]) ? window.mapNamesRu[option.value].toLowerCase() : '';
            if (
                searchTerm === '' ||
                engName.includes(searchTerm) ||
                (ruMap && ruMap.includes(searchTerm))
            ) {
                option.style.display = '';
                found = true;
            } else {
                option.style.display = 'none';
            }
        } else {
            // Поиск по английскому и русскому для героев
            if (
                searchTerm === '' ||
                engName.includes(searchTerm) ||
                (ruName && ruName.includes(searchTerm))
            ) {
                option.style.display = '';
                found = true;
            } else {
                option.style.display = 'none';
            }
        }
    });
    // Если не найдено совпадений, показываем сообщение
    let noMatchId = selectId + '_no_match';
    let noMatchOption = select.querySelector('#' + noMatchId);
    if (!found && searchTerm.length > 0) {
        if (!noMatchOption) {
            noMatchOption = document.createElement('option');
            noMatchOption.id = noMatchId;
            noMatchOption.disabled = true;
            noMatchOption.selected = true;
            noMatchOption.textContent = 'Нет совпадений';
            select.appendChild(noMatchOption);
        }
    } else if (noMatchOption) {
        select.removeChild(noMatchOption);
    }
}

// Заполнение select'ов героев и карт
function fillHeroAndMapSelects() {
    // Герои
    const heroSelects = document.querySelectorAll('.hero-select');
    heroSelects.forEach(select => {
        select.innerHTML = '<option value="">Выберите героя</option>';
        heroesData.heroes.forEach(hero => {
            const ru = heroesData.heroNamesRu ? heroesData.heroNamesRu[hero] : '';
            const option = document.createElement('option');
            option.value = hero;
            option.textContent = ru && ru !== hero ? `${ru} (${hero})` : hero;
            select.appendChild(option);
        });
    });
    // Карты
    const mapSelect = document.getElementById('mapSelect');
    if (mapSelect) {
        mapSelect.innerHTML = '<option value="">Выберите карту</option>';
        heroesData.maps.forEach(map => {
            const option = document.createElement('option');
            option.value = map;
            option.textContent = mapNamesRu[map] || map;
            mapSelect.appendChild(option);
        });
    }
}

// Основная функция анализа пиков
function analyzePicks() {
    const allies = getSelectedHeroes('ally');
    const enemies = getSelectedHeroes('enemy');
    const map = getSelectedMap();

    if (allies.length === 0 && enemies.length === 0 && !map) {
        showError('Пожалуйста, выберите хотя бы одного героя или карту');
        return;
    }

    showLoading();
    
    // Имитируем задержку для лучшего UX
    setTimeout(() => {
        const recommendations = calculateRecommendations(allies, enemies, map);
        showResults(recommendations);
    }, 1000);
}

// --- Переопределяем getSelectedHeroes для новых полей ---
function getSelectedHeroes(prefix) {
    const heroes = [];
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(prefix + i);
        if (input && input.value) {
            heroes.push(input.value);
        }
    }
    return heroes;
}
// --- getSelectedMap для autocomplete ---
function getSelectedMap() {
    const mapInput = document.getElementById('mapSelect');
    const val = mapInput && mapInput.value ? mapInput.value : '';
    // Проверяем, есть ли карта в списке (en/ru)
    if (!val) return '';
    const maps = heroesData.maps;
    for (let i = 0; i < maps.length; i++) {
        const eng = maps[i];
        const ru = window.mapNamesRu ? window.mapNamesRu[eng] : '';
        if (val === eng || val === ru) return eng;
    }
    return '';
}

// Расчет рекомендаций
function calculateRecommendations(allies, enemies, map) {
    const heroScores = {};
    
    // Проходим по всем героям
    heroesData.heroes.forEach(hero => {
        let score = 0;
        let reasons = [];

        // Проверяем синергии с союзниками
        allies.forEach(ally => {
            if (heroesData.synergies[ally] && heroesData.synergies[ally].includes(hero)) {
                score += 10;
                reasons.push(`Синергия с ${ally} (+10)`);
            }
        });

        // Проверяем контры противников
        enemies.forEach(enemy => {
            if (heroesData.counteredBy[enemy] && heroesData.counteredBy[enemy].includes(hero)) {
                score += 15;
                reasons.push(`Контрит ${enemy} (+15)`);
            }
        });

        // Проверяем лучшие карты
        if (map && heroesData.bestMaps[hero] && heroesData.bestMaps[hero].includes(map)) {
            score += 8;
            reasons.push(`Отлично подходит для карты ${map} (+8)`);
        }

        // Бонус за мету
        if (heroesData.metaTiers) {
            if (heroesData.metaTiers.S && heroesData.metaTiers.S.includes(hero)) {
                score += 10;
                reasons.push('Tier S мета (+10)');
            } else if (heroesData.metaTiers.A && heroesData.metaTiers.A.includes(hero)) {
                score += 5;
                reasons.push('Tier A мета (+5)');
            } else if (heroesData.metaTiers.B && heroesData.metaTiers.B.includes(hero)) {
                score += 3;
                reasons.push('Tier B мета (+3)');
            } else if (heroesData.metaTiers.C && heroesData.metaTiers.C.includes(hero)) {
                score += 1;
                reasons.push('Tier C мета (+1)');
            }
        }

        // Дополнительные бонусы
        if (allies.length > 0) {
            const synergyCount = allies.filter(ally => 
                heroesData.synergies[ally] && heroesData.synergies[ally].includes(hero)
            ).length;
            if (synergyCount >= 2) {
                score += 5;
                reasons.push(`Множественные синергии (${synergyCount}) (+5)`);
            }
        }

        if (enemies.length > 0) {
            const counterCount = enemies.filter(enemy => 
                heroesData.counteredBy[enemy] && heroesData.counteredBy[enemy].includes(hero)
            ).length;
            if (counterCount >= 2) {
                score += 8;
                reasons.push(`Множественные контры (${counterCount}) (+8)`);
            }
        }

        // Исключаем уже выбранных героев
        if (allies.includes(hero) || enemies.includes(hero)) {
            score = -1000;
        }

        if (score > 0) {
            heroScores[hero] = {
                score: score,
                reasons: reasons
            };
        }
    });

    // Сортируем по убыванию очков
    const sortedHeroes = Object.entries(heroScores)
        .sort(([,a], [,b]) => b.score - a.score);

    return sortedHeroes;
}

// Показать загрузку
function showLoading() {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.classList.add('show');
    
    // Показываем загрузку в каждой категории
    const categories = ['tanks', 'healers', 'damage', 'specialists'];
    categories.forEach(category => {
        const categoryList = document.getElementById(category + 'List');
        if (categoryList) {
            categoryList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner"></i>
                    <p>Анализируем...</p>
                </div>
            `;
        }
    });
}

// Показать результаты
function showResults(recommendations) {
    if (recommendations.length === 0) {
        // Показываем ошибку в каждой категории
        const categories = ['tanks', 'healers', 'damage', 'specialists'];
        categories.forEach(category => {
            const categoryList = document.getElementById(category + 'List');
            if (categoryList) {
                categoryList.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Не найдено подходящих героев</p>
                    </div>
                `;
            }
        });
        return;
    }
    
    // Показываем категории
    showCategories(recommendations);
}

// Показать категории героев
function showCategories(recommendations) {
    const categories = ['tanks', 'bruisers', 'healers', 'damage', 'specialists'];
    const categoryNames = {
        tanks: {en: 'TANKS', ru: 'Танки'},
        bruisers: {en: 'BRUISERS', ru: 'Брузеры'},
        healers: {en: 'HEALERS', ru: 'Хилеры'},
        damage: {en: 'DAMAGE', ru: 'ДД'},
        specialists: {en: 'SPECIALISTS', ru: 'Специалисты'}
    };
    // Определяем текущую тему
    const theme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
    categories.forEach(category => {
        const categoryList = document.getElementById(category + 'List');
        if (!categoryList) return;
        const categoryHeroes = heroesData.heroCategories[category] || [];
        let recommendedHeroes = recommendations
            .filter(([hero, data]) => categoryHeroes.includes(hero) && data.score > 0);
        recommendedHeroes = recommendedHeroes.slice(0, 5);
        let html = '';
        // Название категории только один раз, на языке пользователя
        const catName = window.currentLang === 'en' ? categoryNames[category].en : categoryNames[category].ru;
        if (recommendedHeroes.length > 0) {
            recommendedHeroes.forEach(([hero, data], index) => {
                const rankColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#4a90e2';
                const ru = heroesData.heroNamesRu ? heroesData.heroNamesRu[hero] : '';
                const heroDisplay = ru && ru !== hero ? `${ru} (${hero})` : hero;
                const scoreColor = theme === 'dark-theme' ? '#58a6ff' : '#238636';
                html += `
                    <div class="hero-card ${theme}">
                        <div class="hero-name ${theme}" style="font-size: 1.1em;">
                            <i class="fas fa-crown" style="color: ${rankColor}"></i>
                            ${heroDisplay}
                        </div>
                        <div class="hero-score ${theme}" style="font-size: 0.9em; color: ${scoreColor};">
                            Очки: ${data.score}
                        </div>
                        <div class="hero-reasons" style="font-size: 0.85em; color: #7f8c8d; margin-top: 5px;">
                            ${data.reasons && data.reasons.length > 0 ? `<strong>Пояснения:</strong><br><ul style='margin: 0 0 0 18px; padding: 0;'>${data.reasons.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            html = '<p style="color: #7f8c8d; font-style: italic; margin-bottom: 10px;">Нет подходящих героев</p>';
        }
        // Вставляем название категории только один раз
        categoryList.parentElement.querySelector('.category-title').innerHTML = `<span style="font-weight:bold;color:#58a6ff;"><i class="${categoryList.parentElement.querySelector('.category-title i').className}"></i> ${catName}</span>`;
        categoryList.innerHTML = html;
    });
}



// Показать ошибку
function showError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.add('show');
    // Показываем ошибку только один раз на всю секцию
    const categories = ['tanks', 'healers', 'damage', 'specialists'];
    categories.forEach(category => {
        const categoryList = document.getElementById(category + 'List');
        if (categoryList) {
            categoryList.innerHTML = `
                <div class="error" style="white-space: normal; word-break: break-word; max-width: 95%; margin: 0 auto;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p class="error-text" style="margin: 0; font-size: 1em;">${window.currentLang === 'en' ? 'Please select at least one hero or map' : 'Пожалуйста, выберите хотя бы одного героя или карту'}</p>
                </div>
            `;
        }
    });
}
 
// Автоматическое применение классов темы к основным элементам
function applyThemeClasses(theme) {
    const container = document.querySelector('.container');
    const header = document.querySelector('.header');
    const mainContent = document.querySelector('.main-content');
    const selects = document.querySelectorAll('select');
    const inputs = document.querySelectorAll('.search-input');
    const buttons = document.querySelectorAll('button');
    const categorySections = document.querySelectorAll('.category-section');
    const heroCards = document.querySelectorAll('.hero-card');
    const heroInputs = document.querySelectorAll('.hero-autocomplete');
    const autocompleteLists = document.querySelectorAll('.autocomplete-list');
    if (container) { container.classList.remove('light-theme', 'dark-theme'); container.classList.add(theme+'-theme'); }
    if (header) { header.classList.remove('light-theme', 'dark-theme'); header.classList.add(theme+'-theme'); }
    if (mainContent) { mainContent.classList.remove('light-theme', 'dark-theme'); mainContent.classList.add(theme+'-theme'); }
    selects.forEach(s => { s.classList.remove('light-theme', 'dark-theme'); s.classList.add(theme+'-theme'); });
    inputs.forEach(i => { i.classList.remove('light-theme', 'dark-theme'); i.classList.add(theme+'-theme'); });
    buttons.forEach(b => { b.classList.remove('light-theme', 'dark-theme'); b.classList.add(theme+'-theme'); });
    categorySections.forEach(cs => { cs.classList.remove('light-theme', 'dark-theme'); cs.classList.add(theme+'-theme'); });
    heroCards.forEach(hc => { hc.classList.remove('light-theme', 'dark-theme'); hc.classList.add(theme+'-theme'); });
    heroInputs.forEach(i => { i.classList.remove('light-theme', 'dark-theme'); i.classList.add(theme+'-theme'); });
    autocompleteLists.forEach(l => { l.classList.remove('light-theme', 'dark-theme'); l.classList.add(theme+'-theme'); });
}

// Исправленный setTheme и применение темы
window.setTheme = function(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme+'-theme');
    localStorage.setItem('theme', theme);
    // Кнопка
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i> <span id="theme-toggle-text">' + (window.currentLang === 'en' ? 'Light theme' : 'Светлая тема') + '</span>' : '<i class="fas fa-moon"></i> <span id="theme-toggle-text">' + (window.currentLang === 'en' ? 'Dark theme' : 'Тёмная тема') + '</span>';
    }
    // Применить классы
    if (typeof applyThemeClasses === 'function') applyThemeClasses(theme);
    // Обновить язык UI (чтобы текст кнопки темы был актуальным)
    if (typeof updateLangUI === 'function') updateLangUI();
};

// --- Язык интерфейса ---
window.currentLang = localStorage.getItem('lang') || 'ru';
window.setLang = function(lang) {
    window.currentLang = lang;
    localStorage.setItem('lang', lang);
    updateLangUI();
};
function updateLangUI() {
    // Переводим основные элементы интерфейса
    document.querySelector('.header h1').innerHTML = window.currentLang === 'en' ? '<i class="fas fa-gamepad"></i> Heroes of the Storm' : '<i class="fas fa-gamepad"></i> Heroes of the Storm';
    document.querySelector('.header p').textContent = window.currentLang === 'en' ? 'Hero picks analyzer' : 'Анализатор пиков героев';
    document.getElementById('theme-toggle-text').textContent = window.currentLang === 'en' ? (document.body.classList.contains('dark-theme') ? 'Light theme' : 'Dark theme') : (document.body.classList.contains('dark-theme') ? 'Светлая тема' : 'Тёмная тема');
    const donateBtn = document.querySelector('.donate-btn');
    if (donateBtn) donateBtn.innerHTML = `<i class="fas fa-donate"></i> ${window.currentLang === 'en' ? 'Support project' : 'Поддержать проект'}`;
    // Поля
    const allyLabels = ['Ally 1','Ally 2','Ally 3','Ally 4','Ally 5'];
    const enemyLabels = ['Enemy 1','Enemy 2','Enemy 3','Enemy 4','Enemy 5'];
    document.querySelectorAll('.pick-field label').forEach((el, idx) => {
        if (idx < 5) el.textContent = window.currentLang === 'en' ? allyLabels[idx] : `Союзник ${idx+1}`;
        else el.textContent = window.currentLang === 'en' ? enemyLabels[idx-5] : `Противник ${idx-4}`;
    });
    // Map
    document.querySelector('.section-title i.fa-map').nextSibling.textContent = window.currentLang === 'en' ? ' Map' : ' Карта';
    // Кнопка анализа
    document.querySelector('.analyze-btn').innerHTML = `<i class="fas fa-search"></i> ${window.currentLang === 'en' ? 'Analyze picks' : 'Анализировать пики'}`;
    // Категории
    const cats = [
        {id:'tanksList',en:'TANKS',ru:'Танки'},
        {id:'bruisersList',en:'BRUISERS',ru:'Брузеры'},
        {id:'healersList',en:'HEALERS',ru:'Хилеры'},
        {id:'damageList',en:'DAMAGE',ru:'ДД'},
        {id:'specialistsList',en:'SPECIALISTS',ru:'Специалисты'}
    ];
    document.querySelectorAll('.category-title').forEach((el, idx) => {
        const icon = el.querySelector('i') ? el.querySelector('i').outerHTML : '';
        el.innerHTML = `${icon} <span>${window.currentLang === 'en' ? cats[idx].en : cats[idx].ru}</span>`;
    });
    // Autocomplete placeholders
    document.querySelectorAll('.hero-autocomplete').forEach(el => {
        el.placeholder = window.currentLang === 'en' ? 'Select or search hero...' : 'Выберите или найдите героя...';
    });
    // Map autocomplete placeholder
    const mapInput = document.getElementById('mapSelect');
    if (mapInput) mapInput.placeholder = window.currentLang === 'en' ? 'Select or search map...' : 'Выберите или найдите карту...';
    // Обновить отображение выбранной карты при смене языка
    if (mapInput && mapInput.value) {
        const eng = mapInput.getAttribute('data-map-eng');
        const ru = mapInput.getAttribute('data-map-ru');
        if (eng) {
            let display = '';
            if (window.currentLang === 'en') {
                display = eng;
            } else {
                display = ru || eng;
            }
            mapInput.value = display;
        }
    }
    // Очистить поле карты при смене языка, если не выбрано
    if (mapInput && !mapInput.value) mapInput.value = '';
    // Кнопка языка
    const langBtn = document.getElementById('lang-btn-text');
    if (langBtn) langBtn.textContent = window.currentLang === 'en' ? 'EN' : 'RU';
    // Обновить текст ошибки, если он есть
    document.querySelectorAll('.error-text').forEach(el => {
        el.textContent = window.currentLang === 'en' ? 'Please select at least one hero or map' : 'Пожалуйста, выберите хотя бы одного героя или карту';
    });
    // Кнопка смены темы
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const isDark = document.body.classList.contains('dark-theme');
        themeBtn.innerHTML = isDark
            ? '<i class="fas fa-sun"></i> <span id="theme-toggle-text">' + (window.currentLang === 'en' ? 'Light theme' : 'Светлая тема') + '</span>'
            : '<i class="fas fa-moon"></i> <span id="theme-toggle-text">' + (window.currentLang === 'en' ? 'Dark theme' : 'Тёмная тема') + '</span>';
    }
    // Автор
    const author = document.querySelector('.author-signature');
    if (author) author.textContent = window.currentLang === 'en' ? 'Author: waanori | Discord: waanori' : 'Автор: waanori | Discord: waanori';
    // Триггер кастомного события для обновления карты
    window.dispatchEvent(new Event('languageChanged'));
}
window.addEventListener('DOMContentLoaded', function() {
    updateLangUI();
    // Исправить: назначить обработчик для theme-toggle
    let theme = localStorage.getItem('theme') || 'light';
    window.setTheme(theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.onclick = function() {
            theme = (theme === 'dark') ? 'light' : 'dark';
            window.setTheme(theme);
        };
    }
});
// --- END ---
 