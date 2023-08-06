import EventEmitter from "events";
import Web3, { BlockHeaderOutput, Web3BaseProvider, BlockOutput } from "web3";
import { Erc20, Pair } from "../entities";
import { isFetcherConstructorWebsocketProvider } from "../helpers";
import { FetcherConstructorParameters } from "../interfaces";
import { NewHeadsSubscription } from "web3/lib/commonjs/eth.exports";

export class Fetcher extends EventEmitter {
  websocketProvider: Web3BaseProvider | undefined;
  web3: Web3;
  chainId!: bigint;
  tokens: Erc20[] = [];
  pairs: Pair[] = [];
  subscription: NewHeadsSubscription | undefined;
  constructor(fetcherConstructorParameters: FetcherConstructorParameters) {
    super();
    if (isFetcherConstructorWebsocketProvider(fetcherConstructorParameters)) {
      const { websocketProvider } = fetcherConstructorParameters;
      this.websocketProvider = websocketProvider;
    } else {
      const { url } = fetcherConstructorParameters;
      this.websocketProvider = new Web3.providers.WebsocketProvider(url);
    }
    this.web3 = new Web3(this.websocketProvider);
  }

  async initialize() {
    const chainId = await this.web3.eth.getChainId();
    this.chainId = chainId;
    await this.subscribe();
    return { chainId };
  }

  private async subscribe() {
    if (this.subscription) return;
    const callback = async (blockHeader: BlockHeaderOutput) => {
      const block = await this.web3.eth.getBlock(blockHeader.number, true);
      this.emit("newBlock", block as BlockOutput);
    };
    this.subscription = await this.web3.eth.subscribe("newBlockHeaders");
    this.subscription.on("data", callback);
  }

  async erc20(address: string) {
    const tokenIndex = this.tokens.findIndex((token) => token.address === address);
    if (tokenIndex > -1) return this.tokens[tokenIndex];
    const token = new Erc20(this.web3, address);
    await token.initialize();
    this.tokens.push(token);
    return token;
  }

  async pair(address: string) {
    const pairIndex = this.pairs.findIndex((pair) => pair.address === address);
    if (pairIndex > -1) return this.pairs[pairIndex];
    const pair = new Pair(this.web3, address);
    await pair.initialize();
    this.pairs.push(pair);
    return pair;
  }
}

export default Fetcher;

export declare interface Fetcher {
  on(event: "newBlock", listener: (data: BlockOutput) => void): this;
  emit(eventName: "newBlock", data: BlockOutput): boolean;
}
