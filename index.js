// Fetch the wordlist and available syllables from local files
const words = (await (await fetch("mots/mots.txt")).text()).split(/\r?\n/);
const syllables = await (await fetch("mots/syllabes.json")).json();

// UI Container Elements
const startContainer = document.getElementById("startContainer");
const gameContainer = document.getElementById("gameContainer");
const endContainer = document.getElementById("endContainer");
const historyList = document.getElementById("historyList");

// Game Control Elements
const startButton = document.getElementById("startButton");
const practiceButton = document.getElementById("practiceButton");
const restartButton = document.getElementById("restartButton");
const skipButton = document.getElementById("skipButton");
const wordPrompt = document.getElementById("wordPrompt");
const inputWord = document.getElementById("inputWord");
const gameTimeEl = document.getElementById("gameTime");
const scoreEl = document.getElementById("score");
const quitButton = document.getElementById("quitButton");

// Game State Variables
let gameTime = 15;
let currentGameTime = 0;
let gameTimeInterval;

let inputtedWords = []; // Tracks words used in current session to prevent duplicates
let gameHistory = []; 
let inGame = false;
let practiceMode = false;
let score = 0;
let streak = 1; // Multiplier that increases with consecutive correct answers

let currentMode = "fr"; // Supports "fr" (word game) or "maths"
let mathAnswer = null;

// Removes accents from strings for easier comparison/validation
function stripAccents(str) {
    if (typeof str !== 'undefined') {
        var rExps = [
            { re: /[\xC0-\xC6]/g, ch: 'A' }, { re: /[\xE0-\xE6]/g, ch: 'a' },
            { re: /[\xC8-\xCB]/g, ch: 'E' }, { re: /[\xE8-\xEB]/g, ch: 'e' },
            { re: /[\xCC-\xCF]/g, ch: 'I' }, { re: /[\xEC-\xEF]/g, ch: 'i' },
            { re: /[\xD2-\xD6]/g, ch: 'O' }, { re: /[\xF2-\xF6]/g, ch: 'o' },
            { re: /[\xD9-\xDC]/g, ch: 'U' }, { re: /[\xF9-\xFC]/g, ch: 'u' },
            { re: /[\xC7-\xE7]/g, ch: 'c' }, { re: /[\xD1]/g, ch: 'N' },
            { re: /[\xF1]/g, ch: 'n' }
        ];
        for (var i = 0, len = rExps.length; i < len; i++) {
            str = str.replace(rExps[i].re, rExps[i].ch);
        }
        return str;
    }
}

// Updates score based on streak and adds time bonus in standard mode
function updateScore(points) {
    score += points * streak;
    streak = (streak >= 5) ? 5 : streak + 1;
    if (inGame && !practiceMode) {
        currentGameTime += 1;
        gameTimeEl.innerText = `${currentGameTime}s`;
    }
    scoreEl.textContent = `Score: ${score}`;
}

// Switches to the next challenge based on the selected mode
function nextPrompt() {
    inputWord.value = "";
    if (currentMode === "fr") {
        const randomIndex = Math.floor(Math.random() * syllables.length);
        wordPrompt.innerText = syllables[randomIndex];
    } else if (currentMode === "maths") {
        generateMathProblem();
    }
}

// Creates random arithmetic problems (+, -, *)
function generateMathProblem() {
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a, b;
    if (op === '*') {
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
    } else {
        a = Math.floor(Math.random() * 100) + 1;
        b = Math.floor(Math.random() * 100) + 1;
    }
    wordPrompt.innerText = `${a} ${op} ${b} = ?`;
    mathAnswer = eval(`${a} ${op} ${b}`).toString();
}

// Handles the logic for skipping a prompt (penalizes time and resets streak)
const handleSkip = () => {
    if (!inGame) return;

    gameHistory.push({
        prompt: wordPrompt.innerText,
        answer: "SKIPPED",
        correct: false
    });

    streak = 1;
    if (!practiceMode) {
        currentGameTime -= 2; // Penalty for skipping
        if (currentGameTime <= 0) {
            currentGameTime = 0;
            gameTimeEl.innerText = `0s`;
            endGame();
            return;
        }
        gameTimeEl.innerText = `${currentGameTime}s`;
    }
    nextPrompt();
    inputWord.focus();
};

// Stops the game and displays the final score and history
function endGame() {
    inGame = false;
    clearInterval(gameTimeInterval);
    
    gameContainer.style.display = "none";
    endContainer.style.display = "flex";

    document.getElementById("finalScore").innerText = `Final Score: ${score}`;

    // Render results history list
    historyList.innerHTML = gameHistory.map(item => `
        <div class="history-item ${item.correct ? 'history-success' : 'history-fail'}">
            <span>${item.prompt}</span>
            <span><strong>${item.answer}</strong> ${item.correct ? '✓' : '✗'}</span>
        </div>
    `).join('');
    historyList.scrollTop = 0;
}

