const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const linesElement = document.getElementById("lines");
const levelElement = document.getElementById("level");

const startButton = document.getElementById("start");
const message = document.getElementById("message");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

const COLORS = [
    null,
    "#00ffff",
    "#0000ff",
    "#ff8800",
    "#ffff00",
    "#00ff00",
    "#aa00ff",
    "#ff0044"
];

const PIECES = [

    [
        [1, 1, 1, 1]
    ],

    [
        [2, 0, 0],
        [2, 2, 2]
    ],

    [
        [0, 0, 3],
        [3, 3, 3]
    ],

    [
        [4, 4],
        [4, 4]
    ],

    [
        [0, 5, 5],
        [5, 5, 0]
    ],

    [
        [0, 6, 0],
        [6, 6, 6]
    ],

    [
        [7, 7, 0],
        [0, 7, 7]
    ]
];

let board;

let player;

let score = 0;
let lines = 0;
let level = 1;

let running = false;
let paused = false;

let lastTime = 0;
let dropTimer = 0;

let dropSpeed = 800;


/* =========================
   TABULEIRO
========================= */

function createBoard() {

    board = [];

    for (let y = 0; y < ROWS; y++) {

        board.push(
            new Array(COLS).fill(0)
        );
    }
}


/* =========================
   PEÇA
========================= */

function createPiece() {

    const piece =
        PIECES[
            Math.floor(
                Math.random() * PIECES.length
            )
        ];

    return piece.map(row => [...row]);
}


function spawnPiece() {

    player = {

        matrix: createPiece(),

        x: Math.floor(COLS / 2) - 2,

        y: 0
    };

    if (collision()) {

        gameOver();
    }
}


/* =========================
   DESENHO
========================= */

function drawBlock(x, y, color) {

    const px = x * SIZE;
    const py = y * SIZE;

    ctx.fillStyle = COLORS[color];

    ctx.fillRect(
        px,
        py,
        SIZE,
        SIZE
    );

    // efeito pixel retrô
    ctx.fillStyle = "rgba(255,255,255,0.18)";

    ctx.fillRect(
        px + 3,
        py + 3,
        SIZE - 6,
        4
    );

    ctx.fillStyle = "rgba(0,0,0,0.3)";

    ctx.fillRect(
        px + 3,
        py + SIZE - 7,
        SIZE - 6,
        4
    );

    ctx.strokeStyle = "#000";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        px,
        py,
        SIZE,
        SIZE
    );
}


function drawGrid() {

    ctx.strokeStyle = "#071c0d";

    ctx.lineWidth = 1;

    for (let x = 0; x <= COLS; x++) {

        ctx.beginPath();

        ctx.moveTo(
            x * SIZE,
            0
        );

        ctx.lineTo(
            x * SIZE,
            canvas.height
        );

        ctx.stroke();
    }

    for (let y = 0; y <= ROWS; y++) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y * SIZE
        );

        ctx.lineTo(
            canvas.width,
            y * SIZE
        );

        ctx.stroke();
    }
}


function drawBoard() {

    ctx.fillStyle = "#000";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawGrid();

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            if (board[y][x]) {

                drawBlock(
                    x,
                    y,
                    board[y][x]
                );
            }
        }
    }
}


function drawPlayer() {

    player.matrix.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (value) {

                        drawBlock(
                            player.x + x,
                            player.y + y,
                            value
                        );
                    }
                }
            );
        }
    );
}


function draw() {

    drawBoard();

    if (player) {
        drawPlayer();
    }
}


/* =========================
   COLISÃO
========================= */

function collision() {

    for (
        let y = 0;
        y < player.matrix.length;
        y++
    ) {

        for (
            let x = 0;
            x < player.matrix[y].length;
            x++
        ) {

            if (!player.matrix[y][x]) {
                continue;
            }

            const px =
                player.x + x;

            const py =
                player.y + y;

            if (
                px < 0 ||
                px >= COLS ||
                py >= ROWS
            ) {

                return true;
            }

            if (
                py >= 0 &&
                board[py][px]
            ) {

                return true;
            }
        }
    }

    return false;
}


