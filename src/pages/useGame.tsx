import { useEffect } from "react";
import {
  resetPlayerBoardState,
  selectPlayerBoardState,
} from "@/store/playerBoardSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  CurrentPlayer,
  resetGameState,
  selectGameState,
  setIsGameOver,
  setIsGameStarted,
  setWinner,
} from "@/store/gameSlice";
import {
  resetComputerBoardState,
  selectComputerBoardState,
} from "@/store/computerBoardSlice";
import { checkWin, isGameFinished } from "@/services/game/gameService";

interface UseGameReturn {
  isGameStarted: boolean;
  isPlayerReady: boolean;
  isGameOver: boolean;
  winner: CurrentPlayer | null;
  startGame: () => void;
  restartGame: () => void;
}

export const useGame = (): UseGameReturn => {
  const dispatch = useAppDispatch();
  const { ships: playerShips } = useAppSelector(selectPlayerBoardState);
  const { ships: computerShips } = useAppSelector(selectComputerBoardState);
  const { isGameStarted, isGameOver, winner } = useAppSelector(selectGameState);
  const isPlayerReady = playerShips.length === 10 && !isGameStarted;

  const startGame = (): void => {
    if (isPlayerReady && !isGameStarted) {
      dispatch(setIsGameStarted(true));
    }
  };

  const restartGame = (): void => {
    dispatch(resetGameState());
    dispatch(resetPlayerBoardState());
    dispatch(resetComputerBoardState());
  };

  const checkGameOutcome = (): void => {
    if (isGameFinished(playerShips, computerShips)) {
      dispatch(setIsGameOver(true));

      if (checkWin(computerShips)) {
        dispatch(setWinner(CurrentPlayer.PLAYER));
      } else {
        dispatch(setWinner(CurrentPlayer.COMPUTER));
      }
    }
  };

  useEffect(() => {
    if (isGameStarted) {
      checkGameOutcome();
    }
  }, [playerShips, computerShips]);

  return {
    isGameStarted,
    isPlayerReady,
    isGameOver,
    winner,
    startGame,
    restartGame,
  };
};
