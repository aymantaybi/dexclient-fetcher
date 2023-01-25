import Web3 from "web3";
import { WebsocketProvider } from "web3-providers-ws";
import { BlockTransactionObject } from "web3-eth";
import { executeAsync, isFetcherConstructorWebsocketProvider, isFetcherConstructorWebsocketProviderHost } from "../helpers";
import { FetcherConstructor } from "../interfaces";

export default class {
  websocketProvider: WebsocketProvider | undefined;
  web3: Web3;
  chainId!: number;
  block!: BlockTransactionObject;
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
    const batch = new this.web3.BatchRequest();
    const methods = [(this.web3.eth.getChainId as any).request(), (this.web3.eth.getBlock as any).request("latest", true)];
    for (const method of methods) {
      batch.add(method);
    }
    const [chainId, block]: [number, BlockTransactionObject] = await executeAsync(batch);
    [this.chainId, this.block] = [chainId, block];
    return { chainId, block };
  }

  async erc20(address: string) {}

  async pair(address: string) {}
}
