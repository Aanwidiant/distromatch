ALTER TABLE "distros" RENAME COLUMN "ux_experience_rating" TO "ux_rating";--> statement-breakpoint
ALTER TABLE "surveys" RENAME COLUMN "q1_ux_experience" TO "q1_ux";--> statement-breakpoint
ALTER TABLE "surveys" RENAME COLUMN "q2_ux_experience" TO "q2_ux";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "dominator_ux_experience" TO "dominator_ux";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "positive_ux_experience" TO "positive_ux";--> statement-breakpoint
ALTER TABLE "topsis_meta" RENAME COLUMN "negative_ux_experience" TO "negative_ux";--> statement-breakpoint
ALTER TABLE "weight_survey" RENAME COLUMN "ux_experience_weight" TO "ux_weight";