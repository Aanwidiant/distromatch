ALTER TABLE "topsis_meta" RENAME COLUMN "dominator_ux" TO "denominator_ux";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "dominator_performance" TO "denominator_performance";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "dominator_stability" TO "denominator_stability";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "dominator_features" TO "denominator_features";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "dominator_support" TO "denominator_support";--> statement-breakpoint
ALTER TABLE "bayesian_results" ALTER COLUMN "shrinkage_coefficient" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "bayesian_results" ALTER COLUMN "confidence_adjusted_score" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "penalty_results" ALTER COLUMN "distance" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "penalty_results" ALTER COLUMN "distance_normalized" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "penalty_results" ALTER COLUMN "utility_score" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "system_settings" ALTER COLUMN "lambda_param" SET DEFAULT '-0.5';--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_ux" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_ux" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_performance" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_performance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_stability" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_stability" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_features" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_features" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_support" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "positive_support" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_ux" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_ux" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_performance" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_performance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_stability" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_stability" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_features" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_features" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_support" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_meta" ALTER COLUMN "negative_support" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "normalized_ux" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "normalized_performance" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "normalized_stability" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "normalized_features" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "normalized_support" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "weighted_ux" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "weighted_performance" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "weighted_stability" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "weighted_features" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "weighted_support" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "distance_ideal_positive" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "distance_ideal_negative" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "topsis_result" ALTER COLUMN "cc_score" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "ux_weight" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "performance_weight" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "stability_weight" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "features_weight" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "support_weight" SET DATA TYPE numeric(14, 10);--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_rankings_run_position" ON "rankings" USING btree ("dss_run_id","rank_position");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_surveys_run" ON "surveys" USING btree ("dss_run_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_weight_survey_run" ON "weight_survey" USING btree ("dss_run_id");--> statement-breakpoint
ALTER TABLE "rankings" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "weight_survey" DROP COLUMN "updated_at";