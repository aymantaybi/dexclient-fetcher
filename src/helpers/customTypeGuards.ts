import { FetcherConstructor, FetcherConstructorWebsocketProvider, FetcherConstructorWebsocketProviderHost } from "../interfaces";

export function isFetcherConstructorWebsocketProvider(obj: FetcherConstructor): obj is FetcherConstructorWebsocketProvider {
  return (<FetcherConstructorWebsocketProvider>obj).websocketProvider !== undefined;
}

export function isFetcherConstructorWebsocketProviderHost(obj: FetcherConstructor): obj is FetcherConstructorWebsocketProviderHost {
  return (<FetcherConstructorWebsocketProviderHost>obj).websocketProviderHost !== undefined;
}
