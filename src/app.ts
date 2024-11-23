import { db } from "@/db"
import { env } from "@/env"
import { Telegraf } from 'telegraf'
import { autopost } from "./autoposting"
import { groups } from "./db/schema"

const postings = new Map<string, NodeJS.Timeout>()

const bot = new Telegraf(env.BOT_TOKEN)

bot.start(async ctx => {
	const chat = ctx.update.message.chat
	const group = await db.query.groups.findFirst({
		where: (groupTable, { eq }) => eq(groupTable.id, chat.id.toString()),
	})

	if (group) return ctx.replyWithHTML("У вас уже создана группа!")

	await db.insert(groups).values({
		id: chat.id.toString(),
		name: "title" in chat ? chat.title : "UNTITLED",
	})

	return ctx.replyWithHTML("Создана новая группа, теперь добавьте лекции в чат с помощью команды <code>/add_lesson</code>.")
})

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

	const posting = autopost({
		ctx,
		lessons: group.lessons,
	})

	postings.set(chat.id.toString(), posting)

	ctx.reply("Авто-оповещение включено!")
})

bot.command("stop_autoposting", ctx => {
	const message = ctx.update.message

	const chatId = message.chat.id.toString()
	const posting = postings.get(chatId)
	
	if (!posting) 
		return ctx.replyWithHTML("Авто-оповещение не включено!")
	
	clearInterval(posting)
	postings.delete(chatId)

	ctx.reply("Авто-оповещение отключено!")
})

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Bot Launch
bot.launch();

