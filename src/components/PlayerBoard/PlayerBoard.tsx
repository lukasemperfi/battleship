import styled from "styled-components";
import { ReactComponent as RotateIcon } from "@/assets/icons/rotate.svg";
import { ReactComponent as RandomIcon } from "@/assets/icons/random.svg";
import { ReactComponent as RefreshIcon } from "@/assets/icons/refresh.svg";
import { usePlayerBoard } from "./usePlayerBoard";
import { DropZoneBoard } from "@/components/UI/Board/DropZoneBoard";
import { ShipsInitial } from "@/components/Ships";

const Wrapper = styled.div<{ isGameStarted: boolean }>`
  display: flex;
  gap: 33px;
  width: ${({ isGameStarted }) => (isGameStarted ? "auto" : "100%")};
  justify-content: space-between;
`;

const Button = styled.button`
  border: 2px solid black;
  padding: 10px;
  border-radius: 15px;
`;

const InitialShipsWrapper = styled.div`
  position: relative;
`;

const Container = styled.div`
  width: 330px;
  height: 330px;
  display: flex;
  flex-direction: column;
  gap: 33px;
`;

const ShipControls = styled.div`
  display: flex;
  gap: 33px;
  margin-top: auto;
`;

export const PlayerBoard = (): JSX.Element => {
  const {
    isGameStarted,
    playerBoard,
    playerShips,
    playerBoardCurrentPlayer,
    currentPlayer,
    initialShips,
    randomlyPlaceShipsHandler,
    rotateShip,
    resetShipPlacement,
  } = usePlayerBoard();

  return (
    <Wrapper isGameStarted={isGameStarted}>
      <DropZoneBoard
        board={playerBoard}
        ships={playerShips}
        currentPlayer={playerBoardCurrentPlayer}
        activePlayer={currentPlayer}
      />
      {!isGameStarted && (
        <Container>
          {playerShips.length < 10 && (
            <InitialShipsWrapper>
              <ShipsInitial ships={initialShips} />
            </InitialShipsWrapper>
          )}
          <ShipControls>
            <Button
              onClick={randomlyPlaceShipsHandler}
              title="Randomly Place Ships"
            >
              <RandomIcon width={33} height={33} />
            </Button>
            <Button onClick={rotateShip} title="Rotate Ship">
              <RotateIcon width={33} height={33} />
            </Button>
            <Button onClick={resetShipPlacement} title="Reset Ship Placement">
              <RefreshIcon width={33} height={33} />
            </Button>
          </ShipControls>
        </Container>
      )}
    </Wrapper>
  );
};
