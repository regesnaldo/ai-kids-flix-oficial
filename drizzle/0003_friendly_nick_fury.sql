ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionPlan` enum('BASIC','PREMIUM','FAMILY');--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','canceled','past_due','trialing');--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndDate` timestamp;