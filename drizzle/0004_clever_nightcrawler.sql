CREATE TABLE `explorer_decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`explorer_id` int NOT NULL,
	`content_id` varchar(100) NOT NULL,
	`track` enum('tech','science','arts','math','philosophy') NOT NULL,
	`pillars` json NOT NULL,
	`decision_type` varchar(80) NOT NULL,
	`payload` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `explorer_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `explorer_progress` (
	`explorer_id` int NOT NULL,
	`content_id` varchar(100) NOT NULL,
	`track` enum('tech','science','arts','math','philosophy') NOT NULL,
	`watched_percentage` int NOT NULL DEFAULT 0,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `explorer_progress_explorer_id_content_id_pk` PRIMARY KEY(`explorer_id`,`content_id`)
);
--> statement-breakpoint
CREATE TABLE `explorers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(191) NOT NULL,
	`ai_knowledge_level` enum('leigo','intermediario','avancado') NOT NULL DEFAULT 'leigo',
	`age_group` enum('kids-4-6','kids-7-9','kids-10-12','teens-13','adults-18','all-ages') NOT NULL DEFAULT 'all-ages',
	`track` enum('tech','science','arts','math','philosophy') NOT NULL DEFAULT 'tech',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `explorers_id` PRIMARY KEY(`id`),
	CONSTRAINT `explorers_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `explorer_decisions` ADD CONSTRAINT `explorer_decisions_explorer_id_explorers_id_fk` FOREIGN KEY (`explorer_id`) REFERENCES `explorers`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `explorer_progress` ADD CONSTRAINT `explorer_progress_explorer_id_explorers_id_fk` FOREIGN KEY (`explorer_id`) REFERENCES `explorers`(`id`) ON DELETE cascade ON UPDATE cascade;