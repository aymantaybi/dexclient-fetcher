jest.mock("web3-providers-ws");
jest.mock("web3-core-requestmanager");

import Web3 from "web3";
import Core from "../../src/core";

const { WS_PROVIDER } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(WS_PROVIDER!);

const core = new Core({ websocketProvider });

const blockHeaderExemple = {
  parentHash: "0xbd86a560cd1358150939ff2a5773b041dbff8190f6da4d66730b41f98635cd8c",
  sha3Uncles: "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  miner: "0xFc3e31519B551bd594235dd0eF014375a87C4e21",
  stateRoot: "0x9052c62a4c8047d525e6a9dcfcc7ce9caea3fc6639d95b25848af61e4b6a1243",
  transactionsRoot: "0x9d8327eedd0f7a9c7503e25372869759c2e6976f9979ebf2a65498890902bd88",
  receiptsRoot: "0xbe39e208a51780f3730da4174db4df740a85cd77eea1eed2e983d6aa87192db2",
  logsBloom:
    "0x0020000018080000040040008841000000080000100401000001000400000000800084008800000000200000000000000108400010000000010000000008200c1002c00000000000000208080300002010048400000000000000004000000002820004000400000000400000080000000000100008000000802400101000000003000004040000000002000200001803b0080000002000080000004010100200108004000080100000000000400000000000000000000002001000000200000008008802000100000050000080000004000000000208001010040000000000000208200804002010000022020000000000002200010000000020084500040400",
  difficulty: "7",
  number: 21032721,
  gasLimit: 99902345,
  gasUsed: 1160983,
  timestamp: 1674860620,
  extraData:
    "0xd683020400846765746886676f312e3137856c696e7578000000000000000000c936002ea90d8ad1bd29edd4175d982d87d7f040b155ca7ff9eb28fd353409f97489f87cbe339822d0ed551438ba05aedde81fe1c67c7e7b8215de39c17a089800",
  mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  nonce: "0x0000000000000000",
  baseFeePerGas: null,
  hash: "0x452c5e581b92706a81f20743ff60794331d2419f73ff81cdb7c25b4d9e8603a0",
};

describe("Core", () => {
  it("should initialize the Core module by adding the chain ID", async () => {
    await core.initialize();
    expect(core.chainId).toEqual(2020);
  }, 0);
  it("should add an ERC20 token", async () => {
    const slpAddress = "0xa8754b9Fa15fc18BB59458815510E40a12cD2014";
    const slpToken = await core.erc20(slpAddress);
    expect(slpToken.address).toEqual(slpAddress);
    expect(slpToken.symbol).toEqual("SLP");
    expect(slpToken.decimals).toEqual("0");
    expect(core.tokens.some((token) => token.address === slpAddress)).toBeTruthy();
  }, 0);
  it("should add a Pair", async () => {
    const BnxBusdAddress = "0xB72723e36a83FB5Fe1793f06b436F4720F5DE4F9";
    const BnxBusdPair = await core.pair(BnxBusdAddress);
    expect(BnxBusdPair.address).toEqual(BnxBusdAddress);
    expect(BnxBusdPair.symbol).toEqual("Cake-LP");
    expect(BnxBusdPair.token0).toEqual("0x8C851d1a123Ff703BD1f9dabe631b69902Df5f97");
    expect(BnxBusdPair.token1).toEqual("0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56");
    expect(BnxBusdPair.reserves).toEqual({
      blockTimestampLast: "1674649798",
      reserve0: "158316285352958847168441",
      reserve1: "13918328525777256275824294",
    });
    expect(core.pairs.some((pair) => pair.address === BnxBusdAddress)).toBeTruthy();
  }, 0);
  it("should subscribe to new block headers and return the full block object on every new block header", (done) => {
    core.on("newBlock", (block) => {
      done();
      expect(block).not.toBeUndefined();
    });
    const callback = core.subscription?.callback as any;
    callback(null, blockHeaderExemple);
  }, 60000);
});
