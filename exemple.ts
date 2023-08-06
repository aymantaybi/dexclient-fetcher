import * as dotenv from "dotenv";
dotenv.config();
import { Web3 } from "web3";
import { Fetcher } from "./src";

const { WS_PROVIDER } = process.env;

const fetcher = new Fetcher({ url: WS_PROVIDER! });

(async () => {
  await fetcher.initialize();
//  fetcher.on("newBlock", console.log);
  await fetcher.erc20("0x97a9107c1793bc407d6f527b77e7fff4d812bece");
  const pair = await fetcher.pair("0xc6344bc1604fcab1a5aad712d766796e2b7a70b9");
  pair.on("reservesUpdate", console.log);
})();
