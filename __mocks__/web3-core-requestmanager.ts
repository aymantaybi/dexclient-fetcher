const originalModule = jest.requireActual("web3-core-requestmanager");

const { Manager, BatchManager } = originalModule;

Manager.prototype.sendBatch = function (data, callback) {
  const results = data.map((request, index) => {
    if (request.method == "eth_chainId") return { jsonrpc: "2.0", id: index + 1, result: "0x38" };
  });
  callback(null, results);
};

export { Manager, BatchManager };
