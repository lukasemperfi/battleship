import styled from "styled-components";
import battleFieldBackground from "@/assets/img/grid.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayerBoard } from "../components/PlayerBoard";
import { PageContainer } from "@/components/UI/PageContainer/PageContainer";
import { GameBoardContainer } from "@/components/UI/GameBoardContainer/GameBoardContainer";
import {
  clearBoard,
  handleShipHit as handlePlayerBoardShipHit,
  handleShotResult as handlePlayerBoardShotResult,
  moveShipOnBoard,
  randomlyPlaceShips,
  resetPlayerBoardState,
  selectPlayerBoardState,
  selectSelectedShip,
  setIsRotationNotAllowed,
} from "@/store/playerBoardSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  canRotateShip,
  toogleRotate,
} from "@/services/placement/placementService";
import {
  CurrentPlayer,
  increaseMoveCount,
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
import { Ship, ShipCoord } from "@/services/ships/shipsTypes";
import { Matrix, ShotResult } from "@/services/board/boardTypes";
import { color } from "framer-motion";
import { deepClone, generateRandomNumber } from "@/utils/commonUtils";
import { ShipCoords } from "@/services/ships/shipsTypes";
import { ShipOrientation } from "@/services/ships/shipsTypes";
import {
  computerShot,
  getRandomShotCoords,
  getShotCoordsAroundHit,
  shotAlgorithm,
} from "@/services/AIService/AIService";
import { checkWin, isGameFinished } from "@/services/game/gameService";
import { DifficultyLevel, ShotInfo } from "@/services/AIService/AIServiceTypes";
import { Board, BoardField } from "@/components/UI/Board";
import { BoardShips } from "@/components/UI/Board/BoardShips";
import { Button } from "@/components/UI/Button/Button";
import { ReactComponent as AIIcon } from "@/assets/icons/ai.svg";

// const BattleField = styled.div`
//   width: 860px;
//   height: 563px;
//   position: relative;
//   margin: 0 auto;
//   background: url(${battleFieldBackground}) repeat;
// `;

const Header = styled.header`
  padding-top: 10px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  // height: 50px;
  // padding: 10px;
`;

const BoardWrapper = styled.div``;
const BoardTitle = styled.h2`
  display: flex;
  justify-content: center;
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

  const onCellClick = useCallback(
    (coords: ShipCoord, board: Matrix) => {
      if (isGameOver) {
        return;
      }
      const [x, y] = coords;
      const shotResult = board[x][y];

      if (currentPlayer === CurrentPlayer.COMPUTER && isGameStarted) {
        dispatch(increaseMoveCount());
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
    },
    [isGameOver, currentPlayer, isGameStarted, dispatch]
  );

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

    onCellClick(shotCoords, playerBoard);
  };

  // useEffect(() => {
  //   shotAlgorithm(playerBoard);
  // }, []);

  useEffect(() => {
    if (currentPlayer === CurrentPlayer.COMPUTER && !isGameOver) {
      makeComputerShot();
    }
  }, [currentPlayer, playerBoard]);
  // console.log(playerBoard);

  // const winMessage = (
  //   // <div>
  //   <>
  //     {winner === CurrentPlayer.PLAYER ? (
  //       <WinMessage color="green">You Win!</WinMessage>
  //     ) : (
  //       <WinMessage color="red">You Lose!</WinMessage>
  //     )}
  //   </>

  //   // </div>
  // );

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
