import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { RootReducers } from "./rootReducers";
import { RootState } from "./store";

import { ShipData } from "@/config/gameConfig";

import {
  createBoardMatrix,
  markSunkShipArea,
  placeShipOnBoard,
  removeShipFromBoard,
} from "@/services/board/boardService";
import {
  generateRandomBoardAndShips,
  generateInitialShips,
  updateShipPositionOnBoard,
  addShipToBoard,
} from "@/services/game/gameService";
import { ShipCoordsAndPosition } from "@/services/placement/placementTypes";
import {
  Ship,
  ShipCoord,
  ShipCoords,
  ShipPlacement,
} from "@/services/ships/shipsTypes";
import { Matrix, ShotResult } from "@/services/board/boardTypes";

interface PlayerBoardReducers extends SliceCaseReducers<PlayerBoardState> {
  randomlyPlaceShips: (
    state: PlayerBoardState,
    action: PayloadAction<void>
  ) => void;
  createInitialShips: (
    state: PlayerBoardState,
    action: PayloadAction<void>
  ) => void;
  moveShipOnBoard: (
    state: PlayerBoardState,
    action: PayloadAction<{
      currentShip: Ship;
      shipPlacement: ShipPlacement;
    }>
  ) => void;

  placeShipOnBoardFromOutside: (
    state: PlayerBoardState,
    action: PayloadAction<{
      currentShip: Ship;
      shipPlacement: ShipPlacement;
    }>
  ) => void;
  clearBoard: (state: PlayerBoardState) => void;
  setSelectedShip: (
    state: PlayerBoardState,
    action: PayloadAction<Ship | null>
  ) => void;
  setIsRotationNotAllowed: (
    state: PlayerBoardState,
    action: PayloadAction<boolean>
  ) => void;
  handleShotResult: (
    state: PlayerBoardState,
    action: PayloadAction<{ coords: ShipCoord; shotResult: ShotResult }>
  ) => void;
  handleShipHit: (
    state: PlayerBoardState,
    action: PayloadAction<ShipCoord>
  ) => void;
  resetPlayerBoardState: (state: PlayerBoardState) => void;
}

interface PlayerBoardState {
  board: Matrix;
  ships: Ship[];
  initialShips: Ship[];
  selectedShip: Ship | null;
  isRotationNotAllowed: boolean;
  targetShipHitCoords: ShipCoords | null;
}

const initialState: PlayerBoardState = {
  board: createBoardMatrix(),
  ships: [],
  initialShips: [],
  selectedShip: null,
  isRotationNotAllowed: false,
  targetShipHitCoords: null,
};

// const PlayerBoardReducers: ValidateSliceCaseReducers<PlayerBoardState, PlayerBoardReducers> = {};

export const playerBoard = createSlice<
  PlayerBoardState,
  PlayerBoardReducers,
  RootReducers
>({
  name: RootReducers.PLAYER_BOARD,
  initialState,
  reducers: {
    randomlyPlaceShips: (state) => {
      state.initialShips = [];
      const [newBoard, newShips] = generateRandomBoardAndShips();

      // state.board = createBoardMatrix(ShotResult.Empty, 10);

      state.board = newBoard;
      state.ships = newShips;
    },
    createInitialShips: (state) => {
      const initialShips = generateInitialShips();

      state.initialShips = initialShips;
    },
    moveShipOnBoard: (state, { payload }) => {
      const { currentShip, shipPlacement } = payload;

      const [updatedBoard, updatedShips, updatedShip] =
        updateShipPositionOnBoard(
          state.board,
          state.ships,
          currentShip,
          shipPlacement
        );

      state.board = updatedBoard;
      state.ships = updatedShips;
      state.selectedShip = updatedShip;
    },
    placeShipOnBoardFromOutside: (state, { payload }) => {
      const { currentShip, shipPlacement } = payload;

      state.initialShips = state.initialShips.map((initShip) => {
        if (initShip.id === currentShip.id) {
          return { ...initShip, isShipPlaced: true };
        }

        return initShip;
      });

      const [updatedBoard, updatedShips, updatedShip] = addShipToBoard(
        state.board,
        state.ships,
        currentShip,
        shipPlacement
      );

      state.board = updatedBoard;
      state.ships = updatedShips;
      state.selectedShip = updatedShip;

      if (state.ships.length === 10) {
        state.initialShips = [];
      }
    },
    clearBoard: (state) => {
      state.board = createBoardMatrix();
      state.ships = [];
    },
    setSelectedShip: (state, { payload: currentShip }) => {
      state.selectedShip = currentShip;
    },
    setIsRotationNotAllowed: (state, { payload: isShipRotationPossible }) => {
      state.isRotationNotAllowed = isShipRotationPossible;
    },
    handleShotResult: (state, { payload }) => {
      const {
        coords: [x, y],
        shotResult,
      } = payload;
      state.board[x][y] = shotResult;
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

      if (state.targetShipHitCoords === null) {
        state.targetShipHitCoords = [[shotX, shotY]];
      } else {
        state.targetShipHitCoords.push([shotX, shotY]);
      }

      if (targetShip.hits === targetShip.coords.length) {
        const updatedBoard = markSunkShipArea(state.board, targetShip);
        state.board = updatedBoard;
        state.targetShipHitCoords = null;
      }
    },
    resetPlayerBoardState: (state) => {
      state.board = createBoardMatrix();
      state.ships = [];
      state.initialShips = [];
      state.isRotationNotAllowed = false;
      state.selectedShip = null;
      state.targetShipHitCoords = null;
    },
  },
});

export const {
  randomlyPlaceShips,
  createInitialShips,
  moveShipOnBoard,
  placeShipOnBoardFromOutside,
  setSelectedShip,
  setIsRotationNotAllowed,
  clearBoard,
  handleShipHit,
  handleShotResult,
  resetPlayerBoardState,
} = playerBoard.actions;

export const selectPlayerBoardState = (state: RootState) => state.playerBoard;
export const selectSelectedShip = (state: RootState) =>
  state.playerBoard.selectedShip;
export const selectIsRotationNotAllowed = (state: RootState) =>
  state.playerBoard.isRotationNotAllowed;

export const playerBoardSlice = playerBoard.reducer;
