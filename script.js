
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




let p1CardsElement = document.querySelector('#playerOneCards');
let p2CardsElement = document.querySelector('#playerTwoCards');

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
            cardInfo.setAttribute('class', 'cardInfo');
            cardInfo.textContent = player.playerCards[i];

            card.append(cardInfo);
            element.append(card);
        }
    }

    //  Display player cards
    displayCards() {
        this.createCardElements(this.playerOne, p1CardsElement);
        this.createCardElements(this.playerTwo, p2CardsElement);
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
        if(this.playerOne.playFirst === true) {
            this.firstPlayer              = this.playerOne;
            this.firstPlayerCardsElement  = p1CardsElement;
            this.secondPlayer             = this.playerTwo;
            this.secondPlayerCardsElement = p2CardsElement;
        } else {
            this.firstPlayer              = this.playerTwo;
            this.firstPlayerCardsElement  = p2CardsElement;
            this.secondPlayer             = this.playerOne;
            this.secondPlayerCardsElement = p1CardsElement;
        }

        //  Show firstPlayer card
        this.currentCard = this.firstPlayer.playerCards.shift();
        this.currentCardElement = this.firstPlayerCardsElement.querySelector('.card').querySelector('.cardInfo');
        this.currentCardElement.classList.toggle('show');
        // console.log(this.currentCard)
        // console.log(this.currentCardElement)

        //  
        this.firstPlayer.guess  = undefined;
        this.secondPlayer.guess = undefined;

        // window.prompt("Is the next card in your deck higher or lower than the one shown?");

        
        console.log(this.deck.cardsShuffled);

        //  Set the first card played
        // this.currentPlayedCard = this.currentDeck.shift();
        // console.log("First card played");
        // console.log(this.currentPlayedCard);


        
    }




}
    

class Deck {
    constructor(playerOne, playerTwo) {
        this.cards = [
            '1♠', '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠',
            '1♦', '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦',
            '1♣', '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣',
            '1♥', '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥'
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