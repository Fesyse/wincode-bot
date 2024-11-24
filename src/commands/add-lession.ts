import { Context } from "@/types"

export const addLession = (ctx: Context) => {
  if ("message" in ctx.update && ctx.update.message.chat.type !== "private")
    return ctx.reply("Эта команда доступна только для администраторов!")
}
