import { WebsocketProvider } from "web3-providers-ws";
import { Contract } from "web3-eth-contract";

export interface FetcherConstructor {
  WebsocketProvider: WebsocketProvider;
  WebsocketProviderHost: string;
}

export interface BaseEntity {
  contract: Contract;
  initialize: () => Promise<void>;
}
