/*  ===============================================================================================
//  HIGHER OR LOWER
===================================================================================================
//  - Higher or Lower is a family-friendly card game that adults and children of all ages can play!
//  - It's simple ... Guess whether the pip (number or letter) of your card is higher or lower than 
//    the one being shown.
//  - This game has been created using HTML, CSS & JavaScript. 
//  - Basic JavaScript has been used to create and control the cards and logic. 
//  - While animations have been added using the Animate.css library.
===============================================================================================  */




/*  ===============================================================================================
//  GAME LOGIC
===================================================================================================
//  - The player order is determined at random each game.
//  - Seven cards are dealt to each player face-down.
//  - The first card of each player's hand is placed face-up.
//  - Each player must select a button that corresponds with whether they think their next unturned
//    card will be higher or lower/equal to the previous face-up card.
//  - If the player guesses correctly, then they get to guess again.
//  - The next card is turned face-up, and the player gets a chance to guess the next unturned card.
//  - If the player guesses incorrectly, then the next player gets an opportunity to guess whether
//    the next card in their hand is higher or lower/equal.
//  - The players then alternate turns each time one guesses incorrectly.
//  - The first player to guess all of their cards correctly, wins the game.
//  - At this point, all of the winning player's cards will be overturned.
//  - A reset button is presented to allow the players to start a new game at any time.
===============================================================================================  */




/*  ===============================================================================================
//  GLOBAL VARIABLES
===================================================================================================
//  Variables that will be used throughout the appliation
===============================================================================================  */
//  Retrieve the player div IDs for each player
let playerOneElement      = document.querySelector('#playerOne');
let playerTwoElement      = document.querySelector('#playerTwo');

//  Retrieve the cards element for each player
let playerOneCardsElement = document.querySelector('#playerOneCards');
let playerTwoCardsElement = document.querySelector('#playerTwoCards');

//  Retrieve the gameplay buttons for each player
let playerOneButtonHigher = playerOneElement.querySelector('.higher');
let playerOneButtonLower  = playerOneElement.querySelector('.lower');
let playerTwoButtonHigher = playerTwoElement.querySelector('.higher');
let playerTwoButtonLower  = playerTwoElement.querySelector('.lower');

//  Retrieve the button that will be used to reset the game
let playAgainButton       = document.querySelector('#playAgain');
playAgainButton.addEventListener('click', playAgain);

//  Colors that will be used for the card pips (letters / numbers)
let primaryColor          = "black";
let secondaryColor        = "red";

//  Audio sound for card flip
const cardFlip = new Audio('ui-click-97915.mp3');




/*  ===============================================================================================
//  GLOBAL FUNCTIONS
===================================================================================================
//  Functions that will be used throughout the appliation
===============================================================================================  */
//  Generate a random number
function random() {
    return Math.random();
}

//  Refreshes the browser to start a new game
function playAgain() {
    window.location.reload();
}




/*  ===============================================================================================
//  GAME CLASS
===================================================================================================
//  Class that controls the entire game.
===============================================================================================  */
class Game {
    constructor() {
        //  New Game Started
        console.log("New Game Started");

        //  Create the players
        this.playerOne = new Player("Player One");
        this.playerTwo = new Player("Player Two");

        //  Create a new Deck of cards
        this.deck = new Deck(this);

        //  Shuffle the cards
        this.currentDeck = this.deck.shuffle();

        //  Deal cards to players
        this.deck.deal();
        
        //  Display the cards in browser
        this.displayCards();

        //  Properties for first and second player
        this.first;
        this.firstPlayer;
        this.firstPlayerCardsElement;
        this.firstPlayerCards;
        this.firstPlayerStatusElement;
        this.firstPlayerMessageElement;
        this.firstPlayerButtonHigher;
        this.firstPlayerButtonLower;

        this.second;
        this.secondPlayer;
        this.secondPlayerCardsElement;
        this.secondPlayerCards;
        this.secondPlayerStatusElement;
        this.secondPlayerMessageElement;
        this.secondPlayerButtonHigher;
        this.secondPlayerButtonLower;

        this.currentPlayer;
        this.nextPlayer;
        this.currentCard;
        this.currentCardElement;
        this.nextCard;
        this.nextCardElement;

        this.currentMessageElement;
        this.nextMessageElement;
        this.tempMessageElement;

        this.currentStatusElement;
        this.nextStatusElement;
        this.tempStatusElement;

        this.playerGuess = undefined;

        this.tempName;
        this.tempPlayer;

        this.tempCurrentCard;
        this.tempNextCard;
        
        this.npCurrentCard;
        this.npNextCard;

        this.npCurrentCardElement;
        this.npNextCardElement;

        this.tempCurrentCardElement;
        this.tempNextCardElement;

        this.currentPlayerCount = 0;
        this.nextPlayerCount = 0;

        this.currentPlayerElement;
        this.currentPlayerButtons;
        this.nextPlayerElement;
        this.nextPlayerButtons;


        //  Set play order
        this.preparePlayers();

        //  Setup turn for firstPlayer
        this.setupFirstTurn();

        //  Add event listener to buttons
        playerOneButtonHigher.addEventListener('click', (evt) => {this.checkNum(evt)});
        playerOneButtonLower.addEventListener('click',  (evt) => {this.checkNum(evt)});        
        playerTwoButtonHigher.addEventListener('click', (evt) => {this.checkNum(evt)});
        playerTwoButtonLower.addEventListener('click',  (evt) => {this.checkNum(evt)});

        //  Array to hold the discarded cards
        this.cardsDiscarded = [];

        // console log the remaining cards
        console.log(this.deck.cardsShuffled);
    }


