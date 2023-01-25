jest.mock("web3-core-requestmanager", () => {
  const originalModule = jest.requireActual("web3-core-requestmanager");
  const { Manager, BatchManager } = originalModule;
  Manager.prototype.sendBatch = function (data, callback) {
    const results = [
      {
        jsonrpc: "2.0",
        id: 1,
        result:
          "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044255534400000000000000000000000000000000000000000000000000000000",
      },
      {
        jsonrpc: "2.0",
        id: 2,
        result: "0x0000000000000000000000000000000000000000000000000000000000000012",
      },
    ];
    callback(null, results);
  };
  return { Manager, BatchManager };
});

import Web3 from "web3";
import Erc20 from "../../src/entities/Erc20";

const { HTTP_PROVIDER } = process.env;
const web3 = new Web3(HTTP_PROVIDER!);

describe("Erc20", () => {
  it("should initialize the BUSD token by adding it's address, symbol & decimals", async () => {
    const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
    const busdToken = new Erc20(web3, busdAddress);
    await busdToken.initialize();
    expect(busdToken.address).toEqual(busdAddress);
    expect(busdToken.symbol).toEqual("BUSD");
    expect(busdToken.decimals).toEqual("18");
  }, 0);
});
