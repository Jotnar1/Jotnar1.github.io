import { MAP_NAMES_RU } from '../data/mapNames.js';
import { t } from './i18n.js';

export function setupHeroAutocomplete(heroesData, lang = 'ru') {
    const heroInputs = document.querySelectorAll('.hero-autocomplete');
    heroInputs.forEach((input) => {
        const listDiv = document.getElementById(`${input.id}-list`);
        if (!listDiv) {
            return;
        }
        let currentFocus = -1;

        const renderList = () => {
            const val = input.value.toLowerCase();
            listDiv.innerHTML = '';
            const allInputs = Array.from(document.querySelectorAll('.hero-autocomplete'));
            const selected = allInputs.filter((i) => i !== input).map((i) => i.value);
            const seen = new Set();
            const matches = [];

            heroesData.heroes.forEach((hero) => {
                const ru = heroesData.heroNamesRu?.[hero] || '';
                const key = hero.toLowerCase();
                if (
                    (hero.toLowerCase().includes(val) || (ru && ru.toLowerCase().includes(val))) &&
                    !selected.includes(hero) &&
                    !seen.has(key)
                ) {
                    matches.push({ eng: hero, ru });
                    seen.add(key);
                }
            });

            if (matches.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'autocomplete-item';
                empty.textContent = t('noMatches', lang);
                listDiv.appendChild(empty);
            } else {
                matches.forEach((h) => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    const display = lang === 'en' ? h.eng : (h.ru || h.eng);
                    item.innerHTML = `<strong>${display}</strong> <span class="autocomplete-sub">${h.eng}</span>`;
                    item.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        input.value = h.eng;
                        listDiv.classList.remove('show');
                        input.dispatchEvent(new Event('change'));
                        input.blur();
                    });
                    listDiv.appendChild(item);
                });
            }
            listDiv.classList.add('show');
            currentFocus = -1;
        };

        input.addEventListener('input', renderList);
        input.addEventListener('focus', renderList);
        input.addEventListener('blur', () => setTimeout(() => listDiv.classList.remove('show'), 150));
        input.addEventListener('keydown', (e) => {
            const items = listDiv.querySelectorAll('.autocomplete-item');
            if (!items.length) {
                return;
            }
            if (e.key === 'ArrowDown') {
                currentFocus = (currentFocus + 1) % items.length;
                setActive(items, currentFocus);
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                currentFocus = currentFocus <= 0 ? items.length - 1 : currentFocus - 1;
                setActive(items, currentFocus);
                e.preventDefault();
            } else if (e.key === 'Enter' && currentFocus > -1) {
                items[currentFocus].dispatchEvent(new Event('mousedown'));
                e.preventDefault();
            }
        });
    });
}

export function setupMapAutocomplete(heroesData, lang = 'ru') {
    const mapInput = document.getElementById('mapSelect');
    const listDiv = document.getElementById('mapSelect-list');
    if (!mapInput || !listDiv) {
        return;
    }

    let currentFocus = -1;

    const renderList = () => {
        const val = mapInput.value.toLowerCase();
        listDiv.innerHTML = '';
        const matches = [];

        (heroesData.maps || []).forEach((map) => {
            const ru = MAP_NAMES_RU[map] || '';
            if (map.toLowerCase().includes(val) || (ru && ru.toLowerCase().includes(val))) {
                matches.push({ eng: map, ru });
            }
        });

        if (matches.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'autocomplete-item';
            empty.textContent = t('noMatches', lang);
            listDiv.appendChild(empty);
        } else {
            matches.forEach((m) => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                const display = lang === 'en' ? m.eng : (m.ru || m.eng);
                item.innerHTML = `<strong>${display}</strong>`;
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    mapInput.value = lang === 'en' ? m.eng : (m.ru || m.eng);
                    mapInput.dataset.mapEng = m.eng;
                    mapInput.dataset.mapRu = m.ru || '';
                    listDiv.classList.remove('show');
                    mapInput.blur();
                });
                listDiv.appendChild(item);
            });
        }
        listDiv.classList.add('show');
        currentFocus = -1;
    };

    mapInput.addEventListener('input', renderList);
    mapInput.addEventListener('focus', renderList);
    mapInput.addEventListener('blur', () => setTimeout(() => listDiv.classList.remove('show'), 150));
    mapInput.addEventListener('keydown', (e) => {
        const items = listDiv.querySelectorAll('.autocomplete-item');
        if (!items.length) {
            return;
        }
        if (e.key === 'ArrowDown') {
            currentFocus = (currentFocus + 1) % items.length;
            setActive(items, currentFocus);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            currentFocus = currentFocus <= 0 ? items.length - 1 : currentFocus - 1;
            setActive(items, currentFocus);
            e.preventDefault();
        } else if (e.key === 'Enter' && currentFocus > -1) {
            items[currentFocus].dispatchEvent(new Event('mousedown'));
            e.preventDefault();
        }
    });
}

function setActive(items, idx) {
    items.forEach((i) => i.classList.remove('selected'));
    if (items[idx]) {
        items[idx].classList.add('selected');
    }
}