    //  Create a card element, add it to the page
    createCardElements(player, element) {
        for(let i = 0; i < this.deck.dealCount; i++) {
            let card = document.createElement('div');
            card.setAttribute('class', 'card');

            let cardInfo = document.createElement('span');
            cardInfo.setAttribute('class', 'cardInfo hide');
            cardInfo.textContent = player.playerCards[i];

            card.append(cardInfo);
            element.append(card);

            if(cardInfo.textContent.includes("♥") || cardInfo.textContent.includes("♦")) {
                cardInfo.style.color = "red";
            }
        }
    }


    //  Create a single card element, add it to the page
    createNewCard(player, element) {
        let card = document.createElement('div');
            card.setAttribute('class', 'card');

            let cardInfo = document.createElement('span');
            cardInfo.setAttribute('class', 'cardInfo hide');
            cardInfo.textContent = player.playerCards.slice(-1)[0];

            card.append(cardInfo);
            element.append(card);
    }


    //  Display player cards
    displayCards() {
        this.createCardElements(this.playerOne, playerOneCardsElement);
        this.createCardElements(this.playerTwo, playerTwoCardsElement);
    }


    //  Determines who plays first and sets up variables accordingly
    preparePlayers() {
        //  Determine who plays first
        Player.determineFirstPlayer(this);

        //  Set elements determined by who plays first
        if(this.playerOne.playFirst === true) {
            this.firstPlayer              = this.playerOne;
            this.first                    = 'playerOne';
            this.secondPlayer             = this.playerTwo;
            this.second                   = 'playerTwo';
        } else {
            this.firstPlayer              = this.playerTwo;
            this.first                    = 'playerTwo';
            this.secondPlayer             = this.playerOne;
            this.second                   = 'playerOne';
        }

        this.firstPlayerCardsElement    = document.querySelector(`#${this.first}`).querySelector(`#${this.first}Cards`);
        this.firstPlayerCards           = this.firstPlayerCardsElement.querySelectorAll('.card');
        this.firstPlayerStatusElement   = document.querySelector(`#${this.first}`).querySelector('.status');
        this.firstPlayerMessageElement  = document.querySelector(`#${this.first}`).querySelector('.message');
        this.firstPlayerButtonHigher    = document.querySelector(`#${this.first}`).querySelector('.higher');
        this.firstPlayerButtonLower     = document.querySelector(`#${this.first}`).querySelector('.lower');

        this.secondPlayerCardsElement   = document.querySelector(`#${this.second}`).querySelector(`#${this.second}Cards`);
        this.secondPlayerCards          = this.secondPlayerCardsElement.querySelectorAll('.card');
        this.secondPlayerStatusElement  = document.querySelector(`#${this.second}`).querySelector('.status');
        this.secondPlayerMessageElement = document.querySelector(`#${this.second}`).querySelector('.message');
        this.secondPlayerButtonHigher   = document.querySelector(`#${this.second}`).querySelector('.higher');
        this.secondPlayerButtonLower    = document.querySelector(`#${this.second}`).querySelector('.lower');
    }
    

