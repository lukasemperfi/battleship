import { createGlobalStyle } from "styled-components";
import "./reset.css";

export const GlobalStyles = createGlobalStyle`
html {
    font-size: 16px;
  }

  *,
  *:before,
  *:after {
    border-color: #e2e8f0;
  }

  body {
    min-height: 100vh;
    color: #4530af;
    background: #ffffff; 
    transition: color 0.5s, background-color 0.5s;
    line-height: 1.5;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 18px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
