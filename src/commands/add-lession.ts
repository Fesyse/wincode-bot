import { db } from "@/db"
import type { Context } from "@/types"
import { Markup } from "telegraf"

export const addLession = async (ctx: Context) => {
  if (
    ("message" in ctx.update && ctx.update.message.chat.type !== "private") ||
    !ctx.session.admin
  )
    return ctx.reply("Эта команда доступна только для администраторов!")

  const user = await db.query.adminUsers.findFirst({
    where: (userTable, { eq }) => eq(userTable.id, ctx.session.adminId!)
  })
  if (!user)
    return ctx.reply("Эта команда доступна только для администраторов!")

  const groups = await db.query.groups.findMany()

  ctx.reply(
    "Выберите группу: ",
    Markup.keyboard(groups.map(group => Markup.button.text(group.name)))
  )
}
