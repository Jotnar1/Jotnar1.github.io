const quizData = {
  levelTest: [
    { question: "What does 'abandon' mean?", options: ["leave", "arrive", "build", "repair"], answer: "leave" },
    // ...добавь ещё 24 вопроса
  ],
  practice: [
    { question: "Choose the synonym of 'happy'", options: ["sad", "joyful", "angry", "tired"], answer: "joyful" },
    // ...добавь больше слов
  ]
};

let currentMode = null;
let currentIndex = 0;
let score = 0;

function startLevelTest() {
  currentMode = "levelTest";
  currentIndex = 0;
  score = 0;
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  showQuestion();
}

function startPractice() {
  currentMode = "practice";
  currentIndex = 0;
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');
  showQuestion();
}

function showQuestion() {
  const data = quizData[currentMode][currentIndex % quizData[currentMode].length];
  document.getElementById('question').innerText = data.question;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = "";

  data.options.forEach(option => {
    const btn = document.createElement('button');
    btn.innerText = option;
    btn.onclick = () => {
      if (option === data.answer && currentMode === "levelTest") {
        score++;
      }
      if (currentMode === "levelTest" && currentIndex === 24) {
        showResult();
      } else {
        currentIndex++;
        showQuestion();
      }
    };
    optionsDiv.appendChild(btn);
  });
}

function nextQuestion() {
  if (currentMode === "practice") {
    currentIndex++;
    showQuestion();
  }
}

function showResult() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').innerText = `Your English level score: ${score}/25`;
}
