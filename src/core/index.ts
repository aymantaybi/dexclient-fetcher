import Web3 from "web3";
import { WebsocketProvider } from "web3-providers-ws";
import { isFetcherConstructorWebsocketProvider, isFetcherConstructorWebsocketProviderHost } from "../helpers";
import { FetcherConstructor } from "../interfaces";
import Erc20 from "../entities/Erc20";
import Pair from "../entities/Pair";

export default class {
  websocketProvider: WebsocketProvider | undefined;
  web3: Web3;
  chainId!: number;
  tokens: Erc20[] = [];
  pairs: Pair[] = [];
  constructor(fetcherConstructor: FetcherConstructor) {
    if (isFetcherConstructorWebsocketProvider(fetcherConstructor)) {
      const { websocketProvider } = fetcherConstructor;
      this.websocketProvider = websocketProvider;
    } else if (isFetcherConstructorWebsocketProviderHost(fetcherConstructor)) {
      const { websocketProviderHost } = fetcherConstructor;
      this.websocketProvider = new Web3.providers.WebsocketProvider(websocketProviderHost);
    }
    if (!this.websocketProvider) throw Error("Either WebsocketProvider OR WebsocketProviderHost should be provided");
    this.web3 = new Web3(this.websocketProvider);
  }

  async initialize() {
    const chainId = await this.web3.eth.getChainId();
    this.chainId = chainId;
    return { chainId };
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
