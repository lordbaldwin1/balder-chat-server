import { getStockPricesDaily } from "../db/queries/daily-prices";


export async function createFortunePrompt(symbol: string) {
  const dailyFortuneString = await createDailyStockFortunePrompt(symbol);
}

async function createDailyStockFortunePrompt(symbol: string) {
  const dailyQuotes = await getStockPricesDaily(symbol);
  if (dailyQuotes.length < 2) {
    throw new Error("UH OH, WE DON'T GOT ENOUGH QUOTES TO MAKE A FORTUNE!")
  }
  // is stock happy or sad today?

  const todaysClose = dailyQuotes[0]?.close;
  const yesterdaysClose = dailyQuotes[1]?.close;
  if (!todaysClose || !yesterdaysClose) {
    throw new Error("UH OH, TODAYS OR YESTERDAYS CLOSE IS MISSING BRUH!");
  }
  const dailyCloseChangePercent = (todaysClose - yesterdaysClose) / yesterdaysClose * 100;

  let sumCloseChangePercent = 0;
  let closeChangePercentCount = 0;
  for (let i = 0; i < dailyQuotes.length - 1; i++) {
    const recentClose = dailyQuotes[i]?.close;
    const pastClose = dailyQuotes[i+1]?.close;
    if (!recentClose || !pastClose) {
      continue;
    }
    sumCloseChangePercent += (recentClose - pastClose) / pastClose * 100;
    closeChangePercentCount++;
  }
  const dailyCloseVolatility = Math.abs(sumCloseChangePercent / closeChangePercentCount);

  return `
  Symbol: ${symbol}
  Daily % change: ${dailyCloseChangePercent}
  Average daily % change (volatility): ${dailyCloseVolatility}
  `
}