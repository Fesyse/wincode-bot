import { createId as cuid } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { integer, pgTable, varchar } from "drizzle-orm/pg-core"

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
type timeType = `${number}:${number}`

export const groups = pgTable("group", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
})

export const lessons = pgTable("lesson", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(cuid),
	day: varchar("day", { length: 255, enum: days }).notNull(),
	startTime: varchar("start_time", { length: 255 }).$type<timeType>().notNull(),
	endTime: varchar("end_time", { length: 255 }).$type<timeType>().notNull(),
  groupId: integer("group_id").references(() => groups.id).notNull(),
})

export const groupsRelations = relations(groups, ({ many }) => ({
	lessons: many(lessons),
}))

export const lessonsRelations = relations(lessons, ({ one }) => ({
  group: one(groups, {
    fields: [lessons.groupId],
    references: [groups.id],
  }),
}))
