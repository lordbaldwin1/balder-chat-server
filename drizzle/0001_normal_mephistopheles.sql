ALTER TABLE "instruments" ALTER COLUMN "long_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "instruments" ALTER COLUMN "short_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "instruments" ALTER COLUMN "full_exchange_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "instruments" ALTER COLUMN "first_trade_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "instruments" ALTER COLUMN "has_pre_post_market_data" DROP NOT NULL;