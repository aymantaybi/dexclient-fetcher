import { BatchRequest } from "web3-core";
import { Contract } from "web3-eth-contract";
import { WebsocketProvider } from "web3-providers-ws";

export interface FetcherConstructor {
  WebsocketProvider: WebsocketProvider;
  WebsocketProviderHost: string;
}

export interface BaseEntity {
  address: string;
  contract: Contract;
  initialize: () => Promise<unknown>;
}
