const languageDocument = document.querySelector("html").lang;

class Card {
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.domCard = document.createElement("div");
    this.state = 0; // 0 means hidden 1 means uncover.
  }

  createCard(boardId) {
    const board = document.getElementById(boardId);

    this.domCard.id = `${this.id}`;
    this.domCard.classList.add("card");

    board.appendChild(this.domCard);
  }

  pickCard() {
    this.domCard.classList.toggle("selected-card");
    this.domCard.innerHTML = this.value;
  }

  hideCard() {
    this.domCard.classList.remove("selected-card");
    this.domCard.classList.remove("wrong-card");
    this.domCard.innerHTML = "";
  }

  paredCard() {
    this.domCard.classList.toggle("pared-card");
    this.domCard.innerHTML = this.value;
  }

  wrongCard() {
    this.domCard.classList.toggle("wrong-card");
    this.domCard.innerHTML = this.value;
  }

  changeState() {
    this.state = 1;
  }
}

export class Board {
  constructor(numberCards) {
    this.id = "game-board";
    this.cards = [];
    this.selectedCard = null;
    this.matches = 0;
    this.numberCards = numberCards; // is constant
    this.numberPares = numberCards / 2; // Change with the game
    this.boardState = 1; // 1 means active 0 unactive
    this.turns = 0;
    this.domBoard = document.createElement("div");
  }

  startBoard() {
    const turnCounter = document.createElement("div");
    const pares = document.createElement("div");
    const resetButton = document.createElement("div");
    const container = document.getElementById("board-cnt");

    this.domBoard.id = this.id;

    turnCounter.id = "turns-counter";
    turnCounter.innerHTML = "Turn: " + this.turns;

    if (languageDocument === "es") {
      turnCounter.innerHTML = "Turno: " + this.turns;
    }

    this.domBoard.appendChild(turnCounter);

    pares.id = "pares";
    pares.innerHTML = `🎴 ${this.numberPares}`;
    this.domBoard.appendChild(pares);

    resetButton.id = "reset-btn";
    resetButton.innerHTML = "new game";

    if (languageDocument === "es") {
      resetButton.innerHTML = "Nuevo Juego";
    }

    this.domBoard.appendChild(resetButton);

    container.appendChild(this.domBoard);
  }

  createCards(valueArray) {
    for (let i = 0; i < this.numberCards; i++) {
      const placer = Math.floor(Math.random() * valueArray.length);
      const newCard = new Card(i, valueArray[placer]);
      valueArray.splice(placer, 1);
      newCard.createCard(this.id);
      this.cards.push(newCard);
    }
  }

  clearBoard() {
    for (let i = 0; i < this.numberCards; i++) {
      this.cards[i].domCard.remove();
    }
    this.cards = [];
  }

  getCard(cardId) {
    let myCard;
    for (let i = 0; i < this.cards.length; i++) {
      if (this.cards[i].id === cardId) {
        myCard = this.cards[i];
        break;
      }
    }
    return myCard;
  }

  addSelection(element) {
    this.selectedCard = element;
  }

  clearSelection() {
    this.selectedCard = null;
  }

  isSelected(cardId) {
    return this.selectedCard === cardId;
  }

  isCompleted() {
    return this.numberPares === 0;
  }

  updateTurn() {
    this.turns = this.turns + 1;
    let turn = languageDocument === "es" ? "Turno: " : "Turn: ";
    document.getElementById("turns-counter").innerHTML = turn + this.turns;
  }

  updatePares() {
    this.numberPares = this.numberPares - 1;
    document.getElementById("pares").innerHTML = `&#x1F3B4; ${this.numberPares}`;
  }

  resetGame() {
    this.selectedCard = null;
    this.matches = 0;
    this.boardState = 1;
    this.turns = 0;
    this.numberPares = this.numberCards / 2;
    document.getElementById("pares").innerHTML = `🎴 ${this.numberPares}`;
    const turn = languageDocument === "es" ? "Turno: " : "Turn: ";

    document.getElementById("turns-counter").innerHTML = turn + this.turns;
  }

  revealCards(time) {
    for (let i = 0; i < this.numberCards; i++) {
      this.cards[i].pickCard();
    }

    this.boardState = 0;

    setTimeout(() => {
      for (let i = 0; i < this.numberCards; i++) {
        this.cards[i].hideCard();
      }
      this.boardState = 1;
    }, time);
  }

  popMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.id = 'msg';
    messageContainer.innerHTML = `<p id="msg-text">${message}</p>`;
    this.domBoard.appendChild(messageContainer);
  }

  removeMessage() {
    document.getElementById("msg").remove();
  }
}
