import Web3 from "web3";
import { WebsocketProvider } from "web3-providers-ws";
import { BlockTransactionObject } from "web3-eth";
import { executeAsync, isFetcherConstructorWebsocketProvider, isFetcherConstructorWebsocketProviderHost } from "../helpers";
import { FetcherConstructor } from "../interfaces";
import Erc20 from "../entities/Erc20";

export default class {
  websocketProvider: WebsocketProvider | undefined;
  web3: Web3;
  chainId!: number;
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
    const token = new Erc20(this.web3, address);
    await token.initialize();
    return token;
  }

  async pair(address: string) {}
}
