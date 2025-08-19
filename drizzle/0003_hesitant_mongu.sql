ALTER TABLE "stock_prices_daily" ALTER COLUMN "high" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ALTER COLUMN "volume" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ALTER COLUMN "open" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ALTER COLUMN "low" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ALTER COLUMN "close" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ALTER COLUMN "adj_close" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ALTER COLUMN "high" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ALTER COLUMN "volume" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ALTER COLUMN "open" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ALTER COLUMN "low" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ALTER COLUMN "close" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ALTER COLUMN "adj_close" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ALTER COLUMN "high" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ALTER COLUMN "volume" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ALTER COLUMN "open" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ALTER COLUMN "low" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ALTER COLUMN "close" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ALTER COLUMN "adj_close" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ADD CONSTRAINT "stock_prices_daily_symbol_date_unique" UNIQUE("symbol","date");--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ADD CONSTRAINT "stock_prices_monthly_symbol_date_unique" UNIQUE("symbol","date");--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ADD CONSTRAINT "stock_prices_weekly_symbol_date_unique" UNIQUE("symbol","date");