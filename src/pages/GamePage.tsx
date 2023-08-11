import styled from "styled-components";
import { useEffect } from "react";
import { PlayerBoard } from "../components/PlayerBoard";
import { PageContainer } from "@/components/UI/PageContainer/PageContainer";
import { GameBoardContainer } from "@/components/UI/GameBoardContainer/GameBoardContainer";
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
import { ComputerBoard } from "@/components/ComputerBoard/ComputerBoard";
import {
  resetComputerBoardState,
  selectComputerBoardState,
} from "@/store/computerBoardSlice";
import { checkWin, isGameFinished } from "@/services/game/gameService";
import { Button } from "@/components/UI/Button/Button";
import { useGame } from "./useGame";

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
  const {
    isGameStarted,
    isPlayerReady,
    isGameOver,
    winner,
    startGame,
    restartGame,
  } = useGame();

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
