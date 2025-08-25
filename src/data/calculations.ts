import type { StockPricesDaily, StockPricesWeekly } from "../db/schema";
import type { DailyMetrics } from "./fortunes";

export function calcDailyCloseChangePercent(
  todaysClose: number | null | undefined,
  yesterdaysClose: number | null | undefined
) {
  return todaysClose && yesterdaysClose
    ? Math.round(((todaysClose - yesterdaysClose) / yesterdaysClose) * 100  * 100) / 100
    : undefined;
}

export function calcOpenCloseChangePercent(
  todaysOpen: number | null | undefined,
  todaysClose: number | null | undefined
) {
  return todaysClose && todaysOpen
    ? Math.round(((todaysClose - todaysOpen) / todaysOpen) * 100) * 100 / 100
    : undefined;
}

export function calcDailyCloseVolatility(dailyQuotes: StockPricesDaily[]) {
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

  return Math.round(sumCloseChangePercent / count * 100) / 100;
}

export function calcIntradayRange(
  todayHigh: number | null | undefined,
  todayLow: number | null | undefined
) {
  return todayHigh && todayLow
    ? Math.round(((todayHigh - todayLow) / todayLow) * 100 * 100) / 100
    : undefined;
}

export function calcTodayAverageVs30DayAverage(
  dailyQuotes: StockPricesDaily[]
) {
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
    ? Math.round(dailyQuotes[0]?.volume / avg30DayVolume * 100) / 100
    : undefined;
}

export function formatDailyPrompt(d: DailyMetrics) {
  return `
    Symbol: ${d.symbol}
    Daily Close Change: ${d.dailyCloseChangePercent?.toFixed(2)}%
    Intraday Open/Close Change: ${d.openCloseChangePercent?.toFixed(2)}%
    Daily Volatility (Avg Close Change): ${d.closeVolatilityPercent?.toFixed(2)}%
    Intraday Range (High-Low): ${d.intradayRange?.toFixed(2)}%
    Volume vs 30-Day Average: ${d.todayVolumeVsAverage?.toFixed(2)}x
    `;
}

export function calcWeeklyVolumeVs12WeekAverage(
  weeklyQuotes: StockPricesWeekly[]
) {
  if (weeklyQuotes.length < 2) return undefined;
  
  let lastWeekVolume: number | undefined;
  for (let i = 1; i < weeklyQuotes.length; i++) {
    const volume = weeklyQuotes[i]?.volume;
    if (volume !== null && volume !== undefined) {
      lastWeekVolume = volume;
      break;
    }
  }
  
  if (!lastWeekVolume) return undefined;
  
  let sumVolume = 0;
  let count = 0;
  
  for (let i = 2; i < Math.min(weeklyQuotes.length, 14); i++) {
    const weekVolume = weeklyQuotes[i]?.volume;
    if (weekVolume) {
      sumVolume += weekVolume;
      count++;
    }
  }
  
  const avg12WeekVolume = count > 0 ? sumVolume / count : undefined;
  
  if (!avg12WeekVolume) return undefined;
  
  return Math.round((lastWeekVolume / avg12WeekVolume) * 100) / 100;
}

export function calcWeeklyVolatility(
  weeklyQuotes: StockPricesWeekly[]
) {
  if (weeklyQuotes.length === 0) return undefined;
  
  const thisWeekHigh = weeklyQuotes[0]?.high;
  const thisWeekLow = weeklyQuotes[0]?.low;
  
  if (!thisWeekHigh || !thisWeekLow) return undefined;
  
  return Math.round(((thisWeekHigh - thisWeekLow) / thisWeekLow) * 100 * 100) / 100;
}

export function calcWeeklyCloseChangePercent(
  thisWeekClose: number | null | undefined,
  lastWeekClose: number | null | undefined
) {
  return thisWeekClose && lastWeekClose
    ? Math.round(
        ((thisWeekClose - lastWeekClose) / lastWeekClose) * 100 * 100
      ) / 100
    : undefined;
}

export function calcWeeklyCloseStreak(weeklyQuotes: StockPricesWeekly[]) {
  let streak = 0;
  let streakDirection: "positive" | "negative" | null = null;

  for (let i = 0; i < weeklyQuotes.length - 1; i++) {
    const recentClose = weeklyQuotes[i]?.close;
    const pastClose = weeklyQuotes[i + 1]?.close;

    if (!recentClose || !pastClose) break;

    const changePercent = calcWeeklyCloseChangePercent(recentClose, pastClose);
    if (!changePercent) continue;

    const isPositive = changePercent > 0;
    const isNegative = changePercent < 0;

    if (streakDirection === null) {
      streakDirection = isPositive ? "positive" : "negative";
      streak = 1;
      continue;
    }

    if (
      (isPositive && streakDirection === "positive") ||
      (isNegative && streakDirection === "negative")
    ) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function formatWeeklyPrompt(weeklyMetrics: {
  weeklyCloseChangePercent: number | undefined;
  weeklyCloseStreak: number | undefined;
  weeklyVolatility: number | undefined;
  weeklyVolumeVs12WeekAverage: number | undefined;
}) {
  const streakDirection = weeklyMetrics.weeklyCloseChangePercent && weeklyMetrics.weeklyCloseChangePercent > 0 ? "up" : "down";
  
  return `
    Weekly Close Change: ${weeklyMetrics.weeklyCloseChangePercent?.toFixed(2)}%
    Weekly Streak: ${weeklyMetrics.weeklyCloseStreak} weeks ${streakDirection}
    Weekly Volatility (High-Low Range): ${weeklyMetrics.weeklyVolatility?.toFixed(2)}%
    Volume vs 12-Week Average: ${weeklyMetrics.weeklyVolumeVs12WeekAverage?.toFixed(2)}x
  `;
}

export function calcMonthlyCloseChangePercent(
    thisMonthClose: number | null | undefined,
    lastMonthClose: number | null | undefined
  ) {
    return thisMonthClose && lastMonthClose
      ? Math.round((thisMonthClose - lastMonthClose) / lastMonthClose * 100 * 100) / 100
      : undefined;
  }
  
  export function calcHighVs52WeekHigh(currentClose: number | null | undefined, fiftyTwoWeekHighClose: number | null | undefined) {
    return currentClose && fiftyTwoWeekHighClose
      ? Math.round((currentClose - fiftyTwoWeekHighClose) / fiftyTwoWeekHighClose * 100 * 100) / 100
      : undefined;
  }
  
  export function calcLowVs52WeekLow(currentClose: number | null | undefined, fiftyTwoWeekLowClose: number | null | undefined) {
    return currentClose && fiftyTwoWeekLowClose
      ? Math.round((currentClose - fiftyTwoWeekLowClose) / fiftyTwoWeekLowClose * 100 * 100) / 100
      : undefined;
  }

export function formatMonthlyPrompt(monthlyMetrics: {
  monthlyCloseChangePercent: number | undefined;
  highVs52WeekHigh: number | undefined;
  lowVs52WeekLow: number | undefined;
}) {
  return `
    Monthly Close Change: ${monthlyMetrics.monthlyCloseChangePercent?.toFixed(2)}%
    Distance from 52-Week High: ${monthlyMetrics.highVs52WeekHigh?.toFixed(2)}%
    Distance from 52-Week Low: ${monthlyMetrics.lowVs52WeekLow?.toFixed(2)}%
  `;
}