import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { BaseEntity, Reserves } from "../interfaces";
import PairABI from "../samples/contracts/Pair.json";
import { executeAsync } from "../helpers";
import EventEmitter from "events";

export default class implements BaseEntity {
  web3: Web3;
  address: string;
  contract: Contract;
  symbol!: string;
  token0!: string;
  token1!: string;
  reserves!: Reserves;
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
    const [symbol, token0, token1, { blockTimestampLast, reserve0, reserve1 }]: [string, string, string, Reserves] = await executeAsync(batch);
    [this.symbol, this.token0, this.token1, this.reserves] = [symbol, token0, token1, { blockTimestampLast, reserve0, reserve1 }];
    return { symbol, token0, token1, reserves: this.reserves };
  }
}
