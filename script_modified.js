const quizData = {
  easy: [
    { q: "대한민국의 수도는?", a: "서울", c: ["부산", "서울", "대전", "인천"] },
    { q: "하루는 몇 시간?", a: "24시간", c: ["12시간", "20시간", "24시간", "30시간"] },
    { q: "기린의 목은?", a: "길다", c: ["짧다", "중간", "길다", "없다"] },
    { q: "바다가 아닌 것은?", a: "한강", c: ["태평양", "한강", "인도양", "대서양"] },
    { q: "우리나라 국기는?", a: "태극기", c: ["성조기", "일장기", "태극기", "홍콩기"] }
  ],
  normal: [
    { q: "지구에서 가장 높은 산은?", a: "에베레스트", c: ["후지산", "에베레스트", "알프스", "안데스"] },
    { q: "물의 화학식은?", a: "H2O", c: ["O2", "CO2", "H2O", "H2SO4"] },
    { q: "프랑스의 수도는?", a: "파리", c: ["런던", "마드리드", "파리", "로마"] },
    { q: "피타고라스 정리는?", a: "a² + b² = c²", c: ["E=mc²", "F=ma", "a² + b² = c²", "V=IR"] },
    { q: "한국의 전통 악기 중 하나는?", a: "가야금", c: ["기타", "드럼", "가야금", "피아노"] }
  ],
  hard: [
    { q: "DNA의 이중 나선 구조를 밝힌 과학자는?", a: "왓슨과 크릭", c: ["뉴턴", "아인슈타인", "왓슨과 크릭", "다윈"] },
    { q: "플랑크 상수는 무엇을 설명하는가?", a: "양자 에너지", c: ["광속", "중력", "양자 에너지", "질량 보존"] },
    { q: "페르마의 마지막 정리를 증명한 수학자는?", a: "앤드루 와일스", c: ["가우스", "파스칼", "뉴턴", "앤드루 와일스"] },
    { q: "모차르트가 활동한 시대는?", a: "고전주의", c: ["바로크", "낭만주의", "고전주의", "현대"] },
    { q: "대한민국 최초의 위성은?", a: "우리별 1호", c: ["아리랑 1호", "우리별 1호", "누리호", "천리안"] }
  ]
};

const difficulty = localStorage.getItem("difficulty") || "easy";
const questions = quizData[difficulty];
let current = 0;
let score = 0;
let locked = false;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultModal = document.getElementById("result-modal");
const resultText = document.getElementById("result-text");
const finalModal = document.getElementById("final-modal");
const finalText = document.getElementById("final-text");
const cheerSound = document.getElementById("cheer-sound");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const questionNum = document.getElementById("question-number");
const timerDisplay = document.getElementById("timer");

let timerInterval;
let timeLeft = 15;

function startTimer() {
  timeLeft = 15;
  timerDisplay.innerText = `⏰ ${timeLeft}초 남음`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `⏰ ${timeLeft}초 남음`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      resultText.innerText = "시간 초과!";
      resultText.className = "incorrect";
      resultModal.classList.remove("hidden");
      setTimeout(() => {
        resultModal.classList.add("hidden");
        current++;
        showQuestion();
      }, 2000);
    }
  }, 1000);
}

function showQuestion() {
  locked = false;
  if (current >= questions.length) {
    finalText.innerText = `수고하셨습니다!\n정답: ${score} / ${questions.length}`;
    finalModal.classList.remove("hidden");
    cheerSound.play();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 10000);
    return;
  }

  const q = questions[current];
  questionNum.innerText = `${current + 1} / ${questions.length}`;
  questionEl.innerText = q.q;
  choicesEl.innerHTML = "";

  q.c.forEach(choice => {
    const btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => checkAnswer(choice, q.a, btn);
    choicesEl.appendChild(btn);
  });

  startTimer();
}

function checkAnswer(selected, answer, button) {
  if (locked) return;
  locked = true;

  if (selected === answer) {
    clearInterval(timerInterval);
    correctSound.play();
    score++;
    resultText.innerText = "정답입니다!";
    resultText.className = "correct";
    resultModal.classList.remove("hidden");
    setTimeout(() => {
      resultModal.classList.add("hidden");
      current++;
      showQuestion();
    }, 1000);
  } else {
    wrongSound.play();
    resultText.innerText = "오답입니다!";
    resultText.className = "incorrect";
    resultModal.classList.remove("hidden");
    button.style.border = "4px solid red";
    navigator.vibrate?.(300);
    setTimeout(() => {
      resultModal.classList.add("hidden");
      button.style.border = "";
      current++;
      showQuestion();
    }, 500);
  }
}

showQuestion();