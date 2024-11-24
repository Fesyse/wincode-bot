import { days, type Lesson } from "@/db/schema"
import { type Context } from "@/types"
import * as fs from "fs"
import { Input } from "telegraf"

const MINUTE = 60

export function autopost(options: { ctx: Context; lessons: Lesson[] }) {
  const { ctx, lessons } = options

  // Object to track notification states for each lesson
  const notificationStates: Record<string, boolean> = {}

  const interval = setInterval(() => {
    const now = new Date()
    const currentDay = days[(now.getDay() + 6) % 7]

    // Filter lessons for today
    const todayLessons = lessons.filter(lesson => lesson.day === currentDay)

    todayLessons.forEach(async lesson => {
      const [hours, minutes] = lesson.startTime.split(":").map(Number)
      const lessonStartTime = new Date(now)
      lessonStartTime.setHours(hours, minutes, 0, 0) // Set lesson start time

      const timeDiff = (lessonStartTime.getTime() - now.getTime()) / 1000 / 60 // Difference in minutes

      // Initialize notification state for this lesson if not set
      if (!notificationStates[lesson.id]) {
        notificationStates[lesson.id] = false // false means not notified yet
      }

      // Notify when the lesson starts
      if (timeDiff <= 0 && timeDiff > -1 && !notificationStates[lesson.id]) {
        await ctx.sendPhoto(
          Input.fromBuffer(fs.readFileSync("./assets/attention.png"))
        )
        ctx.replyWithHTML(
          `Добрый день, ребят. Напоминаю вам, что у нас занятие в ${lesson.startTime})! 
P.S. Если прочитали данное сообщение поставьте 🔥`
        )
        notificationStates[lesson.id] = true // Mark as notified
      }

      // Reset notification state after the lesson ends (optional)
      if (timeDiff < -1) {
        notificationStates[lesson.id] = false // Allow notifications for future lessons
      }
    })
  }, MINUTE * 1000) // Check every minute

  return interval
}
