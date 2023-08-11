import { CurrentPlayer } from "@/store/gameSlice";
import { useComputerBoard } from "./useComputerBoard";
import { Board, BoardField, BoardShips } from "@/components/UI/Board";

export const ComputerBoard = (): JSX.Element => {
  const { currentPlayer, board, onCellClick, sunkShips } = useComputerBoard();

  return (
    <Board currentPlayer={CurrentPlayer.COMPUTER} activePlayer={currentPlayer}>
      <BoardField board={board} onCellClick={onCellClick} />
      <BoardShips ships={sunkShips} />
    </Board>
  );
};
