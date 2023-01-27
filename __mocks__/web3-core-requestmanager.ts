const errors = require("web3-core-helpers").errors;
const Jsonrpc = require("web3-core-requestmanager/src/jsonrpc.js");
const { callbackify } = require("util");

const originalModule = jest.requireActual("web3-core-requestmanager");

const { Manager, BatchManager } = originalModule;

Manager.prototype.sendBatch = function (data, callback) {
  const results = data.map((request, index) => {
    const jsonrpc = "2.0";
    const id = index + 1;
    if (request.method == "eth_chainId") return { jsonrpc, id, result: "0x38" };
    if (request.method == "eth_call") {
      if (request.params[1] === "latest") {
        if (request.params[0].to === "0xe9e7cea3dedca5984780bafc599bd69add087d56") {
          if (request.params[0].data === "0x95d89b41") {
            return {
              jsonrpc,
              id,
              result:
                "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000044255534400000000000000000000000000000000000000000000000000000000",
            };
          }
          if (request.params[0].data === "0x313ce567") {
            return {
              jsonrpc,
              id,
              result: "0x0000000000000000000000000000000000000000000000000000000000000012",
            };
          }
        }
        if (request.params[0].to === "0xb72723e36a83fb5fe1793f06b436f4720f5de4f9") {
          if (request.params[0].data === "0x95d89b41") {
            return {
              jsonrpc,
              id,
              result:
                "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000743616b652d4c5000000000000000000000000000000000000000000000000000",
            };
          }
          if (request.params[0].data === "0x0dfe1681") {
            return {
              jsonrpc,
              id,
              result: "0x0000000000000000000000008c851d1a123ff703bd1f9dabe631b69902df5f97",
            };
          }
          if (request.params[0].data === "0xd21220a7") {
            return {
              jsonrpc,
              id,
              result: "0x000000000000000000000000e9e7cea3dedca5984780bafc599bd69add087d56",
            };
          }
          if (request.params[0].data === "0x0902f1ac") {
            return {
              jsonrpc,
              id,
              result:
                "0x00000000000000000000000000000000000000000000218657d08ce319e12fb90000000000000000000000000000000000000000000b835219eb916cf62ccea60000000000000000000000000000000000000000000000000000000063d120c6",
            };
          }
        }
      }
    }
  });
  callback(null, results);
};

Manager.prototype.send = function (data, callback) {
  if (data.method !== "eth_chainId") {
    callback = callback || function () {};
    if (!this.provider) {
      return callback(errors.InvalidProvider());
    }
    const { method, params } = data;
    const jsonrpcPayload = Jsonrpc.toPayload(method, params);
    const jsonrpcResultCallback = this._jsonrpcResultCallback(callback, jsonrpcPayload);
    if (this.provider.request) {
      const callbackRequest = callbackify(this.provider.request.bind(this.provider));
      const requestArgs = { method, params };
      callbackRequest(requestArgs, callback);
    } else if (this.provider.sendAsync) {
      this.provider.sendAsync(jsonrpcPayload, jsonrpcResultCallback);
    } else if (this.provider.send) {
      this.provider.send(jsonrpcPayload, jsonrpcResultCallback);
    } else {
      throw new Error("Provider does not have a request or send method to use.");
    }
  } else {
    callback = callback || function () {};
    const { method, params } = data;
    const jsonrpcPayload = Jsonrpc.toPayload(method, params);
    const jsonrpcResultCallback = this._jsonrpcResultCallback(callback, jsonrpcPayload);
    jsonrpcResultCallback(null, { jsonrpc: "2.0", id: jsonrpcPayload.id, result: "0x7e4" });
  }
};

/* function (data, callback) {
  
}; */

export { Manager, BatchManager };
