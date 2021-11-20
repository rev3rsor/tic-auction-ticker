import { useContext, useEffect, useState } from "react";

import { SheetContext } from "~src/components/SheetProvider";
import { Row } from "~src/models/Row";
import { Button, Container, ItemText, ItemWrapper } from "./styles";

const CHECKED_ITEMS_SESSION_KEY = "checkedItems";

const History = () => {
  const doc = useContext(SheetContext);

  const [items, setItems] = useState<Row[] | null>(null);
  const [bids, setBids] = useState<Row[]>([]);

  const [checkedItems, setCheckedItems] = useState<boolean[]>(() =>
    JSON.parse(sessionStorage.getItem(CHECKED_ITEMS_SESSION_KEY) || "[]")
  );

  useEffect(() => {
    sessionStorage.setItem(
      CHECKED_ITEMS_SESSION_KEY,
      JSON.stringify(checkedItems)
    );
  }, [checkedItems]);

  useEffect(() => {
    if (!doc) return undefined;

    if (!items) {
      (async () => {
        const newItems = (await doc.sheetsByIndex[0].getRows()) as Row[];
        setItems(newItems);
      })();
    }

    if (!bids) {
      (async () => {
        const newRows = (await doc.sheetsByIndex[1].getRows()) as Row[];
        if (!newRows) return;

        setBids(newRows);
      })();
    }

    const interval = setInterval(async () => {
      const newRows = (await doc.sheetsByIndex[1].getRows()) as Row[];
      if (!newRows) return;

      setBids(newRows);

      setCheckedItems((prevCheckedItems) =>
        newRows.length > prevCheckedItems.length
          ? [
              ...new Array(newRows.length - prevCheckedItems.length).fill(
                false
              ),
              ...prevCheckedItems,
            ]
          : prevCheckedItems
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [doc]);

  return (
    <Container>
      {bids.length ? (
        [...bids].reverse().map((row, idx) => {
          const matchingItemName = items?.find(
            (item) => item.number === row.number
          )?.item;

          return (
            <ItemWrapper key={idx}>
              <input
                checked={checkedItems[idx] ?? false}
                onChange={(evt) =>
                  setCheckedItems((prev) => [
                    ...prev.slice(0, idx),
                    evt.target.checked,
                    ...prev.slice(idx + 1),
                  ])
                }
                type="checkbox"
              />
              <ItemText
                onClick={() =>
                  setCheckedItems((prev) => [
                    ...prev.slice(0, idx),
                    !prev[idx],
                    ...prev.slice(idx + 1),
                  ])
                }
                strikethrough={checkedItems[idx]}
              >
                Return ${row.price} to {row.highestBidder}, outbid on item
                number {row.number}
                {matchingItemName ? ` (${matchingItemName})` : null}
              </ItemText>
            </ItemWrapper>
          );
        })
      ) : (
        <div>Loading...</div>
      )}
      <Button onClick={() => setCheckedItems([])}>Clear checkboxes</Button>
    </Container>
  );
};

export default History;
