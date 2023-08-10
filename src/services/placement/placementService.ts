import { CELL_BORDER, SHIP_SIDE } from "@/config/gameConfig";
import { checkLocationShip, removeShipFromBoard } from "../board/boardService";
import { deepClone } from "@/utils/commonUtils";
import { getShipCoords } from "../ships/shipsService";
import {
  DropTargetMonitor,
  ShipCoordsAndPosition,
  XYCoord,
} from "./placementTypes";
import { Matrix, ShotResult } from "../board/boardTypes";
import {
  ShipPosition,
  Ship,
  ShipPlacement,
  ShipOrientation,
} from "../ships/shipsTypes";

const snapToGrid = (x: number, y: number): [number, number] => {
  const snappedX = Math.round(x / SHIP_SIDE) * SHIP_SIDE;
  const snappedY = Math.round(y / SHIP_SIDE) * SHIP_SIDE;
  return [snappedX, snappedY];
};

const convertPixelsToIndexes = (top: number, left: number): XYCoord => {
  const x = Math.floor(top / SHIP_SIDE);
  const y = Math.floor(left / SHIP_SIDE);
  return { x, y };
};

const getIndexCoords = (
  itemOffset: XYCoord | null,
  boardPosition: DOMRect | null
): XYCoord | null => {
  if (!itemOffset || !boardPosition) {
    return null;
  }
  const { x: itemLeft, y: itemTop } = itemOffset;
  const { x: boardLeft, y: boardTop } = boardPosition;

  let leftOffset = itemLeft - boardLeft;
  let topOffset = itemTop - boardTop;

  [leftOffset, topOffset] = snapToGrid(leftOffset, topOffset);

  return convertPixelsToIndexes(topOffset, leftOffset);
};

const convertIndexesToPixels = (x: number, y: number): ShipPosition => {
  const top = x * SHIP_SIDE + CELL_BORDER;
  const left = y * SHIP_SIDE + CELL_BORDER;
  return { top, left };
};

const canDropShip = (
  board: Matrix,
  boardRect: DOMRect | null,
  ship: Ship | null,
  shipOffset: XYCoord | null
): boolean => {
  const shipIndexCoords = getIndexCoords(shipOffset, boardRect);

  if (!shipIndexCoords || !ship) {
    return false;
  }
  const newMatrix: ShotResult[][] = deepClone(board);

  const updatedBoard = removeShipFromBoard(newMatrix, ship.coords);

  const shipPosition = {
    x: shipIndexCoords.x,
    y: shipIndexCoords.y,
    orientation: ship.placement.orientation,
  };

  const decks = ship.width / SHIP_SIDE;

  return checkLocationShip(updatedBoard, shipPosition, decks);
};

const canRotateShip = (board: Matrix, currentShip: Ship): boolean => {
  const boardClone = deepClone(board);
  const shipDecks = currentShip.coords.length;

  const orientation =
    currentShip.placement.orientation === ShipOrientation.Horizontal
      ? ShipOrientation.Vertical
      : ShipOrientation.Horizontal;

  const shipPlacement = {
    x: currentShip.placement.x,
    y: currentShip.placement.y,
    orientation,
  };

  // const currentShipCoords = getShipCoords(currentShip.placement, shipDecks);
  const updatedBoard = removeShipFromBoard(boardClone, currentShip.coords);

  return checkLocationShip(updatedBoard, shipPlacement, shipDecks);
};

const calculateShipCoords = (
  currentShip: Ship,
  monitor: DropTargetMonitor,
  boardPosition: DOMRect | null
): ShipPlacement => {
  const itemOffset = monitor.getSourceClientOffset();
  const startIndexCoords = getIndexCoords(itemOffset, boardPosition);

  if (!startIndexCoords) {
    return currentShip.placement;
  }

  const { x, y } = startIndexCoords;

  // const shipCoords = getShipCoords(
  //   x,
  //   y,
  //   currentShip.coords.length,
  //   currentShip.placement.orientation
  // );

  // const shipPosition = convertIndexesToPixels(x, y);

  return {
    x,
    y,
    orientation: currentShip.placement.orientation,
  };
};

const toogleRotate = (orientation: ShipOrientation): ShipOrientation =>
  orientation === ShipOrientation.Horizontal
    ? ShipOrientation.Vertical
    : ShipOrientation.Horizontal;

export {
  canDropShip,
  calculateShipCoords,
  getIndexCoords,
  convertIndexesToPixels,
  canRotateShip,
  toogleRotate,
};
