import { ShipData } from "@/config/gameConfig";
import { createArrayFromFunction } from "@/utils/commonUtils";
import { createBoardMatrix, placeShipOnBoard } from "../board/boardService";
import { Matrix } from "../board/boardTypes";
import { Ship } from "../ships/shipsTypes";
import { BoardAndShips } from "./gameTypes";

const placeShips = (
  shipData: ShipData[],
  callback: (ship: ShipData, matrix: Matrix, index: number) => Ship
): BoardAndShips => {
  let newMatrix = createBoardMatrix();

  const ships = shipData.reduce<Ship[]>((acc, ship) => {
    const squadronShips = createArrayFromFunction<Ship>(
      ship.count,
      (_, index) => {
        const newShip = callback(ship, newMatrix, index);

        newMatrix = placeShipOnBoard(newMatrix, newShip.coords);

        return newShip;
      }
    );

    return [...acc, ...squadronShips];
  }, []);

  return [newMatrix, ships];
};

export { placeShips };
