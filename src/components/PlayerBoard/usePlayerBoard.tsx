import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  clearBoard,
  createInitialShips,
  moveShipOnBoard,
  randomlyPlaceShips,
  selectPlayerBoardState,
  setIsRotationNotAllowed,
  setSelectedShip,
  handleShipHit as handlePlayerBoardShipHit,
  handleShotResult as handlePlayerBoardShotResult,
} from "@/store/playerBoardSlice";
import { useEffect } from "react";
import {
  canRotateShip,
  toogleRotate,
} from "@/services/placement/placementService";
import {
  CurrentPlayer,
  selectGameState,
  setCurrentPlayer,
} from "@/store/gameSlice";
import { type Ship, type ShipCoord } from "@/services/ships/shipsTypes";
import { type Matrix, ShotResult } from "@/services/board/boardTypes";
import { isGameFinished } from "@/services/game/gameService";
import { computerShot } from "@/services/AIService/AIService";
import { DifficultyLevel } from "@/services/AIService/AIServiceTypes";
import { selectComputerBoardState } from "@/store/computerBoardSlice";

interface UsePlayerBoardReturn {
  isGameStarted: boolean;
  playerBoard: Matrix;
  playerShips: Ship[];
  playerBoardCurrentPlayer?: CurrentPlayer;
  currentPlayer: CurrentPlayer;
  initialShips: Ship[];
  randomlyPlaceShipsHandler: () => void;
  rotateShip: () => void;
  resetShipPlacement: () => void;
}

export const usePlayerBoard = (): UsePlayerBoardReturn => {
  const {
    board: playerBoard,
    ships: playerShips,
    initialShips,
    selectedShip,
    targetShipHitCoords,
  } = useAppSelector(selectPlayerBoardState);
  const { ships: computerShips } = useAppSelector(selectComputerBoardState);
  const { isGameStarted, currentPlayer, isGameOver } =
    useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (playerShips.length === 0) {
      dispatch(createInitialShips());
    }
  }, [playerShips]);

  useEffect(() => {
    if (isGameStarted) {
      dispatch(setSelectedShip(null));
    }
  }, [isGameStarted]);

  useEffect(() => {
    if (currentPlayer === CurrentPlayer.COMPUTER && !isGameOver) {
      makeComputerShot();
    }
  }, [currentPlayer, playerBoard]);

  const randomlyPlaceShipsHandler = (): void => {
    dispatch(randomlyPlaceShips());
  };

  const rotateShip = (): void => {
    if (!selectedShip) {
      return;
    }

    const shipDecks = selectedShip.coords.length;
    const {
      placement: { x, y, orientation },
    } = selectedShip;

    if (shipDecks === 1) {
      return;
    }

    const shipPlacement = {
      x,
      y,
      orientation: toogleRotate(orientation),
    };

    const isRotationPossible = canRotateShip(playerBoard, selectedShip);

    if (!isRotationPossible) {
      dispatch(setIsRotationNotAllowed(true));
    } else {
      dispatch(moveShipOnBoard({ currentShip: selectedShip, shipPlacement }));
    }
  };

  const resetShipPlacement = (): void => {
    if (playerShips.length === 0) {
      return;
    }
    dispatch(clearBoard());
  };

  const playerBoardCurrentPlayer = isGameStarted
    ? CurrentPlayer.PLAYER
    : undefined;

  // Computer move logic
  const onCellClick = (coords: ShipCoord, shotResult: ShotResult): void => {
    if (isGameOver) {
      return;
    }

    if (currentPlayer === CurrentPlayer.COMPUTER && isGameStarted) {
      if (shotResult === ShotResult.Empty) {
        dispatch(
          handlePlayerBoardShotResult({ coords, shotResult: ShotResult.Miss })
        );
        dispatch(setCurrentPlayer(CurrentPlayer.PLAYER));
      }
      if (shotResult === ShotResult.Ship) {
        dispatch(
          handlePlayerBoardShotResult({ coords, shotResult: ShotResult.Hit })
        );
        dispatch(handlePlayerBoardShipHit(coords));
      }
    }
  };

  const makeComputerShot = async (): Promise<void> => {
    if (isGameFinished(playerShips, computerShips)) {
      return;
    }

    const shotCoords: ShipCoord | null = await computerShot(
      targetShipHitCoords,
      playerBoard,
      DifficultyLevel.EASY,
      1000
    );

    if (!shotCoords) {
      return;
    }

    const [x, y] = shotCoords;
    const shotResult = playerBoard[x][y];

    onCellClick(shotCoords, shotResult);
  };

  return {
    isGameStarted,
    playerBoard,
    playerShips,
    playerBoardCurrentPlayer,
    currentPlayer,
    initialShips,
    randomlyPlaceShipsHandler,
    rotateShip,
    resetShipPlacement,
  };
};
