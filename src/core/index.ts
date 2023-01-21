import Web3 from "web3";
import { WebsocketProvider } from "web3-providers-ws";
import { FetcherConstructor } from "../interfaces";

export default class {
  WebsocketProvider: WebsocketProvider;
  web3: Web3;
  constructor({ WebsocketProvider, WebsocketProviderHost }: FetcherConstructor) {
    if (!WebsocketProvider && !WebsocketProviderHost) throw Error("Either WebsocketProvider OR WebsocketProviderHost should be provided");
    this.WebsocketProvider = WebsocketProvider ? WebsocketProvider : new Web3.providers.WebsocketProvider(WebsocketProviderHost);
    this.web3 = new Web3(this.WebsocketProvider);
  }

  async addErc20Token(address: string) {

  }
}
