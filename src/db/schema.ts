import { createId as cuid } from "@paralleldrive/cuid2"
import { relations } from "drizzle-orm"
import { pgTable, varchar } from "drizzle-orm/pg-core"

export const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
type timeType = `${number}:${number}` // HH:MM

export const adminUsers = pgTable("admin_user", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(cuid),
  username: varchar("username", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
})

export const groups = pgTable("group", {
  id: varchar("id", { length: 255 }).primaryKey(), // telegram chat id
  name: varchar("name", { length: 255 }).notNull(),
})

export const lessons = pgTable("lesson", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(cuid),
	day: varchar("day", { length: 255, enum: days }).notNull(),
	startTime: varchar("start_time", { length: 255 }).$type<timeType>().notNull(),
	endTime: varchar("end_time", { length: 255 }).$type<timeType>().notNull(),

  groupId: varchar("group_id", { length: 255 }).references(() => groups.id).notNull(),
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

export type Group = typeof groups.$inferSelect
export type Lesson = typeof lessons.$inferSelect
