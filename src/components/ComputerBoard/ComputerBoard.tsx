import { useEffect } from "react";
import { Board, BoardField } from "../UI/Board";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  handleShotResult,
  handleShipHit,
  randomlyPlaceShips,
  selectComputerBoardState,
} from "@/store/computerBoardSlice";
import {
  CurrentPlayer,
  selectGameState,
  setCurrentPlayer,
} from "@/store/gameSlice";
import { ShotResult } from "@/services/board/boardTypes";
import { BoardShips } from "../UI/Board/BoardShips";
import { ShipCoord } from "@/services/ships/shipsTypes";

export const ComputerBoard = () => {
  const { board, ships } = useAppSelector(selectComputerBoardState);
  const { isGameStarted, currentPlayer, isGameOver } =
    useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isGameStarted) {
      dispatch(randomlyPlaceShips());
    }
  }, [isGameStarted]);

  const onCellClick = (coords: ShipCoord, shotResult: ShotResult): void => {
    if (isGameOver) {
      return;
    }

    if (currentPlayer === CurrentPlayer.PLAYER && isGameStarted) {
      if (shotResult === ShotResult.Empty) {
        dispatch(handleShotResult({ coords, shotResult: ShotResult.Miss }));
        dispatch(setCurrentPlayer(CurrentPlayer.COMPUTER));
      }
      if (shotResult === ShotResult.Ship) {
        dispatch(handleShotResult({ coords, shotResult: ShotResult.Hit }));
        dispatch(handleShipHit(coords));
      }
    }
  };

  const sunkShips = ships.filter((ship) => ship.hits === ship.coords.length);

  return (
    <Board currentPlayer={CurrentPlayer.COMPUTER} activePlayer={currentPlayer}>
      <BoardField board={board} onCellClick={onCellClick} />
      <BoardShips ships={sunkShips} />
    </Board>
  );
};
