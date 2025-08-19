import { createFortunePrompt } from "./data/fortunes";
import { instruments } from "./data/instrument-data";

export const globalStockState: Record<string, string> = {};

export async function initGlobalStockState(
  globalStockState: Record<string, string>
) {
  for (const symbol of instruments) {
    globalStockState[symbol] = await createFortunePrompt(symbol);
  }
}
