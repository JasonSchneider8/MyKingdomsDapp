import { Gem } from "../types/contract.ts";
import { GEMS } from "../types/gems.ts";

interface KingdomState {
  selectedItem?: string;
}

// Account ID -> FarmState
type CachedKingdoms = Record<string, KingdomState>;

const CACHED_KINGDOMS_KEY = "kingdoms";

const DEFAULT: KingdomState = {
  selectedItem: GEMS[0].name,
};

function getKingdoms(): CachedKingdoms {
  const stored = localStorage.getItem(CACHED_KINGDOMS_KEY);

  if (!stored) {
    return {};
  }

  try {
    const parsed = JSON.parse(stored);

    return parsed;
  } catch (e) {
    console.error("Parsing localstorage failed: ", e);
    return {};
  }
}

export function getKingdom(accountId: string): KingdomState {
  const kingdoms = getKingdoms();
  const kingdom = kingdoms[accountId];

  if (!kingdom) {
    return DEFAULT;
  }

  return kingdom;
}

export function cacheAccountKingdom(accountId: string, state: KingdomState) {
  const kingdoms = getKingdoms();
  const newKingdoms: CachedKingdoms = {
    ...kingdoms,
    [accountId]: state,
  };

  localStorage.setItem(CACHED_KINGDOMS_KEY, JSON.stringify(newKingdoms));
}

export function getSelectedItem(accountId: string): ActionableItem {
  const kingdoms = getKingdoms();

  const kingdom = kingdoms[accountId];

  if (!kingdom || !kingdom.selectedItem) {
    return GEMS[0];
  }

  const item = ACTIONABLE_ITEMS.find((item) => item.name === kingdom.selectedItem);

  return item;
}
