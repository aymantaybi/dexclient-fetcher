import { WebsocketProvider } from "web3-providers-ws";

export interface FetcherConstructorWebsocketProvider {
  websocketProvider: WebsocketProvider;
}

export interface FetcherConstructorWebsocketProviderHost {
  websocketProviderHost: string;
}

export type FetcherConstructor = FetcherConstructorWebsocketProvider | FetcherConstructorWebsocketProviderHost;
