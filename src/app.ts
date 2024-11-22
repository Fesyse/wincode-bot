import { env } from "@/env"
import { Telegraf } from 'telegraf'

const bot = new Telegraf(env.BOT_TOKEN)

bot.start(ctx => ctx.reply('Hello World!'))

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Bot Launch
bot.launch();

