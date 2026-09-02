/* =========================================================
   TETRIS RETRO 2D
   1 PLAYER / 2 PLAYERS
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const COLS = 10;
const ROWS = 20;
const SIZE = 30;


const COLORS = [
    null,
    "#00ffff", // I
    "#0000ff", // J
    "#ff8800", // L
    "#ffff00", // O
    "#00ff00", // S
    "#aa00ff", // T
    "#ff0044"  // Z
];


const PIECES = [

    // I
    [
        [1, 1, 1, 1]
    ],

    // J
    [
        [2, 0, 0],
        [2, 2, 2]
    ],

    // L
    [
        [0, 0, 3],
        [3, 3, 3]
    ],

    // O
    [
        [4, 4],
        [4, 4]
    ],

    // S
    [
        [0, 5, 5],
        [5, 5, 0]
    ],

    // T
    [
        [0, 6, 0],
        [6, 6, 6]
    ],

    // Z
    [
        [7, 7, 0],
        [0, 7, 7]
    ]
];


/* =========================================================
   ELEMENTOS DO HTML
========================================================= */

const menu =
    document.getElementById("menu");

const game =
    document.getElementById("game");


const onePlayerButton =
    document.getElementById("onePlayer");

const twoPlayersButton =
    document.getElementById("twoPlayers");


const startButton =
    document.getElementById("start");

const pauseButton =
    document.getElementById("pause");

const restartButton =
    document.getElementById("restart");

const menuButton =
    document.getElementById("menuButton");


const actions =
    document.getElementById("actions");

const instructions =
    document.getElementById("instructions");


const controls2 =
    document.getElementById("controls2");

const player2Container =
    document.getElementById("player2");


const mobileControls =
    document.getElementById("mobileControls");


/* =========================================================
   CLASSE DO TETRIS
========================================================= */

class TetrisGame {

    constructor(canvas, elements, playerNumber) {

        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");


        this.scoreElement =
            elements.score;

        this.linesElement =
            elements.lines;

        this.levelElement =
            elements.level;

        this.messageElement =
            elements.message;


        this.playerNumber =
            playerNumber;


        this.board = [];

        this.player = null;


        this.score = 0;

        this.lines = 0;

        this.level = 1;


        this.running = false;

        this.paused = false;


        this.dropTimer = 0;

        this.dropSpeed = 800;


        this.createBoard();
    }


    /* =====================================================
       TABULEIRO
    ===================================================== */

    createBoard() {

        this.board = [];


        for (
            let y = 0;
            y < ROWS;
            y++
        ) {

            this.board.push(
                new Array(COLS).fill(0)
            );
        }
    }


    /* =====================================================
       CRIAR PEÇA
    ===================================================== */

    createPiece() {

        const piece =
            PIECES[
                Math.floor(
                    Math.random() *
                    PIECES.length
                )
            ];


        return piece.map(
            row => [...row]
        );
    }


    /* =====================================================
       NASCER PEÇA
    ===================================================== */

    spawnPiece() {

        const matrix =
            this.createPiece();


        this.player = {

            matrix,

            x:
                Math.floor(
                    (COLS -
                        matrix[0].length) / 2
                ),

            y: 0
        };


        if (this.collision()) {

            this.gameOver();
        }
    }


    /* =====================================================
       DESENHAR BLOCO
    ===================================================== */

    drawBlock(x, y, color) {

        const px =
            x * SIZE;

        const py =
            y * SIZE;


        this.ctx.fillStyle =
            COLORS[color];


        this.ctx.fillRect(
            px,
            py,
            SIZE,
            SIZE
        );


        /* brilho superior */

        this.ctx.fillStyle =
            "rgba(255,255,255,0.18)";


        this.ctx.fillRect(
            px + 3,
            py + 3,
            SIZE - 6,
            4
        );


        /* sombra inferior */

        this.ctx.fillStyle =
            "rgba(0,0,0,0.3)";


        this.ctx.fillRect(
            px + 3,
            py + SIZE - 7,
            SIZE - 6,
            4
        );


        /* borda */

        this.ctx.strokeStyle =
            "#000";


        this.ctx.lineWidth = 2;


        this.ctx.strokeRect(
            px,
            py,
            SIZE,
            SIZE
        );
    }


