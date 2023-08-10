import React, {
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/ItemTypes";
import { Board, BoardProps } from "./Board";
import { useDomRect } from "@/hooks/useDomRect";
import { SHIP_SIDE } from "@/config/gameConfig";
import { ShipDragPreview } from "../Ship/ShipDragPreview";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  moveShipOnBoard,
  placeShipOnBoardFromOutside,
  setSelectedShip,
} from "@/store/playerBoardSlice";

import { Matrix } from "@/services/board/boardTypes";
import { Ship, ShipPlacement } from "@/services/ships/shipsTypes";
import {
  calculateShipCoords,
  canDropShip,
  getIndexCoords,
} from "@/services/placement/placementService";
import { selectGameState } from "@/store/gameSlice";
import { BoardField, BoardFieldProps } from "./BoardField";
import { BoardShips } from "./BoardShips";

interface DropZoneBoardProps extends BoardProps {
  board: Matrix;
  ships: Ship[];
}

export const DropZoneBoard: FC<DropZoneBoardProps> = ({
  board,
  ships,
  currentPlayer,
  activePlayer,
}) => {
  const dispatch = useAppDispatch();
  const { isGameStarted } = useAppSelector(selectGameState);
  const [boardEl, setBoardEl] = useState<HTMLDivElement | null>(null);
  const boardPosition = useDomRect(boardEl);
  const [, drop] = useDrop<Ship, unknown, any>(
    () => ({
      accept: ItemTypes.SHIP,
      canDrop: (currentShip, monitor) =>
        !isGameStarted &&
        canDropShip(
          board,
          boardPosition,
          currentShip,
          monitor.getSourceClientOffset()
        ),
      drop: (currentShip, monitor) => {
        const shipPlacement: ShipPlacement = calculateShipCoords(
          currentShip,
          monitor,
          boardPosition
        );

        if (!currentShip.isShipPlaced) {
          dispatch(
            placeShipOnBoardFromOutside({
              currentShip,
              shipPlacement,
            })
          );
        } else {
          dispatch(moveShipOnBoard({ currentShip, shipPlacement }));
        }
      },
    }),
    [board, boardPosition, moveShipOnBoard, isGameStarted]
  );

  const handleBoardRef = useCallback(
    (el: HTMLDivElement | null) => {
      drop(el);
      setBoardEl(el);
    },
    [drop]
  );

  return (
    <Board
      ref={handleBoardRef}
      currentPlayer={currentPlayer}
      activePlayer={activePlayer}
    >
      <BoardField board={board} />
      <BoardShips ships={ships} />
      <ShipDragPreview board={board} boardPosition={boardPosition} />
    </Board>
  );
};
