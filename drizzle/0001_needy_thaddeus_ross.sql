CREATE TABLE `ab_test_experiments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`test_type` enum('thumbnail','title','description','layout') NOT NULL,
	`series_id` int,
	`start_date` timestamp NOT NULL DEFAULT (now()),
	`end_date` timestamp,
	`min_sample_size` int DEFAULT 1000,
	`confidence_level` decimal(4,2) DEFAULT '95',
	`status` enum('running','completed','paused') DEFAULT 'running',
	`winner_variant` varchar(50),
	`significance` decimal(5,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ab_test_experiments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`summary` varchar(500),
	`content` text NOT NULL,
	`opening_scene` text,
	`category` varchar(100) NOT NULL,
	`agent_id` varchar(50),
	`agent_commentary` text,
	`interactive_pause` json,
	`age_rating` varchar(10) DEFAULT 'all',
	`xp_reward` int DEFAULT 5,
	`whatsapp_text` text,
	`generated_by` varchar(50) DEFAULT 'deepseek',
	`published_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `blog_reads` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`post_id` varchar(36) NOT NULL,
	`completed` boolean DEFAULT false,
	`choice_made` varchar(1),
	`xp_awarded` int DEFAULT 0,
	`read_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_reads_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_br_user_post` UNIQUE(`user_id`,`post_id`)
);
--> statement-breakpoint
CREATE TABLE `content_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`series_id` int NOT NULL,
	`match_base_score` decimal(5,2) DEFAULT '50',
	`maturity_rating` varchar(10) DEFAULT 'L',
	`difficulty` int DEFAULT 1,
	`tags` json,
	`genres` json,
	`moods` json,
	`primary_agents` json,
	`secondary_agents` json,
	`avg_completion_rate` decimal(5,2) DEFAULT '0',
	`avg_rating` decimal(3,1) DEFAULT '0',
	`total_interactions` int DEFAULT 0,
	`trend_score` decimal(5,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_metadata_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fraud_log` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`risk_score` int DEFAULT 0,
	`flagged_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fraud_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parent_controls` (
	`id` varchar(36) NOT NULL,
	`parent_id` int NOT NULL,
	`child_id` int NOT NULL,
	`time_limit_minutes` int DEFAULT 60,
	`allowed_categories` json,
	`pin` varchar(6),
	`weekly_report` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `parent_controls_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_pc_pair` UNIQUE(`parent_id`,`child_id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` varchar(36) NOT NULL,
	`referrer_id` int NOT NULL,
	`invited_id` int,
	`invited_email` varchar(320),
	`ip_address` varchar(45),
	`fingerprint` varchar(255),
	`valid` boolean DEFAULT false,
	`validated_at` timestamp,
	`validation_reason` varchar(255),
	`link_code` varchar(20),
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_link_code_unique` UNIQUE(`link_code`)
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`level` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`code` varchar(100),
	`claimed_at` timestamp,
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `thumbnail_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`series_id` int NOT NULL,
	`variant_name` varchar(50) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`segment` varchar(50),
	`age_group` varchar(20),
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`ctr` decimal(5,2) DEFAULT '0',
	`is_active` boolean DEFAULT true,
	`is_winner` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `thumbnail_variants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`series_id` int NOT NULL,
	`interaction_type` enum('impression','click','play','pause','complete','skip','bookmark','share','rate','search') NOT NULL,
	`thumbnail_variant_id` int,
	`source` varchar(50),
	`row_context` varchar(100),
	`watch_time_seconds` int DEFAULT 0,
	`rating` int,
	`device_type` enum('desktop','mobile','tablet','tv'),
	`user_agent` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `xp_events` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`amount` int NOT NULL,
	`reason` varchar(50) NOT NULL,
	`agent_id` varchar(50),
	`season` int,
	`episode` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `xp_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `agent_combinations` MODIFY COLUMN `requisitos_desbloqueio` json;--> statement-breakpoint
ALTER TABLE `agent_memories` MODIFY COLUMN `tags` json;--> statement-breakpoint
ALTER TABLE `agent_memories` MODIFY COLUMN `contexto` json;--> statement-breakpoint
ALTER TABLE `agent_metadata` MODIFY COLUMN `tags` json;--> statement-breakpoint
ALTER TABLE `agent_metadata` MODIFY COLUMN `requisitos_desbloqueio` json;--> statement-breakpoint
ALTER TABLE `blog_reads` ADD CONSTRAINT `blog_reads_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fraud_log` ADD CONSTRAINT `fraud_log_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parent_controls` ADD CONSTRAINT `parent_controls_parent_id_users_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parent_controls` ADD CONSTRAINT `parent_controls_child_id_users_id_fk` FOREIGN KEY (`child_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_referrer_id_users_id_fk` FOREIGN KEY (`referrer_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_invited_id_users_id_fk` FOREIGN KEY (`invited_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rewards` ADD CONSTRAINT `rewards_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `xp_events` ADD CONSTRAINT `xp_events_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_ab_status` ON `ab_test_experiments` (`status`);--> statement-breakpoint
CREATE INDEX `idx_ab_type` ON `ab_test_experiments` (`test_type`);--> statement-breakpoint
CREATE INDEX `idx_bp_slug` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_bp_cat` ON `blog_posts` (`category`);--> statement-breakpoint
CREATE INDEX `idx_bp_pub` ON `blog_posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `idx_br_user` ON `blog_reads` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_cm_series` ON `content_metadata` (`series_id`);--> statement-breakpoint
CREATE INDEX `idx_cm_tags` ON `content_metadata` (`tags`);--> statement-breakpoint
CREATE INDEX `idx_cm_match` ON `content_metadata` (`match_base_score`);--> statement-breakpoint
CREATE INDEX `idx_fl_user` ON `fraud_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_fl_score` ON `fraud_log` (`risk_score`);--> statement-breakpoint
CREATE INDEX `idx_ref_referrer` ON `referrals` (`referrer_id`);--> statement-breakpoint
CREATE INDEX `idx_ref_invited` ON `referrals` (`invited_id`);--> statement-breakpoint
CREATE INDEX `idx_ref_link` ON `referrals` (`link_code`);--> statement-breakpoint
CREATE INDEX `idx_ref_valid` ON `referrals` (`valid`);--> statement-breakpoint
CREATE INDEX `idx_rwd_user` ON `rewards` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_rwd_level` ON `rewards` (`level`);--> statement-breakpoint
CREATE INDEX `idx_tv_series` ON `thumbnail_variants` (`series_id`);--> statement-breakpoint
CREATE INDEX `idx_tv_segment` ON `thumbnail_variants` (`segment`);--> statement-breakpoint
CREATE INDEX `idx_tv_winner` ON `thumbnail_variants` (`is_winner`);--> statement-breakpoint
CREATE INDEX `idx_ui_user` ON `user_interactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_ui_series` ON `user_interactions` (`series_id`);--> statement-breakpoint
CREATE INDEX `idx_ui_type` ON `user_interactions` (`interaction_type`);--> statement-breakpoint
CREATE INDEX `idx_ui_thumbnail` ON `user_interactions` (`thumbnail_variant_id`);--> statement-breakpoint
CREATE INDEX `idx_ui_user_date` ON `user_interactions` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_xpe_user` ON `xp_events` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_xpe_user_date` ON `xp_events` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_xpe_reason` ON `xp_events` (`reason`);