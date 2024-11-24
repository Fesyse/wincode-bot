import { login } from "@/auth"
import { type Context } from "@/types"
import { Message } from "typegram"

export const enterLogin = (ctx: Context) => {
  if (
    "message" in ctx.update &&
    (ctx.update.message as Message).chat.type !== "private"
  )
    return ctx.reply("Эта команда доступна только для администраторов!")

  ctx.session.type = "login_username"
  ctx.reply("Введите логин: ")
}

export const handleLogin = async (ctx: Context) => {
  if (ctx.session.type === "login_username") {
    ctx.session.username = ctx.message.text

    ctx.reply("Введите пароль: ")
    ctx.session.type = "login_password"
  } else if (ctx.session.type === "login_password") {
    await ctx.deleteMessage(ctx.message.message_id)
    await Promise.all([
      ctx.reply("......"),
      login(
        {
          username: ctx.session.username!,
          password: ctx.message.text
        },
        ctx
      )
    ])
  }
}

export const logout = (ctx: Context) => {
  ctx.session.type = undefined
  ctx.session.username = undefined
  ctx.session.admin = undefined
  ctx.session.adminId = undefined

  ctx.reply("Вы успешно вышли из админки!")
}
