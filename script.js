// Основной скрипт для анализа пиков героев
let heroesData;

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
            bestMaps: {}
        };
    }
    
    initializeSelects();
    initializeSearch();
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
            filterSelectOptions(targetSelect, searchTerm);
        });
        
        // Очистка поиска при фокусе
        input.addEventListener('focus', function() {
            this.select();
        });
    });
}

// Фильтрация опций в селекте
function filterSelectOptions(selectId, searchTerm) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const options = select.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === '') return; // Пропускаем пустую опцию
        
        const heroName = option.textContent.toLowerCase();
        if (searchTerm === '' || heroName.includes(searchTerm)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
}

// Основная функция анализа пиков
function analyzePicks() {
    const allies = getSelectedHeroes('ally');
    const enemies = getSelectedHeroes('enemy');
    const map = document.getElementById('mapSelect').value;

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
                reasons.push(`Синергия с ${ally}`);
            }
        });

        // Проверяем контры противников
        enemies.forEach(enemy => {
            if (heroesData.counteredBy[enemy] && heroesData.counteredBy[enemy].includes(hero)) {
                score += 15;
                reasons.push(`Контрит ${enemy}`);
            }
        });

        // Проверяем лучшие карты
        if (map && heroesData.bestMaps[hero] && heroesData.bestMaps[hero].includes(map)) {
            score += 8;
            reasons.push(`Отлично подходит для карты ${map}`);
        }

        // Дополнительные бонусы
        if (allies.length > 0) {
            const synergyCount = allies.filter(ally => 
                heroesData.synergies[ally] && heroesData.synergies[ally].includes(hero)
            ).length;
            if (synergyCount >= 2) {
                score += 5;
                reasons.push(`Множественные синергии (${synergyCount})`);
            }
        }

        if (enemies.length > 0) {
            const counterCount = enemies.filter(enemy => 
                heroesData.counteredBy[enemy] && heroesData.counteredBy[enemy].includes(hero)
            ).length;
            if (counterCount >= 2) {
                score += 8;
                reasons.push(`Множественные контры (${counterCount})`);
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
    const categories = ['tanks', 'healers', 'damage', 'specialists'];
    const categoryNames = {
        tanks: 'Танки',
        healers: 'Хилеры', 
        damage: 'ДД',
        specialists: 'Специалисты'
    };
    
    categories.forEach(category => {
        const categoryList = document.getElementById(category + 'List');
        if (!categoryList) return;
        
        const categoryHeroes = heroesData.heroCategories[category] || [];
        const recommendedHeroes = recommendations
            .filter(([hero]) => categoryHeroes.includes(hero))
            .slice(0, 5); // Показываем до 5 героев в каждой категории
        
        let html = '';
        if (recommendedHeroes.length > 0) {
            recommendedHeroes.forEach(([hero, data], index) => {
                const rankColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#4a90e2';
                html += `
                    <div class="hero-card" style="margin-bottom: 10px;">
                        <div class="hero-name" style="font-size: 1.1em;">
                            <i class="fas fa-crown" style="color: ${rankColor}"></i>
                            ${hero}
                        </div>
                        <div class="hero-score" style="font-size: 0.9em;">
                            Очки: ${data.score}
                        </div>
                        <div class="hero-reasons" style="font-size: 0.8em; color: #7f8c8d; margin-top: 5px;">
                            ${data.reasons.slice(0, 2).join(', ')}
                        </div>
                    </div>
                `;
            });
        } else {
            // Если нет рекомендаций в категории, показываем топ-5 героев из этой категории
            const topCategoryHeroes = categoryHeroes.slice(0, 5);
            html = '<p style="color: #7f8c8d; font-style: italic; margin-bottom: 10px;">Топ героев в категории:</p>';
            topCategoryHeroes.forEach((hero, index) => {
                const rankColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#4a90e2';
                html += `
                    <div class="hero-card" style="margin-bottom: 10px; opacity: 0.7;">
                        <div class="hero-name" style="font-size: 1.1em;">
                            <i class="fas fa-star" style="color: ${rankColor}"></i>
                            ${hero}
                        </div>
                        <div class="hero-score" style="font-size: 0.9em;">
                            Базовый герой
                        </div>
                    </div>
                `;
            });
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
 