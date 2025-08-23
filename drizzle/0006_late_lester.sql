-- Convert created_at from text to timestamp with proper casting
-- First, update any existing text values to proper timestamp format
UPDATE "fortunes" 
SET "created_at" = CASE 
  WHEN "created_at" ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}' THEN "created_at"::timestamp
  WHEN "created_at" ~ '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}' THEN "created_at"::timestamp
  WHEN "created_at" ~ '^\d{4}-\d{2}-\d{2}$' THEN ("created_at" || ' 00:00:00')::timestamp
  ELSE now()
END;

-- Now alter the column type to timestamp
ALTER TABLE "fortunes" ALTER COLUMN "created_at" TYPE timestamp USING "created_at"::timestamp;--> statement-breakpoint

-- Set the default value
ALTER TABLE "fortunes" ALTER COLUMN "created_at" SET DEFAULT now();