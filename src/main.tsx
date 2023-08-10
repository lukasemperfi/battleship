import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./styles/main.scss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Provider } from "react-redux";
import { store } from "./store/store";
// import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //  <React.StrictMode>
  //  <ChakraProvider>
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </Provider>

  // </ChakraProvider>
  //  </React.StrictMode>
);
