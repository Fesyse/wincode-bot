// @ts-nocheck

import {
  addLession,
  changePassword,
  enterLogin,
  handleAddLesson,
  handleLogin,
  logout,
  start,
  startAutoposting,
  stopAutoposting
} from "@/actions"
import { env } from "@/env"
import { Telegraf } from "telegraf"
import LocalSession from "telegraf-session-local"

const bot = new Telegraf(env.BOT_TOKEN)
const sessions = new LocalSession({ database: "session_db.json" })

bot.use(sessions.middleware())

bot.start(start)

// Autoposting

bot.command("start_autoposting", startAutoposting)
bot.command("stop_autoposting", stopAutoposting)

// Admin commands

bot.action("login", enterLogin)
bot.action("logout", logout)
bot.action("change_password", changePassword)

bot.on("text", async ctx => {
  handleLogin(ctx)
  // handleShowGroup
  handleAddLesson(ctx)
})

bot.action("add_lesson", addLession)

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

// Bot Launch
bot.launch()
