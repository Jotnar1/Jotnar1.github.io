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

// Кастомный автокомплит для hero-picker
function setupAutocomplete() {
    const allInputs = document.querySelectorAll('.hero-picker');
    allInputs.forEach(input => {
        const listId = input.id + '-list';
        const listDiv = document.getElementById(listId);
        let currentFocus = -1;

        input.addEventListener('input', function() {
            const val = this.value.toLowerCase();
            listDiv.innerHTML = '';
            let matches = [];
            heroesData.heroes.forEach(hero => {
                const ru = heroesData.heroNamesRu ? heroesData.heroNamesRu[hero] : '';
                if (
                    hero.toLowerCase().includes(val) ||
                    (ru && ru.toLowerCase().includes(val))
                ) {
                    matches.push({eng: hero, ru: ru});
                }
            });
            if (matches.length === 0) {
                listDiv.innerHTML = '<div class="autocomplete-item">Нет совпадений</div>';
            } else {
                matches.forEach((h, idx) => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.innerHTML = `<b>${h.ru || h.eng}</b> <span style='color:#aaa;font-size:0.9em;'>${h.eng}</span>`;
                    item.addEventListener('mousedown', function(e) {
                        input.value = h.eng;
                        listDiv.classList.remove('show');
                        input.blur();
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
    setupAutocomplete();
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
    // Сброс поиска при выборе героя
    const selects = document.querySelectorAll('.pick-field select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const input = select.parentElement.querySelector('.search-input');
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
        const engName = option.value.toLowerCase();
        let ruName = '';
        if (window.heroesData && window.heroesData.heroNamesRu) {
            ruName = (window.heroesData.heroNamesRu[option.value] || '').toLowerCase();
        }
        // Поиск по английскому и русскому
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

// Получение выбранных героев
function getSelectedHeroes(prefix) {
    const heroes = [];
    for (let i = 1; i <= 5; i++) {
        const select = document.getElementById(prefix + i);
        if (select && select.value) {
            heroes.push(select.value);
        }
    }
    return heroes;
}
// Получение выбранной карты
function getSelectedMap() {
    const mapSelect = document.getElementById('mapSelect');
    return mapSelect && mapSelect.value ? mapSelect.value : '';
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
        tanks: 'Танки',
        bruisers: 'Брузеры',
        healers: 'Хилеры', 
        damage: 'ДД',
        specialists: 'Специалисты'
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
        categoryList.innerHTML = html;
    });
}



// Показать ошибку
function showError(message) {
    const resultsDiv = document.getElementById('results');
    
    resultsDiv.classList.add('show');
    
    // Показываем ошибку в каждой категории
    const categories = ['tanks', 'healers', 'damage', 'specialists'];
    categories.forEach(category => {
        const categoryList = document.getElementById(category + 'List');
        if (categoryList) {
            categoryList.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
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
    if (container) { container.classList.remove('light-theme', 'dark-theme'); container.classList.add(theme+'-theme'); }
    if (header) { header.classList.remove('light-theme', 'dark-theme'); header.classList.add(theme+'-theme'); }
    if (mainContent) { mainContent.classList.remove('light-theme', 'dark-theme'); mainContent.classList.add(theme+'-theme'); }
    selects.forEach(s => { s.classList.remove('light-theme', 'dark-theme'); s.classList.add(theme+'-theme'); });
    inputs.forEach(i => { i.classList.remove('light-theme', 'dark-theme'); i.classList.add(theme+'-theme'); });
    buttons.forEach(b => { b.classList.remove('light-theme', 'dark-theme'); b.classList.add(theme+'-theme'); });
    categorySections.forEach(cs => { cs.classList.remove('light-theme', 'dark-theme'); cs.classList.add(theme+'-theme'); });
    heroCards.forEach(hc => { hc.classList.remove('light-theme', 'dark-theme'); hc.classList.add(theme+'-theme'); });
}

// Исправленный setTheme и применение темы
window.setTheme = function(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme+'-theme');
    localStorage.setItem('theme', theme);
    // Кнопка
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i> <span id="theme-toggle-text">Светлая тема</span>' : '<i class="fas fa-moon"></i> <span id="theme-toggle-text">Тёмная тема</span>';
    }
    // Применить классы
    if (typeof applyThemeClasses === 'function') applyThemeClasses(theme);
};

window.addEventListener('DOMContentLoaded', function() {
    let theme = localStorage.getItem('theme') || 'light';
    setTheme(theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.onclick = function() {
            theme = (theme === 'dark') ? 'light' : 'dark';
            setTheme(theme);
        };
    }
});
 