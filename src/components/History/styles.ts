import styled from "styled-components";

export const Button = styled.button`
  font-family: inherit;
  font-size: 16px;
  margin-top: 8px;
  padding: 8px;
`;

export const Container = styled.div`
  font-family: "Fake Receipt";
  font-size: 16px;
  color: white;
  margin: 24px auto;
  max-width: 1200px;
`;

interface ItemTextProps {
  strikethrough: boolean;
}

export const ItemText = styled.div<ItemTextProps>`
  margin-left: 6px;
  ${(props) => props.strikethrough && `text-decoration: line-through;`};
`;

export const ItemWrapper = styled.div`
  display: flex;
  margin: 6px 0;
`;
