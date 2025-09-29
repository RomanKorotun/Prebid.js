import { registerBidder } from "../src/adapters/bidderFactory.js";
import { BANNER } from "../src/mediaTypes.js";

export const AUCTION_PATH =
  "https://adtelligent-backend-production.up.railway.app/korotunAuction";
const BIDDER_CODE = "korotun";

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],
  isBidRequestValid: (bid) => {
    return typeof bid.params.korotunId === "number" && bid.params.korotunId > 0;
  },
  buildRequests: (validBidRequests, bidderRequest) => {
    const bids = validBidRequests.map((bid) => ({
      bidId: bid.bidId,
      korotunId: bid.params.korotunId,
      adUnitCode: bid.adUnitCode,
      sizes: bid.sizes,
      cpm: bid.params.cpm,
      currency: bid.params.currency,
    }));

    const payload = {
      auctionId: bidderRequest.auctionId,
      referer: bidderRequest.refererInfo?.referer || "",
      bids: bids,
    };

    return {
      method: "POST",
      url: AUCTION_PATH,
      data: JSON.stringify(payload),
    };
  },
  interpretResponse: (serverResponse) => {
    const responseBody = serverResponse.body;
    if (!responseBody || !Array.isArray(responseBody)) {
      return [];
    }
    return responseBody.map((bid) => ({
      requestId: bid.bidId,
      cpm: bid.cpm,
      width: bid.width,
      height: bid.height,
      creativeId: bid.creativeId,
      dealId: bid.dealId || null,
      currency: bid.currency,
      netRevenue: true,
      ttl: bid.ttl,
      ad: bid.ad,
    }));
  },
};

registerBidder(spec);
