import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BaseEntity } from "../interfaces";
import Erc20ABI from "../samples/contracts/Erc20.json";

export default class implements BaseEntity {
  address: string;
  contract: any;
  constructor(web3: Web3, address: string) {
    this.address = address;
    this.contract = new web3.eth.Contract(Erc20ABI as AbiItem[], this.address);
  }
  async initialize() {}
}
