import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { BaseEntity } from "../interfaces";
import PairABI from "../samples/contracts/Pair.json";
import { executeAsync } from "../helpers/asyncBatch";
import EventEmitter from "events";

export default class implements BaseEntity {
  web3: Web3;
  address: string;
  contract: Contract;
  symbol: string | undefined;
  token0: string | undefined;
  token1: string | undefined;
  getReserves: any | undefined;
  constructor(web3: Web3, address: string) {
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
      this.contract.methods.getReserves().call.request(),
    ];
    for (const method of methods) {
      batch.add(method);
    }
    const [symbol, token0, token1, getReserves]: [string, string, string, any] = await executeAsync(batch);
    [this.symbol, this.token0, this.token1, this.getReserves] = [symbol, token0, token1, getReserves];
    return { symbol, token0, token1, getReserves };
  }
}
