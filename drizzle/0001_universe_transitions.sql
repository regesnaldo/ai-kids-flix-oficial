CREATE TABLE IF NOT EXISTS `universeTransitions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `episodeId` int NOT NULL DEFAULT 0,
  `seriesId` int NOT NULL DEFAULT 0,
  `fromAgent` varchar(100) NOT NULL,
  `toAgent` varchar(100) NOT NULL,
  `reason` varchar(80) NOT NULL,
  `transitionNarrative` text,
  `metadata` json,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `universeTransitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_universeTransitions_user_createdAt` ON `universeTransitions` (`userId`,`createdAt`);
