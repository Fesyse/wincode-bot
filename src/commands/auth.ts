import { changePassword, login } from "@/auth"
import { type Context } from "@/types"
import { Markup } from "telegraf"
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
  } else if (ctx.session.type === "change_password") {
    await ctx.deleteMessage(ctx.message.message_id)
    await Promise.all([
      ctx.reply("......"),
      changePassword(
        {
          username: ctx.session.username!,
          password: ctx.message.text
        },
        ctx
      )
    ])
  }
}

export const logout = async (ctx: Context) => {
  ctx.session.type = undefined
  ctx.session.username = undefined
  ctx.session.admin = undefined
  ctx.session.adminId = undefined

  await ctx.reply("Вы успешно вышли из админки!")
  return ctx.reply(
    "Здравствуйте, это панель управления ботом, если вы не администратор - можете удалить этот чат.",
    Markup.inlineKeyboard([Markup.button.callback("🚪 Войти", "login")], {
      columns: 1
    })
  )
}
