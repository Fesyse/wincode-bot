import { autopost } from "@/autoposting"
import { db } from "@/db"
import { Context } from "@/types"
import { checkAdmin } from "@/utils"

export const startAutoposting = async (
  ctx: Context,
  autopostings: Map<string, NodeJS.Timeout>
) => {
  const chat = ctx.update.message.chat
  if (chat.type === "private")
    return ctx.reply("Эта команда доступна только в группах!")

  if (autopostings.has(chat.id.toString()))
    return ctx.reply("Авто-оповещение уже включено!")

  const group = await db.query.groups.findFirst({
    with: {
      lessons: true
    },
    where: (groupTable, { eq }) => eq(groupTable.id, chat.id.toString())
  })

  if (!group)
    return ctx.replyWithHTML(
      "Сначала создайте группу с помощью команды <code>/start</code>!"
    )

  if (group.lessons.length === 0)
    return ctx.reply(
      "В группе нет лекций, добавьте их в панели управления ботом!"
    )

  const autoposting = autopost({
    groupId: group.id,
    lessons: group.lessons,
    ctx
  })

  autopostings.set(chat.id.toString(), autoposting)

  ctx.reply("Авто-оповещение включено!")
}

export const startAutopostingAll = async (
  ctx: Context,
  autopostings: Map<string, NodeJS.Timeout>
) => {
  if (checkAdmin(ctx)) return

  const groups = await db.query.groups.findMany({
    with: {
      lessons: true
    }
  })
  console.log("START AUTOPOSTING ALL")
  console.log(groups)

  groups.forEach(async group => {
    if (group.lessons.length === 0) return

    const autoposting = autopost({
      groupId: group.id,
      lessons: group.lessons,
      ctx
    })

    autopostings.set(group.id, autoposting)
  })

  ctx.reply("Авто-оповещение включено для всех групп!")
}

export const stopAutoposting = (
  ctx: Context,
  autopostings: Map<string, NodeJS.Timeout>
) => {
  const chat = ctx.update.message.chat
  if (chat.type === "private")
    return ctx.reply("Эта команда доступна только в группах!")

  const message = ctx.update.message

  const chatId = message.chat.id.toString()
  const posting = autopostings.get(chatId)

  if (!posting) return ctx.replyWithHTML("Авто-оповещение не включено!")

  clearInterval(posting)
  autopostings.delete(chatId)

  ctx.reply("Авто-оповещение отключено!")
}

export const stopAutopostingAll = async (
  ctx: Context,
  autopostings: Map<string, NodeJS.Timeout>
) => {
  autopostings.forEach(interval => clearInterval(interval))

  ctx.reply("Авто-оповещение отключено для всех групп!")
  autopostings.clear()
}
