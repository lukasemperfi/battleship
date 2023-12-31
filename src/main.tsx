import ReactDOM from "react-dom/client";
import { App } from "./App";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GlobalStyles } from "./styles/GlobalStyles";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <GlobalStyles />
      <App />
    </DndProvider>
  </Provider>
);
