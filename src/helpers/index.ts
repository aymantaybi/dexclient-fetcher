import { JsonRpcIdentifier } from "web3";

export * from "./typeGuards";

export function createRequest(method: string, params: unknown[], id: number | string = crypto.randomUUID(), jsonrpc: JsonRpcIdentifier = "2.0") {
  return {
    method,
    params,
    id,
    jsonrpc,
  };
}
