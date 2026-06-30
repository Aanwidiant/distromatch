ALTER TABLE "system_settings" ALTER COLUMN "prior_count" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "system_settings" ALTER COLUMN "prior_count" SET DEFAULT '5.00';