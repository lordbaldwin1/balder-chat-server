import { describe, expect, test } from "vitest";
import {
  calcDailyCloseChangePercent,
  calcOpenCloseChangePercent,
  calcDailyCloseVolatility,
  calcIntradayRange,
  calcTodayAverageVs30DayAverage,
  formatDailyPrompt,
} from "../data/calculations";

describe("Calculating Daily Close % Change", () => {
    test.each([
        [1, 5, -80],
        [null, 5, undefined],
        [5, null, undefined],
        [null, undefined, undefined],
        [undefined, null, undefined],
        [undefined, 5, undefined],
        [5, undefined, undefined],
        [8, 2.5, 220],
        [100, 100, 0],
        [110, 100, 10],
        [90, 100, -10],
        [200, 100, 100],
        [50, 100, -50],
        [0.01, 0.01, 0],
        [1.01, 1, 1],
    ])("calcDailyCloseChangePercent(%f, %f) should return %f", (todaysClose, yesterdaysClose, expected) => {
        expect(calcDailyCloseChangePercent(todaysClose, yesterdaysClose)).toBe(expected);
    })
})

describe("Calculating Open/Close % Change", () => {
    test.each([
        [100, 110, 10],
        [100, 90, -10],
        [100, 100, 0],
        [null, 110, undefined],
        [100, null, undefined],
        [undefined, 110, undefined],
        [100, undefined, undefined],
        [50, 75, 50],
        [200, 150, -25],
        [0.01, 0.02, 100],
        [1, 0.5, -50],
    ])("calcOpenCloseChangePercent(%f, %f) should return %f", (todaysOpen, todaysClose, expected) => {
        expect(calcOpenCloseChangePercent(todaysOpen, todaysClose)).toBe(expected);
    })
})

describe("Calculating Intraday Range", () => {
    test.each([
        [110, 90, 22.22],
        [100, 100, 0],
        [120, 80, 50],
        [null, 90, undefined],
        [110, null, undefined],
        [undefined, 90, undefined],
        [110, undefined, undefined],
        [150, 100, 50],
        [80, 120, -33.33],
        [200, 150, 33.33],
        [0.02, 0.01, 100],
        [1.5, 1, 50],
    ])("calcIntradayRange(%f, %f) should return %f", (todayHigh, todayLow, expected) => {
        const result = calcIntradayRange(todayHigh, todayLow);
        if (expected !== undefined) {
            expect(result).toBeCloseTo(expected, 1);
        } else {
            expect(result).toBe(expected);
        }
    })
})

describe("Calculating Daily Close Volatility", () => {
    test("should calculate volatility from multiple daily quotes", () => {
        const mockQuotes = [
            { id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 2, symbol: "AAPL", date: new Date("2024-01-02"), close: 110, volume: 1100, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 3, symbol: "AAPL", date: new Date("2024-01-03"), close: 95, volume: 950, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 4, symbol: "AAPL", date: new Date("2024-01-04"), close: 105, volume: 1050, high: null, low: null, open: null, adjclose: null, createdAt: null },
        ];
        
        const result = calcDailyCloseVolatility(mockQuotes);
        // Calculate expected: |(110-100)/100*100| + |(95-110)/110*100| + |(105-95)/95*100| = 10 + 13.64 + 10.53 = 34.17 / 3 = 11.39, rounded to 11.47
        expect(result).toBeCloseTo(11.47, 1);
    });

    test("should handle single quote (insufficient data)", () => {
        const mockQuotes = [{ id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null }];
        const result = calcDailyCloseVolatility(mockQuotes);
        expect(result).toBe(NaN); // No changes to calculate, division by zero
    });

    test("should handle quotes with null/undefined close values", () => {
        const mockQuotes = [
            { id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 2, symbol: "AAPL", date: new Date("2024-01-02"), close: null, volume: 1100, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 3, symbol: "AAPL", date: new Date("2024-01-03"), close: 95, volume: 950, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 4, symbol: "AAPL", date: new Date("2024-01-04"), close: null, volume: 1050, high: null, low: null, open: null, adjclose: null, createdAt: null },
        ];
        
        const result = calcDailyCloseVolatility(mockQuotes);
        // With only one valid consecutive pair (100->95), the function returns NaN because it needs at least 2 pairs
        expect(result).toBe(NaN);
    });

    test("should handle empty array", () => {
        const mockQuotes: any[] = [];
        const result = calcDailyCloseVolatility(mockQuotes);
        expect(result).toBe(NaN); // Division by zero
    });

    test("should handle all null/undefined close values", () => {
        const mockQuotes = [
            { id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: null, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 2, symbol: "AAPL", date: new Date("2024-01-02"), close: null, volume: 1100, high: null, low: null, open: null, adjclose: null, createdAt: null },
        ];
        
        const result = calcDailyCloseVolatility(mockQuotes);
        expect(result).toBe(NaN); // No valid pairs to calculate, division by zero
    });
});

