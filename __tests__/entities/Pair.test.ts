jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Pair from "../../src/entities/Pair";

const { HTTP_PROVIDER } = process.env;
const web3 = new Web3(HTTP_PROVIDER!);

describe("Pair", () => {
  it("should initialize the BNX-BUSD Pair by adding it's address, symbol, token0, token1 & getReserves", async () => {
    const BnxBusdAddress = "0xB72723e36a83FB5Fe1793f06b436F4720F5DE4F9";
    const BnxBusdPair = new Pair(web3, BnxBusdAddress);
    await BnxBusdPair.initialize();
    expect(BnxBusdPair.address).toEqual(BnxBusdAddress);
    expect(BnxBusdPair.symbol).toEqual("Cake-LP");
    expect(BnxBusdPair.token0).toEqual("0x8C851d1a123Ff703BD1f9dabe631b69902Df5f97");
    expect(BnxBusdPair.token1).toEqual("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56");
    expect(BnxBusdPair.reserves).toEqual({
      blockTimestampLast: "1674649798",
      reserve0: "158316285352958847168441",
      reserve1: "13918328525777256275824294",
    });
  }, 0);
});
