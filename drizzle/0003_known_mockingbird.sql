CREATE TYPE "public"."auth_provider" AS ENUM('SYSTEM', 'GOOGLE');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" "auth_provider" DEFAULT 'SYSTEM' NOT NULL;