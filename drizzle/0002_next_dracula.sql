CREATE TABLE `universe_progression` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`completed` json,
	`active_planet` varchar(50),
	`available` json,
	`active_hints` json,
	`last_progression_at` timestamp DEFAULT (now()),
	`total_completed` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `universe_progression_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_up_user` UNIQUE(`user_id`)
);
--> statement-breakpoint
DROP INDEX `idx_cm_tags` ON `content_metadata`;--> statement-breakpoint
ALTER TABLE `universe_progression` ADD CONSTRAINT `universe_progression_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_up_active_planet` ON `universe_progression` (`active_planet`);