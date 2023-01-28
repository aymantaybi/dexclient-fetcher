jest.mock("web3-providers-ws");
jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Pair from "../../src/entities/Pair";

const { WS_PROVIDER } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(WS_PROVIDER!);
const web3 = new Web3(websocketProvider);

const slpWethAddress = "0x306A28279d04a47468ed83d55088d0DCd1369294";
const slpWethPair = new Pair(web3, slpWethAddress);

const logExemple = {
  address: "0x306A28279d04a47468ed83d55088d0DCd1369294",
  topics: ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"],
  data: "0x0000000000000000000000000000000000000000000000000000000078384c920000000000000000000000000000000000000000000000dab99e5b486d9fdddc",
  blockNumber: 21031835,
  transactionHash: "0xed08762f8b3edb44095502b24e443e5d2a93c2c4950f324e5d8e2f98478a16cf",
  transactionIndex: 0,
  blockHash: "0x3feb09b3fa1b3676fa59bbb0502b46924a7116e366dcdaf0c726644d6375f1ca",
  logIndex: 3,
  removed: false,
  id: "log_ab1b21c5",
};

describe("Pair", () => {
  it("should initialize the SLP-WETH Pair by adding it's address, symbol, token0, token1 & getReserves", async () => {
    await slpWethPair.initialize();
    expect(slpWethPair.address).toEqual(slpWethAddress);
    expect(slpWethPair.symbol).toEqual("SLP-WETH");
    expect(slpWethPair.token0).toEqual("0xa8754b9Fa15fc18BB59458815510E40a12cD2014");
    expect(slpWethPair.token1).toEqual("0xc99a6A985eD2Cac1ef41640596C5A5f9F4E19Ef5");
    expect(slpWethPair.reserves).toEqual({
      blockTimestampLast: "1674853335",
      reserve0: "2017043775",
      reserve1: "4034978415800246540142",
    });
  }, 0);
  it("should subscribe to sync event", (done) => {
    slpWethPair.subscribe();
    slpWethPair.on("reservesUpdate", (data) => {
      done();
      expect(data).toEqual({ reserve0: "2016955538", reserve1: "4034765436378654170588" });
    });
    const callback = slpWethPair.subscription?.callback as any;
    callback(null, logExemple);
  }, 0);
});
