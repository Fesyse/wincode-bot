import { db } from "@/db"
import { env } from "@/env"
import { Telegraf } from 'telegraf'
import { autopost } from "./autoposting"
import { groups } from "./db/schema"

const bot = new Telegraf(env.BOT_TOKEN)

bot.start(async ctx => {
	const chat = ctx.update.message.chat
	let group = await db.query.groups.findFirst({
		with: {
			lessons: true
		},
		where: (groupTable, { eq }) => eq(groupTable.id, chat.id.toString()),
	})

	if (!group) {
		const newGroup = await db.insert(groups).values({
				id: chat.id.toString(),
				name: "title" in chat ? chat.title : "",
			}).returning()
				.then(r => r[0])

			group = { ...newGroup, lessons: [] }

			return ctx.replyWithHTML("Создана новая группа, теперь добавьте лекции в чат с помощью команды <code>/add_lesson</code>.")
		}
	
	const posting = autopost({
		ctx,
		lessons: group.lessons,
	})

	ctx.reply("asd")
})

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Bot Launch
bot.launch();

