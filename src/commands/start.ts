import { db } from "@/db"
import { groups } from "@/db/schema"
import { adminActions } from "@/layout/admin-actions"
import { Context } from "@/types"
import { Markup } from "telegraf"

export const start = async (ctx: Context) => {
  const chat = ctx.update.message.chat

  if (chat.type !== "private") {
    const group = await db.query.groups.findFirst({
      where: (groupTable, { eq }) => eq(groupTable.id, chat.id.toString())
    })

    if (group) return ctx.replyWithHTML("У вас уже создана группа!")

    await db.insert(groups).values({
      id: chat.id.toString(),
      name: "title" in chat ? chat.title : "UNTITLED"
    })

    return ctx.replyWithHTML(
      "Создана новая группа, теперь добавьте лекции в чат с помощью команды <code>/add_lesson</code> в панели управления ботом."
    )
  }

  // Admin
  if (!ctx.session.admin) {
    ctx.session = {}

    return ctx.reply(
      "Здравствуйте, это панель управления ботом, если вы не администратор - можете удалить этот чат.",
      Markup.inlineKeyboard([Markup.button.callback("🚪 Войти", "login")], {
        columns: 1
      })
    )
  }

  ctx.reply("Здравствуйте, это панель управления ботом.", adminActions())
}
