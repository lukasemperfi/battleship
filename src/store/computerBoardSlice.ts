import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { RootReducers } from "./rootReducers";
import { RootState } from "./store";


import {
  createBoardMatrix,
  markSunkShipArea,
} from "@/services/board/boardService";
import {
  generateRandomBoardAndShips,
} from "@/services/game/gameService";
import { Ship, ShipCoord } from "@/services/ships/shipsTypes";
import { Matrix, ShotResult } from "@/services/board/boardTypes";

interface ComputerBoardReducers extends SliceCaseReducers<ComputerBoardState> {
  randomlyPlaceShips: (
    state: ComputerBoardState,
    action: PayloadAction<void>
  ) => void;
  handleShotResult: (
    state: ComputerBoardState,
    action: PayloadAction<{ coords: ShipCoord; shotResult: ShotResult }>
  ) => void;
  handleShipHit: (
    state: ComputerBoardState,
    action: PayloadAction<ShipCoord>
  ) => void;
  resetComputerBoardState: (state: ComputerBoardState) => void;
}

interface ComputerBoardState {
  board: Matrix;
  ships: Ship[];
}

const initialState: ComputerBoardState = {
  board: createBoardMatrix(),
  ships: [],
};

export const computerBoard = createSlice<
  ComputerBoardState,
  ComputerBoardReducers,
  RootReducers
>({
  name: RootReducers.COMPUTER_BOARD,
  initialState,
  reducers: {
    randomlyPlaceShips: (state) => {
      const [newBoard, newShips] = generateRandomBoardAndShips();

      state.board = newBoard;
      state.ships = newShips;
    },
    handleShotResult: (state, { payload }) => {
      const {
        coords: [shotX, shotY],
        shotResult,
      } = payload;
      state.board[shotX][shotY] = shotResult;
    },
    handleShipHit: (state, { payload: coords }) => {
      const [shotX, shotY] = coords;
      const targetShip = state.ships.find((ship) =>
        ship.coords.some(([x, y]) => x === shotX && y === shotY)
      );

      if (!targetShip) {
        return;
      }

      targetShip.hits++;

      if (targetShip.hits === targetShip.coords.length) {
        const updatedBoard = markSunkShipArea(state.board, targetShip);
        state.board = updatedBoard;
      }
    },
    resetComputerBoardState: (state) => {
      state.board = createBoardMatrix();
      state.ships = [];
    },
  },
});

export const {
  randomlyPlaceShips,
  handleShotResult,
  handleShipHit,
  resetComputerBoardState,
} = computerBoard.actions;

export const selectComputerBoardState = (state: RootState) =>
  state.computerBoard;

export const computerBoardSlice = computerBoard.reducer;
