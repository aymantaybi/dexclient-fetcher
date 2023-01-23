import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import { BaseEntity } from "../interfaces";
import Erc20ABI from "../samples/contracts/Erc20.json";
import { executeAsync } from "../helpers/asyncBatch";

export default class implements BaseEntity {
  web3: Web3;
  address: string;
  contract: Contract;
  constructor(web3: Web3, address: string) {
    this.web3 = web3;
    this.address = address;
    this.contract = new web3.eth.Contract(Erc20ABI as AbiItem[], this.address);
  }
  async initialize() {
    const batch = new this.web3.BatchRequest();
    const methods = [this.contract.methods.symbol().call, this.contract.methods.decimals().call];
    for (var method of methods) {
      batch.add(method);
    }
    const [symbol, decimals]: [string, string] = await executeAsync(batch);
    return { symbol, decimals };
  }
}
