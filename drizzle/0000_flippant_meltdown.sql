CREATE TABLE "fortunes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"body" text NOT NULL,
	"stock_data" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instruments" (
	"symbol" text PRIMARY KEY NOT NULL,
	"instrument_type" text NOT NULL,
	"currency" text NOT NULL,
	"timezone" text NOT NULL,
	"exchange_timezone_name" text NOT NULL,
	"long_name" text,
	"short_name" text,
	"exchange_name" text NOT NULL,
	"full_exchange_name" text,
	"first_trade_date" timestamp,
	"has_pre_post_market_data" boolean DEFAULT false,
	"chart_previous_close" real,
	"regular_market_price" real NOT NULL,
	"regular_market_day_high" real,
	"regular_market_day_low" real,
	"regular_market_volume" real,
	"fifty_two_week_high" real,
	"fifty_two_week_low" real,
	"pre_market_start" timestamp,
	"pre_market_end" timestamp,
	"regular_market_start" timestamp,
	"regular_market_end" timestamp,
	"post_market_start" timestamp,
	"post_market_end" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stock_prices_daily" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text,
	"date" timestamp NOT NULL,
	"high" real,
	"volume" bigint,
	"open" real,
	"low" real,
	"close" real,
	"adj_close" real,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "stock_prices_daily_symbol_date_unique" UNIQUE("symbol","date")
);
--> statement-breakpoint
CREATE TABLE "stock_prices_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text,
	"date" timestamp NOT NULL,
	"high" real,
	"volume" bigint,
	"open" real,
	"low" real,
	"close" real,
	"adj_close" real,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "stock_prices_monthly_symbol_date_unique" UNIQUE("symbol","date")
);
--> statement-breakpoint
CREATE TABLE "stock_prices_weekly" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text,
	"date" timestamp NOT NULL,
	"high" real,
	"volume" bigint,
	"open" real,
	"low" real,
	"close" real,
	"adj_close" real,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "stock_prices_weekly_symbol_date_unique" UNIQUE("symbol","date")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"hashed_password" text DEFAULT 'unset' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "fortunes" ADD CONSTRAINT "fortunes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ADD CONSTRAINT "stock_prices_daily_symbol_instruments_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."instruments"("symbol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ADD CONSTRAINT "stock_prices_monthly_symbol_instruments_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."instruments"("symbol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ADD CONSTRAINT "stock_prices_weekly_symbol_instruments_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."instruments"("symbol") ON DELETE no action ON UPDATE no action;