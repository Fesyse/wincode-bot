import { days, type Lesson } from "@/db/schema"
import { type Context } from "@/types"
import * as fs from "fs"
import { Input } from "telegraf"

const MINUTE = 60
const attentionImage = fs.readFileSync("./assets/attention.png")

export function autopost(options: { ctx: Context; lessons: Lesson[] }) {
  const { ctx, lessons } = options

  // Object to track notification states for each lesson
  const notificationStates: Record<
    string,
    { notifiedStart: boolean; notifiedBefore: boolean }
  > = {}

  const interval = setInterval(() => {
    const now = new Date()
    const currentDay = days[(now.getDay() + 6) % 7]

    // Filter lessons for today
    const todayLessons = lessons.filter(lesson => lesson.day === currentDay)

    todayLessons.forEach(async lesson => {
      const [hours, minutes] = lesson.startTime.split(":").map(Number)
      const lessonStartTime = new Date(now)
      lessonStartTime.setHours(hours, minutes, 0, 0) // Set lesson start time

      // Calculate time differences
      const timeDiff = (lessonStartTime.getTime() - now.getTime()) / 1000 / 60 // Difference in minutes
      const thirtyMinutesBeforeDiff = timeDiff + 30 // Time difference for 30 minutes before

      // Initialize notification state for this lesson if not set
      if (!notificationStates[lesson.id]) {
        notificationStates[lesson.id] = {
          notifiedStart: false,
          notifiedBefore: false
        }
      }

      // Notify when it's 30 minutes before the lesson starts
      if (
        thirtyMinutesBeforeDiff <= 0 &&
        thirtyMinutesBeforeDiff > -1 &&
        !notificationStates[lesson.id].notifiedBefore
      ) {
        await ctx.sendPhoto(Input.fromBuffer(attentionImage))
        ctx.replyWithHTML(
          `Напоминаю вам, что у нас занятие начнется через 30 минут в ${lesson.startTime}! 
P.S. Если прочитали данное сообщение поставьте 🔥`
        )
        notificationStates[lesson.id].notifiedBefore = true // Mark as notified for before the lesson
      }

      // Notify when the lesson starts
      if (
        timeDiff <= 0 &&
        timeDiff > -1 &&
        !notificationStates[lesson.id].notifiedStart
      ) {
        ctx.replyWithHTML(`Занятие уже началось! 🎉`)
        notificationStates[lesson.id].notifiedStart = true // Mark as notified for the start of the lesson
      }

      // Reset notification states after the lesson ends (optional)
      if (timeDiff < -1) {
        delete notificationStates[lesson.id] // Remove state for this lesson to allow notifications for future lessons
      }
    })
  }, MINUTE * 1000) // Check every minute

  return interval
}
