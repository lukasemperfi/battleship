import styled from "styled-components";
import { CurrentPlayer } from "@/store/gameSlice";

import { useGame } from "./useGame";
import { PageContainer } from "@/components/UI/PageContainer";
import { GameBoardContainer } from "@/components/UI/GameBoardContainer";
import { PlayerBoard } from "@/components/PlayerBoard";
import { ComputerBoard } from "@/components/ComputerBoard";
import { Button } from "@/components/UI/Button";

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
