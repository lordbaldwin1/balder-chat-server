import yahooFinance from "yahoo-finance2";


const now = new Date();
const oneYearAgo = new Date(now);
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const data = await yahooFinance.chart("AAPL", {
  period1: oneYearAgo,
  period2: now,
  interval: "1d",
});

console.log(data.quotes[0]);
