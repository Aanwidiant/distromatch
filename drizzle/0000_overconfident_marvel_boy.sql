CREATE TYPE "public"."distro_level" AS ENUM('Beginner Friendly', 'Intermediate Experience Required', 'Advanced Experience Required');--> statement-breakpoint
CREATE TYPE "public"."distro_status" AS ENUM('ACTIVE', 'INACTIVE', 'DEPRECATED');--> statement-breakpoint
CREATE TYPE "public"."system_setting_status_enum" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "bayesian_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"distro_id" integer NOT NULL,
	"shrinkage_coefficient" numeric(5, 4) NOT NULL,
	"confidence_adjusted_score" numeric(6, 4) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "bayesian_results_user_id_distro_id_unique" UNIQUE("user_id","distro_id")
);
--> statement-breakpoint
CREATE TABLE "distros" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"logo" varchar(255),
	"homepage_url" varchar(255),
	"docs_url" text[],
	"total_reviews" integer DEFAULT 0,
	"ux_rating" numeric(3, 2),
	"performance_rating" numeric(3, 2),
	"stability_rating" numeric(3, 2),
	"features_rating" numeric(3, 2),
	"support_rating" numeric(3, 2),
	"target_user_level" "distro_level" NOT NULL,
	"distro_type" text[],
	"based_on" text[],
	"origin_country" text[],
	"architectures" text[],
	"desktop_environments" text[],
	"categories" text[],
	"status" "distro_status" DEFAULT 'ACTIVE',
	"description" text,
	"source_url" text[],
	"taken_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "distros_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "penalty_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"distro_id" integer NOT NULL,
	"distance" integer NOT NULL,
	"distance_normalized" numeric(3, 2) NOT NULL,
	"penalty_value" numeric(6, 4) NOT NULL,
	"utility_score" numeric(6, 4) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "penalty_results_user_id_distro_id_unique" UNIQUE("user_id","distro_id")
);
--> statement-breakpoint
CREATE TABLE "rankings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"distro_id" integer NOT NULL,
	"rank_position" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rankings_user_id_distro_id_unique" UNIQUE("user_id","distro_id")
);
--> statement-breakpoint
CREATE TABLE "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"q1_ux_experience" integer NOT NULL,
	"q2_ux_experience" integer NOT NULL,
	"q3_performance" integer NOT NULL,
	"q4_performance" integer NOT NULL,
	"q5_stability" integer NOT NULL,
	"q6_stability" integer NOT NULL,
	"q7_features" integer NOT NULL,
	"q8_features" integer NOT NULL,
	"q9_support" integer NOT NULL,
	"q10_support" integer NOT NULL,
	"q11_level_pref" integer NOT NULL,
	"q12_level_pref" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "surveys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"lambda_param" numeric(3, 2) DEFAULT '0.5' NOT NULL,
	"max_distance" integer DEFAULT 2 NOT NULL,
	"median_reviews" integer,
	"total_distros" integer DEFAULT 30 NOT NULL,
	"top_n_recommendations" integer DEFAULT 5 NOT NULL,
	"status" "system_setting_status_enum" DEFAULT 'ACTIVE',
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_settings_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "topsis_result" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"distro_id" integer NOT NULL,
	"normalized_value" numeric(6, 4),
	"weighted_value" numeric(6, 4),
	"distance_ideal_positive" numeric(6, 4),
	"distance_ideal_negative" numeric(6, 4),
	"cc_score" numeric(6, 4) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "topsis_result_user_id_distro_id_unique" UNIQUE("user_id","distro_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"photo" text,
	"role" "user_role" DEFAULT 'USER',
	"status" "user_status" DEFAULT 'ACTIVE',
	"refresh_token" text,
	"session_expired_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "weight_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"ux_experience_weight" numeric(5, 4) NOT NULL,
	"performance_weight" numeric(5, 4) NOT NULL,
	"stability_weight" numeric(5, 4) NOT NULL,
	"features_weight" numeric(5, 4) NOT NULL,
	"support_weight" numeric(5, 4) NOT NULL,
	"total_weight" numeric(5, 4) NOT NULL,
	"user_pref_score" integer NOT NULL,
	"user_pref_level" "distro_level" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "weight_survey_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "bayesian_results" ADD CONSTRAINT "bayesian_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bayesian_results" ADD CONSTRAINT "bayesian_results_distro_id_distros_id_fk" FOREIGN KEY ("distro_id") REFERENCES "public"."distros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalty_results" ADD CONSTRAINT "penalty_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "penalty_results" ADD CONSTRAINT "penalty_results_distro_id_distros_id_fk" FOREIGN KEY ("distro_id") REFERENCES "public"."distros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_distro_id_distros_id_fk" FOREIGN KEY ("distro_id") REFERENCES "public"."distros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topsis_result" ADD CONSTRAINT "topsis_result_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topsis_result" ADD CONSTRAINT "topsis_result_distro_id_distros_id_fk" FOREIGN KEY ("distro_id") REFERENCES "public"."distros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weight_survey" ADD CONSTRAINT "weight_survey_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bayesian_user" ON "bayesian_results" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_bayesian_distro" ON "bayesian_results" USING btree ("distro_id");--> statement-breakpoint
CREATE INDEX "idx_bayesian_confidence" ON "bayesian_results" USING btree ("confidence_adjusted_score");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_distros_name" ON "distros" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_distros_status" ON "distros" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_distros_target_level" ON "distros" USING btree ("target_user_level");--> statement-breakpoint
CREATE INDEX "idx_penalty_user" ON "penalty_results" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_penalty_distro" ON "penalty_results" USING btree ("distro_id");--> statement-breakpoint
CREATE INDEX "idx_penalty_utility" ON "penalty_results" USING btree ("utility_score");--> statement-breakpoint
CREATE INDEX "idx_rankings_user_position" ON "rankings" USING btree ("user_id","rank_position");--> statement-breakpoint
CREATE INDEX "idx_rankings_distro" ON "rankings" USING btree ("distro_id");--> statement-breakpoint
CREATE INDEX "idx_surveys_user" ON "surveys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_settings_status" ON "system_settings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_settings_updated_by" ON "system_settings" USING btree ("updated_by");--> statement-breakpoint
CREATE INDEX "idx_topsis_user" ON "topsis_result" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_topsis_distro" ON "topsis_result" USING btree ("distro_id");--> statement-breakpoint
CREATE INDEX "idx_topsis_cc" ON "topsis_result" USING btree ("cc_score");--> statement-breakpoint
CREATE INDEX "idx_weight_survey_user" ON "weight_survey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_weight_survey_pref_level" ON "weight_survey" USING btree ("user_pref_level");