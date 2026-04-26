CREATE TABLE "dss_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "topsis_meta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dss_run_id" uuid NOT NULL,
	"dominator_ux_experience" numeric(10, 6) NOT NULL,
	"dominator_performance" numeric(10, 6) NOT NULL,
	"dominator_stability" numeric(10, 6) NOT NULL,
	"dominator_features" numeric(10, 6) NOT NULL,
	"dominator_support" numeric(10, 6) NOT NULL,
	"positive_ux_experience" numeric(10, 6) NOT NULL,
	"positive_performance" numeric(10, 6) NOT NULL,
	"positive_stability" numeric(10, 6) NOT NULL,
	"positive_features" numeric(10, 6) NOT NULL,
	"positive_support" numeric(10, 6) NOT NULL,
	"negative_ux_experience" numeric(10, 6) NOT NULL,
	"negative_performance" numeric(10, 6) NOT NULL,
	"negative_stability" numeric(10, 6) NOT NULL,
	"negative_features" numeric(10, 6) NOT NULL,
	"negative_support" numeric(10, 6) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bayesian_results" RENAME COLUMN "user_id" TO "dss_run_id";--> statement-breakpoint
ALTER TABLE "penalty_results" RENAME COLUMN "user_id" TO "dss_run_id";--> statement-breakpoint
ALTER TABLE "rankings" RENAME COLUMN "user_id" TO "dss_run_id";--> statement-breakpoint
ALTER TABLE "surveys" RENAME COLUMN "user_id" TO "dss_run_id";--> statement-breakpoint
ALTER TABLE "topsis_result" RENAME COLUMN "user_id" TO "dss_run_id";--> statement-breakpoint
ALTER TABLE "topsis_result" RENAME COLUMN "normalized_value" TO "normalized_ux";--> statement-breakpoint
ALTER TABLE "topsis_result" RENAME COLUMN "weighted_value" TO "normalized_performance";--> statement-breakpoint
ALTER TABLE "bayesian_results" DROP CONSTRAINT "bayesian_results_user_id_distro_id_unique";--> statement-breakpoint
ALTER TABLE "penalty_results" DROP CONSTRAINT "penalty_results_user_id_distro_id_unique";--> statement-breakpoint
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_user_id_distro_id_unique";--> statement-breakpoint
ALTER TABLE "surveys" DROP CONSTRAINT "surveys_user_id_unique";--> statement-breakpoint
ALTER TABLE "topsis_result" DROP CONSTRAINT "topsis_result_user_id_distro_id_unique";--> statement-breakpoint
ALTER TABLE "weight_survey" DROP CONSTRAINT "weight_survey_user_id_unique";--> statement-breakpoint
ALTER TABLE "bayesian_results" DROP CONSTRAINT "bayesian_results_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "penalty_results" DROP CONSTRAINT "penalty_results_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "surveys" DROP CONSTRAINT "surveys_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "topsis_result" DROP CONSTRAINT "topsis_result_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "weight_survey" DROP CONSTRAINT "weight_survey_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "idx_bayesian_user";--> statement-breakpoint
DROP INDEX "idx_penalty_user";--> statement-breakpoint
DROP INDEX "idx_rankings_user_position";--> statement-breakpoint
DROP INDEX "idx_surveys_user";--> statement-breakpoint
DROP INDEX "idx_topsis_user";--> statement-breakpoint
DROP INDEX "idx_weight_survey_user";--> statement-breakpoint
ALTER TABLE "system_settings" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "normalized_stability" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "normalized_features" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "normalized_support" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "weighted_ux" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "weighted_performance" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "weighted_stability" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "weighted_features" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "topsis_result" ADD COLUMN "weighted_support" numeric(6, 4);--> statement-breakpoint
ALTER TABLE "weight_survey" ADD COLUMN "dss_run_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "dss_runs" ADD CONSTRAINT "dss_runs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topsis_meta" ADD CONSTRAINT "topsis_meta_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_dss_runs_user" ON "dss_runs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_topsis_meta_run" ON "topsis_meta" USING btree ("dss_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_topsis_meta_run" ON "topsis_meta" USING btree ("dss_run_id");--> statement-breakpoint
ALTER TABLE "bayesian_results" ADD CONSTRAINT "bayesian_results_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalty_results" ADD CONSTRAINT "penalty_results_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topsis_result" ADD CONSTRAINT "topsis_result_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weight_survey" ADD CONSTRAINT "weight_survey_dss_run_id_dss_runs_id_fk" FOREIGN KEY ("dss_run_id") REFERENCES "public"."dss_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bayesian_dss_run" ON "bayesian_results" USING btree ("dss_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_bayesian_run_distro" ON "bayesian_results" USING btree ("dss_run_id","distro_id");--> statement-breakpoint
CREATE INDEX "idx_penalty_dss_run" ON "penalty_results" USING btree ("dss_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_penalty_run_distro" ON "penalty_results" USING btree ("dss_run_id","distro_id");--> statement-breakpoint
CREATE INDEX "idx_rankings_dss_run" ON "rankings" USING btree ("dss_run_id");--> statement-breakpoint
CREATE INDEX "idx_rankings_position" ON "rankings" USING btree ("rank_position");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_rankings_run_distro" ON "rankings" USING btree ("dss_run_id","distro_id");--> statement-breakpoint
CREATE INDEX "idx_surveys_dss_run" ON "surveys" USING btree ("dss_run_id");--> statement-breakpoint
CREATE INDEX "idx_topsis_dss_run" ON "topsis_result" USING btree ("dss_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_topsis_run_distro" ON "topsis_result" USING btree ("dss_run_id","distro_id");--> statement-breakpoint
CREATE INDEX "idx_weight_survey_dss_run" ON "weight_survey" USING btree ("dss_run_id");--> statement-breakpoint
ALTER TABLE "weight_survey" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "weight_survey" DROP COLUMN "total_weight";