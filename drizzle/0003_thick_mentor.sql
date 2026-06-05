CREATE TABLE `logos_attempts` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`episode_id` varchar(36) NOT NULL,
	`agent_id` varchar(50) NOT NULL,
	`questions` json NOT NULL,
	`answers` json NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`passed` boolean NOT NULL DEFAULT false,
	`attempt_number` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `logos_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `narrative_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`episode_id` varchar(100),
	`agent_id` varchar(100),
	`choice_id` varchar(100) NOT NULL,
	`choice_label` varchar(255) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `narrative_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `universe_transitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`from_agent` varchar(100) NOT NULL,
	`to_agent` varchar(100) NOT NULL,
	`reason` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `universe_transitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`user_id` int NOT NULL,
	`emotional_dim` decimal(3,2) NOT NULL DEFAULT '0.50',
	`intellectual_dim` decimal(3,2) NOT NULL DEFAULT '0.50',
	`moral_dim` decimal(3,2) NOT NULL DEFAULT '0.50',
	`archetype_label` varchar(64),
	`last_agent_id` varchar(100),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `uq_up_user` UNIQUE(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `blog_posts` MODIFY COLUMN `generated_by` varchar(50) DEFAULT 'groq';--> statement-breakpoint
ALTER TABLE `narrative_decisions` ADD CONSTRAINT `narrative_decisions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `universe_transitions` ADD CONSTRAINT `universe_transitions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_nd_user` ON `narrative_decisions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_nd_user_episode` ON `narrative_decisions` (`user_id`,`episode_id`);--> statement-breakpoint
CREATE INDEX `idx_ut_user` ON `universe_transitions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_ut_user_from` ON `universe_transitions` (`user_id`,`from_agent`);--> statement-breakpoint
CREATE INDEX `idx_ut_user_to` ON `universe_transitions` (`user_id`,`to_agent`);