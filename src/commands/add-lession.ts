import { db } from "@/db"
import type { Context } from "@/types"
import { checkAdmin } from "@/utils"
import { Markup } from "telegraf"

export const addLession = async (ctx: Context) => {
  if (checkAdmin(ctx)) return

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

export const handleAddLesson = async (ctx: Context) => {
  if (checkAdmin(ctx)) return
}
