const sentences = [
    {
        words: ["I", "am", "learning", "English", "now"],
        correct: "I am learning English now"
    },
    {
        words: ["She", "likes", "to", "read", "books"],
        correct: "She likes to read books"
    },
    {
        words: ["They", "went", "to", "the", "park", "yesterday"],
        correct: "They went to the park yesterday"
    },
    {
        words: ["He", "is", "playing", "football", "with", "friends"],
        correct: "He is playing football with friends"
    },
    {
        words: ["We", "will", "visit", "London", "next", "summer"],
        correct: "We will visit London next summer"
    }
];

let currentSentence;
let selectedWords = [];

function startSentenceGame() {
    showSection('sentenceGame');
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    selectedWords = [];
    displayGame();
}

function displayGame() {
    // Показываем слова в банке слов
    const wordBank = document.getElementById('wordBank');
    wordBank.innerHTML = '';
    
    const shuffledWords = [...currentSentence.words].sort(() => Math.random() - 0.5);
    shuffledWords.forEach(word => {
        if (!selectedWords.includes(word)) {
            const wordElement = document.createElement('span');
            wordElement.className = 'word-item';
            wordElement.textContent = word;
            wordElement.onclick = () => selectWord(word);
            wordBank.appendChild(wordElement);
        }
    });

    // Показываем выбранные слова
    const constructedSentence = document.getElementById('constructedSentence');
    constructedSentence.innerHTML = selectedWords.join(' ');
}

function selectWord(word) {
    selectedWords.push(word);
    displayGame();
    
    if (selectedWords.length === currentSentence.words.length) {
        checkSentence();
    }
}

function checkSentence() {
    const constructedSentence = selectedWords.join(' ');
    const isCorrect = constructedSentence === currentSentence.correct;
    
    const result = document.createElement('div');
    result.className = isCorrect ? 'correct' : 'wrong';
    result.textContent = isCorrect ? 'Правильно!' : 'Попробуйте еще раз';
    
    document.getElementById('constructedSentence').appendChild(result);
    
    if (!isCorrect) {
        setTimeout(() => {
            selectedWords = [];
            displayGame();
        }, 2000);
    } else {
        setTimeout(() => {
            currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
            selectedWords = [];
            displayGame();
        }, 2000);
    }
}

document.getElementById('checkSentence').addEventListener('click', () => {
    if (selectedWords.length > 0) {
        checkSentence();
    }
}); 