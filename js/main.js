// TODO:
// 1) subtract time penalty from final score

// STRETCH GOALS:
// 1) add difficulty option--draw 3 cards at a time instead of 1
// 2) add drag and drop functionality
// 3) highlight all possible moves when card is highlighted
// 4) make winning more exciting
// 5) add functionality to 'replay' the same game/cards from the start
// 6) make an undo button
// 7) add 'instructions' section

/*----- constants -----*/

const suits = ['s', 'h', 'c', 'd'];
const values = [
  'A',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  'J',
  'Q',
  'K',
];

/*----- app's state (variables) -----*/

let draw,
  clickedCard,
  firstClickDest,
  firstStackId,
  cardArr,
  secondsPlayed,
  counter,
  boardScore,
  totalScore,
  drawCycles,
  clickCount;
let deck_ability, deck_profession, deck_passion, deck_challenge;
let pile_ability, pile_profession, pile_passion, pile_challenge;

let decks = [deck_ability, deck_profession, deck_passion, deck_challenge];

/*----- cached element references -----*/
const boardEls = {
  pile_ability: document.getElementById('pile_ability'),
  pile_profession: document.getElementById('pile_profession'),
  pile_passion: document.getElementById('pile_passion'),
  pile_challenge: document.getElementById('pile_challenge'),
  draw: document.getElementById('draw'),
  portfolio: document.getElementById('portfolio'),
  challenge: document.getElementById('challenge'),
  return: document.getElementById('return'),
};

const timerEl = document.getElementById('timer');

// Maps
//  - suites to pile
const pileMap = new Map();
pileMap.set(pile_ability, 's');
pileMap.set(pile_passion, 'h');
pileMap.set(pile_profession, 'c');
pileMap.set(pile_challenge, 'd');

// - deck to pile
const deckMap = new Map();
deckMap.set(deck_ability, pile_ability);
deckMap.set(deck_passion, pile_passion);
deckMap.set(deck_profession, pile_profession);
deckMap.set(deck_challenge, pile_challenge);

// - suite to deck
const suiteMap = new Map();
suiteMap.set('s', deck_ability);
suiteMap.set('h', deck_passion);
suiteMap.set('c', deck_profession);
suiteMap.set('d', deck_challenge);

/*----- event listeners -----*/

document.querySelector('body').addEventListener('click', handleClick);

/*----- functions -----*/

init();

function init() {
  stopTimer();
  clickCount = 0;
  // piles
  pile_ability = [];
  pile_profession = [];
  pile_passion = [];
  pile_challenge = [];
  // decks
  deck_ability = [];
  deck_profession = [];
  deck_passion = [];
  deck_challenge = [];
  deck_return = [];
  // draw
  draw = [];
  //
  cardArr = [];
  clickedCard = null;
  secondsPlayed = null;
  counter = null;
  drawCycles = 0;
  // Make it happen
  makeDecks();
  shuffleDeck();
  dealCards();
  render();
}

function render() {
  clearAllDivs();
  renderPiles();
  renderDraw();
}

function dealCards() {
  deck_ability.forEach((card) => {
    pile_ability.push(card);
  });
  deck_passion.forEach((card) => {
    pile_passion.push(card);
  });
  deck_profession.forEach((card) => {
    pile_profession.push(card);
  });
  deck_challenge.forEach((card) => {
    pile_challenge.push(card);
  });
}

function renderPiles() {
  renderPile(pile_ability);
  renderPile(pile_passion);
  renderPile(pile_profession);
  renderPile(pile_challenge);
}

function renderPile(pile) {
  pile.forEach((card, cIdx) => {
    let cardEl = document.createElement('div');
    cardEl.className = `card back ${card.suit}${card.value}`;
    cardEl.style = `position: absolute; left: -7px; top: ${
      -7 + cIdx * -0.5
    }px;`;
    switch (pile) {
      case pile_ability:
        boardEls.pile_ability.appendChild(cardEl);
        break;
      case pile_passion:
        boardEls.pile_passion.appendChild(cardEl);
        break;
      case pile_profession:
        boardEls.pile_profession.appendChild(cardEl);
        break;
      case pile_challenge:
        boardEls.pile_challenge.appendChild(cardEl);
        break;
    }
  });
}

let selectedRegion = 'draw';
function renderDraw() {
  draw.slice(draw.length - 1).forEach((card, cIdx) => {
    let cardEl = document.createElement('div');
    cardEl.className = `card ${card.suit}${card.value}`;
    // cardEl.style = `position: absolute; left: -7px; top: ${
    //   -7 + cIdx * -0.5
    // }px;`;
    // boardEls.draw.appendChild(cardEl);
    boardEls[selectedRegion].appendChild(cardEl);
  });
}

function makeDecks() {
  suits.forEach((suit) => {
    values.forEach((value) => {
      let card = { value: value, suit: suit };
      switch (suit) {
        case 's':
          deck_ability.push(card);
          break;
        case 'h':
          deck_passion.push(card);
          break;
        case 'c':
          deck_profession.push(card);
          break;
        case 'd':
          deck_challenge.push(card);
          break;
      }
    });
  });
}

