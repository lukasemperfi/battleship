import { type DropTargetMonitor, type XYCoord } from "react-dnd";
import { type ShipCoords, type ShipPosition } from "../ships/shipsTypes";

interface ShipCoordsAndPosition {
  shipCoords: ShipCoords;
  shipPosition: ShipPosition;
}

export { type ShipCoordsAndPosition, type DropTargetMonitor, type XYCoord };
