import { getStockPricesDaily } from "../db/queries/daily-prices";
import { getInstrument } from "../db/queries/instruments";
import { getStockPricesMonthly } from "../db/queries/monthly-prices";
import { getStockPricesWeekly } from "../db/queries/weekly-prices";
import { type StockPricesDaily, type StockPricesWeekly } from "../db/schema";
import {
  calcDailyCloseChangePercent,
  calcDailyCloseVolatility,
  calcHighVs52WeekHigh,
  calcIntradayRange,
  calcLowVs52WeekLow,
  calcMonthlyCloseChangePercent,
  calcOpenCloseChangePercent,
  calcTodayAverageVs30DayAverage,
  calcWeeklyCloseChangePercent,
  calcWeeklyCloseStreak,
  calcWeeklyVolatility,
  calcWeeklyVolumeVs12WeekAverage,
  formatDailyPrompt,
  formatMonthlyPrompt,
  formatWeeklyPrompt,
} from "./calculations";

export type DailyMetrics = {
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

  const weeklyMetrics = await calculateWeeklyMetrics(symbol);
  const weeklyPrompt = formatWeeklyPrompt(weeklyMetrics);
  console.log(weeklyPrompt);

  const monthlyMetrics = await calculateMonthlyMetrics(symbol);
  const monthlyPrompt = formatMonthlyPrompt(monthlyMetrics);
  console.log(monthlyPrompt);
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

async function calculateWeeklyMetrics(symbol: string) {
  const weeklyQuotes = await getStockPricesWeekly(symbol);

  const thisWeekClose = weeklyQuotes[1]?.close;
  const lastWeekClose = weeklyQuotes[2]?.close;

  const weeklyCloseChangePercent = calcWeeklyCloseChangePercent(
    thisWeekClose,
    lastWeekClose
  );
  const weeklyCloseStreak = calcWeeklyCloseStreak(weeklyQuotes);
  const weeklyVolatility = calcWeeklyVolatility(weeklyQuotes);
  const weeklyVolumeVs12WeekAverage =
    calcWeeklyVolumeVs12WeekAverage(weeklyQuotes);

  return {
    weeklyCloseChangePercent: weeklyCloseChangePercent,
    weeklyCloseStreak: weeklyCloseStreak,
    weeklyVolatility: weeklyVolatility,
    weeklyVolumeVs12WeekAverage: weeklyVolumeVs12WeekAverage,
  };
}

async function calculateMonthlyMetrics(symbol: string) {
  const monthlyQuotes = await getStockPricesMonthly(symbol);
  const metaData = await getInstrument(symbol);

  const thisMonthClose = monthlyQuotes[1]?.close;
  const lastMonthClose = monthlyQuotes[2]?.close;
  const fiftyTwoWeekHigh = metaData?.fiftyTwoWeekHigh;
  const fiftyTwoWeekLow = metaData?.fiftyTwoWeekLow;

  const monthlyCloseChangePercent = calcMonthlyCloseChangePercent(thisMonthClose, lastMonthClose);
  const highVs52WeekHigh = calcHighVs52WeekHigh(thisMonthClose, fiftyTwoWeekHigh);
  const lowVs52WeekLow = calcLowVs52WeekLow(thisMonthClose, fiftyTwoWeekLow);

  return {
    monthlyCloseChangePercent: monthlyCloseChangePercent,
    highVs52WeekHigh: highVs52WeekHigh,
    lowVs52WeekLow: lowVs52WeekLow,
  };
}

await createFortunePrompt("AAPL");
