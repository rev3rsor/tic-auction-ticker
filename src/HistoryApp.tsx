import styled from "styled-components";

import GlobalStyles from "./components/GlobalStyle";
import History from "./components/History";
import SheetProvider from "./components/SheetProvider";

const Wrapper = styled.div`
  background-color: teal;
  display: flex;
  height: 100%;
`;

const App = () => (
  <SheetProvider>
    <GlobalStyles />
    <Wrapper>
      <History />
    </Wrapper>
  </SheetProvider>
);

export default App;
