
/*
CRAZY 8s
====================
This game has one crazy twist: eights rule!
Deal out seven cards to each person in a two-player game, or five cards for games with three or four players.
The rest go in a draw pile, with one card turned over to start the play pile.
The player to the dealer's left must match the card's number or suit from the face-up pile.
A player who does not have a match may play an eight and change the suit to anything they wish.
A player who has neither a match nor an eight must draw until he gets a card that can be played.
The first to discard all their cards wins.
(Did you notice that this game is UNO, without buying a fancy deck?)

SEVEN-IN-A-ROW
====================
Place seven cards face-down in a row in front of each player.
Player 1 turns over her first card. She declares if she thinks the next card will be higher or lower.
If it is, the process continues.
If she's wrong (or if the number is the same), she stops and it's the next player's turn.
Player 2 will see if he can get further than Player 1.
Essentially, everyone plays until they're wrong, and the first person to finish their row of seven is the winner.
Players get a new hand of seven cards with each turn.
*/


let playerOneElement      = document.querySelector('#playerOne');
let playerTwoElement      = document.querySelector('#playerTwo');

let playerOneCardsElement = document.querySelector('#playerOneCards');
let playerTwoCardsElement = document.querySelector('#playerTwoCards');

let playerOneButtonHigher = playerOneElement.querySelector('.higher');
let playerOneButtonLower  = playerOneElement.querySelector('.lower');
let playerTwoButtonHigher = playerTwoElement.querySelector('.higher');
let playerTwoButtonLower  = playerTwoElement.querySelector('.lower');

let playAgainButton       = document.querySelector('#playAgain');
playAgainButton.addEventListener('click', playAgain);




function random() {
    return Math.random();
}

