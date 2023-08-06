import { FetcherConstructorParameters, FetcherConstructorWebsocketProvider } from "../interfaces";

export function isFetcherConstructorWebsocketProvider(
  fetcherConstructorParameters: FetcherConstructorParameters
): fetcherConstructorParameters is FetcherConstructorWebsocketProvider {
  return (<FetcherConstructorWebsocketProvider>fetcherConstructorParameters).websocketProvider !== undefined;
}
