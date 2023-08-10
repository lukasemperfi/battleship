import { DropTargetMonitor, XYCoord } from "react-dnd";
import { ShipCoords, ShipPosition } from "../ships/shipsTypes";

interface ShipCoordsAndPosition {
  shipCoords: ShipCoords;
  shipPosition: ShipPosition;
}

export { type ShipCoordsAndPosition, type DropTargetMonitor, type XYCoord };
