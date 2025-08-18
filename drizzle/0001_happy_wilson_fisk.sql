CREATE TABLE "stock_prices_daily" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text,
	"date" timestamp NOT NULL,
	"high" real NOT NULL,
	"volume" integer NOT NULL,
	"open" real NOT NULL,
	"low" real NOT NULL,
	"close" real NOT NULL,
	"adj_close" real NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_prices_monthly" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text,
	"date" timestamp NOT NULL,
	"high" real NOT NULL,
	"volume" integer NOT NULL,
	"open" real NOT NULL,
	"low" real NOT NULL,
	"close" real NOT NULL,
	"adj_close" real NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_prices_weekly" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text,
	"date" timestamp NOT NULL,
	"high" real NOT NULL,
	"volume" integer NOT NULL,
	"open" real NOT NULL,
	"low" real NOT NULL,
	"close" real NOT NULL,
	"adj_close" real NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "stock_prices_daily" ADD CONSTRAINT "stock_prices_daily_symbol_instruments_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."instruments"("symbol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_prices_monthly" ADD CONSTRAINT "stock_prices_monthly_symbol_instruments_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."instruments"("symbol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_prices_weekly" ADD CONSTRAINT "stock_prices_weekly_symbol_instruments_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."instruments"("symbol") ON DELETE no action ON UPDATE no action;