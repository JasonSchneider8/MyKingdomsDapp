import coin from "../images/ui/coin.png";


export enum Gem {
  None = "0",
  MDVL = "1",
}


export interface GemItem {
  gem: Gem;
  name: string;
  image: string;
  minePrice: number;
  claimPrice: number;
  landRequired: number;
  miningMinutes: number;
}

export const GEMS: GemItem[] = [
  {
    gem: Gem.MDVL,
    name: "MDVL",
    image: coin,
    minePrice: 1.0,
    claimPrice: 2.0,
    landRequired: 0,
    miningMinutes: 0.05,
  }
];

export function getGem(gem: Gem) {
  return GEMS.find((item) => item.gem === gem);
}

// Apply the market rate against to get the current buy and sell prices
export function getMarketGems() {
  return GEMS.map((gem) => ({
    ...gem,
    minePrice: gem.minePrice,
    claimPrice: gem.claimPrice,
  }));
}
