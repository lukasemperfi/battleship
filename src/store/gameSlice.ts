import {
  type PayloadAction,
  type SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { RootReducers } from "./rootReducers";
import { type RootState } from "./store";

export enum CurrentPlayer {
  PLAYER = "Player",
  COMPUTER = "Computer",
}

interface GameState {
  isGameStarted: boolean;
  isGameOver: boolean;
  currentPlayer: CurrentPlayer;
  winner: CurrentPlayer | null;
}

const initialState: GameState = {
  isGameStarted: false,
  isGameOver: false,
  currentPlayer: CurrentPlayer.PLAYER,
  winner: null,
};

interface GameReducers extends SliceCaseReducers<GameState> {
  setIsGameStarted: (state: GameState, action: PayloadAction<boolean>) => void;
  setIsGameOver: (state: GameState, action: PayloadAction<boolean>) => void;
  setCurrentPlayer: (
    state: GameState,
    action: PayloadAction<CurrentPlayer>
  ) => void;
  setWinner: (state: GameState, action: PayloadAction<CurrentPlayer>) => void;
  resetGameState: (state: GameState) => void;
}

export const game = createSlice<GameState, GameReducers, RootReducers>({
  name: RootReducers.GAME,
  initialState,
  reducers: {
    setIsGameStarted: (state, { payload: isGameStarted }) => {
      state.isGameStarted = isGameStarted;
    },
    setIsGameOver: (state, { payload: isGameOver }) => {
      state.isGameOver = isGameOver;
    },
    setCurrentPlayer: (state, { payload: currentPlayer }) => {
      state.currentPlayer = currentPlayer;
    },
    setWinner: (state, { payload: winner }) => {
      state.winner = winner;
    },
    resetGameState: (state) => {
      state.currentPlayer = CurrentPlayer.PLAYER;
      state.isGameOver = false;
      state.isGameStarted = false;
      state.winner = null;
    },
  },
});

export const {
  setIsGameStarted,
  setIsGameOver,
  setCurrentPlayer,
  setWinner,
  increaseMoveCount,
  setMoveCount,
  resetGameState,
} = game.actions;

export const selectGameState = (state: RootState): GameState => state.game;

export const gameSlice = game.reducer;
