import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { WebsocketProvider } from "web3-providers-ws";
import { Subscription } from "web3-core-subscriptions";
import { BlockHeader } from "web3-eth";
import { Log } from "web3-core";

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

export interface FetcherSubscriptions {
  newBlockHeaders: Subscription<BlockHeader> | undefined;
  logs: Subscription<Log> | undefined;
}
