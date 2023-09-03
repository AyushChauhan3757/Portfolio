// Get the grid element from the HTML
const grid = document.getElementById("grid");

// Flag to lock the game when it's over
let lockGame = false;

// Set test mode to true if you want to see mines' locations
const testMode = false;

// Initialize the game by generating the grid and mines
generateGrid();

// Generate a 10x10 grid
function generateGrid() {
    // Reset the game state
    lockGame = false;
    // Clear any existing grid
    grid.innerHTML = "";
    
    // Create a 10x10 grid
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            // Set click event handler for cell
            cell.onclick = function () { init(this); };
            // Create a custom attribute to track if the cell contains a mine
            var mine = document.createAttribute("mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
    // Generate mines randomly on the grid
    generateMines();
}

// Generate mines randomly and place them on the grid
function generateMines() {
    // Add 20 mines to the game
    for (var i = 0; i < 20; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        // Set the custom attribute to indicate a mine is present
        cell.setAttribute("mine", "true");
        // If in test mode, display "X" to indicate mines
        if (testMode) {
            cell.innerHTML = "X";
        }
    }
}

// Highlight all mines in red when the game ends
function revealMines() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var cell = grid.rows[i].cells[j];
            if (cell.getAttribute("mine") == "true") {
                cell.className = "mine";
            }
        }
    }
}

// Check if the game is complete by verifying all non-mine cells are revealed
function checkGameComplete() {
    var gameComplete = true;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("mine") == "false") && (grid.rows[i].cells[j].innerHTML == "")) {
                gameComplete = false;
            }
        }
    }
    if (gameComplete) {
        alert("You Found All Mines!");
        // When the game is complete, reveal all mines
        revealMines();
    }
}

// Function to handle cell click events and reveal mines or numbers
function init(cell) {
    // Check if the game is already locked (game over)
    if (lockGame) {
        return;
    } else {
        // Check if the clicked cell contains a mine
        if (cell.getAttribute("mine") == "true") {
            // Player clicked on a mine, reveal all mines and lock the game
            revealMines();
            lockGame = true;
        } else {
            // Player clicked on an empty cell, reveal it
            cell.className = "active";
            
            // Display the number of neighboring mines
            var mineCount = 0;
            var cellRow = cell.parentNode.rowIndex;
            var cellCol = cell.cellIndex;
            
            for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                    if (grid.rows[i].cells[j].getAttribute("mine") == "true") {
                        mineCount++;
                    }
                }
            }
            
            // Display the mine count as content in the cell
            cell.innerHTML = mineCount;
            
            if (mineCount == 0) {
                // If the cell has no neighboring mines, recursively reveal neighboring cells
                for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                    for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                        if (grid.rows[i].cells[j].innerHTML == "") {
                            init(grid.rows[i].cells[j]);
                        }
                    }
                }
            }
            
            // Check if the game is complete after the cell click
            checkGameComplete();
        }
    }
}
