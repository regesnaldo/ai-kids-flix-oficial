import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";

export const AGE_GROUPS = ["3-5", "6-8", "9-12"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const TRACKS = ["ciencia", "tecnologia", "arte", "filosofia", "matematica"] as const;
export type TrackId = (typeof TRACKS)[number];

export const explorers = mysqlTable("explorers", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  ageGroup: varchar("age_group", { length: 10 }).notNull().$type<AgeGroup>(),
  track: varchar("track", { length: 50 }).notNull().$type<TrackId>(),
  videoUrl: varchar("video_url", { length: 500 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});
