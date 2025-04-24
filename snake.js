const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * 25) * box,
    y: Math.floor(Math.random() * 25) * box
};

let score = 0;

document.addEventListener("keydown", changeDirection);
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("stopBtn").addEventListener("click", stopGame);

let game;

function changeDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    // Check collision with food
    if (headX === food.x && headY === food.y) {
        score += 10;
        updateScore(); // 💡 Real-time update here
        food = {
            x: Math.floor(Math.random() * 25) * box,
            y: Math.floor(Math.random() * 25) * box
        };
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    // Check game over (walls or self)
    if (
        headX < 0 || headX >= canvas.width ||
        headY < 0 || headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        document.getElementById("gameOver").classList.remove("hidden");
    }

    snake.unshift(newHead);
}

function updateScore() {
    document.getElementById("score").textContent = score;
}

function collision(head, body) {
    return body.some(segment => head.x === segment.x && head.y === segment.y);
}

function startGame() {
    if (!game) {
        game = setInterval(draw, 100);
    }
}

function stopGame() {
    clearInterval(game);
    game = null;
}



let highScore = localStorage.getItem("highScore") || 0;

// Show initial high score when game starts
document.getElementById("highScore").textContent = highScore;

function updateScore() {
    document.getElementById("score").textContent = score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScore").textContent = highScore;
    }
}

function restartGame() {
    document.getElementById("gameOver").classList.add("hidden");
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    updateScore();
    food = {
        x: Math.floor(Math.random() * 25) * box,
        y: Math.floor(Math.random() * 25) * box
    };
    startGame();
}
