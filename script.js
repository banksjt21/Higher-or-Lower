
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



function random() {
    return Math.random();

}




class Game {
    constructor() {
        //  New Game Started
        console.log("New Game Started");

        //  Create the players
        this.playerOne = new Player("Player One");
        this.playerTwo = new Player("Player Two");

        //  Create a new Deck of cards
        this.deck = new Deck(this.playerOne, this.playerTwo);
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

    //  Display player cards
    displayCards() {
        this.createCardElements(this.playerOne, playerOneCardsElement);
        this.createCardElements(this.playerTwo, playerTwoCardsElement);
    }


    seven() {
        //  Shuffle the cards
        this.currentDeck = this.deck.shuffle();

        //  Deal cards to players
        this.deck.deal();

        //  Display the cards in browser
        this.displayCards();

        //  Determine who plays first
        this.playerOne.determineFirstPlayer(this.playerOne, this.playerTwo);

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
        this.firstPlayerTurns           = 0;

        this.secondPlayerCardsElement   = document.querySelector(`#${this.second}`).querySelector(`#${this.second}Cards`);
        this.secondPlayerCards          = this.secondPlayerCardsElement.querySelectorAll('.card');
        this.secondPlayerStatusElement  = document.querySelector(`#${this.second}`).querySelector('.status');
        this.secondPlayerMessageElement = document.querySelector(`#${this.second}`).querySelector('.message');
        this.secondPlayerButtonHigher   = document.querySelector(`#${this.second}`).querySelector('.higher');
        this.secondPlayerButtonLower    = document.querySelector(`#${this.second}`).querySelector('.lower');
        this.secondPlayerTurns          = 0;


        //  Let first player know that it's their turn to play
        this.firstPlayerStatusElement.classList.toggle('hide');
        this.firstPlayerMessageElement.textContent = "Testing";


        //  Show firstPlayer card
        this.currentCard = this.firstPlayer.playerCards.shift();
        this.nextCard    = this.firstPlayer.playerCards.shift();
        this.currentCardElement = this.firstPlayerCards[this.firstPlayerTurns].querySelector('.cardInfo');
        this.firstPlayerTurns++;
        this.nextCardElement    = this.firstPlayerCards[this.firstPlayerTurns].querySelector('.cardInfo');
        this.currentCardElement.classList.toggle('hide');


        //  Disable the secondPlayer buttons
        this.secondPlayerButtonHigher.toggleAttribute('disabled');
        this.secondPlayerButtonLower.toggleAttribute('disabled');


        //  Define guess functions
        function checkHigher(theCurrentCard, theNextCard, currentPlayer, evt) {
            console.log("Checking if card is higher ...");
            // console.log(evt);

            //  Current cards to compare
            let currentComparison = [theCurrentCard, theNextCard];
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
            let playerGuess = undefined;
            console.log(currentComparison);
            if(currentComparison[1] > currentComparison[0]) {
                playerGuess = true;
            } else {
                playerGuess = false;
            }

            //  Define messages
            let currentMessageElement = undefined;
            let higherText = "Great job! You chose correctly!";
            let lowerText  = "Oh no. Better luck next time ...";

            //  Update message element with result of guess
            currentMessageElement = document.querySelector(`#${currentPlayer}`).querySelector('.message');
            if(playerGuess === true) {
                currentMessageElement.textContent = higherText;
            } else {
                currentMessageElement.textContent = lowerText;
            }
        }


        function checkLower(theCurrentCard, theNextCard, currentPlayer, evt) {
            console.log("Checking if card is lower than or equal to ...");
            // console.log(evt);

            //  Current cards to compare
            let currentComparison = [theCurrentCard, theNextCard];
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
            let playerGuess = undefined;
            console.log(currentComparison);
            if(currentComparison[1] <= currentComparison[0]) {
                playerGuess = true;
            } else {
                playerGuess = false;
            }

            //  Define messages
            let currentMessageElement = undefined;
            let higherText = "Great job! You chose correctly!";
            let lowerText  = "Oh no. Better luck next time ...";

            //  Update message element with result of guess
            currentMessageElement = document.querySelector(`#${currentPlayer}`).querySelector('.message');
            if(playerGuess === true) {
                currentMessageElement.textContent = higherText;
            } else {
                currentMessageElement.textContent = lowerText;
            }
        }


        //  Add event listener to buttons
        playerOneButtonHigher.addEventListener('click', (evt) => {checkHigher(this.currentCard, this.nextCard, "playerOne", evt)});
        playerOneButtonLower.addEventListener('click',  (evt) => { checkLower(this.currentCard, this.nextCard, "playerOne", evt)});        
        playerTwoButtonHigher.addEventListener('click', (evt) => {checkHigher(this.currentCard, this.nextCard, "playerTwo", evt)});
        playerTwoButtonLower.addEventListener('click',  (evt) => { checkLower(this.currentCard, this.nextCard, "playerTwo", evt)});
        
        








        // console log the remaining cards
        console.log(this.deck.cardsShuffled);




        
    }




}
    

class Deck {
    constructor(playerOne, playerTwo) {
        this.cards = [
            'A♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
            'A♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
            'A♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣',
            'A♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥'
        ];
        this.cardCount = this.cards.length;
        this.cardsShuffled = [];
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
    }

    //  sort using the Array.sort() method
    shuffle() {
        this.cardsShuffled = this.cards.sort( () => Math.random() - 0.5 );
        console.log("Cards have been shuffled.");
        return this.cardsShuffled;
    }

    //  sort using a for loop
    shuffle2(cards) {
        for(let a = 0; a < cards.length - 2; a++) {
            let z = Math.floor(Math.random() * cards.length);
            let temp = cards[a];
            cards[a] = cards[z];
            cards[z] = temp;
        }
        return cards;
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

    drawCard(player) {
        player.playerCards.push(this.cardsShuffled.shift());
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
        console.log(`${this.name} created.`);
    }

    determineFirstPlayer(playerOne, playerTwo) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
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
game.seven();















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