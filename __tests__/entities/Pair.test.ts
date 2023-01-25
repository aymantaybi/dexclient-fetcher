jest.mock("web3-core-requestmanager", () => {
  const originalModule = jest.requireActual("web3-core-requestmanager");
  const { Manager, BatchManager } = originalModule;
  Manager.prototype.sendBatch = function (data, callback) {
    const results = [
      {
        jsonrpc: "2.0",
        id: 7145208114183460,
        result:
          "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000743616b652d4c5000000000000000000000000000000000000000000000000000",
      },
      {
        jsonrpc: "2.0",
        id: 7145208114183461,
        result: "0x0000000000000000000000008c851d1a123ff703bd1f9dabe631b69902df5f97",
      },
      {
        jsonrpc: "2.0",
        id: 7145208114183462,
        result: "0x000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d56",
      },
      {
        jsonrpc: "2.0",
        id: 7145208114183463,
        result:
          "0x00000000000000000000000000000000000000000000218657d08ce319e12fb90000000000000000000000000000000000000000000b835219eb916cf62ccea60000000000000000000000000000000000000000000000000000000063d120c6",
      },
    ];
    callback(null, results);
  };
  return { Manager, BatchManager };
});

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
    expect(BnxBusdPair.getReserves).toEqual({
      "0": "158316285352958847168441",
      "1": "13918328525777256275824294",
      "2": "1674649798",
      blockTimestampLast: "1674649798",
      reserve0: "158316285352958847168441",
      reserve1: "13918328525777256275824294",
    });
  }, 0);
});
