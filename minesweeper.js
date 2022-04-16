export const TILE_STATUS = {
  HIDDEN: "hidden",
  MARKED: "marked",
  MINE: "mine",
  NUMBER: "number",
};

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePosition = getMinePosition(boardSize, numberOfMines);
  console.log("mineposition=================>", minePosition);
  for (let x = 0; x < boardSize; x++) {
    let row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUS.HIDDEN;
      const tile = {
        element,
        x,
        y,
        // mine: minePosition.some((p) => positionMatch(p, { x, y })),
        mine: minePosition.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

function getMinePosition(boardSize, numberOfMines) {
  const positions = [];
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    // if (!positions.some((p) => positionMatch(p, position))) {
    //   positions.push(position);
    // }
    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }
  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(boardSize) {
  return Math.floor(Math.random() * boardSize);
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUS.HIDDEN &&
    tile.status !== TILE_STATUS.MARKED
  ) {
    return;
  }
  if (tile.status === TILE_STATUS.MARKED) {
    tile.status = TILE_STATUS.HIDDEN;
  } else {
    tile.status = TILE_STATUS.MARKED;
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUS.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUS.MARKED ||
            tile.status === TILE_STATUS.HIDDEN))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUS.MINE;
    });
  });
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUS.HIDDEN) {
    return;
  }
  if (tile.mine) {
    tile.status = TILE_STATUS.MINE;
    return;
  }
  tile.status = TILE_STATUS.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((tile) => tile.mine);
  if (mines.length === 0) {
    // adjacentTiles.forEach((tile) => revealTile(board, tile));
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
  }
}

function nearbyTiles(board, { x, y }) {
  let adjacentNeighbours = [];
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      let tile = board[x + xOffset]?.[y + yOffset];
      if (tile) {
        adjacentNeighbours.push(tile);
      }
    }
  }

  return adjacentNeighbours;
}
