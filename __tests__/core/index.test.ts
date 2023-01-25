const errors = require("web3-core-helpers").errors;
const Jsonrpc = require("web3-core-requestmanager/src/jsonrpc.js");

jest.mock("web3-providers-ws", () => {
  const originalModule = jest.requireActual("web3-providers-ws");
  originalModule.prototype.connect = () => {};
  return originalModule;
});

jest.mock("web3-core-requestmanager", () => {
  const originalModule = jest.requireActual("web3-core-requestmanager");
  const { Manager, BatchManager } = originalModule;
  Manager.prototype.send = function (data, callback) {
    callback = callback || function () {};
    if (!this.provider) {
      return callback(errors.InvalidProvider());
    }
    const { method, params } = data;
    const jsonrpcPayload = Jsonrpc.toPayload(method, params);
    const jsonrpcResultCallback = this._jsonrpcResultCallback(callback, jsonrpcPayload);
    jsonrpcResultCallback(null, { jsonrpc: "2.0", id: jsonrpcPayload.id, result: "0x7e4" });
  };
  return { Manager, BatchManager };
});

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
