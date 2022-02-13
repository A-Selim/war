const newDeckBtn = document.getElementById("new-deck");
const drawBtn = document.getElementById("draw");
const remainingCards = document.getElementById("remaining-cards");
const headerText = document.getElementById("header");
const cards = document.getElementById("cards");
const computerScoreText = document.getElementById("computer-score");
const playerScoreText = document.getElementById("player-score");

let deckId;
let computerScore = 0;
let playerScore = 0;

newDeckBtn.addEventListener("click", getNewDeck);

drawBtn.addEventListener("click", drawTwoCards);

// Get new deck of cards from API
function getNewDeck() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle")
        .then((res) => res.json())
        .then((data) => {
            // Save deck_id to use it later when draw cards
            deckId = data.deck_id;
            // Display the remaining cards of deck
            remainingCards.textContent = `Remaining Cards: ${data.remaining}`;
            // Update header text
            headerText.textContent = "Let us play";
            // Enable draw button
            drawBtn.disabled = false;
            // Reset card holders if player wants to play again
            cards.children[0].innerHTML = "";
            cards.children[1].innerHTML = "";
            // Reset score if player wants to play again
            computerScore = 0;
            playerScore = 0;
            computerScoreText.textContent = `Computer Score: ${computerScore}`;
            playerScoreText.textContent = `Player Score: ${playerScore}`;
        });
}

// Draw 2 cards from the deck
function drawTwoCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then((res) => res.json())
        .then((data) => {
            const computerCard = data.cards[0];
            const playerCard = data.cards[1];
            // Display each card image in its card holder
            cards.children[0].innerHTML = `<img src="${computerCard.image}" />`;
            cards.children[1].innerHTML = `<img src="${playerCard.image}" />`;
            // Display the remaining cards of deck
            remainingCards.textContent = `Remaining Cards: ${data.remaining}`;
            // Drfine who is winning in each draw
            defineWin(computerCard, playerCard);
            // When deck is finished disable draw button & detemine who won the game
            if (data.remaining === 0) {
                drawBtn.disabled = true;
                if (computerScore > playerScore) {
                    headerText.textContent = "Sorry, You lost";
                } else if (computerScore < playerScore) {
                    headerText.textContent = "You win the game";
                } else {
                    headerText.textContent = "It's a tie";
                }
            }
        });
}
// Function to define who is winning in each draw
function defineWin(computerCard, playerCard) {
    const cardsArr = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];

    const indexOfComputerCard = cardsArr.indexOf(computerCard.value);
    const indexOfPlayerCard = cardsArr.indexOf(playerCard.value);

    if (indexOfComputerCard > indexOfPlayerCard) {
        headerText.textContent = "Computer Wins";
        computerScore++;
        computerScoreText.textContent = `Computer Score: ${computerScore}`;
    } else if (indexOfComputerCard < indexOfPlayerCard) {
        headerText.textContent = "You Win";
        playerScore++;
        playerScoreText.textContent = `Player Score: ${playerScore}`;
    } else {
        headerText.textContent = "War";
    }
}
