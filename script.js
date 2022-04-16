//DISPLAY/UI LOGIC

//2. Left click on tiles --- Reveal tiles
//3. Right click on tiles --- mark tiles
//4. Check for win/loose

import {
  createBoard,
  TILE_STATUS,
  markTile,
  revealTile,
  checkLose,
  checkWin,
} from "./minesweeper.js";

const BOARD_SIZE = 10;
const NUMBER_OF_MINES = 3;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const messageText = document.querySelector(".subtext");
boardElement.style.setProperty("--size", BOARD_SIZE);
const mineLeftText = document.querySelector("[data-left-count]");
mineLeftText.textContent = NUMBER_OF_MINES;

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesLeft();
    });
  });
});

function listMinesLeft() {
  const minesLeftCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUS.MARKED).length
    );
  }, 0);

  console.log(minesLeftCount);

  mineLeftText.textContent = NUMBER_OF_MINES - minesLeftCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You Win";
  }
  if (lose) {
    messageText.textContent = "You Lose";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUS.MARKED) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  e.stopImmediatePropagation();
}
