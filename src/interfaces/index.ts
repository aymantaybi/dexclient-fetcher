import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { WebsocketProvider } from "web3-providers-ws";

export interface FetcherConstructor {
  WebsocketProvider: WebsocketProvider;
  WebsocketProviderHost: string;
}

export interface BaseEntity {
  web3: Web3;
  address: string;
  contract: Contract;
  initialize: () => Promise<unknown>;
}
