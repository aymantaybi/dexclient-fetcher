import { FetcherConstructorWebsocketProvider, FetcherConstructorWebsocketProviderHost } from "../interfaces";

export function isFetcherConstructorWebsocketProvider(
  obj: FetcherConstructorWebsocketProvider | FetcherConstructorWebsocketProviderHost
): obj is FetcherConstructorWebsocketProvider {
  return (<FetcherConstructorWebsocketProvider>obj).websocketProvider !== undefined;
}

export function isFetcherConstructorWebsocketProviderHost(
  obj: FetcherConstructorWebsocketProvider | FetcherConstructorWebsocketProviderHost
): obj is FetcherConstructorWebsocketProviderHost {
  return (<FetcherConstructorWebsocketProviderHost>obj).websocketProviderHost !== undefined;
}