    /* =====================================================
       GRID
    ===================================================== */

    drawGrid() {

        this.ctx.strokeStyle =
            "#071c0d";


        this.ctx.lineWidth = 1;


        for (
            let x = 0;
            x <= COLS;
            x++
        ) {

            this.ctx.beginPath();


            this.ctx.moveTo(
                x * SIZE,
                0
            );


            this.ctx.lineTo(
                x * SIZE,
                this.canvas.height
            );


            this.ctx.stroke();
        }


        for (
            let y = 0;
            y <= ROWS;
            y++
        ) {

            this.ctx.beginPath();


            this.ctx.moveTo(
                0,
                y * SIZE
            );


            this.ctx.lineTo(
                this.canvas.width,
                y * SIZE
            );


            this.ctx.stroke();
        }
    }


    /* =====================================================
       DESENHAR TABULEIRO
    ===================================================== */

    drawBoard() {

        this.ctx.fillStyle =
            "#000";


        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        this.drawGrid();


        for (
            let y = 0;
            y < ROWS;
            y++
        ) {

            for (
                let x = 0;
                x < COLS;
                x++
            ) {

                if (this.board[y][x]) {

                    this.drawBlock(
                        x,
                        y,
                        this.board[y][x]
                    );
                }
            }
        }
    }


    /* =====================================================
       DESENHAR PEÇA ATUAL
    ===================================================== */

