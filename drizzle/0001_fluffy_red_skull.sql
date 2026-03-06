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
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`seriesId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
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