function playAgain() {
    window.location.reload();
}




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
        // this.firstPlayerCount = 0;

        this.second;
        this.secondPlayer;
        this.secondPlayerCardsElement;
        this.secondPlayerCards;
        this.secondPlayerStatusElement;
        this.secondPlayerMessageElement;
        this.secondPlayerButtonHigher;
        this.secondPlayerButtonLower;
        // this.secondPlayerCount = 0;

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


        //  Game Loop
        this.round = 1;
        this.cardsDiscarded = [];

        console.log(this.playerOne.playerCards.length);
        console.log(this.playerTwo.playerCards.length);


        // this.gameLoop();

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


    //  
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


    updateMessage() {
        //  Define messages
        // let currentMessageElement = undefined;
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
            // this.cardsDiscarded.push(this.nextCard);                        // send the card they got wrong to the cardsDiscarded array
            // this.currentCardElement.parentElement.remove();        // remove card they got wrong from the browser
            // this.deck.drawCard(this.currentPlayer);                         // draw another card from currentDeck and add it as the last card in their hand
            // this.createNewCard(this.currentPlayer, this.currentPlayerElement.querySelector('.cards'));        // Something goes wrong with this section of code
            // this.nextCard = this.currentPlayer.playerCards.shift();         // get the next card from the player's hand for their next turn

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

            let buttonsToSwitch  = document.querySelectorAll('.buttonsPlay button');
            buttonsToSwitch.forEach(function(button) {
                button.toggleAttribute('disabled')
            })
            


            // console.log(this.cardsDiscarded);
            // this.nextCardElement.classList.toggle('hide');
        }


        //  Update the current player's hand in browser
        if(this.playerGuess === true) {
            console.log(this.currentCardElement, this.nextCardElement)
            this.nextCardElement.classList.toggle('hide');
            console.log(this.nextCardElement.parentElement)
            console.log(this.nextCardElement.parentElement.parentElement.lastElementChild)

            // if nextCardElement is the last card in the player's hand, end the game
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


        this.updateMessage();


        this.updateCards();
    }



    // gameLoop() {
    //     while(this.playerOne.playerCards.length >= 0 || this.playerTwo.playerTwo.length >= 0) {
            
    //     }
    // }

}
    

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

    drawCard(currentPlayer) {
        currentPlayer.playerCards.push(this.cardsShuffled.shift());
    }

    static convertFaceToValue(faceCard) {
        switch (faceCard) {
            case "A":
                faceCard = '1';
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





class Player {
    constructor(name) {
        this.name = name;
        this.playerCards = [];
        this.playFirst = false;
        this.count = 0;
        console.log(`${this.name} created.`);
    }

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



//  Start a new Game
const game = new Game();
// game.seven();















// TESTING
// console.log(deck.cards)
// deck.shuffle();
// console.log(deck.cardsShuffled)
// console.log(deck.shuffle2(deck.cards))


// class Players {
//     constructor() {
//         this.playerOne;
//         this.playerTwo;
//         this.playerOneCards = [];
//         this.playerTwoCards = [];
//     }
// }




// this.cards = [
//     '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', 'Js', 'Qs', 'Ks',
//     '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d', '9d', '10d', 'Jd', 'Qd', 'Kd',
//     '1c', '2c', '3c', '4c', '5c', '6c', '7c', '8c', '9c', '10c', 'Jc', 'Qc', 'Kc',
//     '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', 'Jh', 'Qh', 'Kh'
// ];



        //  Set the first card played
        // this.currentPlayedCard = this.currentDeck.shift();
        // console.log("First card played");
        // console.log(this.currentPlayedCard);



                // window.prompt("Is the next card in your deck higher or lower than the one shown?");



                // if(this.playerOne.playFirst === true) {
                //     let first  = 'playerOne';
                //     let second = 'playerTwo';
                // } else {
                //     let first  = 'playerTwo';
                //     let second = 'playerOne';
                // }

                // this.firstPlayer                = first;
                // this.firstPlayerCardsElement    = playerOneCardsElement;
                // this.firstPlayerStatusElement   = document.querySelector(`#${first}`).querySelector('.playerStatus');
                // this.firstPlayerMessageElement  = document.querySelector(`#${first}`).querySelector('.message');
                // this.secondPlayer               = second;
                // this.secondPlayerCardsElement   = playerTwoCardsElement;
                // this.secondPlayerStatusElement  = document.querySelector(`#${second}`).querySelector('.playerStatus');
                // this.secondPlayerMessageElement = document.querySelector(`#${second}`).querySelector('.message');
            



                
        // if(this.playerOne.playFirst === true) {
        //     this.firstPlayer                = this.playerOne;
        //     this.firstPlayerCardsElement    = playerOneCardsElement;
        //     this.firstPlayerStatusElement   = document.querySelector('#playerOne').querySelector('.playerStatus');
        //     this.firstPlayerMessageElement  = document.querySelector('#playerOne').querySelector('.message');
        //     this.secondPlayer               = this.playerTwo;
        //     this.secondPlayerCardsElement   = playerTwoCardsElement;
        //     this.secondPlayerStatusElement  = document.querySelector('#playerTwo').querySelector('.playerStatus');
        //     this.secondPlayerMessageElement = document.querySelector('#playerTwo').querySelector('.message');
        // } else {
        //     this.firstPlayer                = this.playerTwo;
        //     this.firstPlayerCardsElement    = playerTwoCardsElement;
        //     this.firstPlayerStatusElement   = document.querySelector('#playerTwo').querySelector('.playerStatus');
        //     this.firstPlayerMessageElement  = document.querySelector('#playerTwo').querySelector('.message');
        //     this.secondPlayer               = this.playerOne;
        //     this.secondPlayerCardsElement   = playerOneCardsElement;
        //     this.secondPlayerStatusElement  = document.querySelector('#playerOne').querySelector('.playerStatus');
        //     this.secondPlayerMessageElement = document.querySelector('#playerOne').querySelector('.message');
        // }



        

        //  Store all the individual card elements
        // this.playerOneCards = playerOneCardsElement.querySelectorAll('.card');
        // this.playerTwoCards = playerTwoCardsElement.querySelectorAll('.card');



        
        //  Initialize guesses
        // this.firstPlayerGuess  = undefined;
        // this.secondPlayerGuess = undefined;

        // const currentPlayers = [this.playerOne, this.playerTwo];



        // function checkHigher(theCurrentCard, theNextCard, currentPlayer, evt) {
        //     console.log("Checking if card is higher ...");
        //     console.log(evt);

        //     //  Current cards to compare
        //     let currentComparison = [theCurrentCard, theNextCard];
        //     for(let c = 0; c < currentComparison.length; c++) {
        //         //  Extract the value of the card
        //         currentComparison[c] = currentComparison[c].slice(0, -1);

        //         //  Convert face cards to their string value
        //         if(currentComparison[c] === "A" || currentComparison[c] === "J" || currentComparison[c] === "Q" || currentComparison[c] === "K") { 
        //             currentComparison[c] = Deck.convertFaceToValue(currentComparison[c]);
        //         }

        //         //  Convert strings to numbers
        //         currentComparison[c] = Number(currentComparison[c]);
        //     }

        //     //  Perform comparison
        //     let playerGuess = undefined;
        //     console.log(currentComparison);
        //     if(currentComparison[1] > currentComparison[0]) {
        //         playerGuess = true;
        //     } else {
        //         playerGuess = false;
        //     }

        //     //  Define messages
        //     let currentMessageElement = undefined;
        //     let higherText = "Great job! You chose correctly!";
        //     let lowerText  = "Oh no. Better luck next time ...";

        //     //  Update message element with result of guess
        //     currentMessageElement = document.querySelector(`#${currentPlayer}`).querySelector('.message');
        //     if(playerGuess === true) {
        //         currentMessageElement.textContent = higherText;
        //     } else {
        //         currentMessageElement.textContent = lowerText;
        //     }
        // }


        // function checkLower(theCurrentCard, theNextCard, currentPlayer, evt) {
        //     console.log("Checking if card is lower than or equal to ...");
        //     // console.log(evt);

        //     //  Current cards to compare
        //     let currentComparison = [theCurrentCard, theNextCard];
        //     for(let c = 0; c < currentComparison.length; c++) {
        //         //  Extract the value of the card
        //         currentComparison[c] = currentComparison[c].slice(0, -1);

        //         //  Convert face cards to their string value
        //         if(currentComparison[c] === "A" || currentComparison[c] === "J" || currentComparison[c] === "Q" || currentComparison[c] === "K") { 
        //             currentComparison[c] = Deck.convertFaceToValue(currentComparison[c]);
        //         }

        //         //  Convert strings to numbers
        //         currentComparison[c] = Number(currentComparison[c]);
        //     }

        //     //  Perform comparison
        //     let playerGuess = undefined;
        //     console.log(currentComparison);
        //     if(currentComparison[1] <= currentComparison[0]) {
        //         playerGuess = true;
        //     } else {
        //         playerGuess = false;
        //     }

        //     //  Define messages
        //     let currentMessageElement = undefined;
        //     let higherText = "Great job! You chose correctly!";
        //     let lowerText  = "Oh no. Better luck next time ...";

        //     //  Update message element with result of guess
        //     currentMessageElement = document.querySelector(`#${currentPlayer}`).querySelector('.message');
        //     if(playerGuess === true) {
        //         currentMessageElement.textContent = higherText;
        //     } else {
        //         currentMessageElement.textContent = lowerText;
        //     }
        // }