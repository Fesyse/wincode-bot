import { changePassword, login } from "@/auth"
import { type Context } from "@/types"
import { checkAdmin } from "@/utils"
import { Markup } from "telegraf"

export const enterLogin = (ctx: Context) => {
  if (checkAdmin(ctx)) return

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
  ctx.session = {}

  await ctx.reply("Вы успешно вышли из админки!")
  return ctx.reply(
    "Здравствуйте, это панель управления ботом, если вы не администратор - можете удалить этот чат.",
    Markup.inlineKeyboard([Markup.button.callback("🚪 Войти", "login")], {
      columns: 1
    })
  )
}
