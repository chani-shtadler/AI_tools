const board = document.getElementById('game-board');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-msg');
const finalScoreEl = document.getElementById('final-score');

// משתני מצב
let score = 0;
let timeLeft = 300; // 5 דקות בשניות
let timerInterval;
let hasFlippedCard = false;
let lockBoard = false; // מונע לחיצה בזמן אנימציה
let firstCard, secondCard;
let cardsRemaining = 0;

// המאגר - 8 זוגות של חיות (סה"כ 16 קלפים)
const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

function initGame() {
    // איפוס משתנים
    score = 0;
    timeLeft = 300; // 5 דקות
    scoreEl.textContent = score;
    updateTimerDisplay();
    modal.classList.add('hidden');
    board.innerHTML = '';
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;

    // עצירת טיימר קודם אם קיים
    clearInterval(timerInterval);

    // יצירת חפיסה כפולה וערבוב
    const deck = [...animals, ...animals];
    shuffle(deck);
    cardsRemaining = deck.length;

    // יצירת הקלפים ב-HTML
    deck.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.animal = animal;

        const frontFace = document.createElement('div');
        frontFace.classList.add('front');
        // ניתן להוסיף כאן סימן שאלה או לוגו אם רוצים

        const backFace = document.createElement('div');
        backFace.classList.add('back');
        backFace.textContent = animal; // הצגת החיה

        card.appendChild(frontFace);
        card.appendChild(backFace);
        card.addEventListener('click', flipCard);
        
        board.appendChild(card);
    });

    // הפעלת טיימר
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // מניעת לחיצה כפולה על אותו קלף

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // לחיצה ראשונה
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // לחיצה שניה
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.animal === secondCard.dataset.animal;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // **פעולות בעת ניצחון זוג**
    
    // 1. הוספת ניקוד
    score += 5;
    scoreEl.textContent = score;

    // 2. הוספת זמן (30 שניות)
    timeLeft += 30;
    updateTimerDisplay();
    
    // הבהוב ירוק קטן לטיימר כדי לסמן שנוספו שניות (אופציונלי)
    timerEl.style.color = '#2ecc71';
    setTimeout(() => timerEl.style.color = '#e67e22', 500);

    // 3. הסרת הקלפים מהלוח
    lockBoard = true; // נועלים רגע כדי למנוע באגים
    setTimeout(() => {
        firstCard.classList.add('hidden-card'); // CSS גורם להם להיות בלתי נראים
        secondCard.classList.add('hidden-card');
        resetBoard();
        
        cardsRemaining -= 2;
        if (cardsRemaining === 0) {
            endGame(true);
        }
    }, 1000); // מחכים שניה כדי שהשחקן יראה את ההתאמה
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function endGame(victory) {
    clearInterval(timerInterval);
    modal.classList.remove('hidden');
    finalScoreEl.textContent = score;
    
    if (victory) {
        modalTitle.textContent = "🎉 כל הכבוד! 🎉";
        modalMsg.textContent = "מצאת את כל הזוגות!";
    } else {
        modalTitle.textContent = "⌛ נגמר הזמן";
        modalMsg.textContent = "לא נורא, נסה שוב!";
    }
}

function restartGame() {
    initGame();
}

// התחלה בטעינה
initGame();