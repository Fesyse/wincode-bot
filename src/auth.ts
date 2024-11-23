import { db } from "@/db"
import { verify } from "argon2"
import { Context } from "telegraf"

export const login = async (user: { username: string; password: string }, ctx: Context) => {
	const userFromDb = await db.query.adminUsers.findFirst({
		where: (userTable, { eq }) => eq(userTable.username, user.username),
	})

	if (!userFromDb) return ctx.reply("Неверный логин или пароль!")

	if (!(verify(userFromDb.password, user.password)))
		return ctx.reply("Неверный логин или пароль!")

	ctx.session.admin = true

	return ctx.reply("Вы авторизованы!")
}