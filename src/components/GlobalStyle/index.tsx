import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Fake Receipt';
    src: url(${new URL(
      "../../assets/fakeReceipt.ttf",
      import.meta.url
    ).toString()});
  }

  body, html {
    height: 100%;
    margin: 0;
    width: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    box-sizing: border-box;
    height: 100%;
    margin: 0;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyles;
