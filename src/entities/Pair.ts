import EventEmitter from "events";
import Web3 from "web3";
import { Log } from "web3-core";
import { Subscription } from "web3-core-subscriptions";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { executeAsync } from "../helpers";
import PairABI from "../samples/contracts/Pair.json";

export class Pair extends EventEmitter {
  web3: Web3;
  address: string;
  contract: Contract;
  symbol!: string;
  token0!: string;
  token1!: string;
  subscription: Subscription<Log> | undefined;
  constructor(web3: Web3, address: string) {
    super();
    this.web3 = web3;
    this.address = address;
    this.contract = new web3.eth.Contract(PairABI as AbiItem[], this.address);
  }
  async initialize() {
    const batch = new this.web3.BatchRequest();
    const methods = [
      this.contract.methods.symbol().call.request(),
      this.contract.methods.token0().call.request(),
      this.contract.methods.token1().call.request(),
    ];
    for (const method of methods) {
      batch.add(method);
    }
    const [symbol, token0, token1]: [string, string, string] = await executeAsync(batch);
    [this.symbol, this.token0, this.token1] = [symbol, token0, token1];
    this.subscribe();
    return { symbol, token0, token1 };
  }

  private subscribe() {
    const eventSignature = this.web3.eth.abi.encodeEventSignature("Sync(uint112,uint112)");
    const options = { address: this.address, topics: [eventSignature] };
    const callback = (error, log: Log) => {
      const hexString = log.data;
      const decodedParameters = this.web3.eth.abi.decodeParameters(["uint112", "uint112"], hexString);
      const [reserve0, reserve1]: [string, string] = [decodedParameters[0], decodedParameters[1]];
      this.emit("reservesUpdate", { pair: this.address, reserve0, reserve1 });
    };
    this.subscription = this.web3.eth.subscribe("logs", options, callback);
  }
}

export default Pair;

export declare interface Pair {
  on(event: "reservesUpdate", listener: (data: { pair: string; reserve0: string; reserve1: string }) => void): this;
}
