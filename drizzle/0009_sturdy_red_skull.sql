DROP INDEX "idx_rankings_dss_run";--> statement-breakpoint
DROP INDEX "idx_rankings_position";--> statement-breakpoint
CREATE INDEX "idx_rankings_run_rank" ON "rankings" USING btree ("dss_run_id","rank_position");