    //  Sets up the first turn for both players
    setupFirstTurn() {
        //  Let first player know that it's their turn to play
        this.firstPlayerStatusElement.classList.toggle('hide');
        this.firstPlayerMessageElement.textContent  = "Good Luck!";
        this.secondPlayerMessageElement.textContent = "Good Luck!";


        //  Show firstPlayer card
        this.currentCard          = this.firstPlayer.playerCards.shift();
        this.nextCard             = this.firstPlayer.playerCards.shift();
        this.currentCardElement   = this.firstPlayerCards[this.currentPlayerCount].querySelector('.cardInfo');
        this.currentPlayerCount++;
        this.nextCardElement      = this.firstPlayerCards[this.currentPlayerCount].querySelector('.cardInfo');
        this.currentCardElement.classList.toggle('hide');


        //  Get secondPlayer cards ready for their turn
        this.npCurrentCard        = this.secondPlayer.playerCards.shift();
        this.npNextCard           = this.secondPlayer.playerCards.shift();
        this.npCurrentCardElement = this.secondPlayerCards[this.nextPlayerCount].querySelector('.cardInfo');
        this.nextPlayerCount++;
        this.npNextCardElement    = this.secondPlayerCards[this.nextPlayerCount].querySelector('.cardInfo');
        this.npCurrentCardElement.classList.toggle('hide');


        //  Disable the secondPlayer buttons
        this.secondPlayerButtonHigher.toggleAttribute('disabled');
        this.secondPlayerButtonLower.toggleAttribute('disabled');
    }


    //  Messages to let the players know whether they guessed correctly or incorrectly
    updateMessage() {
        //  Define messages
        let correctText = "Great job! You chose correctly!";
        let incorrectText  = `Oh no. Better luck next time ... Do you remember the option you selected?`;


        //  Update message element with result of guess
        this.currentMessageElement = document.querySelector(`#${this.tempName}`).querySelector('.message');
        if(this.playerGuess === true) {
            this.currentMessageElement.textContent = correctText;
            console.log(correctText);
        } else {
            this.currentMessageElement.textContent = incorrectText;
            console.log(incorrectText);
        }
    }


