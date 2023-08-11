import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { DropZoneBoard } from "../UI/Board/DropZoneBoard";
import {
  clearBoard,
  createInitialShips,
  moveShipOnBoard,
  randomlyPlaceShips,
  selectPlayerBoardState,
  setIsRotationNotAllowed,
  setSelectedShip,
} from "@/store/playerBoardSlice";
import { useEffect } from "react";
import styled from "styled-components";
import { ShipsInitial } from "../Ships/ShipsInitial";
import {
  canRotateShip,
  toogleRotate,
} from "@/services/placement/placementService";
import { CurrentPlayer, selectGameState } from "@/store/gameSlice";
import { ReactComponent as RotateIcon } from "@/assets/icons/rotate.svg";
import { ReactComponent as RandomIcon } from "@/assets/icons/random.svg";
import { ReactComponent as RefreshIcon } from "@/assets/icons/refresh.svg";

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
  const { board, ships, initialShips, selectedShip } = useAppSelector(
    selectPlayerBoardState
  );
  const { isGameStarted, currentPlayer } = useAppSelector(selectGameState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ships.length === 0) {
      dispatch(createInitialShips());
    }
  }, [ships]);

  const randomlyPlaceShipsHandler = () => {
    dispatch(randomlyPlaceShips());
  };

  const rotateShip = () => {
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

    const isRotationPossible = canRotateShip(board, selectedShip);

    if (!isRotationPossible) {
      dispatch(setIsRotationNotAllowed(true));
    } else {
      dispatch(moveShipOnBoard({ currentShip: selectedShip, shipPlacement }));
    }
  };

  const resetShipPlacement = () => {
    if (ships.length === 0) {
      return;
    }
    dispatch(clearBoard());
  };

  useEffect(() => {
    if (isGameStarted) {
      dispatch(setSelectedShip(null));
    }
  }, [isGameStarted]);

  const boardCurrentPlayer = isGameStarted ? CurrentPlayer.PLAYER : undefined;

  return (
    <Wrapper isGameStarted={isGameStarted}>
      <DropZoneBoard
        board={board}
        ships={ships}
        currentPlayer={boardCurrentPlayer}
        activePlayer={currentPlayer}
      />
      {!isGameStarted && (
        <Container>
          {ships.length < 10 && (
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
