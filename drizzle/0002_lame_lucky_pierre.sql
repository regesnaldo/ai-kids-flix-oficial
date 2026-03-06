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
