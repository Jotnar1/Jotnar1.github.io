const grammarTopics = {
    'present-simple': {
        title: 'Present Simple',
        content: `
            <h3>Present Simple (Настоящее простое время)</h3>
            <p>Используется для описания:</p>
            <ul>
                <li>Регулярных действий: I play tennis every Sunday</li>
                <li>Фактов: The Sun rises in the east</li>
                <li>Привычек: She drinks coffee in the morning</li>
            </ul>
            <h4>Формирование:</h4>
            <ul>
                <li>I/You/We/They + глагол</li>
                <li>He/She/It + глагол + s</li>
            </ul>
            <h4>Примеры:</h4>
            <ul>
                <li>I work → He works</li>
                <li>They play → She plays</li>
                <li>We study → It studies</li>
            </ul>
        `
    },
    'past-simple': {
        title: 'Past Simple',
        content: `
            <h3>Past Simple (Прошедшее простое время)</h3>
            <p>Используется для описания:</p>
            <ul>
                <li>Действий в прошлом: I visited Paris last year</li>
                <li>Последовательности событий: He came home, had dinner and went to bed</li>
                <li>Привычек в прошлом: She always walked to school</li>
            </ul>
            <h4>Формирование:</h4>
            <ul>
                <li>Правильные глаголы: + ed (play → played)</li>
                <li>Неправильные глаголы: особая форма (go → went)</li>
            </ul>
            <h4>Примеры:</h4>
            <ul>
                <li>Work → Worked</li>
                <li>Study → Studied</li>
                <li>Go → Went</li>
                <li>Take → Took</li>
            </ul>
        `
    },
    'future-simple': {
        title: 'Future Simple',
        content: `
            <h3>Future Simple (Будущее простое время)</h3>
            <p>Используется для описания:</p>
            <ul>
                <li>Предсказаний: It will rain tomorrow</li>
                <li>Спонтанных решений: I'll help you with that</li>
                <li>Обещаний: I will always love you</li>
            </ul>
            <h4>Формирование:</h4>
            <ul>
                <li>will + глагол</li>
                <li>going to + глагол (для запланированных действий)</li>
            </ul>
            <h4>Примеры:</h4>
            <ul>
                <li>I will work</li>
                <li>She will study</li>
                <li>They are going to play</li>
            </ul>
        `
    }
};

function showGrammar() {
    showSection('grammar');
    document.getElementById('grammarContent').className = 'grammar-content hidden';
}

function showGrammarTopic(topicId) {
    const content = document.getElementById('grammarContent');
    content.innerHTML = grammarTopics[topicId].content;
    content.className = 'grammar-content';
} 