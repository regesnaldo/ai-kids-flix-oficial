ALTER TABLE users ADD COLUMN password varchar(255) DEFAULT '' NULL;
ALTER TABLE users MODIFY COLUMN openId varchar(64) NULL;
ALTER TABLE users MODIFY COLUMN subscriptionPlan ENUM('FREE','BASIC','PREMIUM','FAMILY') DEFAULT 'FREE';
ALTER TABLE users MODIFY COLUMN subscriptionStatus ENUM('active','canceled','past_due','trialing') DEFAULT 'active';