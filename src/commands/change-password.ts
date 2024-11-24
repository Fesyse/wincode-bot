import { type Context } from "@/types"
import { checkAdmin } from "@/utils"

export const changePassword = async (ctx: Context) => {
  if (checkAdmin(ctx)) return

  ctx.session.type = "change_password"
  ctx.reply("Введите новый пароль: ")
}
