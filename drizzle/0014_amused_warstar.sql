ALTER TABLE "system_settings" RENAME COLUMN "median_reviews" TO "prior_count";--> statement-breakpoint
ALTER TABLE "system_settings" ADD COLUMN "scale" numeric(5, 3) DEFAULT '1.000' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_rankings_run_position" ON "rankings" USING btree ("dss_run_id","rank_position");