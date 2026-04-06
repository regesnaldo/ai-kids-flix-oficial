CREATE TABLE `agent_combinations` (
	`id` varchar(36) NOT NULL,
	`agent_a_id` varchar(100) NOT NULL,
	`agent_b_id` varchar(100) NOT NULL,
	`tipo_sinergia` enum('amplificacao','contrabalanco','fusao','especializacao') NOT NULL DEFAULT 'amplificacao',
	`sinergia_bonus` int NOT NULL DEFAULT 0,
	`xp_bonus` int NOT NULL DEFAULT 0,
	`descricao` text,
	`requisitos_desbloqueio` json,
	`ativa` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_combinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_combination_par` UNIQUE(`agent_a_id`,`agent_b_id`)
);
--> statement-breakpoint
CREATE TABLE `agent_metadata` (
	`agent_id` varchar(100) NOT NULL,
	`temporada` int NOT NULL DEFAULT 1,
	`ordem_na_temporada` int NOT NULL DEFAULT 0,
	`fase` int NOT NULL DEFAULT 1,
	`categoria` enum('fundamentos','linguagens','criacao','inovacao','ferramentas','colaborativos') NOT NULL DEFAULT 'fundamentos',
	`tags` json,
	`dificuldade` int NOT NULL DEFAULT 1,
	`xp_por_interacao` int NOT NULL DEFAULT 15,
	`xp_por_concluir` int NOT NULL DEFAULT 100,
	`bloqueado_por_padrao` boolean NOT NULL DEFAULT false,
	`requisitos_desbloqueio` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_metadata_agent_id` PRIMARY KEY(`agent_id`)
);
--> statement-breakpoint
CREATE TABLE `agent_notes` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`agent_id` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userMessage` text NOT NULL,
	`botResponse` text NOT NULL,
	`context` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`seriesId` int NOT NULL,
	`seasonNumber` int NOT NULL,
	`episodeNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`duration` int DEFAULT 0,
	`videoUrl` varchar(500),
	`thumbnail` varchar(500),
	`releaseDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `episodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`seriesId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `interactiveDecisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`episodeId` int NOT NULL,
	`seriesId` int NOT NULL,
	`choiceId` varchar(100) NOT NULL,
	`choiceLabel` varchar(255) NOT NULL,
	`narrativeResponse` text,
	`graphState` json,
	`decisionPath` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interactiveDecisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`avatar` varchar(20) DEFAULT 'blue',
	`ageGroup` enum('kids-4-6','kids-7-9','kids-10-12','teens-13','adults-18') NOT NULL DEFAULT 'adults-18',
	`isKids` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`image` varchar(500),
	`category` varchar(100) NOT NULL,
	`rating` decimal(3,1) DEFAULT '0',
	`totalSeasons` int DEFAULT 50,
	`totalEpisodes` int DEFAULT 500,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `series_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_agent_progress` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`agent_id` varchar(100) NOT NULL,
	`desbloqueado` boolean NOT NULL DEFAULT false,
	`desbloqueado_em` timestamp,
	`interacoes_total` int NOT NULL DEFAULT 0,
	`notas_total` int NOT NULL DEFAULT 0,
	`xp_ganho` int NOT NULL DEFAULT 0,
	`nivel_interacao` int NOT NULL DEFAULT 0,
	`completado_em` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_agent_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_user_agent_progress` UNIQUE(`user_id`,`agent_id`)
);
--> statement-breakpoint
CREATE TABLE `user_combinations` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`combination_id` varchar(36) NOT NULL,
	`descoberta_em` timestamp NOT NULL DEFAULT (now()),
	`vezes_usada` int NOT NULL DEFAULT 1,
	`ultimo_uso_em` timestamp DEFAULT (now()),
	CONSTRAINT `user_combinations_id` PRIMARY KEY(`id`),
	CONSTRAINT `uq_user_combination` UNIQUE(`user_id`,`combination_id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`themeMode` enum('kids','teens','adults') NOT NULL DEFAULT 'kids',
	`language` varchar(10) DEFAULT 'pt-BR',
	`notificationsEnabled` boolean DEFAULT true,
	`autoPlayEnabled` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `userProfile` (
	`userId` int NOT NULL,
	`dimensaoEmocional` int NOT NULL DEFAULT 0,
	`dimensaoIntelectual` int NOT NULL DEFAULT 0,
	`dimensaoMoral` int NOT NULL DEFAULT 0,
	`agentHistory` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfile_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_xp` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`xp_total` int DEFAULT 0,
	`xp_this_week` int DEFAULT 0,
	`streak_days` int DEFAULT 0,
	`last_activity_date` varchar(10),
	`week_start_date` varchar(10),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_xp_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64),
	`name` text,
	`email` varchar(320),
	`password` varchar(255) DEFAULT '',
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`subscriptionPlan` enum('FREE','BASIC','PREMIUM','FAMILY') DEFAULT 'FREE',
	`subscriptionStatus` enum('active','canceled','past_due','trialing') DEFAULT 'active',
	`subscriptionEndDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `watchProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`seriesId` int NOT NULL,
	`episodeId` int NOT NULL,
	`seasonNumber` int NOT NULL,
	`episodeNumber` int NOT NULL,
	`progressSeconds` int DEFAULT 0,
	`totalSeconds` int DEFAULT 0,
	`isCompleted` boolean DEFAULT false,
	`lastWatchedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `watchProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `explorer_decisions` ADD CONSTRAINT `explorer_decisions_explorer_id_explorers_id_fk` FOREIGN KEY (`explorer_id`) REFERENCES `explorers`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `explorer_progress` ADD CONSTRAINT `explorer_progress_explorer_id_explorers_id_fk` FOREIGN KEY (`explorer_id`) REFERENCES `explorers`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user_agent_progress` ADD CONSTRAINT `user_agent_progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_combinations` ADD CONSTRAINT `user_combinations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_combinations` ADD CONSTRAINT `user_combinations_combination_id_agent_combinations_id_fk` FOREIGN KEY (`combination_id`) REFERENCES `agent_combinations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userProfile` ADD CONSTRAINT `userProfile_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_comb_agent_a` ON `agent_combinations` (`agent_a_id`);--> statement-breakpoint
CREATE INDEX `idx_comb_agent_b` ON `agent_combinations` (`agent_b_id`);--> statement-breakpoint
CREATE INDEX `idx_comb_sinergia` ON `agent_combinations` (`tipo_sinergia`);--> statement-breakpoint
CREATE INDEX `idx_agent_temporada` ON `agent_metadata` (`temporada`);--> statement-breakpoint
CREATE INDEX `idx_agent_categoria` ON `agent_metadata` (`categoria`);--> statement-breakpoint
CREATE INDEX `idx_agent_fase` ON `agent_metadata` (`fase`);--> statement-breakpoint
CREATE INDEX `idx_uap_user_desbloqueado` ON `user_agent_progress` (`user_id`,`desbloqueado`);--> statement-breakpoint
CREATE INDEX `idx_uap_agent_interacoes` ON `user_agent_progress` (`agent_id`,`interacoes_total`);--> statement-breakpoint
CREATE INDEX `idx_uc_user_uso` ON `user_combinations` (`user_id`,`vezes_usada`);--> statement-breakpoint
CREATE INDEX `idx_uc_combo_uso` ON `user_combinations` (`combination_id`,`vezes_usada`);
