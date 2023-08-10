interface Ship {
  id: string;
  name: string;
  placement: ShipPlacement;
  coords: ShipCoords;
  hits: number;
  position: ShipPosition;
  width: number;
  isShipPlaced: boolean;
  canFlip?: boolean;
}

interface ShipPlacement {
  x: number;
  y: number;
  orientation: ShipOrientation;
}

enum ShipOrientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

type ShipCoord = [number, number];

type ShipCoords = number[][];

interface ShipPosition {
  top: number;
  left: number;
}

interface ShipDimensions {
  width: number;
  position: ShipPosition;
}

export {
  type Ship,
  type ShipPlacement,
  type ShipCoords,
  ShipOrientation,
  type ShipDimensions,
  type ShipPosition,
  type ShipCoord,
};
