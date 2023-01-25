jest.mock("web3-core-requestmanager", () => {
  const originalModule = jest.requireActual("web3-core-requestmanager");
  const { Manager, BatchManager } = originalModule;
  Manager.prototype.sendBatch = function (data, callback) {
    const results = data.map((request, index) => {
      if (request.method == "eth_chainId") return { jsonrpc: "2.0", id: index + 1, result: "0x38" };
    });
    callback(null, results);
  };
  return { Manager, BatchManager };
});

import Web3 from "web3";
import { executeAsync } from "../../src/helpers/asyncBatch";

const { HTTP_PROVIDER } = process.env;

const web3 = new Web3(HTTP_PROVIDER!);

describe("asyncBatch", () => {
  it("execute batch request asynchronously", async () => {
    const batch = new web3.BatchRequest();
    const getChainId: any = web3.eth.getChainId;
    const methods = [getChainId.request(), getChainId.request()];
    for (const method of methods) {
      batch.add(method);
    }
    const [chainId1, chainId2] = await executeAsync(batch);
    expect(chainId1).toEqual(chainId2);
  }, 0);
});
