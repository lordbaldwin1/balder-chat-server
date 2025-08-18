import { getStockPricesDaily } from "../db/queries/daily-prices";
import type { StockPricesDaily } from "../db/schema";

type DailyMetrics = {
  symbol: string;
  dailyCloseChangePercent: number | undefined;
  openCloseChangePercent: number | undefined;
  closeVolatilityPercent: number | undefined;
  intradayRange: number | undefined;
  todayVolumeVsAverage: number | undefined;
};

export async function createFortunePrompt(symbol: string) {
  const dailyMetrics = await calculateDailyMetrics(symbol);
  const dailyPrompt = formatDailyPrompt(dailyMetrics);
  console.log(dailyPrompt);
}

async function calculateDailyMetrics(symbol: string) {
  const dailyQuotes: StockPricesDaily[] = await getStockPricesDaily(symbol);
  if (dailyQuotes.length < 2) {
    throw new Error("UH OH, WE DON'T GOT ENOUGH QUOTES TO MAKE A FORTUNE!");
  }

  const todaysClose = dailyQuotes[0]?.close;
  const yesterdaysClose = dailyQuotes[1]?.close;
  const todaysOpen = dailyQuotes[0]?.open;
  const todayHigh = dailyQuotes[0]?.high;
  const todayLow = dailyQuotes[0]?.low;

  const dailyCloseChangePercent = calcDailyCloseChangePercent(
    todaysClose,
    yesterdaysClose
  );
  const openCloseChange = calcOpenCloseChangePercent(todaysOpen, todaysClose);
  const dailyCloseVolatility = calcDailyCloseVolatility(dailyQuotes);
  const intradayRange = calcIntradayRange(todayHigh, todayLow);
  const todayVolumeVsAverage = calcTodayAverageVs30DayAverage(dailyQuotes);

  return {
    symbol: symbol,
    dailyCloseChangePercent: dailyCloseChangePercent,
    openCloseChangePercent: openCloseChange,
    closeVolatilityPercent: dailyCloseVolatility,
    intradayRange: intradayRange,
    todayVolumeVsAverage: todayVolumeVsAverage,
  } satisfies DailyMetrics;
}

function calcDailyCloseChangePercent(
  todaysClose: number | null | undefined,
  yesterdaysClose: number | null | undefined
) {
  return todaysClose && yesterdaysClose
    ? ((todaysClose - yesterdaysClose) / yesterdaysClose) * 100
    : undefined;
}

function calcOpenCloseChangePercent(
  todaysOpen: number | null | undefined,
  todaysClose: number | null | undefined
) {
  return todaysClose && todaysOpen
    ? ((todaysClose - todaysOpen) / todaysOpen) * 100
    : undefined;
}

function calcDailyCloseVolatility(dailyQuotes: StockPricesDaily[]) {
  let sumCloseChangePercent = 0;
  let count = 0;

  for (let i = 0; i < dailyQuotes.length - 1; i++) {
    const recentClose = dailyQuotes[i]?.close;
    const pastClose = dailyQuotes[i + 1]?.close;
    if (!recentClose || !pastClose) {
      continue;
    }

    sumCloseChangePercent += Math.abs(
      ((recentClose - pastClose) / pastClose) * 100
    );
    count++;
  }

  return sumCloseChangePercent / count;
}

function calcIntradayRange(
  todayHigh: number | null | undefined,
  todayLow: number | null | undefined
) {
  return todayHigh && todayLow
    ? ((todayHigh - todayLow) / todayLow) * 100
    : undefined;
}

function calcTodayAverageVs30DayAverage(dailyQuotes: StockPricesDaily[]) {
  let sumVolume = 0;
  let sumCount = 0;
  for (let i = 0; i < Math.min(dailyQuotes.length, 30); i++) {
    const dayVolume = dailyQuotes[i]?.volume;
    if (!dayVolume) {
      continue;
    }
    sumVolume += dayVolume;
    sumCount++;
  }
  const avg30DayVolume = sumCount > 0 ? sumVolume / sumCount : undefined;
  return dailyQuotes[0]?.volume && avg30DayVolume
    ? dailyQuotes[0]?.volume / avg30DayVolume
    : undefined;
}

function formatDailyPrompt(d: DailyMetrics) {
  return `
  Symbol: ${d.symbol}
  Daily % change: ${d.dailyCloseChangePercent?.toFixed(2)}%
  Open/close % change: ${d.openCloseChangePercent?.toFixed(2)}%
  Average daily % change (volatility): ${d.closeVolatilityPercent?.toFixed(2)}%
  Intraday Range: ${d.intradayRange?.toFixed(2)}%
  Today Volume / 30 day average volume: ${d.todayVolumeVsAverage?.toFixed(2)}x
  `;
}

await createFortunePrompt("AAPL");
