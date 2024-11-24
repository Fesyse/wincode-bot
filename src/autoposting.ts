import { type Context } from "@/types"
import { days, type Lesson } from "./db/schema"

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

    todayLessons.forEach(lesson => {
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
        // ctx.replyWithPhoto()
        ctx.replyWithHTML(
          `Лекция началась!\nНачало: <b>${lesson.startTime}</b> | Конец: <b>${lesson.endTime}</b>`
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
