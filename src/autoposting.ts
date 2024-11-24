import { type Context } from "@/types"
import { days, type Lesson } from "./db/schema"

const MINUTE = 60

export function autopost(options: { ctx: Context; lessons: Lesson[] }) {
  const { ctx, lessons } = options

  const interval = setInterval(() => {
    const lesson = lessons.find(lesson => {
      const now = new Date()
      // returning if current day is not the same as the lesson day
      if (now.getDay() !== days.indexOf(lesson.day) + 1) return false

      const [hours, minutes] = lesson.startTime.split(":").map(Number)

      const currentHour = now.getHours()
      const currentMinutes = now.getMinutes()

      const time = hours * 60 * 60 + minutes * 60
      const currentTime = currentHour * 60 * 60 + currentMinutes * 60

      // checking if lesson is about to start (15 minutes before)
      if (time - currentTime >= MINUTE * 15) return true
      else return false
    })

    if (lesson)
      ctx.replyWithHTML(
        `Лекция скоро начнется!\nНачало: <b>${lesson.startTime}</b> | Конец: <b>${lesson.endTime}</b>`
      )
  }, MINUTE * 5)

  return interval
}
