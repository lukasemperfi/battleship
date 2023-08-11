import styled from "styled-components";
import { useEffect } from "react";
import { PlayerBoard } from "../components/PlayerBoard";
import { PageContainer } from "@/components/UI/PageContainer/PageContainer";
import { GameBoardContainer } from "@/components/UI/GameBoardContainer/GameBoardContainer";
import {
  handleShipHit as handlePlayerBoardShipHit,
  handleShotResult as handlePlayerBoardShotResult,
  resetPlayerBoardState,
  selectPlayerBoardState,
} from "@/store/playerBoardSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  CurrentPlayer,
  resetGameState,
  selectGameState,
  setCurrentPlayer,
  setIsGameOver,
  setIsGameStarted,
  setWinner,
} from "@/store/gameSlice";
import { ComputerBoard } from "@/components/ComputerBoard/ComputerBoard";
import {
  resetComputerBoardState,
  selectComputerBoardState,
} from "@/store/computerBoardSlice";
import { ShipCoord } from "@/services/ships/shipsTypes";
import { ShotResult } from "@/services/board/boardTypes";
import { computerShot } from "@/services/AIService/AIService";
import { checkWin, isGameFinished } from "@/services/game/gameService";
import { DifficultyLevel, ShotInfo } from "@/services/AIService/AIServiceTypes";
import { Button } from "@/components/UI/Button/Button";

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const WinMessage = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 20px;
`;

export const GamePage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    ships: playerShips,
    board: playerBoard,
    targetShipHitCoords,
  } = useAppSelector(selectPlayerBoardState);
  const { ships: computerShips } = useAppSelector(selectComputerBoardState);
  const { isGameStarted, currentPlayer, isGameOver, winner } =
    useAppSelector(selectGameState);
  const isPlayerReady = playerShips.length === 10 && !isGameStarted;

  const startGame = () => {
    if (isPlayerReady && !isGameStarted) {
      dispatch(setIsGameStarted(true));
    }
  };

  const restartGame = () => {
    dispatch(resetGameState());
    dispatch(resetPlayerBoardState());
    dispatch(resetComputerBoardState());
  };

  const checkGameOutcome = () => {
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

  const makeComputerShot = async () => {
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

  useEffect(() => {
    if (currentPlayer === CurrentPlayer.COMPUTER && !isGameOver) {
      makeComputerShot();
    }
  }, [currentPlayer, playerBoard]);

  const winMessage = {
    [CurrentPlayer.PLAYER]: <WinMessage color="green">You Win!</WinMessage>,
    [CurrentPlayer.COMPUTER]: <WinMessage color="red">You Lose!</WinMessage>,
  };

  return (
    <PageContainer>
      <GameBoardContainer>
        <PlayerBoard />
        {isGameStarted && <ComputerBoard />}
      </GameBoardContainer>
      <Footer>
        {isPlayerReady && <Button onClick={startGame}>PLAY</Button>}
        {isGameOver && winner !== null && winMessage[winner]}
        {isGameOver && <Button onClick={restartGame}>PLAY AGAIN</Button>}
      </Footer>
    </PageContainer>
  );
};
