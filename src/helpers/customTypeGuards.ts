import { FetcherConstructor, FetcherConstructorWebsocketProvider, FetcherConstructorWebsocketProviderHost } from "../interfaces";

export function isFetcherConstructorWebsocketProvider(fetcherConstructor: FetcherConstructor): fetcherConstructor is FetcherConstructorWebsocketProvider {
  return (<FetcherConstructorWebsocketProvider>fetcherConstructor).websocketProvider !== undefined;
}

export function isFetcherConstructorWebsocketProviderHost(fetcherConstructor: FetcherConstructor): fetcherConstructor is FetcherConstructorWebsocketProviderHost {
  return (<FetcherConstructorWebsocketProviderHost>fetcherConstructor).websocketProviderHost !== undefined;
}
