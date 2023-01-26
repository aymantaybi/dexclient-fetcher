jest.mock("web3-providers-ws");
jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Core from "../../src/core";

const { WS_PROVIDER } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(WS_PROVIDER!);

describe("Core", () => {
  it("should initialize the Core module by adding the chain ID & latest block", async () => {
    const core = new Core({ websocketProvider });
    await core.initialize();
    expect(core.chainId).toEqual(2020);
  }, 0);
});
