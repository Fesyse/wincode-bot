import { Context } from "@/types"

export const changePassword = async (ctx: Context) => {
  if (
    ("message" in ctx.update && ctx.update.message.chat.type !== "private") ||
    !ctx.session.admin
  )
    return ctx.reply("Эта команда доступна только для администраторов!")

  ctx.session.type = "change_password"
  ctx.reply("Введите новый пароль: ")
}
