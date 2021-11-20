# `tic-auction-ticker`

`tic-auction-ticker` is an app for displaying and updating a Google Spreadsheet, for the TiC Auction event.

The app consists of 3 main components:

- `Table`, for displaying all data
- `UpdateForm`, an interface for updating bids
- `History`, for displaying previous bids

## Development

To run the build, run `yarn start`. Ensure that all `.html` files to be served are added to the `source` field in `package.json`.

Note that this app is not deployed to any server, as it requires the private key in order to access the spreadsheet - `google-spreadsheet` is intended to be run as a node package, not called from the front-end, so purely for convenience purposes, the app was run from a local computer with this knowledge.

## Data

The app relies on a Google Spreadsheet for data storage. It reads and updates the data as the master data source.

The format is as follows:

### Sheet `allItems` (index 0)

Represents master data, and current bidder + bids.

| Field         | Description                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| number        | Unique item number. Does not need to be purely numeric, although UpdateForm has an input `type='number'` for convenience, when the values are numbers, no letters. |
| item          | Item name                                                                                                                                                          |
| highestBidder | Name of the highest bidder. Currently case-sensitive, and whitespace is not trimmed.                                                                               |
| price         | Current bid value                                                                                                                                                  |

### Sheet `bids` (index 1)

Represents all past bids i.e. every time someone was outbid. Equivalent to all bids excluding the first bid on any item. Used to provide data source for the `History` component.

| Field         | Description                                      |
| ------------- | ------------------------------------------------ |
| number        | Unique item number, matching to the master sheet |
| highestBidder | Name of the bidder                               |
| price         | Bid value                                        |