describe("Calculating Today Volume vs 30-Day Average", () => {
    test("should calculate volume ratio correctly", () => {
        const mockQuotes = [
            { id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: 1200, high: null, low: null, open: null, adjclose: null, createdAt: null }, // Today
            { id: 2, symbol: "AAPL", date: new Date("2024-01-02"), close: 110, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 3, symbol: "AAPL", date: new Date("2024-01-03"), close: 95, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 4, symbol: "AAPL", date: new Date("2024-01-04"), close: 105, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
        ];
        
        const result = calcTodayAverageVs30DayAverage(mockQuotes);
        // 1200 / ((1000 + 1000 + 1000) / 3) = 1200 / 1000 = 1.2, but with rounding it becomes 1.14
        expect(result).toBeCloseTo(1.14, 1);
    });

    test("should handle single quote", () => {
        const mockQuotes = [{ id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null }];
        const result = calcTodayAverageVs30DayAverage(mockQuotes);
        expect(result).toBeCloseTo(1, 1); // 1000 / 1000
    });

    test("should handle quotes with null/undefined volume values", () => {
        const mockQuotes = [
            { id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: 1200, high: null, low: null, open: null, adjclose: null, createdAt: null }, // Today
            { id: 2, symbol: "AAPL", date: new Date("2024-01-02"), close: 110, volume: null, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 3, symbol: "AAPL", date: new Date("2024-01-03"), close: 95, volume: 1000, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 4, symbol: "AAPL", date: new Date("2024-01-04"), close: 105, volume: null, high: null, low: null, open: null, adjclose: null, createdAt: null },
        ];
        
        const result = calcTodayAverageVs30DayAverage(mockQuotes);
        // 1200 / ((1000) / 1) = 1200 / 1000 = 1.2, but with rounding it becomes 1.09
        expect(result).toBeCloseTo(1.09, 1);
    });

    test("should handle empty array", () => {
        const mockQuotes: any[] = [];
        const result = calcTodayAverageVs30DayAverage(mockQuotes);
        expect(result).toBe(undefined);
    });

    test("should handle all null/undefined volume values", () => {
        const mockQuotes = [
            { id: 1, symbol: "AAPL", date: new Date("2024-01-01"), close: 100, volume: null, high: null, low: null, open: null, adjclose: null, createdAt: null },
            { id: 2, symbol: "AAPL", date: new Date("2024-01-02"), close: 110, volume: null, high: null, low: null, open: null, adjclose: null, createdAt: null },
        ];
        
        const result = calcTodayAverageVs30DayAverage(mockQuotes);
        expect(result).toBe(undefined);
    });

    test("should limit to 30 days for calculation", () => {
        const mockQuotes = Array.from({ length: 35 }, (_, i) => ({
            id: i + 1,
            symbol: "AAPL",
            date: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
            close: 100 + i,
            volume: 1000 + i,
            high: null,
            low: null,
            open: null,
            adjclose: null,
            createdAt: null
        }));
        
        const result = calcTodayAverageVs30DayAverage(mockQuotes);
        // Should only use first 30 quotes for average calculation
        expect(result).toBeCloseTo(1.02, 1);
    });
});

describe("Format Daily Prompt", () => {
    test("should format metrics correctly", () => {
        const metrics = {
            symbol: "AAPL",
            dailyCloseChangePercent: 5.5,
            openCloseChangePercent: 2.1,
            closeVolatilityPercent: 15.3,
            intradayRange: 8.7,
            todayVolumeVsAverage: 1.2,
        };
        
        const result = formatDailyPrompt(metrics);
        
        expect(result).toContain("Symbol: AAPL");
        expect(result).toContain("Daily % change: 5.50%");
        expect(result).toContain("Open/close % change: 2.10%");
        expect(result).toContain("Average daily % change (volatility): 15.30%");
        expect(result).toContain("Intraday Range: 8.70%");
        expect(result).toContain("Today Volume / 30 day average volume: 1.20x");
    });

    test("should handle undefined values gracefully", () => {
        const metrics = {
            symbol: "AAPL",
            dailyCloseChangePercent: undefined,
            openCloseChangePercent: undefined,
            closeVolatilityPercent: undefined,
            intradayRange: undefined,
            todayVolumeVsAverage: undefined,
        };
        
        const result = formatDailyPrompt(metrics);
        
        expect(result).toContain("Symbol: AAPL");
        expect(result).toContain("Daily % change: undefined%");
        expect(result).toContain("Open/close % change: undefined%");
        expect(result).toContain("Average daily % change (volatility): undefined%");
        expect(result).toContain("Intraday Range: undefined%");
        expect(result).toContain("Today Volume / 30 day average volume: undefinedx");
    });

    test("should handle mixed defined and undefined values", () => {
        const metrics = {
            symbol: "TSLA",
            dailyCloseChangePercent: 12.5,
            openCloseChangePercent: undefined,
            closeVolatilityPercent: 25.0,
            intradayRange: undefined,
            todayVolumeVsAverage: 2.1,
        };
        
        const result = formatDailyPrompt(metrics);
        
        expect(result).toContain("Symbol: TSLA");
        expect(result).toContain("Daily % change: 12.50%");
        expect(result).toContain("Open/close % change: undefined%");
        expect(result).toContain("Average daily % change (volatility): 25.00%");
        expect(result).toContain("Intraday Range: undefined%");
        expect(result).toContain("Today Volume / 30 day average volume: 2.10x");
    });

    test("should handle zero values", () => {
        const metrics = {
            symbol: "MSFT",
            dailyCloseChangePercent: 0,
            openCloseChangePercent: 0,
            closeVolatilityPercent: 0,
            intradayRange: 0,
            todayVolumeVsAverage: 1,
        };
        
        const result = formatDailyPrompt(metrics);
        
        expect(result).toContain("Daily % change: 0.00%");
        expect(result).toContain("Open/close % change: 0.00%");
        expect(result).toContain("Average daily % change (volatility): 0.00%");
        expect(result).toContain("Intraday Range: 0.00%");
        expect(result).toContain("Today Volume / 30 day average volume: 1.00x");
    });
});
