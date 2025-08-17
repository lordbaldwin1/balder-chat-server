import yahooFinance from "yahoo-finance2";

const data = await yahooFinance.chart("AAPL", {
  period1: "2024-01-01",
  period2: "2024-01-07",
  events: "div|split|earn",
});

console.log(data);
