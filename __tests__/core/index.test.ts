jest.mock("web3-providers-ws");
jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Core from "../../src/core";

const { WS_PROVIDER } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(WS_PROVIDER!);

const core = new Core({ websocketProvider });

describe("Core", () => {
  it("should initialize the Core module by adding the chain ID", async () => {
    await core.initialize();
    expect(core.chainId).toEqual(2020);
  }, 0);
  it("should add an ERC20 token", async () => {
    const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
    const busdToken = await core.erc20(busdAddress);
    expect(busdToken.address).toEqual(busdAddress);
    expect(busdToken.symbol).toEqual("BUSD");
    expect(busdToken.decimals).toEqual("18");
  }, 0);
  it("should add a Pair", async () => {
    const BnxBusdAddress = "0xB72723e36a83FB5Fe1793f06b436F4720F5DE4F9";
    const BnxBusdPair = await core.pair(BnxBusdAddress);
    expect(BnxBusdPair.address).toEqual(BnxBusdAddress);
    expect(BnxBusdPair.symbol).toEqual("Cake-LP");
    expect(BnxBusdPair.token0).toEqual("0x8C851d1a123Ff703BD1f9dabe631b69902Df5f97");
    expect(BnxBusdPair.token1).toEqual("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56");
    expect(BnxBusdPair.reserves).toEqual({
      "0": "158316285352958847168441",
      "1": "13918328525777256275824294",
      "2": "1674649798",
      blockTimestampLast: "1674649798",
      reserve0: "158316285352958847168441",
      reserve1: "13918328525777256275824294",
    });
  }, 0);
});
