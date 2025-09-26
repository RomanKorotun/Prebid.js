# Overview

**Module Name**: Korotun Bidder Adapter  
**Module Type**: Bidder Adapter  
**Maintainer**: roman.korotun@ukr.net

# Description

The Korotun Bidder Adapter allows publishers to access banner ad demand from the Korotun SSP. It integrates with Korotun’s demand sources to retrieve bids and maximize revenue through header bidding.

# Supported Media Types

- Banner

# Bid Parameters

| Name        | Type   | Description                    | Example  | Required |
| ----------- | ------ | ------------------------------ | -------- | -------- |
| `korotunId` | Number | Unique ID for the ad placement | `123456` | Yes      |

# Test Parameters

```
var adUnits = [
  {
    code: "banner-ad-slot",
    mediaTypes: {
      banner: {
        sizes: [[300, 250]],
      },
    },
    bids: [
      {
        bidder: "korotun",
        params: {
          korotunId: 123456,
        },
      },
    ],
  },
];
```
