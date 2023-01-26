jest.mock("web3-providers-ws");
jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Core from "../../src/core";

const { WS_PROVIDER } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(WS_PROVIDER!);

const core = new Core({ websocketProvider });

describe("Core", () => {
  it("should initialize the Core module by adding the chain ID & latest block", async () => {
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
});
