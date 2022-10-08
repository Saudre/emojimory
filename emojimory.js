import { Board } from "./board.js";
import { Emojis } from "./emojis.js";

function setTitle() {
  const title = document.querySelector("h1");

  const emojiHero = getEmojis(42);
  let hero = "";

  emojiHero.forEach((e) => {
    hero = hero + e;
  });

  title.setAttribute("emoji-line", hero);
}

setTitle();

// Global variables
const language = document.querySelector("html").lang;
const numCards = 48;
const memoryTime = 4000;
const board = new Board(numCards);
let cardValues = getEmojis(numCards / 2);

// Set up game
board.startBoard();
board.createCards([...cardValues,...cardValues]);
board.revealCards(memoryTime);
board.domBoard.addEventListener("click", game);

// It returns an array with all the emojis -Two by each emoji
function getEmojis(num) {
  const emojiArray = [];

  while (emojiArray.length < num) {
    const position = Math.floor(Math.random() * Emojis.length);
    const emoji = Emojis[position];
    if (!emojiArray.includes(emoji)) {
      emojiArray.push(emoji);
    }
  }

  return emojiArray;
}

// Main game function
function game(event) {
  const targetId = event.target.id;

  switch (targetId) {
    case "msg":
    case "pares":
    case "game-board":
    case "turns-counter":
      break;
    case "reset-btn":
      if (board.boardState === 0) {
        return;
      }

      if (document.getElementById("msg")) {
        board.removeMessage();
      }

      board.resetGame();
      cardValues = getEmojis(numCards / 2);
      board.clearBoard();
      board.createCards([...cardValues,...cardValues]);
      board.revealCards(memoryTime);
      break;
    default:
      if (board.boardState === 0) {
        return;
      }

      const card = board.getCard(parseInt(targetId));

      if (card.state === 1) {
        return;
      }

      if (board.selectedCard === null) {
        card.pickCard();
        board.addSelection(card);
        board.updateTurn();
        return;
      }

      if (card.id === board.selectedCard.id) {
        return;
      }

      if (card.value !== board.selectedCard.value) {
        card.wrongCard();
        board.selectedCard.wrongCard();
        board.boardState = 0;

        window.setTimeout(() => {
          card.hideCard();
          board.selectedCard.hideCard();
          board.clearSelection();
          board.boardState = 1;
        }, 1000);
        return;
      }

      card.paredCard();
      card.changeState();

      board.selectedCard.pickCard();
      board.selectedCard.changeState();
      board.selectedCard.paredCard();
      board.clearSelection();
      board.updatePares();

      if (board.isCompleted()) {
        const messageWin = language === "es" ? "Tú ganas!" : "You win!";
        board.popMessage(`&#x1F38A ${messageWin} &#x1F38A`);
      }
      break;
  }
}

