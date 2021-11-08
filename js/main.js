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

const lang = 'ro';
const suits = ['ability', 'passion', 'profession', 'challenge'];
const values_ability = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
];
const values_challenge = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
];
const values_passion = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
];

const values_profession = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59',
  '60',
];

/*----- app's state (variables) -----*/

let draw,
  clickedCard,
  firstClickDest,
  firstStackId,
  cardArr,
  secondsPlayed,
  counter,
  drawCycles,
  clickCount;
let deck_ability, deck_profession, deck_passion, deck_challenge;
let pile_ability, pile_profession, pile_passion, pile_challenge;

let decks = [deck_ability, deck_profession, deck_passion, deck_challenge];

let drawRegion = 'draw';

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
pileMap.set(pile_ability, 'ability');
pileMap.set(pile_passion, 'passion');
pileMap.set(pile_profession, 'profession');
pileMap.set(pile_challenge, 'challenge');

// - deck to pile
const deckMap = new Map();
deckMap.set(deck_ability, pile_ability);
deckMap.set(deck_passion, pile_passion);
deckMap.set(deck_profession, pile_profession);
deckMap.set(deck_challenge, pile_challenge);

// - suite to deck
const suiteMap = new Map();
suiteMap.set('ability', deck_ability);
suiteMap.set('passion', deck_passion);
suiteMap.set('profession', deck_profession);
suiteMap.set('challenge', deck_challenge);

/*----- event listeners -----*/

document.querySelector('body').addEventListener('click', handleClick);

boardEls.portfolio.addEventListener(
  'dragover',
  function (ev) {
    ev.preventDefault();
  },
  false
);
boardEls.portfolio.addEventListener(
  'drop',
  function (ev) {
    ev.preventDefault();
    boardEls.portfolio.appendChild(
      document.getElementById(ev.dataTransfer.getData('text'))
    );
  },
  false
);

boardEls.challenge.addEventListener(
  'dragover',
  function (ev) {
    ev.preventDefault();
  },
  false
);
boardEls.challenge.addEventListener(
  'drop',
  function (ev) {
    ev.preventDefault();
    boardEls.challenge.appendChild(
      document.getElementById(ev.dataTransfer.getData('text'))
    );
  },
  false
);

boardEls.return.addEventListener(
  'dragover',
  function (ev) {
    ev.preventDefault();
  },
  false
);
boardEls.return.addEventListener(
  'drop',
  function (ev) {
    ev.preventDefault();
    boardEls.return.appendChild(
      document.getElementById(ev.dataTransfer.getData('text'))
    );
  },
  false
);

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
    cardEl.className = `card backs ${lang} ${card.suit}`;
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

function renderDraw() {
  draw.slice(draw.length - 1).forEach((card, cIdx) => {
    let cardEl = document.createElement('div');
    cardEl.draggable = true;
    cardEl.className = `card ${card.suit} ${lang}${card.value}`;
    cardEl.id = `${card.suit}-${lang}-${card.value}`;
    boardEls[drawRegion].appendChild(cardEl);
    cardEl.addEventListener('dragstart', drag, false);
  });
}

function makeDecks() {
  suits.forEach((suit) => {
    switch (suit) {
      case 'ability':
        values_ability.forEach((value) => {
          let card = { value: value, suit: suit };
          deck_ability.push(card);
        });
        break;
      case 'passion':
        values_passion.forEach((value) => {
          let card = { value: value, suit: suit };
          deck_passion.push(card);
        });
        break;
      case 'profession':
        values_profession.forEach((value) => {
          let card = { value: value, suit: suit };
          deck_profession.push(card);
        });
        break;
      case 'challenge':
        values_challenge.forEach((value) => {
          let card = { value: value, suit: suit };
          deck_challenge.push(card);
        });
        break;
    }
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

function drag(ev) {
  ev.dataTransfer.setData('Text/plain', ev.target.id);
  console.log(ev.dataTransfer.getData('text'));
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
  drawRegion = e.target.value;
});
