let runningTotal = 0;
let buffer = "0";
let previousOperator;

// Get the calculator screen element
const screen = document.querySelector('.screen');

// Function to handle button clicks
function buttonClick(value) {
    if (isNaN(value)) {
        // If the value is not a number, handle it as a symbol
        handleSymbol(value);
    } else {
        // If the value is a number, handle it as a number
        handleNumber(value);
    }
    // Update the screen display with the current buffer value
    screen.innerText = buffer;
}

// Function to handle symbols (e.g., C, =, ←, +, −, ×, ÷)
function handleSymbol(symbol) {
    switch (symbol) {
        case 'C':
            // Clear the buffer and runningTotal
            buffer = '0';
            runningTotal = 0;
            break;
        case '=':
            // If there's a previous operator, perform the calculation
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseInt(buffer));
            // Reset previousOperator, update buffer with the result, and reset runningTotal
            previousOperator = null;
            buffer = runningTotal;
            runningTotal = 0;
            break;
        case '←':
            // Handle backspace by removing the last character from the buffer
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            // Handle math operators (+, −, ×, ÷)
            handleMath(symbol);
            break;
    }
}

// Function to handle math operators (+, −, ×, ÷)
function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }
    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }
    // Store the previous operator for later use
    previousOperator = symbol;
    buffer = '0';
}

// Function to perform the calculation based on the previous operator
function flushOperation(intBuffer) {
    if (previousOperator === '+') {
        runningTotal += intBuffer;
    } else if (previousOperator === '−') {
        runningTotal -= intBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= intBuffer;
    } else if (previousOperator === '÷') {
        runningTotal /= intBuffer;
    }
}

// Function to handle numbers
function handleNumber(numberString) {
    if (buffer === "0") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

// Initialize the calculator by adding click event listeners to buttons
function init() {
    document.querySelector('.calc-buttons').addEventListener('click', function (event) {
        buttonClick(event.target.innerText);
    });
}

// Call the initialization function
init();
