"use strict"; // Enable strict mode for better code quality.

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20); // Scale the canvas for better visibility.

// Function to handle clearing filled rows in the game arena.
function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// Function to check if the player's piece collides with the arena or walls.
function collide(arena, player) {
    // Check each cell in the player's piece and the corresponding cell in the arena.
    for (let y = 0; y < player.matrix.length; ++y) {
        for (let x = 0; x < player.matrix[y].length; ++x) {
            if (
                player.matrix[y][x] !== 0 &&
                (arena[y + player.pos.y] && arena[y + player.pos.y][x + player.pos.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false;
}

// Function to create an empty matrix for the game arena.
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(Array(w).fill(0));
    }
    return matrix;
}

// Function to create Tetris pieces.
function createPiece(type) {
    // Define shapes of different Tetris pieces (I, L, J, O, Z, S, T).
    // Numbers represent colors.
    if (type === "I") {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ];
    } else if (type === "L") {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2]
        ];
    } else if (type === "J") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0]
        ];
    } else if (type === "O") {
        return [
            [4, 4],
            [4, 4]
        ];
    } else if (type === "Z") {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0]
        ];
    } else if (type === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    } else if (type === "T") {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0]
        ];
    }
}

// Function to draw a Tetris matrix on the canvas.
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Function to merge the player's piece with the arena.
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Function to rotate a matrix.
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// Function to move the player's piece down.
function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

// Function to move the player's piece horizontally.
function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

// Function to reset the player's piece.
function playerReset() {
    const pieces = "TJLOSZI";
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

// Function to rotate the player's piece.
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

// Function to update the game.
function update(time = 0) {
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    lastTime = time;
    draw();
    requestAnimationFrame(update);
}

// Function to update the player's score.
function updateScore() {
    document.getElementById("score").textContent = "Score: " + player.score;
}

// Event listener to handle key presses for controlling the game.
document.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        startGame(); // Start the game on Enter key press.
    } else if (event.keyCode === 37) {
        playerMove(-1); // Move left on left arrow key press.
    } else if (event.keyCode === 39) {
        playerMove(1); // Move right on right arrow key press.
    } else if (event.keyCode === 40) {
        playerDrop(); // Move down on down arrow key press.
    } else if (event.keyCode === 81) {
        playerRotate(-1); // Rotate counterclockwise on 'Q' key press.
    } else if (event.keyCode === 87) {
        playerRotate(1); // Rotate clockwise on 'W' key press.
    }
});

const colors = [
    null,
    "#ff0d72",
    "#0dc2ff",
    "#f538ff",
    "#ff8e0d",
    "#3877ff"
];

// Create the game arena and initialize the player object.
const arena = createMatrix(12, 20);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};

// Function to start the game.
function startGame() {
    playerReset();
    updateScore();
    update(); // Start the game loop.
}

startGame(); // Start the game initially.
