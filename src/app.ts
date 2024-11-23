import { db } from "@/db"
import { env } from "@/env"
import { Markup, Telegraf } from 'telegraf'
import LocalSession from "telegraf-session-local"
import { login } from "./auth"
import { autopost } from "./autoposting"
import { groups } from "./db/schema"
import { adminActions } from "./layout/admin-actions"
import { Session } from "./types"

export const bot = new Telegraf(env.BOT_TOKEN) 
const sessions = new LocalSession({ database: "session_db.json" })
const autopostings = new Map<string, NodeJS.Timeout>()

bot.use(sessions.middleware())

bot.start(async ctx => {
	const chat = ctx.update.message.chat

	if (chat.type !== "private") {
		const group = await db.query.groups.findFirst({
			where: (groupTable, { eq }) => eq(groupTable.id, chat.id.toString()),
		})
	
		if (group) return ctx.replyWithHTML("У вас уже создана группа!")
	
		await db.insert(groups).values({
			id: chat.id.toString(),
			name: "title" in chat ? chat.title : "UNTITLED",
		})
	
		return ctx.replyWithHTML("Создана новая группа, теперь добавьте лекции в чат с помощью команды <code>/add_lesson</code>.")
	}

	// Admin
	if (!ctx.session.admin) {
		ctx.session.type = undefined
		ctx.session.username = undefined
		ctx.session.password = undefined

		return ctx.reply("Здравствуйте, это панель управления ботом, если вы не администратор - можете удалить этот чат.", 
			Markup.inlineKeyboard([
				Markup.button.callback("🚪 Войти", "login")], 
				{ columns: 1 }
			)
		)
	}

	ctx.reply("Здравствуйте, это панель управления ботом.", adminActions())
})

// Autoposting

bot.command("start_autoposting", async ctx => {
	const chat = ctx.update.message.chat
	const group = await db.query.groups.findFirst({
		with: {
			lessons: true
		},
		where: (groupTable, { eq }) => eq(groupTable.id, chat.id.toString()),
	})

	if (!group) 
		return ctx.replyWithHTML("Сначала создайте группу с помощью команды <code>/start</code>!")

	if (group.lessons.length === 0) 
		return ctx.replyWithHTML("В группе нет лекций, добавьте лекции с помощью команды <code>/add_lesson</code>!")

	const autoposting = autopost({
		ctx,
		lessons: group.lessons,
	})

	autopostings.set(chat.id.toString(), autoposting)

	ctx.reply("Авто-оповещение включено!")
})

bot.command("stop_autoposting", ctx => {
	const message = ctx.update.message

	const chatId = message.chat.id.toString()
	const posting = autopostings.get(chatId)
	
	if (!posting) 
		return ctx.replyWithHTML("Авто-оповещение не включено!")
	
	clearInterval(posting)
	autopostings.delete(chatId)

	ctx.reply("Авто-оповещение отключено!")
})

// Admin commands

bot.action("login", ctx => {	
console.log(ctx)

	if ("message" in ctx.update && ctx.update.message.chat.type !== "private")
		return ctx.reply("Эта команда доступна только для администраторов!")

	ctx.session.type = "login_username"
	ctx.reply("Введите логин: ")
})

bot.command("add_lesson", ctx => {
	if ("message" in ctx.update && ctx.update.message.chat.type !== "private")
		return ctx.reply("Эта команда доступна только для администраторов!")
})

bot.on("text", async ctx => {
	const session = (ctx as unknown as { session: Session }).session

	if (session.type === "login_username") {
		ctx.session.username = ctx.message.text
		
		ctx.reply("Введите пароль: ")
		ctx.session.type = "login_password"
	} else if (session.type === "login_password") {
		ctx.deleteMessage(ctx.message.message_id)
		ctx.reply("......")

		login({
			username: session.username!,
			password: ctx.message.text,
		}, ctx)
	}
})

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Bot Launch
bot.launch();

