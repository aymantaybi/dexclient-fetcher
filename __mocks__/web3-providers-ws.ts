const originalModule = jest.requireActual("web3-providers-ws");

originalModule.prototype.connect = () => {};

module.exports = originalModule;
