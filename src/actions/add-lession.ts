import { db } from "@/db"
import { type days, lessons, type TimeType } from "@/db/schema"
import type { Context, Session } from "@/types"
import { checkAdmin, daysTranslationsRussianToEnglish } from "@/utils"
import { Markup } from "telegraf"

export const addLession = async (ctx: Context) => {
  if (checkAdmin(ctx)) return

  const groups = await db.query.groups.findMany()

  ctx.reply(
    "Выберите группу: ",
    Markup.keyboard(
      groups.map(group => Markup.button.text(`${group.name} | ${group.id}`)),
      {
        columns: 4
      }
    )
  )
  ctx.session.type = "add_lesson"
}

export const handleAddLesson = async (ctx: Context) => {
  if (ctx.session.type === "add_lesson") {
    const groupId = ctx.message.text.split("|")[1].trim()

    ctx.session.type = "add_lesson__day"
    ctx.session.lesson = {
      groupId
    }

    ctx.reply(
      "Выберите день: ",
      Markup.keyboard(
        [
          Markup.button.text("Понедельник"),
          Markup.button.text("Вторник"),
          Markup.button.text("Среда"),
          Markup.button.text("Четверг"),
          Markup.button.text("Пятница"),
          Markup.button.text("Суббота"),
          Markup.button.text("Воскресенье")
        ],
        { columns: 4 }
      ).oneTime()
    )
  } else if (ctx.session.type === "add_lesson__day") {
    const day = daysTranslationsRussianToEnglish[
      ctx.message.text.toLowerCase()
    ] as (typeof days)[number]
    ctx.session.lesson = {
      ...ctx.session.lesson,
      day
    }

    ctx.reply("Напишите время начала лекции в формате HH:MM")
    ctx.session.type = "add_lesson__start_time"
  } else if (ctx.session.type === "add_lesson__start_time") {
    const startTime = ctx.message.text as TimeType
    ctx.session.lesson = {
      ...ctx.session.lesson,
      startTime
    }

    ctx.reply("Напишите время окончания лекции в формате HH:MM")
    ctx.session.type = "add_lesson__end_time"
  } else if (ctx.session.type === "add_lesson__end_time") {
    const endTime = ctx.message.text as TimeType
    ctx.session.lesson = {
      ...ctx.session.lesson,
      endTime
    }

    const lesson = ctx.session.lesson as Required<
      NonNullable<Session["lesson"]>
    >
    await db.insert(lessons).values({
      // @ts-expect-error day is correct type
      day: lesson.day,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      groupId: lesson.groupId
    })

    ctx.reply("Лекция успешно добавлена!")
  }
}
