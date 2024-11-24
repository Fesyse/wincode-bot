import { db } from "@/db"
import { type Context } from "@/types"
import { verify } from "argon2"
import { adminActions } from "./layout/admin-actions"

export const login = async (
  user: { username: string; password: string },
  ctx: Context
) => {
  const userFromDb = await db.query.adminUsers.findFirst({
    where: (userTable, { eq }) => eq(userTable.username, user.username)
  })

  if (!userFromDb || !verify(userFromDb.password, user.password)) {
    ctx.session.type = undefined
    ctx.session.username = undefined

    return ctx.reply("Неверный логин или пароль!")
  }

  ctx.session.admin = true
  ctx.session.adminId = userFromDb.id

  ctx.reply("Вы авторизованы!")
  ctx.reply("Панель управления", adminActions())
}
