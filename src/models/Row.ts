import { GoogleSpreadsheetRow } from "google-spreadsheet";

export interface RowProperties {
  number: string;
  item: string;
  highestBidder: string;
  price: string;
}

export interface Row extends GoogleSpreadsheetRow, RowProperties {}
