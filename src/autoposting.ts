import { days, type Lesson } from "@/db/schema"
import { type Context } from "@/types"
import { TZDate } from "@date-fns/tz"
import * as fs from "fs"
import { Input } from "telegraf"

const MINUTE = 60
const attentionImage = fs.readFileSync("./assets/attention.png")

export function autopost(options: {
  ctx: Context
  groupId: string
  lessons: Lesson[]
}) {
  const { groupId, ctx, lessons } = options

  // Object to track notification states for each lesson
  const notificationStates: Record<
    string,
    { notifiedStart: boolean; notifiedBefore: boolean }
  > = {}

  const interval = setInterval(() => {
    const now = new TZDate(new Date(), "Asia/Irkutsk")
    const currentDay = days[(now.getDay() + 6) % 7]

    // Filter lessons for today
    const todayLessons = lessons.filter(lesson => lesson.day === currentDay)

    todayLessons.forEach(async lesson => {
      const [hours, minutes] = lesson.startTime.split(":").map(Number)
      const lessonStartTime = new TZDate(new Date(), "Asia/Irkutsk")
      lessonStartTime.setHours(hours, minutes, 0, 0) // Set lesson start time

      // Calculate time differences
      const timeDiff = (lessonStartTime.getTime() - now.getTime()) / 1000 / 60 // Difference in minutes

      const thirtyMinutesBeforeDiff = timeDiff - 30 // Time difference for 30 minutes before

      // Initialize notification state for this lesson if not set
      if (!notificationStates[lesson.id]) {
        notificationStates[lesson.id] = {
          notifiedStart: false,
          notifiedBefore: false
        }
      }

      // Notify when it's 30 minutes before the lesson starts
      if (
        thirtyMinutesBeforeDiff <= 1 &&
        thirtyMinutesBeforeDiff > -1 &&
        !notificationStates[lesson.id].notifiedBefore
      ) {
        await ctx.telegram.sendPhoto(groupId, Input.fromBuffer(attentionImage))
        ctx.telegram.sendMessage(
          groupId,
          `Напоминаю вам, что у нас занятие начнется через 30 минут в ${lesson.startTime}! 
P.S. Если прочитали данное сообщение поставьте 🔥`
        )
        notificationStates[lesson.id].notifiedBefore = true // Mark as notified for before the lesson
      }

      // Notify when the lesson starts
      if (
        timeDiff <= 1 &&
        timeDiff > -1 &&
        !notificationStates[lesson.id].notifiedStart
      ) {
        ctx.telegram.sendMessage(groupId, `Занятие уже началось! 🎉`)
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
