import EventEmitter from "events";
import Web3 from "web3";
import { Log } from "web3-core";
import { Subscription } from "web3-core-subscriptions";
import ABICoder from "web3-eth-abi";
import { Contract } from "web3-eth-contract";
import { AbiItem, toChecksumAddress } from "web3-utils";
import { executeAsync } from "../helpers";
import Erc20ABI from "../samples/contracts/Erc20.json";

export class Erc20 extends EventEmitter {
  web3: Web3;
  address: string;
  contract: Contract;
  symbol!: string;
  decimals!: string;
  subscription: Subscription<Log> | undefined;
  constructor(web3: Web3, address: string) {
    super();
    this.web3 = web3;
    this.address = address;
    this.contract = new web3.eth.Contract(Erc20ABI as AbiItem[], this.address);
  }
  async initialize() {
    const batch = new this.web3.BatchRequest();
    const methods = [this.contract.methods.symbol().call.request(), this.contract.methods.decimals().call.request()];
    for (const method of methods) {
      batch.add(method);
    }
    const [symbol, decimals]: [string, string] = await executeAsync(batch);
    [this.symbol, this.decimals] = [symbol, decimals];
    return { symbol, decimals };
  }

  subscribe(account: string) {
    const accountChecksumAddress = toChecksumAddress(account);
    const eventSignature = ABICoder.encodeEventSignature("Transfer(address,address,uint256)");
    const address = this.address;
    const topics = [eventSignature];
    const options = { address, topics };
    const callback = async (error, log: Log) => {
      const from = ABICoder.decodeParameter("address", log.topics[1]) as unknown as string;
      const to = ABICoder.decodeParameter("address", log.topics[2]) as unknown as string;
      if (![from, to].includes(accountChecksumAddress)) return;
      const balance: string = await this.contract.methods.balanceOf(account).call();
      this.emit("balanceUpdate", { token: this.address, balance });
    };
    this.subscription = this.web3.eth.subscribe("logs", options, callback);
  }
}

export default Erc20;

export declare interface Erc20 {
  on(event: "balanceUpdate", listener: (data: { token: string; balance: string }) => void): this;
}
