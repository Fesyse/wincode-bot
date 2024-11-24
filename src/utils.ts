import { type Context } from "@/types"

export const daysTranslationsRussianToEnglish: Record<string, string> = {
  понедельник: "monday",
  вторник: "tuesday",
  среда: "wednesday",
  четверг: "thursday",
  пятница: "friday",
  суббота: "saturday",
  воскресенье: "sunday"
}

export const daysTranslationsEnglishToRussian: Record<string, string> = {
  monday: "понедельник",
  tuesday: "вторник",
  wednesday: "среда",
  thursday: "четверг",
  friday: "пятница",
  saturday: "суббота",
  sunday: "воскресенье"
}

export const checkAdmin = (ctx: Context) => {
  if (
    ("message" in ctx.update && ctx.update.message.chat.type !== "private") ||
    !ctx.session.admin
  )
    return ctx.reply("Эта команда доступна только для администраторов!")
}

export const DMCheck = (ctx: Context) => {
  if (
    "message" in ctx.update &&
    (ctx.update.message as any).chat.type !== "private"
  )
    return ctx.reply("Эта команда доступна только для администраторов!")
}
