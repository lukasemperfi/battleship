import { CELL_BORDER, type ShipData } from "@/config/gameConfig";
import { v4 as uuidv4 } from "uuid";
import { createArrayFromFunction, deepClone } from "@/utils/commonUtils";
import {
  type ShipPlacement,
  type ShipDimensions,
  type ShipCoords,
  ShipOrientation,
  type Ship,
} from "./shipsTypes";

const getShipDimensions = (
  side: number,
  decks: number,
  placement: ShipPlacement,
  cellBorder: number
): ShipDimensions => {
  const shipDimensions = {
    width: side * decks,
    position: {
      top: placement.x * side + cellBorder,
      left: placement.y * side + cellBorder,
    },
  };
  return shipDimensions;
};

const getShipCoords = (
  shipPlacement: ShipPlacement,
  coordsOrDecks: ShipCoords | number
): ShipCoords => {
  const { x, y, orientation } = shipPlacement;
  const array =
    typeof coordsOrDecks === "number"
      ? createArrayFromFunction(coordsOrDecks, () => [])
      : coordsOrDecks;

  return array.reduce<ShipCoords>((acc, _, index) => {
    if (orientation === ShipOrientation.Horizontal) {
      acc.push([x, y + index]);
    } else {
      acc.push([x + index, y]);
    }

    return acc;
  }, []);
};

const createShip = (
  shipData: ShipData,
  placement: ShipPlacement,
  isShipPlaced: boolean
): Ship => {
  const { name, decks, side } = shipData;

  const { width, position } = getShipDimensions(
    side,
    decks,
    placement,
    CELL_BORDER
  );
  const coords = getShipCoords(placement, decks);

  return {
    id: uuidv4(),
    hits: 0,
    coords,
    placement,
    name,
    position,
    width,
    isShipPlaced,
  };
};

const updateShip = (currentShip: Ship, shipUpdates: Partial<Ship>): Ship => {
  return { ...currentShip, ...shipUpdates };
};

const updateShips = (
  ships: Ship[],
  shipId: Ship["id"],
  shipUpdates: Partial<Ship>
): Ship[] => {
  const shipsClone = deepClone(ships);

  const shipIndex = shipsClone.findIndex((ship) => ship.id === shipId);

  if (shipIndex === -1) {
    return shipsClone;
  }

  const updatedShip = updateShip(shipsClone[shipIndex], shipUpdates);

  shipsClone[shipIndex] = updatedShip;

  return shipsClone;
};

const addShip = (ships: Ship[], newShip: Ship): Ship[] => {
  const isShipExists = ships.some((ship) => ship.id === newShip.id);

  if (isShipExists) {
    return ships;
  }

  return [...ships, newShip];
};

export { createShip, getShipCoords, addShip, updateShip, updateShips };