/* =========================
   MOVIMENTO
========================= */

function move(direction) {

    player.x += direction;

    if (collision()) {

        player.x -= direction;
    }
}


function drop() {

    player.y++;

    if (collision()) {

        player.y--;

        merge();

        clearLines();

        spawnPiece();
    }

    dropTimer = 0;
}


/* =========================
   DROP INSTANTÂNEO
========================= */

function hardDrop() {

    while (!collision()) {

        player.y++;
    }

    player.y--;

    merge();

    clearLines();

    spawnPiece();

    dropTimer = 0;
}


/* =========================
   ROTAÇÃO
========================= */

function rotate(matrix) {

    return matrix[0].map(
        (_, index) =>
            matrix
                .map(row => row[index])
                .reverse()
    );
}


function rotatePlayer() {

    const oldMatrix =
        player.matrix;

    player.matrix =
        rotate(player.matrix);

    if (collision()) {

        player.matrix =
            oldMatrix;
    }
}


/* =========================
   FIXAR PEÇA
========================= */

function merge() {

    player.matrix.forEach(
        (row, y) => {

            row.forEach(
                (value, x) => {

                    if (value) {

                        board[
                            player.y + y
                        ][
                            player.x + x
                        ] = value;
                    }
                }
            );
        }
    );
}


/* =========================
   LINHAS
========================= */

function clearLines() {

    let cleared = 0;

    for (
        let y = ROWS - 1;
        y >= 0;
        y--
    ) {

        if (
            board[y].every(
                cell => cell !== 0
            )
        ) {

            board.splice(y, 1);

            board.unshift(
                new Array(COLS).fill(0)
            );

            cleared++;

            y++;
        }
    }

    if (cleared > 0) {

        const points = [
            0,
            100,
            300,
            500,
            800
        ];

        score +=
            points[cleared] * level;

        lines += cleared;

        level =
            Math.floor(lines / 10) + 1;

        dropSpeed =
            Math.max(
                100,
                800 - (level - 1) * 60
            );

        updateScore();
    }
}


/* =========================
   PLACAR
========================= */

function updateScore() {

    scoreElement.textContent =
        String(score).padStart(6, "0");

    linesElement.textContent =
        String(lines).padStart(3, "0");

    levelElement.textContent =
        String(level).padStart(2, "0");
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    running = false;

    message.textContent =
        "GAME OVER";

    startButton.textContent =
        "RESTART";
}


/* =========================
   PAUSA
========================= */

function pause() {

    if (!running) {
        return;
    }

    paused = !paused;

    message.textContent =
        paused
            ? "PAUSED"
            : "PLAYING";
}


/* =========================
   INICIAR
========================= */

function startGame() {

    createBoard();

    score = 0;
    lines = 0;
    level = 1;

    dropSpeed = 800;

    updateScore();

    spawnPiece();

    running = true;

    paused = false;

    message.textContent =
        "PLAYING";

    startButton.textContent =
        "RESTART";

    dropTimer = 0;

    lastTime =
        performance.now();

    requestAnimationFrame(loop);
}


/* =========================
   LOOP
========================= */

function loop(time) {

    if (!running) {
        return;
    }

    const delta =
        time - lastTime;

    lastTime = time;

    if (!paused) {

        dropTimer += delta;

        if (dropTimer >= dropSpeed) {

            drop();
        }

        draw();
    }

    requestAnimationFrame(loop);
}


/* =========================
   CONTROLES
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (!running) {
            return;
        }

        if (
            event.key === "p" ||
            event.key === "P"
        ) {

            pause();

            return;
        }

        if (paused) {
            return;
        }

        switch (event.key) {

            case "ArrowLeft":

                move(-1);

                break;

            case "ArrowRight":

                move(1);

                break;

            case "ArrowDown":

                drop();

                break;

            case "ArrowUp":

                rotatePlayer();

                break;

            case " ":

                event.preventDefault();

                hardDrop();

                break;
        }

        draw();
    }
);


startButton.addEventListener(
    "click",
    startGame
);


/* =========================
   INICIALIZAÇÃO
========================= */

createBoard();

draw();