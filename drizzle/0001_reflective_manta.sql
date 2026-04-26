ALTER TABLE "distros" ADD COLUMN "ux_experience_rating" numeric(3, 2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "distros" DROP COLUMN "ux_rating";