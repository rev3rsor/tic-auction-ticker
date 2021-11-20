import styled from "styled-components";

export const Container = styled.div`
  color: white;
  display: flex;
  font-family: "Fake Receipt";
  font-size: 16px;
  justify-content: space-evenly;
  margin: auto;
  width: 100%;
`;

interface IncreaseTextProps {
  show: boolean;
}

export const IncreaseText = styled.span<IncreaseTextProps>`
  ${({ show }) =>
    show
      ? `
          color: limegreen;
        `
      : `
          color: transparent;
          transition: color 0.5s;
        `}
`;

export const PreviousBids = styled.div`
  margin: 24px;
`;

export const StrikethroughText = styled.span`
  margin-right: 1em;
  text-decoration: line-through;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;

  td,
  th {
    border: none;
    box-sizing: border-box;
    height: 2em; // accomodate triangle character
    padding: 0 0.5em;
    text-align: left;
  }

  th {
    padding: 0.5em;
  }

  th:nth-child(3) {
    padding-right: 48px;
  }

  th:nth-child(4) {
    padding-right: 24px;
  }

  tbody {
    tr:nth-child(even) {
      background-color: #343434;
    }
  }
`;
