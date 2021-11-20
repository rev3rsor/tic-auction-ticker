import { GoogleSpreadsheet } from "google-spreadsheet";
import React, { createContext, useEffect, useState } from "react";

const SHEET_ID = "1eyIonTbQEmhxKFXpgA2164RmcCxndjcoHhUCPXMHcPQ";

export const SheetContext = createContext<GoogleSpreadsheet | null>(null);

interface SheetContextProps {
  children?: React.ReactNode;
}

const SheetProvider = ({ children }: SheetContextProps): React.ReactElement => {
  const [sheet, setSheet] = useState<GoogleSpreadsheet | null>(null);

  useEffect(() => {
    (async () => {
      const doc = new GoogleSpreadsheet(SHEET_ID);

      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
        private_key: process.env.GOOGLE_PRIVATE_KEY as string,
      });

      await doc.loadInfo();

      setSheet(doc);
    })();
  }, []);

  return (
    <SheetContext.Provider value={sheet}>{children}</SheetContext.Provider>
  );
};

export default SheetProvider;
