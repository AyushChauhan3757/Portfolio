// Initialize variables to manage calculator state
let runningTotal = 0; // Stores the running total of calculations
let buffer = "0"; // Stores the current input or number
let previousOperator; // Stores the previous operator pressed
let decimalFlag = false; // Flag to track if a decimal point has been entered

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
            decimalFlag = false; // Reset the decimal flag
            break;
        case '=':
            // If there's a previous operator, perform the calculation
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseFloat(buffer)); // Parse buffer as a float for decimal support
            // Reset previousOperator, update buffer with the result, and reset runningTotal
            previousOperator = null;
            buffer = runningTotal.toString();
            runningTotal = 0;
            decimalFlag = buffer.includes('.'); // Check if the result contains a decimal
            break;
        case '←':
            // Handle backspace by removing the last character from the buffer
            if (buffer.length === 1) {
                buffer = '0';
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
                decimalFlag = buffer.includes('.'); // Check if the remaining buffer contains a decimal
            }
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            // Handle math operators (+, −, ×, ÷)
            handleMath(symbol);
            break;
        case '.':
            // Handle decimal point input
            if (!decimalFlag) {
                buffer += '.';
                decimalFlag = true;
            }
            break;
    }
}

// Function to handle math operators (+, −, ×, ÷)
function handleMath(symbol) {
    if (buffer === '0') {
        return;
    }
    const floatBuffer = parseFloat(buffer); // Parse buffer as a float for decimal support
    if (runningTotal === 0) {
        runningTotal = floatBuffer;
    } else {
        flushOperation(floatBuffer);
    }
    // Store the previous operator for later use
    previousOperator = symbol;
    buffer = '0';
    decimalFlag = false; // Reset the decimal flag
}

// Function to perform the calculation based on the previous operator
function flushOperation(floatBuffer) {
    if (previousOperator === '+') {
        runningTotal += floatBuffer;
    } else if (previousOperator === '−') {
        runningTotal -= floatBuffer;
    } else if (previousOperator === '×') {
        runningTotal *= floatBuffer;
    } else if (previousOperator === '÷') {
        if (floatBuffer === 0) {
            // Handle division by zero
            alert("Error: Division by zero");
            clearCalculator();
            return;
        }
        runningTotal /= floatBuffer;
    }
}

// Function to handle numbers and decimal point input
function handleNumber(numberString) {
    if (buffer === "0" && numberString !== "0") {
        buffer = numberString;
    } else {
        buffer += numberString;
    }
}

// Function to clear the calculator
function clearCalculator() {
    buffer = '0';
    runningTotal = 0;
    previousOperator = null;
    decimalFlag = false;
    screen.innerText = buffer;
}

// Initialize the calculator by adding click event listeners to buttons
function init() {
    document.querySelector('.calc-buttons').addEventListener('click', function (event) {
        buttonClick(event.target.innerText);
    });
}

// Call the initialization function
init();
