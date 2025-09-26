import { expect } from "chai";
import { spec } from "modules/korotunBidAdapter.js";

const validBidRequest = {
  bidId: "bid123",
  params: { korotunId: 123456 },
  adUnitCode: "banner-ad-slot",
  sizes: [[300, 250]],
};

const bidderRequest = {
  auctionId: "auction789",
  refererInfo: {
    referer: "https://example.com",
  },
};

const serverResponseWithDeal = {
  body: [
    {
      bidId: "bid123",
      cpm: 1.5,
      width: 300,
      height: 250,
      creativeId: "creative456",
      dealId: "deal789",
      currency: "USD",
      ttl: 300,
      ad: "<div>Ad content</div>",
    },
  ],
};

const serverResponseWithoutDeal = {
  body: [
    {
      bidId: "bid123",
      cpm: 1.5,
      width: 300,
      height: 250,
      creativeId: "creative456",
      currency: "USD",
      ttl: 300,
      ad: "<div>Ad content</div>",
    },
  ],
};

describe("korotunBidAdapter", () => {
  describe("isBidRequestValid", () => {
    it("повертає true, якщо є коректний korotunId", () => {
      expect(
        spec.isBidRequestValid({ params: { korotunId: 123456 } })
      ).to.equal(true);
    });

    it("повертає false, якщо korotunId відсутній", () => {
      expect(spec.isBidRequestValid({ params: {} })).to.equal(false);
    });

    it("повертає false, якщо korotunId не число", () => {
      expect(spec.isBidRequestValid({ params: { korotunId: "abc" } })).to.equal(
        false
      );
    });
  });

  describe("buildRequests", () => {
    it("формує правильний запит до сервера", () => {
      const request = spec.buildRequests([validBidRequest], bidderRequest);
      expect(request.method).to.equal("POST");
      expect(request.url).to.equal("https://korotun.prebid.ua/auction");
      const payload = JSON.parse(request.data);
      expect(payload.auctionId).to.equal("auction789");
      expect(payload.referer).to.equal("https://example.com");
      expect(payload.bids[0].korotunId).to.equal(123456);
    });
  });

  describe("interpretResponse", () => {
    it("повертає масив ставок з відповіді сервера", () => {
      const result = spec.interpretResponse(serverResponseWithDeal);
      expect(result).to.be.an("array").with.lengthOf(1);
      expect(result[0].requestId).to.equal("bid123");
      expect(result[0].cpm).to.equal(1.5);
      expect(result[0].width).to.equal(300);
      expect(result[0].height).to.equal(250);
      expect(result[0].creativeId).to.equal("creative456");
      expect(result[0].dealId).to.equal("deal789");
      expect(result[0].currency).to.equal("USD");
      expect(result[0].ttl).to.equal(300);
      expect(result[0].ad).to.equal("<div>Ad content</div>");
      expect(result[0].netRevenue).to.equal(true);
    });

    it("повертає [] якщо body === []", () => {
      const result = spec.interpretResponse({ body: [] });
      expect(result).to.deep.equal([]);
    });

    it("повертає [] якщо body відсутній", () => {
      const result = spec.interpretResponse({});
      expect(result).to.deep.equal([]);
    });

    it("встановлює dealId як null, якщо він не переданий", () => {
      const result = spec.interpretResponse(serverResponseWithoutDeal);
      expect(result[0].dealId).to.equal(null);
    });
  });
});
