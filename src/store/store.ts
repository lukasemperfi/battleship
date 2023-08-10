import { configureStore } from "@reduxjs/toolkit";
import { RootReducers } from "./rootReducers";
import { playerBoardSlice } from "./playerBoardSlice";
import { gameSlice } from "./gameSlice";
import { computerBoardSlice } from "./computerBoardSlice";

export const store = configureStore({
  reducer: {
    [RootReducers.PLAYER_BOARD]: playerBoardSlice,
    [RootReducers.GAME]: gameSlice,
    [RootReducers.COMPUTER_BOARD]: computerBoardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
