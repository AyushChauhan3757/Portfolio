// Selecting elements from the HTML document
const cards = document.querySelectorAll(".card"); // Select all elements with the class "card"
const timeTag = document.querySelector(".time b"); // Select the time display element
const flipsTag = document.querySelector(".flips b"); // Select the flips display element
const refreshBtn = document.querySelector(".details button"); // Select the refresh button

// Initializing game variables
let maxTime = 20; // Maximum game time in seconds
let timeLeft = maxTime; // Current time left in the game
let flips = 0; // Number of flips made by the player
let matchedCards = 0; // Number of matched pairs
let disabledDeck = false; // Flag to prevent card flips while processing
let isPlaying = false; // Flag to track if the game is in progress
let cardOne, cardTwo, timer; // Variables to track flipped cards and the timer

// Function to initialize and update the game timer
function initTimer() {
    if (timeLeft <= 0) {
        return clearInterval(timer); // Stop the timer when time runs out
    }
    timeLeft--;
    timeTag.innerHTML = timeLeft;
}

// Function to handle card flipping
function flipCard({ target: clickedCard }) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000); // Start the timer when the first card is flipped
    }
    if (clickedCard !== cardOne && !disabledDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if (!cardOne) {
            cardOne = clickedCard; // Store the first flipped card
        } else {
            cardTwo = clickedCard;
            disabledDeck = true;
            let cardOneIcon = cardOne.querySelector(".back-view i").classList.value;
            let cardTwoIcon = cardTwo.querySelector(".back-view i").classList.value;
            matchCards(cardOneIcon, cardTwoIcon);
        }
    }
}

// Function to check if two flipped cards match
function matchCards(icon1, icon2) {
    if (icon1 === icon2) {
        matchedCards++;
        if (matchedCards == 6 && timeLeft > 0) {
            return clearInterval(timer); // Stop the timer when all pairs are matched
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        disabledDeck = false; // Allow further card flips
    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = cardTwo = "";
            disabledDeck = false;
        }, 1200);
    }
}

// Function to shuffle and reset the cards
function shuffleCards() {
    timeLeft = maxTime;
    flips = matchedCards = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerHTML = timeLeft;
    flipsTag.innerText = flips;
    disabledDeck = isPlaying = false;

    let arr = [
        "bxl-tiktok",
        "bxl-instagram-alt",
        "bxl-facebook-circle",
        "bxl-twitter",
        "bxl-whatsapp",
        "bxl-youtube",
    ];
    arr.sort(() => (Math.random() > 0.5 ? 1 : -1)); // Shuffle the icon array randomly

    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let iconTag = card.querySelector(".back-view i");
        setTimeout(() => {
            iconTag.classList.value = `bx ${arr[index]}`;
        }, 500);
        card.addEventListener("click", flipCard);
    });
}

// Initial shuffle and setup of event listeners
shuffleCards(); // Shuffle the cards at the beginning of the game

refreshBtn.addEventListener("click", shuffleCards); // Add event listener to the refresh button

cards.forEach((card) => {
    card.addEventListener("click", flipCard); // Add event listener to each card for flipping
});
