import { db } from "@/db"
import { adminActions } from "@/layout/admin-actions"
import { groupsNavigation } from "@/layout/groups-navigation"
import type { Context } from "@/types"
import {
  capitalize,
  checkAdmin,
  daysTranslationsEnglishToRussian
} from "@/utils"

export const showGroup = async (ctx: Context) => {
  if (checkAdmin(ctx)) return

  const groups = await db.query.groups.findMany()

  ctx.session.type = "show_group"
  ctx.reply("Выберите группу: ", groupsNavigation(groups))
}

export const handleShowGroup = async (ctx: Context) => {
  if (ctx.session.type !== "show_group") return

  const groupId = ctx.message.text.split("|")[1].trim()

  const group = (await db.query.groups.findFirst({
    with: {
      lessons: true
    },
    where: (groupTable, { eq }) => eq(groupTable.id, groupId)
  }))!

  ctx.replyWithHTML(
    `<strong>Группа:</strong> ${group.name}
<strong>Кол-во лекций в неделю:</strong> ${group.lessons.length}\n` +
      group?.lessons
        .map(
          lesson => `
<strong>${capitalize(daysTranslationsEnglishToRussian[lesson.day])}</strong>
<strong>Начало:</strong> ${lesson.startTime}
<strong>Окончание:</strong> ${lesson.endTime}
`
        )
        .join("\n-----\n"),
    adminActions()
  )
}
