import { db } from "@/db"
import { type Context } from "@/types"
import { hash, verify } from "argon2"
import { eq } from "drizzle-orm"
import { adminUsers } from "./db/schema"
import { adminActions } from "./layout/admin-actions"

export const login = async (
  user: { username: string; password: string },
  ctx: Context
) => {
  const userFromDb = await db.query.adminUsers.findFirst({
    where: (userTable, { eq }) => eq(userTable.username, user.username)
  })

  if (!userFromDb || !(await verify(userFromDb.password, user.password))) {
    ctx.session.type = undefined
    ctx.session.username = undefined

    return ctx.reply("Неверный логин или пароль!")
  }

  ctx.session.type = undefined
  ctx.session.admin = true
  ctx.session.adminId = userFromDb.id

  ctx.reply("Вы авторизованы!")
  ctx.reply("Панель управления", adminActions())
}

export const changePassword = async (
  user: { username: string; password: string },
  ctx: Context
) => {
  const newPassword = await hash(user.password)

  try {
    await db
      .update(adminUsers)
      .set({ password: newPassword })
      .where(eq(adminUsers.id, ctx.session.adminId!))
    ctx.reply("Пароль успешно изменен!")
  } catch {
    ctx.reply("Произошла ошибка при изменении пароля!")
  }
}