    //  Swaps the players' turn, updates browser elements and variables
    updateCards() {
        //  get the actual player object
        if(this.tempName === "playerOne") {
            this.currentPlayer        = this.playerOne;
            this.nextPlayer           = this.playerTwo;
            this.currentPlayerElement = document.querySelector('#playerOne');
            this.nextPlayerElement    = document.querySelector('#playerTwo');
        } else {
            this.currentPlayer        = this.playerTwo;
            this.nextPlayer           = this.playerOne;
            this.currentPlayerElement = document.querySelector('#playerTwo');
            this.nextPlayerElement    = document.querySelector('#playerOne');
        }


        //  Update the current player's hand
        console.log(this.currentCard, this.nextCard);                       // show the current cards being compared before they are updated

        if(this.playerGuess === true) {
            this.currentCard = this.nextCard;                               // set the nextCard that the player just guessed correctly as the currentCard
            this.nextCard    = this.currentPlayer.playerCards.shift();      // get another card from the player's hand for their next turn

            console.log(this.currentCard, this.nextCard);                   // cards that will be compared on their next turn
            console.log(this.currentPlayer.playerCards);                    // cards remaining in the player's hand
        } else {
            // this.cardsDiscarded.push(this.nextCard);                     // send the card they got wrong to the cardsDiscarded array
            // this.currentCardElement.parentElement.remove();              // remove card they got wrong from the browser
            // this.deck.drawCard(this.currentPlayer);                      // draw another card from currentDeck and add it as the last card in their hand
            // this.createNewCard(this.currentPlayer, this.currentPlayerElement.querySelector('.cards'));        // Something goes wrong with this section of code
            // this.nextCard = this.currentPlayer.playerCards.shift();      // get the next card from the player's hand for their next turn

            console.log(this.currentCard, this.nextCard);                   // cards that will be compared on their next turn
            console.log(this.currentPlayer.playerCards);                    // cards remaining in the player's hand
            console.log(this.cardsDiscarded);                               // cards that were not guessed correctly
            console.log(this.currentDeck);                                  // cards remaining in the currentDeck


            //  Swap the players
            this.tempPlayer      = this.currentPlayer;                      // store the currentPlayer in a temporary variable
            this.currentPlayer   = this.nextPlayer;                         // get the nextPlayer and assign them as the currentPlayer
            this.nextPlayer      = this.tempPlayer;                         // get the player stored in the temporary variable and assign them as the nextPlayer


            //  Swap the cards that will be compared
            this.tempCurrentCard = this.currentCard;                        // store the currentCard in a temporary variable
            this.tempNextCard    = this.nextCard;                           // store the nextCard in a temporary variable
            this.currentCard     = this.npCurrentCard;                      // get the nextPlayer's currentCard and assign it as the currentCard (to be compared)
            this.nextCard        = this.npNextCard;                         // get the nextPlayer's nextCard and assign it as the nextCard (to be compared)
            this.npCurrentCard   = this.tempCurrentCard;                    // get the former currentCard from the temporary variable and assign it as the nextPlayer's currentCard
            this.npNextCard      = this.tempNextCard;                       // get the former nextCard from the temporary variable and assign it as the nextPlayer's nextCard


            //  Swap the browser elements
            this.tempCurrentCardElement = this.currentCardElement;          // store the currentCardElement in a temporary variable
            this.tempNextCardElement    = this.nextCardElement;             // store the nextCardElement in a temporary variable
            this.currentCardElement     = this.npCurrentCardElement;        // get the nextPlayer's currentCardElement and assign it as the currentCardElement
            this.nextCardElement        = this.npNextCardElement;           // get the nextPlayer's nextCardElement and assign it as the nextCardElement
            this.npCurrentCardElement   = this.tempCurrentCardElement;      // get the former currentCardElement from the temporary variable and assign it as the nextPlayer's currentCardElement
            this.npNextCardElement      = this.tempNextCardElement;         // get the former nextCardElement from the temporary variable and assign it as the nextPlayer's nextCardElement


            // this.tempMessageElement     = this.currentMessageElement;
            // this.currentMessageElement  = this.nextMessageElement;
            // this.nextMessageElement     = this.tempMessageElement;


            // this.tempStatusElement      = this.currentStatusElement;
            // this.currentStatusElement   = this.nextStatusElement;
            // this.nextStatusElement      = this.tempStatusElement;


            //  Toggle the buttons
            // this.currentPlayerButtons = this.currentPlayerElement.querySelectorAll('.buttons');
            // this.currentPlayerButtons.forEach(function(button) {
            //     button.toggleAttribute('disabled');
            // })


            //  Toggles the disabled attribute on the player buttons
            let buttonsToSwitch  = document.querySelectorAll('.buttonsPlay button');
            buttonsToSwitch.forEach(function(button) {
                button.toggleAttribute('disabled');
            })
            

            // console.log(this.cardsDiscarded);
            // this.nextCardElement.classList.toggle('hide');
        }


        //  Update the current player's hand in browser
        if(this.playerGuess === true) {
            console.log(this.currentCardElement, this.nextCardElement)
            this.nextCardElement.classList.toggle('hide');
            this.nextCardElement.parentElement.classList.add('animate__animated');
            this.nextCardElement.parentElement.classList.add('animate__flipInY');
            console.log(this.nextCardElement.parentElement);
            console.log(this.nextCardElement.parentElement.parentElement.lastElementChild);

            cardFlip.play();

            //  if nextCardElement is the last card in the player's hand, end the game
            if(this.nextCardElement.parentElement.isSameNode(this.currentCardElement.parentElement.parentElement.lastElementChild)) {
                console.log(`${this.currentPlayer.name} wins! Congratulations!`);
                this.currentMessageElement.textContent = `${this.currentPlayer.name} wins! Congratulations!`;
                // this.nextMessageElement.textContent = `You'll get em next time ...`;

                //  Disable all player buttons
                let buttonsToDisable = document.querySelectorAll('.buttonsPlay button');
                buttonsToDisable.forEach(function(button) {
                    button.setAttribute('disabled', "");
                });
                console.log("All buttons disabled.")
                
                return;
            }
            

            //  The next set of card elements that will be compared
            this.currentCardElement = this.currentCardElement.parentElement.nextElementSibling.firstChild;
            this.nextCardElement    = this.nextCardElement.parentElement.nextElementSibling.firstChild;
            console.log(this.currentCardElement, this.nextCardElement);
        } else {
            
        }

    }


