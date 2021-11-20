import { useContext, useEffect, useState } from "react";

import { SheetContext } from "~src/components/SheetProvider";
import { Row } from "~src/models/Row";

import {
  Container,
  IncreaseText,
  StrikethroughText,
  StyledTable,
} from "./styles";

interface TableProps {
  startItem: number;
  endItem: number;
}

const Table = ({ startItem, endItem }: TableProps): React.ReactElement => {
  const doc = useContext(SheetContext);

  // keep last three snapshots of row states for comparing
  const [lastThreeRowSnapshots, setLastThreeRowSnapshots] = useState<Row[][]>(
    []
  );

  useEffect(() => {
    if (!doc) return undefined;

    if (!lastThreeRowSnapshots[0]) {
      (async () => {
        const rows = (await doc.sheetsByIndex[0].getRows()) as Row[];
        setLastThreeRowSnapshots([rows]);
      })();
    }

    // refresh rows, keep the last 3
    const interval = setInterval(async () => {
      const newRows = (await doc.sheetsByIndex[0].getRows()) as Row[];
      if (!newRows) return;

      setLastThreeRowSnapshots((snapshots) => [
        newRows,
        ...snapshots.slice(0, 2),
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, [doc]);

  const createTable = (snapshots: Row[][]) => (
    <StyledTable>
      <thead>
        <tr>
          {["Number", "Item", "Highest Bidder", "Price"].map((title) => (
            <th key={title}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {snapshots[0]?.map((row, idx) => {
          const previousRow = snapshots[1]?.[idx];
          const secondPreviousRow = snapshots[2]?.[idx];

          let increaseText = "";
          let show = false;

          if (row.price !== previousRow?.price) {
            increaseText = `▲${
              parseInt(row.price, 10) - parseInt(previousRow?.price || "0", 10)
            }`;
            show = true;
          } else if (row.price !== secondPreviousRow?.price) {
            increaseText = `▲${
              parseInt(row.price, 10) -
              parseInt(secondPreviousRow?.price || "0", 10)
            }`;
          }

          return (
            <tr key={idx}>
              <td>{row.number}</td>
              <td>{row.item}</td>
              <td>
                {previousRow?.highestBidder &&
                previousRow.highestBidder !== row.highestBidder ? (
                  <StrikethroughText>
                    {previousRow.highestBidder}
                  </StrikethroughText>
                ) : null}
                {row.highestBidder}
              </td>
              <td>
                {row.price}
                <IncreaseText show={show}>{increaseText}</IncreaseText>
              </td>
            </tr>
          );
        })}
      </tbody>
    </StyledTable>
  );

  return (
    <Container>
      {lastThreeRowSnapshots[0] ? (
        <>
          {createTable(
            lastThreeRowSnapshots.map((snapshot) =>
              snapshot.slice(startItem, endItem)
            )
          )}
        </>
      ) : (
        "Loading..."
      )}
    </Container>
  );
};

export default Table;
