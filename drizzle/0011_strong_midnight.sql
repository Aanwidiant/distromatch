ALTER TABLE "distros" ALTER COLUMN "target_user_level" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "user_pref_level" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."distro_level";--> statement-breakpoint
CREATE TYPE "public"."distro_level" AS ENUM('Advanced Experience Required', 'Intermediate Experience Required', 'Beginner Friendly');--> statement-breakpoint
ALTER TABLE "distros" ALTER COLUMN "target_user_level" SET DATA TYPE "public"."distro_level" USING "target_user_level"::"public"."distro_level";--> statement-breakpoint
ALTER TABLE "weight_survey" ALTER COLUMN "user_pref_level" SET DATA TYPE "public"."distro_level" USING "user_pref_level"::"public"."distro_level";