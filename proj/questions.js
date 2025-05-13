const levelQuestions = [
    {
        question: "What is the meaning of 'abundant'?",
        options: ["Rare", "Plentiful", "Scarce", "Limited"],
        correct: 1
    },
    {
        question: "Choose the correct word: 'She ___ to the store yesterday.'",
        options: ["go", "goes", "went", "gone"],
        correct: 2
    },
    {
        question: "What's the opposite of 'generous'?",
        options: ["Kind", "Stingy", "Wealthy", "Giving"],
        correct: 1
    },
    {
        question: "Which word means 'to make something better'?",
        options: ["Improve", "Decline", "Remain", "Worsen"],
        correct: 0
    },
    {
        question: "What's the meaning of 'endeavor'?",
        options: ["To give up", "To try hard", "To sleep", "To eat"],
        correct: 1
    },
    {
        question: "Choose the correct form: 'They ___ studying for hours.'",
        options: ["has been", "have been", "is", "are"],
        correct: 1
    },
    {
        question: "What's a synonym for 'beautiful'?",
        options: ["Ugly", "Plain", "Gorgeous", "Simple"],
        correct: 2
    },
    {
        question: "Which word means 'to happen'?",
        options: ["Occur", "Prevent", "Stop", "Avoid"],
        correct: 0
    },
    {
        question: "What's the past tense of 'bring'?",
        options: ["Brang", "Brought", "Bringed", "Bringen"],
        correct: 1
    },
    {
        question: "Choose the correct word: 'She's ___ tired today.'",
        options: ["very", "much", "many", "lot"],
        correct: 0
    },
    {
        question: "What does 'anticipate' mean?",
        options: ["To forget", "To expect", "To ignore", "To deny"],
        correct: 1
    },
    {
        question: "Which is a correct sentence?",
        options: ["I am go home", "I going home", "I am going home", "I goes home"],
        correct: 2
    },
    {
        question: "What's the meaning of 'crucial'?",
        options: ["Unimportant", "Optional", "Very important", "Easy"],
        correct: 2
    },
    {
        question: "Choose the correct word: 'He ___ tennis every Sunday.'",
        options: ["play", "plays", "playing", "played"],
        correct: 1
    },
    {
        question: "What's the opposite of 'ancient'?",
        options: ["Modern", "Old", "Aged", "Traditional"],
        correct: 0
    },
    {
        question: "Which word means 'to look at'?",
        options: ["Listen", "Touch", "Observe", "Smell"],
        correct: 2
    },
    {
        question: "What's the plural of 'child'?",
        options: ["Childs", "Children", "Childes", "Childred"],
        correct: 1
    },
    {
        question: "Choose the correct phrase: 'I'm looking ___ my keys.'",
        options: ["at", "for", "to", "in"],
        correct: 1
    },
    {
        question: "What does 'reluctant' mean?",
        options: ["Eager", "Unwilling", "Ready", "Prepared"],
        correct: 1
    },
    {
        question: "Which is correct: 'She ___ here since morning.'",
        options: ["is", "are", "has been", "have been"],
        correct: 2
    },
    {
        question: "What's a synonym for 'happy'?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correct: 1
    },
    {
        question: "Choose the correct word: '___ you like some tea?'",
        options: ["Would", "Will", "Does", "Do"],
        correct: 0
    },
    {
        question: "What's the meaning of 'vast'?",
        options: ["Tiny", "Small", "Huge", "Medium"],
        correct: 2
    },
    {
        question: "Which word is a verb?",
        options: ["Beautiful", "Quick", "Run", "Happy"],
        correct: 2
    },
    {
        question: "What's the opposite of 'victory'?",
        options: ["Win", "Success", "Defeat", "Triumph"],
        correct: 2
    }
];

const practiceQuestions = [
    {
        question: "What does 'acquire' mean?",
        options: ["To sell", "To obtain", "To lose", "To break"],
        correct: 1
    },
    {
        question: "Choose the correct word: 'She ___ a doctor.'",
        options: ["am", "is", "are", "be"],
        correct: 1
    },
    {
        question: "What's the meaning of 'diverse'?",
        options: ["Same", "Similar", "Varied", "Equal"],
        correct: 2
    },
    {
        question: "Which is the correct spelling?",
        options: ["Recieve", "Receive", "Receeve", "Receve"],
        correct: 1
    },
    {
        question: "What's a synonym for 'begin'?",
        options: ["End", "Finish", "Start", "Stop"],
        correct: 2
    },
    // Добавьте больше вопросов здесь для практики
];

// Функция для получения случайного вопроса из практики
function getRandomPracticeQuestion() {
    return practiceQuestions[Math.floor(Math.random() * practiceQuestions.length)];
}

// Функция для перемешивания массива вопросов
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
} 