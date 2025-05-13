const flashcards = [
    {
        word: "Accomplish",
        translation: "Достигать, выполнять"
    },
    {
        word: "Determine",
        translation: "Определять"
    },
    {
        word: "Enhance",
        translation: "Улучшать, усиливать"
    },
    {
        word: "Facilitate",
        translation: "Способствовать"
    },
    {
        word: "Generate",
        translation: "Производить, создавать"
    },
    {
        word: "Implement",
        translation: "Реализовывать"
    },
    {
        word: "Maintain",
        translation: "Поддерживать"
    },
    {
        word: "Obtain",
        translation: "Получать"
    },
    {
        word: "Perceive",
        translation: "Воспринимать"
    },
    {
        word: "Resolve",
        translation: "Решать, разрешать"
    }
];

let currentCardIndex = 0;
let isFlipped = false;

function startFlashcards() {
    showSection('flashcards');
    currentCardIndex = 0;
    isFlipped = false;
    updateCard();
}

function updateCard() {
    const card = flashcards[currentCardIndex];
    document.getElementById('wordFront').textContent = card.word;
    document.getElementById('wordBack').textContent = card.translation;
    
    const flashcard = document.querySelector('.flashcard');
    flashcard.classList.remove('flipped');
    isFlipped = false;
}

document.getElementById('prevCard').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    updateCard();
});

document.getElementById('nextCard').addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    updateCard();
});

document.getElementById('flipCard').addEventListener('click', () => {
    const flashcard = document.querySelector('.flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
});

// Также можно переворачивать карточку кликом по ней
document.querySelector('.flashcard').addEventListener('click', () => {
    const flashcard = document.querySelector('.flashcard');
    flashcard.classList.toggle('flipped');
    isFlipped = !isFlipped;
}); 