CREATE TABLE `knowledge_asset` (
	`id` varchar(36) NOT NULL,
	`knowledge_unit_id` varchar(36) NOT NULL,
	`agent_id` varchar(32),
	`season` int,
	`episode` int,
	`type` enum('episode','quiz','video','audio','mission','image') NOT NULL,
	`content` json NOT NULL,
	`metadata` json,
	`source` enum('manual','deepseek','groq','hybrid') DEFAULT 'manual',
	`generated_by` varchar(64),
	`generated_at` timestamp,
	`version` int DEFAULT 1,
	`status` enum('draft','review','approved','published') DEFAULT 'draft',
	`cache_key` varchar(64),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_asset_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_graph_edge` (
	`id` varchar(36) NOT NULL,
	`from_unit_id` varchar(36) NOT NULL,
	`to_unit_id` varchar(36) NOT NULL,
	`relationship` enum('prerequisite','next','related','reinforces','expands') NOT NULL,
	`weight` real DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `knowledge_graph_edge_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_kge_edge` UNIQUE(`from_unit_id`,`to_unit_id`,`relationship`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_unit` (
	`id` varchar(36) NOT NULL,
	`title` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`learning_objective` text NOT NULL,
	`cognitive_level` enum('remember','understand','apply','analyze','evaluate','create') NOT NULL DEFAULT 'understand',
	`difficulty` varchar(16) DEFAULT 'beginner',
	`estimated_time_min` int,
	`skills` json,
	`tags` json,
	`agent_domain` varchar(32),
	`version` int DEFAULT 1,
	`status` enum('draft','review','approved','published') DEFAULT 'draft',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_unit_id` PRIMARY KEY(`id`),
	CONSTRAINT `knowledge_unit_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
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
CREATE TABLE `universe_presence` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`agent_id` varchar(50) NOT NULL,
	`last_seen` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `universe_presence_id` PRIMARY KEY(`id`)
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
CREATE INDEX `idx_ka_unit` ON `knowledge_asset` (`knowledge_unit_id`);--> statement-breakpoint
CREATE INDEX `idx_ka_series` ON `knowledge_asset` (`agent_id`,`season`,`episode`);--> statement-breakpoint
CREATE INDEX `idx_ka_type_status` ON `knowledge_asset` (`type`,`status`);--> statement-breakpoint
CREATE INDEX `idx_ka_cache` ON `knowledge_asset` (`cache_key`);--> statement-breakpoint
CREATE INDEX `idx_kge_from` ON `knowledge_graph_edge` (`from_unit_id`);--> statement-breakpoint
CREATE INDEX `idx_kge_to` ON `knowledge_graph_edge` (`to_unit_id`);--> statement-breakpoint
CREATE INDEX `idx_ku_cognitive` ON `knowledge_unit` (`cognitive_level`,`difficulty`);--> statement-breakpoint
CREATE INDEX `idx_ku_agent` ON `knowledge_unit` (`agent_domain`);--> statement-breakpoint
CREATE INDEX `idx_ku_status` ON `knowledge_unit` (`status`);--> statement-breakpoint
CREATE INDEX `idx_nd_user` ON `narrative_decisions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_nd_user_episode` ON `narrative_decisions` (`user_id`,`episode_id`);--> statement-breakpoint
CREATE INDEX `idx_ut_user` ON `universe_transitions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_ut_user_from` ON `universe_transitions` (`user_id`,`from_agent`);--> statement-breakpoint
CREATE INDEX `idx_ut_user_to` ON `universe_transitions` (`user_id`,`to_agent`);