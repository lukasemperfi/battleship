import { Board, BoardField } from "../UI/Board";
import { CurrentPlayer } from "@/store/gameSlice";
import { BoardShips } from "../UI/Board/BoardShips";
import { useComputerBoard } from "./useComputerBoard";

export const ComputerBoard = () => {
  const { currentPlayer, board, onCellClick, sunkShips } = useComputerBoard();

  return (
    <Board currentPlayer={CurrentPlayer.COMPUTER} activePlayer={currentPlayer}>
      <BoardField board={board} onCellClick={onCellClick} />
      <BoardShips ships={sunkShips} />
    </Board>
  );
};