    drawPlayer() {

        if (!this.player) {
            return;
        }


        this.player.matrix.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (!value) {
                            return;
                        }


                        const px =
                            this.player.x + x;

                        const py =
                            this.player.y + y;


                        if (
                            py >= 0 &&
                            py < ROWS &&
                            px >= 0 &&
                            px < COLS
                        ) {

                            this.drawBlock(
                                px,
                                py,
                                value
                            );
                        }
                    }
                );
            }
        );
    }


    /* =====================================================
       DESENHAR TUDO
    ===================================================== */

    draw() {

        this.drawBoard();

        this.drawPlayer();
    }


    /* =====================================================
       COLISÃO
    ===================================================== */

    collision() {

        if (!this.player) {
            return false;
        }


        for (
            let y = 0;
            y < this.player.matrix.length;
            y++
        ) {

            for (
                let x = 0;
                x < this.player.matrix[y].length;
                x++
            ) {

                if (
                    !this.player.matrix[y][x]
                ) {
                    continue;
                }


                const px =
                    this.player.x + x;

                const py =
                    this.player.y + y;


                /* parede */

                if (
                    px < 0 ||
                    px >= COLS
                ) {

                    return true;
                }


                /* chão */

                if (py >= ROWS) {

                    return true;
                }


                /* blocos existentes */

                if (
                    py >= 0 &&
                    this.board[py][px]
                ) {

                    return true;
                }
            }
        }


        return false;
    }


    /* =====================================================
       MOVER
    ===================================================== */

    move(direction) {

        if (
            !this.running ||
            this.paused ||
            !this.player
        ) {
            return;
        }


        this.player.x += direction;


        if (this.collision()) {

            this.player.x -= direction;
        }


        this.draw();
    }


    /* =====================================================
       DESCER
    ===================================================== */

    drop() {

        if (
            !this.running ||
            this.paused ||
            !this.player
        ) {
            return;
        }


        this.player.y++;


        if (this.collision()) {

            this.player.y--;


            this.merge();

            this.clearLines();

            this.spawnPiece();


            if (!this.running) {
                return;
            }
        }


        this.dropTimer = 0;


        this.draw();
    }


    /* =====================================================
       DROP INSTANTÂNEO
    ===================================================== */

    hardDrop() {

        if (
            !this.running ||
            this.paused ||
            !this.player
        ) {
            return;
        }


        while (!this.collision()) {

            this.player.y++;
        }


        this.player.y--;


        this.merge();

        this.clearLines();

        this.spawnPiece();


        if (!this.running) {
            return;
        }


        this.dropTimer = 0;


        this.draw();
    }


    /* =====================================================
       ROTAÇÃO
    ===================================================== */

    rotate(matrix) {

        return matrix[0].map(
            (_, index) =>
                matrix
                    .map(
                        row => row[index]
                    )
                    .reverse()
        );
    }


    rotatePlayer() {

        if (
            !this.running ||
            this.paused ||
            !this.player
        ) {
            return;
        }


        const oldMatrix =
            this.player.matrix;


        const oldX =
            this.player.x;


        this.player.matrix =
            this.rotate(
                this.player.matrix
            );


        /*
           Ajuste para paredes
        */

        if (this.collision()) {

            this.player.x++;


            if (this.collision()) {

                this.player.x -= 2;


                if (this.collision()) {

                    this.player.x =
                        oldX;


                    this.player.matrix =
                        oldMatrix;
                }
            }
        }


        this.draw();
    }


    /* =====================================================
       FIXAR PEÇA
    ===================================================== */

    merge() {

        if (!this.player) {
            return;
        }


        this.player.matrix.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (!value) {
                            return;
                        }


                        const boardY =
                            this.player.y + y;

                        const boardX =
                            this.player.x + x;


                        if (
                            boardY >= 0 &&
                            boardY < ROWS &&
                            boardX >= 0 &&
                            boardX < COLS
                        ) {

                            this.board[boardY][boardX] =
                                value;
                        }
                    }
                );
            }
        );
    }


    /* =====================================================
       LIMPAR LINHAS
    ===================================================== */

    clearLines() {

        let cleared = 0;


        for (
            let y = ROWS - 1;
            y >= 0;
            y--
        ) {

            if (
                this.board[y].every(
                    cell => cell !== 0
                )
            ) {

                this.board.splice(
                    y,
                    1
                );


                this.board.unshift(
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


            this.score +=
                points[cleared] *
                this.level;


            this.lines +=
                cleared;


            this.level =
                Math.floor(
                    this.lines / 10
                ) + 1;


            this.dropSpeed =
                Math.max(
                    100,
                    800 -
                    (this.level - 1) * 60
                );


            this.updateScore();
        }
    }


    /* =====================================================
       PLACAR
    ===================================================== */

    updateScore() {

        if (this.scoreElement) {

            this.scoreElement.textContent =
                String(this.score)
                    .padStart(6, "0");
        }


        if (this.linesElement) {

            this.linesElement.textContent =
                String(this.lines)
                    .padStart(3, "0");
        }


        if (this.levelElement) {

            this.levelElement.textContent =
                String(this.level)
                    .padStart(2, "0");
        }
    }


    /* =====================================================
       GAME OVER
    ===================================================== */

    gameOver() {

        this.running = false;


        this.messageElement.textContent =
            "GAME OVER";


        checkWinner();
    }


    /* =====================================================
       PAUSA
    ===================================================== */

    pause() {

        if (!this.running) {
            return;
        }


        this.paused =
            !this.paused;


        this.messageElement.textContent =
            this.paused
                ? "PAUSED"
                : "PLAYING";
    }


    /* =====================================================
       INICIAR / REINICIAR
    ===================================================== */

    start() {

        this.createBoard();


        this.score = 0;

        this.lines = 0;

        this.level = 1;


        this.dropSpeed = 800;

        this.dropTimer = 0;


        this.running = true;

        this.paused = false;


        this.updateScore();


        this.spawnPiece();


        if (!this.running) {
            return;
        }


        this.messageElement.textContent =
            "PLAYING";


        this.draw();
    }


    /* =====================================================
       ATUALIZAÇÃO
    ===================================================== */

    update(delta) {

        if (
            !this.running ||
            this.paused
        ) {
            return;
        }


        this.dropTimer += delta;


        if (
            this.dropTimer >=
            this.dropSpeed
        ) {

            this.drop();
        }


        this.draw();
    }
}


/* =========================================================
   ELEMENTOS DO JOGADOR 1
========================================================= */

const canvas1 =
    document.getElementById("canvas1");


const game1 =
    new TetrisGame(
        canvas1,
        {
            score:
                document.getElementById("score1"),

            lines:
                document.getElementById("lines1"),

            level:
                document.getElementById("level1"),

            message:
                document.getElementById("message1")
        },
        1
    );


/* =========================================================
   ELEMENTOS DO JOGADOR 2
========================================================= */

const canvas2 =
    document.getElementById("canvas2");


const game2 =
    new TetrisGame(
        canvas2,
        {
            score:
                document.getElementById("score2"),

            lines:
                document.getElementById("lines2"),

            level:
                document.getElementById("level2"),

            message:
                document.getElementById("message2")
        },
        2
    );


/* =========================================================
   MODO ATUAL
========================================================= */

let currentMode = 1;


/* =========================================================
   ESCOLHER 1 JOGADOR
========================================================= */

onePlayerButton.addEventListener(
    "click",
    () => {

        currentMode = 1;


        menu.classList.add(
            "hidden"
        );


        game.classList.remove(
            "hidden"
        );


        actions.classList.remove(
            "hidden"
        );


        instructions.classList.remove(
            "hidden"
        );


        player2Container.classList.add(
            "hidden"
        );


        controls2.classList.add(
            "hidden"
        );


        mobileControls.classList.remove(
            "hidden"
        );


        game1.start();


        game2.running = false;
    }
);


/* =========================================================
   ESCOLHER 2 JOGADORES
========================================================= */

twoPlayersButton.addEventListener(
    "click",
    () => {

        currentMode = 2;


        menu.classList.add(
            "hidden"
        );


        game.classList.remove(
            "hidden"
        );


        actions.classList.remove(
            "hidden"
        );


        instructions.classList.remove(
            "hidden"
        );


        player2Container.classList.remove(
            "hidden"
        );


        controls2.classList.remove(
            "hidden"
        );


        mobileControls.classList.add(
            "hidden"
        );


        game1.start();

        game2.start();
    }
);


/* =========================================================
   START
========================================================= */

startButton.addEventListener(
    "click",
    () => {

        game1.start();


        if (currentMode === 2) {

            game2.start();
        }
    }
);


/* =========================================================
   RESTART
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        game1.start();


        if (currentMode === 2) {

            game2.start();
        }
    }
);


/* =========================================================
   PAUSE
========================================================= */

pauseButton.addEventListener(
    "click",
    () => {

        game1.pause();


        if (currentMode === 2) {

            game2.pause();
        }
    }
);


/* =========================================================
   VOLTAR AO MENU
========================================================= */

menuButton.addEventListener(
    "click",
    () => {

        game1.running = false;

        game2.running = false;


        game.classList.add(
            "hidden"
        );


        actions.classList.add(
            "hidden"
        );


        instructions.classList.add(
            "hidden"
        );


        mobileControls.classList.add(
            "hidden"
        );


        menu.classList.remove(
            "hidden"
        );
    }
);


/* =========================================================
   CONTROLES DO TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {


        /* =================================================
           PAUSA
        ================================================= */

        if (
            event.code === "KeyP"
        ) {

            event.preventDefault();


            if (currentMode === 1) {

                game1.pause();

            } else if (
                currentMode === 2
            ) {

                game1.pause();

                game2.pause();
            }


            return;
        }


        /* =================================================
           MODO 1 PLAYER
        ================================================= */

        if (currentMode === 1) {

            if (
                !game1.running ||
                game1.paused
            ) {
                return;
            }


            switch (event.code) {

                case "KeyA":

                    event.preventDefault();

                    game1.move(-1);

                    break;


                case "KeyD":

                    event.preventDefault();

                    game1.move(1);

                    break;


                case "KeyW":

                    event.preventDefault();

                    game1.rotatePlayer();

                    break;


                case "KeyS":

                    event.preventDefault();

                    game1.drop();

                    break;


                case "Space":

                    event.preventDefault();

                    game1.hardDrop();

                    break;
            }


            return;
        }


        /* =================================================
           MODO 2 PLAYERS
        ================================================= */

        if (currentMode === 2) {


            /* =============================================
               JOGADOR 1
            ============================================= */

            switch (event.code) {

                case "KeyA":

                    event.preventDefault();

                    game1.move(-1);

                    break;


                case "KeyD":

                    event.preventDefault();

                    game1.move(1);

                    break;


                case "KeyW":

                    event.preventDefault();

                    game1.rotatePlayer();

                    break;


                case "KeyS":

                    event.preventDefault();

                    game1.drop();

                    break;


                case "Space":

                    event.preventDefault();

                    game1.hardDrop();

                    break;
            }


            /* =============================================
               JOGADOR 2
            ============================================= */

            switch (event.code) {

                case "ArrowLeft":

                    event.preventDefault();

                    game2.move(-1);

                    break;


                case "ArrowRight":

                    event.preventDefault();

                    game2.move(1);

                    break;


                case "ArrowUp":

                    event.preventDefault();

                    game2.rotatePlayer();

                    break;


                case "ArrowDown":

                    event.preventDefault();

                    game2.drop();

                    break;


                case "Enter":

                case "NumpadEnter":

                    event.preventDefault();

                    game2.hardDrop();

                    break;
            }
        }
    }
);


