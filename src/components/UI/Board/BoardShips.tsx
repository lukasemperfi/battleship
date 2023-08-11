import { type FC } from "react";
import { DraggableShip } from "@/components/UI/Ship/DraggableShip";
import { type Ship } from "@/services/ships/shipsTypes";

interface BoardShipsProps {
  ships: Ship[];
}

export const BoardShips: FC<BoardShipsProps> = ({ ships }) => {
  if (ships.length === 0) {
    return null;
  }
  return (
    <div>
      {ships.map((ship) => (
        <DraggableShip draggableItem={ship} key={ship.id} />
      ))}
    </div>
  );
};
