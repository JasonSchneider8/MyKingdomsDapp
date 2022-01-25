import { GemItem, GEMS, Gem } from "./gems.ts";

export { Gem };

export interface Square {
  gem: Gem;
  createdAt: number;
}

export interface Transaction {
  gem: Gem;
  createdAt: number;
  action: Action;
  landIndex: number;
}

export enum Action {
  Mine = 0,
  Claim = 1,
}


export type ActionableItem = GemItem | Item;

export function isGem(item: ActionableItem): item is GemItem {
  return !(item as Item).address;
}


export interface Item {
  name:
    | "Stone"
    | "Wood"
    | "Iron"
    | "Christmas Tree"
  description: string;
  address: string;
  image: any;
  type: "ERC20" | "NFT";
  isLocked?: boolean;
  supply?: number;
  abi?: any;
  openSeaLink?: string;
}

export const items: Item[] = [];

export const ACTIONABLE_ITEMS = [...GEMS, ...items];