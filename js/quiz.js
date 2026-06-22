// 闖關題：讀 data/quiz.json，每次隨機抽 QUIZ_COUNT 題並打亂順序。
// 版型：所有題目一次列出，每題一張卡，點選項即時回饋對錯與解析。
const QUIZ_COUNT = 10;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function initQuiz(quiz) {
  const root = document.getElementById("quiz-root");
  if (!root || !quiz || !Array.isArray(quiz.questions)) return;

  if (quiz.questions.length === 0) {
    root.innerHTML = "<p>題庫尚未建立，請於 data/quiz.json 加入題目。</p>";
    return;
  }

  let picked = [];
  let answered = [];
  let score = 0;

  function render() {
    picked = shuffle(quiz.questions).slice(0, QUIZ_COUNT);
    answered = new Array(picked.length).fill(false);
    score = 0;

    root.innerHTML = `
      <div class="quiz-list">
        ${picked.map((q, qi) => `
          <article class="quiz-card" data-q="${qi}">
            <p class="quiz-num">第 ${qi + 1} 題</p>
            <p class="quiz-stem">${q.stem}</p>
            <ul class="quiz-options">
              ${q.options.map((opt, i) => `<li><button class="quiz-opt" data-q="${qi}" data-i="${i}">${opt}</button></li>`).join("")}
            </ul>
            <p class="quiz-explain" hidden></p>
          </article>`).join("")}
      </div>
      <div class="quiz-summary">
        <p class="quiz-score">已作答 <span id="quiz-done">0</span> / ${picked.length}　答對 <span id="quiz-correct">0</span> 題</p>
        <button id="quiz-retry" class="btn" hidden>再玩一次</button>
      </div>`;

    root.querySelectorAll(".quiz-opt").forEach((btn) => {
      btn.addEventListener("click", () =>
        onAnswer(Number(btn.dataset.q), Number(btn.dataset.i), btn)
      );
    });
  }

  function onAnswer(qi, i, btn) {
    if (answered[qi]) return;
    answered[qi] = true;

    const q = picked[qi];
    const card = root.querySelector(`.quiz-card[data-q="${qi}"]`);
    const correct = i === q.answer;
    if (correct) score += 1;

    card.querySelectorAll(".quiz-opt").forEach((b, bi) => {
      b.disabled = true;
      if (bi === q.answer) b.classList.add("is-correct");
    });
    if (!correct) btn.classList.add("is-wrong");

    const ex = card.querySelector(".quiz-explain");
    ex.textContent = (correct ? "✔ 答對了！" : "✘ 再想想：") + (q.explanation || "");
    ex.classList.toggle("is-right", correct);
    ex.classList.toggle("is-wrong", !correct);
    ex.hidden = false;

    const doneCount = answered.filter(Boolean).length;
    root.querySelector("#quiz-done").textContent = String(doneCount);
    root.querySelector("#quiz-correct").textContent = String(score);

    if (doneCount === picked.length) {
      const retry = root.querySelector("#quiz-retry");
      retry.hidden = false;
      retry.onclick = render;
    }
  }

  render();
}
