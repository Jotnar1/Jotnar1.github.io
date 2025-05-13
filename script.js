// Глобальные переменные
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let isLevelTest = false;

// DOM элементы
const welcomeSection = document.getElementById('welcome');
const quizSection = document.getElementById('quiz');
const finalResultSection = document.getElementById('finalResult');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');
const nextButton = document.getElementById('nextBtn');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const resultContentElement = document.getElementById('resultContent');

// Инициализация кнопок навигации
document.getElementById('levelTestBtn').addEventListener('click', startLevelTest);
document.getElementById('practiceBtn').addEventListener('click', startPractice);
document.getElementById('flashcardsBtn').addEventListener('click', startFlashcards);
document.getElementById('grammarBtn').addEventListener('click', showGrammar);
document.getElementById('sentenceGameBtn').addEventListener('click', startSentenceGame);
nextButton.addEventListener('click', showNextQuestion);

// Функция начала теста на определение уровня
function startLevelTest() {
    isLevelTest = true;
    currentQuestions = shuffleQuestions([...levelQuestions]);
    startQuiz();
}

// Функция начала практики
function startPractice() {
    isLevelTest = false;
    currentQuestions = [getRandomPracticeQuestion()];
    startQuiz();
}

// Общая функция запуска квиза
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showSection('quiz');
    updateProgress();
    showQuestion();
}

// Показать текущий вопрос
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsElement.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsElement.appendChild(button);
    });

    resultElement.className = 'hidden';
    nextButton.className = 'hidden';
}

// Проверка ответа
function checkAnswer(selectedIndex) {
    const question = currentQuestions[currentQuestionIndex];
    const options = optionsElement.getElementsByClassName('option');
    
    // Отключаем все кнопки
    Array.from(options).forEach(button => {
        button.disabled = true;
    });

    // Показываем правильный и неправильный ответы
    options[question.correct].classList.add('correct');
    if (selectedIndex !== question.correct) {
        options[selectedIndex].classList.add('wrong');
    } else {
        score++;
    }

    // Показываем результат и кнопку "Далее"
    resultElement.className = '';
    resultElement.textContent = selectedIndex === question.correct ? 'Правильно!' : 'Неправильно!';
    nextButton.className = '';
}

// Показать следующий вопрос
function showNextQuestion() {
    currentQuestionIndex++;
    
    if (isLevelTest && currentQuestionIndex >= levelQuestions.length) {
        showFinalResult();
    } else if (!isLevelTest) {
        // В режиме практики добавляем новый случайный вопрос
        currentQuestions = [getRandomPracticeQuestion()];
        currentQuestionIndex = 0;
        showQuestion();
        updateProgress();
    } else {
        showQuestion();
        updateProgress();
    }
}

// Обновление прогресса
function updateProgress() {
    if (isLevelTest) {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        totalQuestionsSpan.textContent = levelQuestions.length;
    } else {
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        totalQuestionsSpan.textContent = '∞';
    }
}

// Показать финальный результат
function showFinalResult() {
    showSection('finalResult');
    
    if (isLevelTest) {
        const percentage = (score / levelQuestions.length) * 100;
        let level = '';
        
        if (percentage >= 80) {
            level = 'Advanced (C1-C2)';
        } else if (percentage >= 60) {
            level = 'Upper-Intermediate (B2)';
        } else if (percentage >= 40) {
            level = 'Intermediate (B1)';
        } else if (percentage >= 20) {
            level = 'Pre-Intermediate (A2)';
        } else {
            level = 'Beginner (A1)';
        }

        resultContentElement.innerHTML = `
            <p>Ваш результат: ${score} из ${levelQuestions.length} (${Math.round(percentage)}%)</p>
            <p>Ваш примерный уровень: ${level}</p>
        `;
    }
}

// Вернуться на главную
function returnToMain() {
    showSection('welcome');
}

// Функция переключения секций
function showSection(sectionId) {
    const sections = ['welcome', 'quiz', 'finalResult', 'flashcards', 'grammar', 'sentenceGame'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.className = 'section' + (section === sectionId ? ' active' : ' hidden');
        }
    });
} 