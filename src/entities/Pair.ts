import EventEmitter from "events";
import { JsonRpcOptionalRequest, Log } from "web3";
import { decodeParameter } from "web3-eth-abi";
import { Contract, Web3 } from "web3";
import { LogsSubscription } from "web3/lib/commonjs/eth.exports";
import { PairContract } from "../contracts";
import { createRequest } from "../helpers";

export class Pair extends EventEmitter {
  web3: Web3;
  address: string;
  contract: Contract<typeof PairContract.ABI>;
  symbol!: string;
  token0!: string;
  token1!: string;
  subscription: LogsSubscription | undefined;
  constructor(web3: Web3, address: string) {
    super();
    this.web3 = web3;
    this.address = address;
    this.contract = new Contract(PairContract.ABI, this.address, this.web3);
  }
  async initialize() {
    const batch = new this.web3.BatchRequest();
    const requests: JsonRpcOptionalRequest[] = [
      createRequest("eth_call", [
        {
          from: null,
          to: this.address,
          data: this.contract.methods.symbol().encodeABI(),
        },
        "latest",
      ]),
      createRequest("eth_call", [
        {
          from: null,
          to: this.address,
          data: this.contract.methods.token0().encodeABI(),
        },
        "latest",
      ]),
      createRequest("eth_call", [
        {
          from: null,
          to: this.address,
          data: this.contract.methods.token1().encodeABI(),
        },
        "latest",
      ]),
    ];
    for (const request of requests) {
      batch.add(request);
    }
    const batchResponse = await batch.execute();
    const symbol = decodeParameter("string", batchResponse[0].result as string) as string;
    const token0 = decodeParameter("address", batchResponse[1].result as string) as string;
    const token1 = decodeParameter("address", batchResponse[2].result as string) as string;
    [this.symbol, this.token0, this.token1] = [symbol, token0, token1];
    this.subscribe();
    return { symbol, token0, token1 };
  }

  private async subscribe() {
    if (this.subscription) return;
    const eventSignature = this.web3.eth.abi.encodeEventSignature("Sync(uint112,uint112)");
    const options = { address: this.address, topics: [eventSignature] };
    const callback = (log: Log) => {
      const hexString = log.data;
      if (!hexString) return;
      const decodedParameters = this.web3.eth.abi.decodeParameters(["uint112", "uint112"], hexString?.toString()) as unknown as [string, string];
      const [reserve0, reserve1]: [string, string] = [decodedParameters[0], decodedParameters[1]];
      this.emit("reservesUpdate", { pair: this.address, reserve0, reserve1, transactionHash: log.transactionHash?.toString() });
    };
    this.subscription = await this.web3.eth.subscribe("logs", options);
    this.subscription.on("data", callback);
  }
}

export default Pair;

export declare interface Pair {
  on(event: "reservesUpdate", listener: (data: { pair: string; reserve0: string; reserve1: string; transactionHash?: string }) => void): this;
  emit(eventName: "reservesUpdate", data: { pair: string; reserve0: string; reserve1: string; transactionHash?: string }): boolean;
}
