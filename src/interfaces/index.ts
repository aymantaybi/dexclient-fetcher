import { Web3BaseProvider } from "web3";

export interface FetcherConstructorWebsocketProvider {
  websocketProvider: Web3BaseProvider;
}

export interface FetcherConstructorUrl {
  url: string;
}

export type FetcherConstructorParameters = FetcherConstructorWebsocketProvider | FetcherConstructorUrl;
