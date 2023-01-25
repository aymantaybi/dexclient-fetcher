import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { WebsocketProvider } from "web3-providers-ws";

export interface FetcherConstructorWebsocketProvider {
  websocketProvider: WebsocketProvider;
}
export interface FetcherConstructorWebsocketProviderHost {
  websocketProviderHost: string;
}

export type FetcherConstructor = FetcherConstructorWebsocketProvider | FetcherConstructorWebsocketProviderHost;

export interface BaseEntity {
  web3: Web3;
  address: string;
  contract: Contract;
  initialize: () => Promise<unknown>;
}

export interface Reserves {
  blockTimestampLast: string;
  reserve0: string;
  reserve1: string;
}
