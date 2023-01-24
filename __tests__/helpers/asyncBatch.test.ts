jest.mock("web3-core-requestmanager");

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
