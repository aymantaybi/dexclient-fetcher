import EventEmitter from "events";
import { JsonRpcOptionalRequest, Log } from "web3";
import { decodeParameter, encodeEventSignature } from "web3-eth-abi";
import { Contract, Web3 } from "web3";
import { toChecksumAddress } from "web3-utils";
import { LogsSubscription } from "web3/lib/commonjs/eth.exports";
import { Erc20Contract } from "../contracts";
import { createRequest } from "../helpers";

export class Erc20 extends EventEmitter {
  web3: Web3;
  address: string;
  contract: Contract<typeof Erc20Contract.ABI>;
  symbol!: string;
  decimals!: string;
  subscription: LogsSubscription | undefined;
  constructor(web3: Web3, address: string) {
    super();
    this.web3 = web3;
    this.address = address;
    this.contract = new Contract(Erc20Contract.ABI, this.address, this.web3);
  }
  async initialize() {
    const batch = new this.web3.BatchRequest();
    const requests: JsonRpcOptionalRequest[] = [
      createRequest(
        "eth_call",
        [
          {
            from: null,
            to: this.address,
            data: this.contract.methods.symbol().encodeABI(),
          },
          "latest",
        ],
        1
      ),
      createRequest(
        "eth_call",
        [
          {
            from: null,
            to: this.address,
            data: this.contract.methods.decimals().encodeABI(),
          },
          "latest",
        ],
        2
      ),
    ];
    for (const request of requests) {
      batch.add(request);
    }
    const batchResponse = await batch.execute();
    const symbol = decodeParameter("string", batchResponse[0].result as string) as string;
    const decimals = decodeParameter("uint8", batchResponse[1].result as string) as string;
    [this.symbol, this.decimals] = [symbol, decimals];
    return { symbol, decimals };
  }

  async subscribe(account: string) {
    if (this.subscription) return;
    const accountChecksumAddress = toChecksumAddress(account);
    const eventSignature = encodeEventSignature("Transfer(address,address,uint256)");
    const address = this.address;
    const topics = [eventSignature];
    const options = { address, topics };
    const callback = async (log: Log) => {
      if (!log.topics) return;
      const from = decodeParameter("address", log.topics[1].toString()) as string;
      const to = decodeParameter("address", log.topics[2].toString()) as string;
      if (![from, to].includes(accountChecksumAddress)) return;
      const balance: string = await this.contract.methods.balanceOf(account).call();
      this.emit("balanceUpdate", { token: address, balance });
    };
    this.subscription = await this.web3.eth.subscribe("logs", options);
    this.subscription.on("data", callback);
  }
}

export default Erc20;

export declare interface Erc20 {
  on(event: "balanceUpdate", listener: (data: { token: string; balance: string }) => void): this;
  emit(eventName: "balanceUpdate", data: { token: string; balance: string }): boolean;
}
