import { env } from "@/env"
import { Telegraf } from "telegraf"
import LocalSession from "telegraf-session-local"
import { addLession } from "./commands/add-lession"
import { enterLogin, handleLogin } from "./commands/auth"
import { startAutoposting, stopAutoposting } from "./commands/autoposting"
import { start } from "./commands/start"
import { Context } from "./types"

export const bot = new Telegraf(env.BOT_TOKEN)
const sessions = new LocalSession({ database: "session_db.json" })

bot.use(sessions.middleware())

bot.start(ctx => start(ctx as unknown as Context))

// Autoposting

bot.command("start_autoposting", ctx =>
  startAutoposting(ctx as unknown as Context)
)
bot.command("stop_autoposting", ctx =>
  stopAutoposting(ctx as unknown as Context)
)

// Admin commands

bot.action("login", ctx => enterLogin(ctx as unknown as Context))
bot.on("text", async context => {
  handleLogin(context as unknown as Context)
})

bot.command("add_lesson", ctx => addLession(ctx as unknown as Context))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

// Bot Launch
bot.launch()
