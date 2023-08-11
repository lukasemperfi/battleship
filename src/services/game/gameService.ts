import { SHIP_DATA } from "@/config/gameConfig";
import {
  generateValidShipPlacement,
  placeShipOnBoard,
  removeShipFromBoard,
} from "@/services/board/boardService";
import {
  addShip,
  createShip,
  getShipCoords,
  updateShips,
} from "@/services/ships/shipsService";
import {
  type Ship,
  ShipOrientation,
  type ShipPlacement,
} from "@/services/ships/shipsTypes";
import { placeShips } from "./gameUtils";
import { type Matrix, ShotResult } from "../board/boardTypes";
import { convertIndexesToPixels } from "../placement/placementService";
import { type BoardAndShips } from "./gameTypes";

const generateRandomBoardAndShips = (): BoardAndShips =>
  placeShips(SHIP_DATA, (shipInfo, matrix) => {
    const coordinates = generateValidShipPlacement(matrix, shipInfo.decks);
    return createShip(shipInfo, coordinates, true);
  });

const generateInitialShips = (): Ship[] => {
  const coordinates = { x: 0, y: 0, orientation: ShipOrientation.Horizontal };

  const [, initialShips] = placeShips(SHIP_DATA, (ship) =>
    createShip(ship, coordinates, false)
  );

  return initialShips;
};

const updateShipPositionOnBoard = (
  board: Matrix,
  ships: Ship[],
  currentShip: Ship,
  shipPlacement: ShipPlacement
): [...BoardAndShips, Ship] => {
  const coords = getShipCoords(shipPlacement, currentShip.coords.length);

  const position = convertIndexesToPixels(shipPlacement.x, shipPlacement.y);

  const updatedBoard = removeShipFromBoard(board, currentShip.coords);
  const newBoard = placeShipOnBoard(updatedBoard, coords);

  const updatedShip = {
    ...currentShip,
    coords,
    position,
    placement: shipPlacement,
    isShipPlaced: true,
  };

  const updatedShips = updateShips(ships, currentShip.id, updatedShip);

  return [newBoard, updatedShips, updatedShip];
};

const addShipToBoard = (
  board: Matrix,
  ships: Ship[],
  currentShip: Ship,
  shipPlacement: ShipPlacement
): [...BoardAndShips, Ship] => {
  const coords = getShipCoords(shipPlacement, currentShip.coords.length);

  const position = convertIndexesToPixels(shipPlacement.x, shipPlacement.y);

  const updatedShip: Ship = {
    ...currentShip,
    coords,
    position,
    placement: shipPlacement,
    isShipPlaced: true,
  };

  const newBoard = placeShipOnBoard(board, updatedShip.coords);
  const newShips = addShip(ships, updatedShip);

  return [newBoard, newShips, updatedShip];
};

const checkWin = (ships: Ship[]): boolean =>
  ships.every((ship) => ship.hits === ship.coords.length);

const isGameFinished = (playerShips: Ship[], computerShips: Ship[]): boolean =>
  checkWin(computerShips) || checkWin(playerShips);

export {
  generateRandomBoardAndShips,
  generateInitialShips,
  updateShipPositionOnBoard,
  addShipToBoard,
  checkWin,
  isGameFinished,
};
