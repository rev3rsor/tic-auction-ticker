import styled from "styled-components";

import GlobalStyles from "./components/GlobalStyle";
import SheetProvider from "./components/SheetProvider";
import UpdateForm from "./components/UpdateForm";

const Wrapper = styled.div`
  background-color: darkturquoise;
  display: flex;
  height: 100%;
`;

const App = () => (
  <SheetProvider>
    <GlobalStyles />
    <Wrapper>
      <UpdateForm />
    </Wrapper>
  </SheetProvider>
);

export default App;
