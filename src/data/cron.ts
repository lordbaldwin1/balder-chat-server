import { seedInstruments } from "./instruments";
import { gatherPastYearStockPricesDailyWeeklyMonthly } from "./quotes";

export async function gatherStockDataDaily() {
    await seedInstruments();
    await gatherPastYearStockPricesDailyWeeklyMonthly()
}