jest.mock(
  "web3-providers-ws" /* , () => {
  const originalModule = jest.requireActual("web3-providers-ws");
  return originalModule;
} */
);
jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Erc20 from "../../src/entities/Erc20";

const { WS_PROVIDER } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(WS_PROVIDER!);
const web3 = new Web3(websocketProvider);

const slpAddress = "0xa8754b9Fa15fc18BB59458815510E40a12cD2014";
const slpToken = new Erc20(web3, slpAddress);

const logExemple = {
  address: "0xa8754b9Fa15fc18BB59458815510E40a12cD2014",
  topics: [
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
    "0x000000000000000000000000c1eb47de5d549d45a871e32d9d082e7ac5d2e3ed",
    "0x0000000000000000000000008f1c5eda143fa3d1bea8b4e92f33562014d30e0d",
  ],
  data: "0x0000000000000000000000000000000000000000000000000000000000000001",
  blockNumber: 21080850,
  transactionHash: "0xc9bd1c00865b301c474dae42ed8143c1dcc47b8bb30a36b95960049319d5c152",
  transactionIndex: 3,
  blockHash: "0x5320e64c5b112c76bbafb7929123e5848c433dccda6b63a1f39677b50ea17660",
  logIndex: 9,
  removed: false,
  id: "log_cdf61f02",
};

describe("Erc20", () => {
  it("should initialize the SLP token by adding it's address, symbol & decimals", async () => {
    await slpToken.initialize();
    expect(slpToken.address).toEqual(slpAddress);
    expect(slpToken.symbol).toEqual("SLP");
    expect(slpToken.decimals).toEqual("0");
  }, 0);
  it("should subscribe of transfer events and return updated balance", (done) => {
    slpToken.subscribe("0xc1eb47de5d549d45a871e32d9d082e7ac5d2e3ed");
    slpToken.on("balanceUpdate", (data) => {
      done();
      expect(data).toEqual({ token: "0xa8754b9Fa15fc18BB59458815510E40a12cD2014", balance: "4" });
    });
    const callback = slpToken.subscription?.callback as any;
    callback(null, logExemple);
  }, 0);
});