/* =========================================================
   CONTROLES MOBILE
========================================================= */

const leftButton =
    document.getElementById("left");


const rightButton =
    document.getElementById("right");


const rotateButton =
    document.getElementById("rotate");


const downButton =
    document.getElementById("down");


const dropButton =
    document.getElementById("drop");


if (leftButton) {

    leftButton.addEventListener(
        "click",
        () => game1.move(-1)
    );
}


if (rightButton) {

    rightButton.addEventListener(
        "click",
        () => game1.move(1)
    );
}


if (rotateButton) {

    rotateButton.addEventListener(
        "click",
        () => game1.rotatePlayer()
    );
}


if (downButton) {

    downButton.addEventListener(
        "click",
        () => game1.drop()
    );
}


if (dropButton) {

    dropButton.addEventListener(
        "click",
        () => game1.hardDrop()
    );
}


/* =========================================================
   VENCEDOR
========================================================= */

function checkWinner() {

    if (currentMode !== 2) {
        return;
    }


    /* =============================================
       JOGADOR 1 PERDEU
       JOGADOR 2 VENCEU
    ============================================= */

    if (
        !game1.running &&
        game2.running
    ) {

        game1.messageElement.textContent =
            "GAME OVER";


        game2.messageElement.textContent =
            "🏆 VENCEDOR!";


        return;
    }


    /* =============================================
       JOGADOR 2 PERDEU
       JOGADOR 1 VENCEU
    ============================================= */

    if (
        !game2.running &&
        game1.running
    ) {

        game2.messageElement.textContent =
            "GAME OVER";


        game1.messageElement.textContent =
            "🏆 VENCEDOR!";


        return;
    }
}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

let lastTime =
    performance.now();


function gameLoop(time) {

    const delta =
        time - lastTime;


    lastTime = time;


    /* Jogador 1 */

    if (game1.running) {

        game1.update(delta);
    }


    /* Jogador 2 */

    if (
        currentMode === 2 &&
        game2.running
    ) {

        game2.update(delta);
    }


    requestAnimationFrame(
        gameLoop
    );
}


requestAnimationFrame(
    gameLoop
);


/* =========================================================
   ESTADO INICIAL
========================================================= */

game.classList.add(
    "hidden"
);


actions.classList.add(
    "hidden"
);


instructions.classList.add(
    "hidden"
);


player2Container.classList.add(
    "hidden"
);


controls2.classList.add(
    "hidden"
);


mobileControls.classList.add(
    "hidden"
);


game1.draw();

game2.draw();