function shuffleDeck() {
  deck_ability = deck_ability.sort(() => Math.random() - 0.5);
  deck_passion = deck_passion.sort(() => Math.random() - 0.5);
  deck_profession = deck_profession.sort(() => Math.random() - 0.5);
  deck_challenge = deck_challenge.sort(() => Math.random() - 0.5);
}

function clearAllDivs() {
  for (let boardEl in boardEls) {
    while (boardEls[boardEl].firstChild) {
      boardEls[boardEl].removeChild(boardEls[boardEl].firstChild);
    }
  }
}

function isDoubleClick() {
  clickCount++;
  if (clickCount === 1) {
    singleClickTimer = setTimeout(function () {
      clickCount = 0;
      return false;
    }, 300);
  } else if (clickCount === 2) {
    clearTimeout(singleClickTimer);
    clickCount = 0;
    return true;
  }
}

function handleClick(evt) {
  let clickDest = getClickDestination(evt.target);

  // start the timer on user's first click
  if (!counter && clickDest !== 'resetButton') {
    startTimer();
  }

  if (clickDest === 'draw') {
    handleDrawClick(evt.target);
  } else if (clickDest === 'resetButton') {
    init();
  } else
    switch (clickDest) {
      case 'pile_ability':
        handlePileClick(pile_ability);
        break;
      case 'pile_passion':
        handlePileClick(pile_passion);
        break;
      case 'pile_profession':
        handlePileClick(pile_profession);
        break;
      case 'pile_challenge':
        handlePileClick(pile_challenge);
        break;
    }
}

function isTheSameCard(cardEl, cardObj) {
  let card1 = getCardClassFromEl(cardEl);
  let card2 = getCardClassFromObj(cardObj);

  return card1 === card2;
}

function getCardClassFromEl(cardEl) {
  let cardClass = cardEl.className.replace('card ', '');
  cardClass = cardClass.replace(' highlight', '');
  return cardClass;
}

function getCardClassFromObj(cardObj) {
  let cardClass = `${cardObj.suit}${cardObj.value}`;
  return cardClass;
}

function getCardObjFromClass(cardClass) {
  let cardObj = {};
  cardObj.suit = cardClass[0];
  let value = cardClass[1] + (cardClass[2] ? cardClass[2] : '');
  cardObj.value = value;
  return cardObj;
}

function handleDrawClick(element) {
  let topCard = draw[draw.length - 1];
  let topCardEl = boardEls.draw.lastChild;

  // if there is no highlighted card, and the draw pile isn't an empty stack, select the top card
  if (!clickedCard && !isEmptyStack(element)) {
    topCardEl.className += ' highlight';
    clickedCard = topCard;
    firstStackId = 'draw';
    firstClickDest = 'draw';
    let cardsToPush = -1;
    while (cardsToPush < 0) {
      cardArr.push(draw.pop());
      cardsToPush++;
    }
  }
}

function handlePileClick(pile) {
  if (!clickedCard) {
    // if there are cards in the 'pile', flip one into the 'draw'
    if (pile.length > 0) {
      draw.push(pile.pop());
      renderPile(pile);
      renderDraw();
    }
    // if the pile is empty do nothing
  }
}

function isEmptyStack(element) {
  return !!element.id;
}

function getCardColor(cardObj) {
  if (cardObj.suit === 'h' || cardObj.suit === 'd') {
    return 'red';
  } else return 'black';
}

function getCardValue(cardObj) {
  switch (cardObj.value) {
    case 'A':
      return 1;
      break;
    case '02':
      return 2;
      break;
    case '03':
      return 3;
      break;
    case '04':
      return 4;
      break;
    case '05':
      return 5;
      break;
    case '06':
      return 6;
      break;
    case '07':
      return 7;
      break;
    case '08':
      return 8;
      break;
    case '09':
      return 9;
      break;
    case '10':
      return 10;
      break;
    case 'J':
      return 11;
      break;
    case 'Q':
      return 12;
      break;
    case 'K':
      return 13;
      break;
    default:
      console.log('getCardValue is broken');
  }
}

function startTimer() {
  secondsPlayed = 0;
  counter = setInterval(count, 1000);
}

function stopTimer() {
  secondsPlayed = null;
  clearInterval(counter);
  timerEl.textContent = `time - 0:00`;
}

function count() {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  secondsPlayed++;

  hours = Math.floor(minutes / 60);
  minutes = Math.floor(secondsPlayed / 60) - hours * 60;
  seconds = secondsPlayed - minutes * 60;

  timerEl.textContent = `time - ${hours > 0 ? `${hours}:` : ''}${
    minutes < 10 && hours > 0 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function isFaceUpCard(element) {
  return (
    element.className.includes('card') &&
    !element.className.includes('back') &&
    !element.className.includes('outline')
  );
}

function getClickDestination(element) {
  if (element.id) {
    return element.id;
  } else {
    return element.parentNode.id;
  }
}

// seller js
const selectMenu = document.querySelector('.region-menu');

selectMenu.addEventListener('change', function (e) {
  selectedRegion = e.target.value;
});
