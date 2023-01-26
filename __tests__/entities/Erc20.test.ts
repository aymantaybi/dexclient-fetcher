jest.mock("web3-core-requestmanager");

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
