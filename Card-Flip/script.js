// Select all card elements, time element, flips element, and refresh button.
const cards = document.querySelectorAll(".card"),
    timeTag = document.querySelector(".time b"),
    flipsTag = document.querySelector(".flips b"),
    refreshBtn = document.querySelector(".details button");

// Initialize game variables
let maxTime = 20;
let timeLeft = maxTime;
let flips = 0;
let matchedCards = 0;
let disabledDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

// Timer function to update the time left
function initTimer() {
    if (timeLeft <= 0) {
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerHTML = timeLeft;
}

// Function to handle card flipping
function flipCard({ target: clickedCard }) {
    if (!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if (clickedCard !== cardOne && !disabledDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if (!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disabledDeck = true;
        let cardOneIcon = cardOne.querySelector(".back-view i").classList.value;
        let cardTwoIcon = cardTwo.querySelector(".back-view i").classList.value;
        matchCards(cardOneIcon, cardTwoIcon);
    }
}

// Function to check if two flipped cards match
function matchCards(icon1, icon2) {
    if (icon1 === icon2) {
        matchedCards++;
        if (matchedCards == 6 && timeLeft > 0) {
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disabledDeck = false;
    }

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

// Function to shuffle cards and start a new game
function shuffleCards() {
    timeLeft = maxTime;
    flips = matchedCards = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerHTML = timeLeft;
    flipsTag.innerText = flips;
    disabledDeck = isPlaying = false;

    // Array of card icons to shuffle and duplicate for pairs
    let arr = ["bxl-tiktok", "bxl-instagram-alt", "bxl-facebook-circle", "bxl-twitter", "bxl-whatsapp", "bxl-youtube"];
    arr = arr.concat(arr); // Duplicate the icons so there are pairs
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // Shuffle the icons randomly

    // Assign shuffled icons to cards and add click event listeners
    cards.forEach((card, index) => {
        card.classList.remove("flip");
        let iconTag = card.querySelector(".back-view i");
        setTimeout(() => {
            iconTag.className = `bx ${arr[index]}`;
        }, 500);
        card.addEventListener("click", flipCard);
    });
}

// Initial shuffle to start the game
shuffleCards();

// Event listener for the refresh button
refreshBtn.addEventListener("click", shuffleCards);

// Event listener for clicking on cards
cards.forEach((card, index) => {
    card.addEventListener("click", flipCard);
});