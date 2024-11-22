import { createId as cuid } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { integer, pgTable, varchar } from "drizzle-orm/pg-core"

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const

export const groups = pgTable("group", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
})

export const lessons = pgTable("lesson", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(cuid),
	day: varchar("day", { length: 255, enum: days }).notNull(),
	startTime: varchar("start_time", { length: 255 }).notNull(),
	endTime: varchar("end_time", { length: 255 }).notNull(),
  groupId: integer("group_id").references(() => groups.id).notNull(),
})

export const groupsRelations = relations(groups, ({ many }) => ({
	lessons: many(lessons),
}))