    //  Define guess function
    checkNum(evt) {
        console.log("Checking the number ...");
        let clickedButton = evt.target.textContent;     // "higher" or "lower"
        this.tempName = evt.path[2].id;                 // "playerOne" or "playerTwo"


        //  Prepare current cards to compare
        let currentComparison = [this.currentCard, this.nextCard];
        for(let c = 0; c < currentComparison.length; c++) {
            //  Extract the value of the card
            currentComparison[c] = currentComparison[c].slice(0, -1);

            //  Convert face cards to their string value
            if(currentComparison[c] === "A" || currentComparison[c] === "J" || currentComparison[c] === "Q" || currentComparison[c] === "K") { 
                currentComparison[c] = Deck.convertFaceToValue(currentComparison[c]);
            }

            //  Convert strings to numbers
            currentComparison[c] = Number(currentComparison[c]);
        }


        //  Perform comparison
        this.playerGuess = undefined;
        console.log(currentComparison);
        if(clickedButton === "Higher") {
            console.log("You chose higher")
            if(currentComparison[1] > currentComparison[0]) {
                this.playerGuess = true;
            } else {
                this.playerGuess = false;
            }
        } else {
            console.log("You chose lower/equal")
            if(currentComparison[1] <= currentComparison[0]) {
                this.playerGuess = true;
            } else {
                this.playerGuess = false;
            }    
        }


        //  Messages to let the players know whether they guessed correctly or incorrectly
        this.updateMessage();


        //  Swaps the players' turn, updates browser elements and variables
        this.updateCards();
    }

}
    



/*  ===============================================================================================
//  DECK CLASS
===================================================================================================
//  Class that represents the deck of cards
===============================================================================================  */
class Deck {
    constructor(gameObj) {
        this.cards = [
            'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
            'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
            'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣',
            'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥'
        ];
        this.cardCount = this.cards.length;
        this.cardsShuffled = [];
        this.playerOne = gameObj.playerOne;
        this.playerTwo = gameObj.playerTwo;
    }

    //  sort using the Array.sort() method
    shuffle() {
        this.cardsShuffled = this.cards.sort( () => Math.random() - 0.5 );
        console.log("Cards have been shuffled.");
        return this.cardsShuffled;
    }

    //  sort using a for loop
    shuffle2(theDeck) {
        for(let a = 0; a < theDeck.length - 2; a++) {
            let z = Math.floor(Math.random() * theDeck.length);
            let temp = theDeck[a];
            theDeck[a] = theDeck[z];
            theDeck[z] = temp;
        }
        return theDeck;
    }


    //  deals cards to the players in alternating order. 
    deal() {
        this.cardsShuffled = this.shuffle();
        this.dealCount = 7;
        
        console.log(this.cardsShuffled);

        console.log("Cards are being dealt");
        for(let x = 0; x < this.dealCount; x++) {
            this.playerOne.playerCards.push(this.cardsShuffled.shift());
            this.playerTwo.playerCards.push(this.cardsShuffled.shift());
        }

        console.log(this.playerOne.name);
        console.log(this.playerOne.playerCards);
        console.log(this.playerTwo.name);
        console.log(this.playerTwo.playerCards);
        console.log("Cards have been dealt");
    }


    //  draw a single card from the deck and add it to the player's hand
    drawCard(currentPlayer) {
        currentPlayer.playerCards.push(this.cardsShuffled.shift());
    }


    //  convert the face card to a value
    static convertFaceToValue(faceCard) {
        switch (faceCard) {
            case "A":
                faceCard = '14';
                return faceCard;
            case "J":
                faceCard = '11';
                return faceCard;
            case "Q":
                faceCard = '12';
                return faceCard;
            case "K":
                faceCard = '13';
                return faceCard;
            default:
                break;
        }
    }
}




/*  ===============================================================================================
//  PLAYER CLASS
===================================================================================================
//  Class that represents the players
===============================================================================================  */
class Player {
    constructor(name) {
        this.name = name;
        this.playerCards = [];
        this.playFirst = false;
        this.count = 0;
        console.log(`${this.name} created.`);
    }

    //  Determines who the first player is at random
    static determineFirstPlayer(gameObj) {
        this.playerOne = gameObj.playerOne;
        this.playerTwo = gameObj.playerTwo;

        if(random() > 0.5) {
            this.playerOne.playFirst = true;
            console.log(`${this.playerOne.name} plays first.`);
        } else {
            this.playerTwo.playFirst = true;
            console.log(`${this.playerTwo.name} plays first.`);
        }
    }

}




/*  ===============================================================================================
//  START THE GAME
===================================================================================================
//  Creates a new game object and handles all gameplay functionality
===============================================================================================  */
const game = new Game();