// Initializes standard game with countdown
function startGame() {
    currentMode = document.querySelector('input[name="gameMode"]:checked').value;
    practiceMode = false;
    gameHistory = []; 
    endContainer.style.display = "none";
    score = 0;
    streak = 1;
    scoreEl.textContent = `Score: ${score}`;
    
    const timeInput = document.querySelector('input[name="gameTime"]:checked');
    gameTime = timeInput ? parseInt(timeInput.value) : 15;
    
    inGame = true;
    inputtedWords = [];
    document.querySelector(".game-card").classList.add("playing");
    startContainer.style.display = "none";
    gameContainer.style.display = "flex";
    
    nextPrompt();
    inputWord.focus();
    
    currentGameTime = gameTime;
    gameTimeEl.innerText = `${currentGameTime}s`;
    
    if (gameTimeInterval) clearInterval(gameTimeInterval);
    gameTimeInterval = setInterval(() => {
        currentGameTime--;
        if (currentGameTime <= 0) {
            currentGameTime = 0;
            endGame();
        }
        gameTimeEl.innerText = `${currentGameTime}s`;
    }, 1000);
}

// Initializes practice mode (no timer)
function startPractice() {
    currentMode = document.querySelector('input[name="gameMode"]:checked').value;
    practiceMode = true;
    gameHistory = [];
    score = 0;
    streak = 1;
    scoreEl.textContent = `Score: 0`;
    inGame = true;
    inputtedWords = [];
    document.querySelector(".game-card").classList.add("playing");
    startContainer.style.display = "none";
    gameContainer.style.display = "flex";
    nextPrompt();
    inputWord.focus();
    gameTimeEl.innerText = `∞`;
    if (gameTimeInterval) clearInterval(gameTimeInterval);
}

// --- EVENT LISTENERS ---

startButton.addEventListener("click", startGame);
practiceButton.addEventListener("click", startPractice);
skipButton.addEventListener("click", (e) => {
    e.preventDefault();
    handleSkip();
});

// Logic for submitting an answer via Enter key
inputWord.addEventListener("keydown", e => { 
    if (e.code === "Enter") {
        if (e.shiftKey) { // Shift + Enter is an alternative skip
            e.preventDefault();
            handleSkip();
        } else {
            const val = inputWord.value.trim();
            if (val === "") return;

            let isCorrect = false;
            let promptText = wordPrompt.innerText;

            if (currentMode === "fr") {
                const word = val.toLowerCase();
                const cleanWord = stripAccents(word);
                const syllable = stripAccents(promptText.toLowerCase());
                
                // Validate if word contains syllable, isn't a duplicate, and exists in list
                if (!inputtedWords.includes(cleanWord) && cleanWord.includes(syllable) && words.includes(word)) {
                    isCorrect = true;
                    updateScore(word.length);
                    inputtedWords.push(cleanWord);
                }
            } else if (currentMode === "maths") {
                if (val === mathAnswer) {
                    isCorrect = true;
                    updateScore(5);
                }
            }

            gameHistory.push({
                prompt: promptText,
                answer: val,
                correct: isCorrect
            });

            if (isCorrect) {
                nextPrompt();
            } else {
                inputWord.value = ""; // Clear input if wrong to allow retry
            }
        }
    }
});

// Global keyboard shortcuts (Enter to start, Escape to quit)
document.addEventListener("keydown", e => {
    if (e.key === "Enter" && !inGame && startContainer.style.display !== "none") {
        startGame();
    }
    if (e.key === "Escape") {
        if (inGame) {
            quitGame(); 
        } else if (endContainer.style.display === "flex") {
            restartButton.click();
        }
    }
});

// Visual theme toggle based on mode
document.querySelectorAll('input[name="gameMode"]').forEach(input => {
    input.addEventListener('change', (e) => {
        const gameCard = document.querySelector(".game-card");
        if (e.target.value === "maths") {
            gameCard.classList.add("math-mode");
        } else {
            gameCard.classList.remove("math-mode");
        }
    });
});

restartButton.addEventListener("click", () => {
    endContainer.style.display = "none";
    startContainer.style.display = "flex";
    document.querySelector(".game-card").classList.remove("playing");
});

// Resets game state and returns to the menu
const quitGame = () => {
    if (!inGame) return;
    inGame = false;
    clearInterval(gameTimeInterval);
    
    gameContainer.style.display = "none";
    endContainer.style.display = "none"; 
    startContainer.style.display = "flex";
    document.querySelector(".game-card").classList.remove("playing");
    
    score = 0;
    streak = 1;
    inputtedWords = [];
    gameHistory = [];
};

quitButton.addEventListener("click", quitGame);