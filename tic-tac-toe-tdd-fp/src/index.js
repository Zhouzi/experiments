/**
 * @typedef {object} Game
 * @property {Player} player
 * @property {Array} grid
 */

/**
 * @typedef {('x'|'o')} Player
 */

/**
 * @returns {Game}
 */
const createGame = () => ({
  player: 'x',
  grid: [
    ['_', '_', '_'],
    ['_', '_', '_'],
    ['_', '_', '_']
  ]
});

/**
 * @param {Game} game
 * @param {number} x
 * @param {number} y
 * @returns {Game}
 */
const check = (game, x, y) => (
  isCheckable(game.grid, x, y)
    ? checkAtCoord(game, x, y)
    : game
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isCheckable = (grid, x, y) => (
  isInRange(grid, x, y) && isFree(grid, x, y)
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isInRange = (grid, x, y) => (
  Boolean(grid[x]) && typeof grid[x][y] === 'string'
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isFree = (grid, x, y) => (
  grid[y] == null || grid[y][x] === '_'
);

/**
 * @param {Game} game
 * @param {number} x
 * @param {number} y
 * @returns {Game}
 */
const checkAtCoord = (game, x, y) => (
  updateGame(
    game,
    {
      player: getNextPlayer(game.player),
      grid: updateCell(game.grid, x, y, game.player)
    }
  )
);

/**
 * @param {Game} game
 * @param {object} newProps
 * @returns {Game}
 */
const updateGame = (game, newProps) => (
  Object.assign(
    {},
    game,
    newProps
  )
);

/**
 * @param {Player} player
 * @returns {Player}
 */
const getNextPlayer = (player) => (
  player === 'x'
    ? 'o'
    : 'x'
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @param value
 * @returns {Array}
 */
const updateCell = (grid, x, y, value) => (
  updateAtIndex(
    grid,
    y,
    (row) => updateAtIndex(
      row,
      x,
      () => value
    )
  )
);

/**
 * @param {Array} items
 * @param {number} index
 * @param {function} valueGetter
 * @returns {Array}
 */
const updateAtIndex = (items, index, valueGetter) => (
  items
    .slice(0, index)
    .concat([valueGetter(items[index])])
    .concat(items.slice(index + 1))
);

/**
 * @param {Game} game
 * @returns {string}
 */
const winner = (game) => (
  getWinnerFromCollectionsOfCoords(
    game.grid,
    [
      getHorizontalIndexes(3),
      getVerticalIndexes(3),
      getDiagonalIndexes(3)
    ]
  )
);

/**
 * @param {number} size
 * @returns {Array}
 */
const getHorizontalIndexes = (size) => (
  times(size, (rowIndex) => (
    times(size, (cellIndex) => [cellIndex, rowIndex])
  ))
);

/**
 * @param {number} size
 * @returns {Array}
 */
const getVerticalIndexes = (size) => (
  times(size, (rowIndex) => (
    times(size, (cellIndex) => [rowIndex, cellIndex])
  ))
);

/**
 * @param {number} size
 * @returns {Array}
 */
const getDiagonalIndexes = (size) => (
  [
    times(size, (index) => [index, index]),
    times(size, (index) => [size - 1 - index, index])
  ]
);

/**
 * @param {Array} grid
 * @param {Array} collectionsOfCoords
 */
const getWinnerFromCollectionsOfCoords = (grid, collectionsOfCoords) => (
  lookupWinner(collectionsOfCoords, (collectionOfCoords) => (
    lookupWinner(collectionOfCoords, (coords) => (
      getWinnerInCoords(grid, coords, getFirstCell(grid, coords))
    ))
  ))
);

/**
 * @param {Array} ar
 * @param {function} iteratee
 * @returns {string}
 */
const lookupWinner = (ar, iteratee) => (
  ar.length === 0
    ? '_'
    : (() => {
      const head = ar[0];
      const result = iteratee(head);

      return (
        result === '_'
          ? lookupWinner(ar.slice(1), iteratee)
          : result
      );
    })()
);

/**
 * @param {Array} grid
 * @param {Array} coords
 * @param {string} firstCell
 */
const getWinnerInCoords = (grid, coords, firstCell) => (
  isWinningCoords(grid, coords, firstCell)
    ? firstCell
    : '_'
);

/**
 * @param {Array} grid
 * @param {Array} coords
 * @param {string} firstCell
 */
const isWinningCoords = (grid, coords, firstCell) => (
  coords.every(([x, y]) => getCellAt(grid, x, y) === firstCell)
);

/**
 * @param {Array} grid
 * @param {Array} coords
 * @returns {string}
 */
const getFirstCell = (grid, coords) => (
  getCellAt(grid, coords[0][0], coords[0][1])
);

/**
 * @param {Array} grid
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
const getCellAt = (grid, x, y) => (
  grid[y][x]
);

/**
 * @param {number} size
 * @param {function} iteratee
 * @returns {Array}
 */
const times = (size, iteratee) => (
  timesRecursive(size, iteratee)
);

/**
 * @param {number} size
 * @param {function} iteratee
 * @param {number} index
 * @param {Array} acc
 * @returns {Array}
 */
const timesRecursive = (size, iteratee, index = 0, acc = []) => (
  size === 0
    ? acc
    : timesRecursive(
      size - 1,
      iteratee,
      index + 1,
      acc.concat([iteratee(index)])
    )
);

/**
 * @param {Game} game
 * @returns {boolean}
 */
const gameover = (game) => (
  !game.grid.some((row) => (
    row.some((cell) => cell == '_')
  ))
);

module.exports = createGame;
module.exports.check = check;
module.exports.winner = winner;
module.exports.gameover = gameover;
