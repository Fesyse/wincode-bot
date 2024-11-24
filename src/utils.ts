import { type Context } from "@/types"

export const checkAdmin = (ctx: Context) => {
  if (
    ("message" in ctx.update && ctx.update.message.chat.type !== "private") ||
    !ctx.session.admin
  )
    return ctx.reply("Эта команда доступна только для администраторов!")
}
