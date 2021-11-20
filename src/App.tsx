import styled from "styled-components";

import GlobalStyles from "./components/GlobalStyle";
import SheetProvider from "./components/SheetProvider";
import Table from "./components/Table";

const Wrapper = styled.div`
  background-color: black;
  display: flex;
  height: 100%;
  width: 100%;
`;

const App = () => (
  <SheetProvider>
    <GlobalStyles />
    <Wrapper>{/* <Table /> */}</Wrapper>
  </SheetProvider>
);

export default App;
