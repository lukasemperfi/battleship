import { LocationCheckArea, Matrix, ShotResult } from "./boardTypes";
import { MATRIX_LENGTH } from "@/config/gameConfig";

import {
  createArrayFromFunction,
  deepClone,
  generateRandomNumber,
} from "@/utils/commonUtils";
import {
  ShipCoords,
  ShipPlacement,
  ShipOrientation,
  Ship,
} from "../ships/shipsTypes";

const createBoardMatrix = (
  cellResult: ShotResult = ShotResult.Empty,
  length: number = MATRIX_LENGTH
): ShotResult[][] =>
  createArrayFromFunction(length, () =>
    createArrayFromFunction(length, () => cellResult)
  );

const updateShipOnBoard = (
  board: Matrix,
  coords: ShipCoords,
  place: boolean
): Matrix => {
  const newBoard = deepClone(board);
  coords.forEach(([x, y]) => {
    newBoard[x][y] = place ? ShotResult.Ship : ShotResult.Empty;
  });
  return newBoard;
};

const placeShipOnBoard = (board: Matrix, shipCoords: ShipCoords): Matrix => {
  return updateShipOnBoard(board, shipCoords, true);
};

const removeShipFromBoard = (board: Matrix, shipCoords: ShipCoords): Matrix => {
  return updateShipOnBoard(board, shipCoords, false);
};

const checkValidCoords = (
  board: Matrix,
  placement: ShipPlacement,
  decks: number
): boolean => {
  const boardSize = board.length;
  const { x, y, orientation } = placement;
  let isXInBounds;
  let isYInBounds;

  if (orientation === ShipOrientation.Horizontal) {
    isXInBounds = x >= 0 && x < boardSize;
    isYInBounds = y >= 0 && y <= boardSize - decks;
  } else {
    isXInBounds = x >= 0 && x <= boardSize - decks;
    isYInBounds = y >= 0 && y < boardSize;
  }

  if (orientation === ShipOrientation.Horizontal) {
    return isXInBounds && isYInBounds;
  } else {
    return isXInBounds && isYInBounds;
  }
};

const getAreaCoords = (
  board: Matrix,
  placement: ShipPlacement,
  decks: number
): LocationCheckArea => {
  const boardSize = board.length;
  const { x, y, orientation } = placement;
  const horizontalPlacement = {
    fromX: Math.max(x - 1, 0),
    toX: Math.min(x + 1, boardSize - 1),
    fromY: Math.max(y - 1, 0),
    toY: Math.min(y + decks, boardSize - 1),
  };
  const verticalPlacement = {
    fromX: Math.max(x - 1, 0),
    toX: Math.min(x + decks, boardSize - 1),
    fromY: Math.max(y - 1, 0),
    toY: Math.min(y + 1, boardSize - 1),
  };

  return orientation === ShipOrientation.Horizontal
    ? horizontalPlacement
    : verticalPlacement;
};

const checkLocationShip = (
  board: Matrix,
  shipPlacement: ShipPlacement,
  decks: number
): boolean => {
  const boardClone = deepClone(board);
  const isCoordsInBounds = checkValidCoords(boardClone, shipPlacement, decks);

  if (!isCoordsInBounds) {
    return false;
  }

  const { fromX, toX, fromY, toY } = getAreaCoords(
    boardClone,
    shipPlacement,
    decks
  );

  for (let startX = fromX; startX <= toX; startX++) {
    for (let startY = fromY; startY <= toY; startY++) {
      if (boardClone[startX][startY] === ShotResult.Ship) {
        return false;
      }
    }
  }

  return true;
};

const generateValidShipPlacement = (
  board: Matrix,
  decks: number
): ShipPlacement => {
  const orientation =
    generateRandomNumber(1) === 0
      ? ShipOrientation.Horizontal
      : ShipOrientation.Vertical;
  let x;
  let y;

  if (orientation === ShipOrientation.Horizontal) {
    x = generateRandomNumber(9);
    y = generateRandomNumber(10 - decks);
  } else {
    x = generateRandomNumber(10 - decks);
    y = generateRandomNumber(9);
  }

  const shipPlacement: ShipPlacement = { x, y, orientation };

  const isValidCoords = checkLocationShip(board, shipPlacement, decks);

  if (!isValidCoords) {
    return generateValidShipPlacement(board, decks);
  }

  return shipPlacement;
};

const markSunkShipArea = (board: Matrix, targetShip: Ship): Matrix => {
  const boardClone = deepClone(board);
  const { fromX, toX, fromY, toY } = getAreaCoords(
    boardClone,
    targetShip.placement,
    targetShip.coords.length
  );

  for (let startX = fromX; startX <= toX; startX++) {
    for (let startY = fromY; startY <= toY; startY++) {
      if (boardClone[startX][startY] === ShotResult.Empty) {
        boardClone[startX][startY] = ShotResult.Miss;
      }
    }
  }
  return boardClone;
};

export {
  createBoardMatrix,
  placeShipOnBoard,
  removeShipFromBoard,
  generateValidShipPlacement,
  checkLocationShip,
  getAreaCoords,
  markSunkShipArea,
};
