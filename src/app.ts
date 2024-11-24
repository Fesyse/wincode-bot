// @ts-nocheck

import {
  addLession,
  changePassword,
  enterLogin,
  handleAddLesson,
  handleLogin,
  handleShowGroup,
  logout,
  showGroup,
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

// Auth
bot.action("login", enterLogin)
bot.action("logout", logout)
bot.action("change_password", changePassword)

// Groups | Lessons
bot.action("add_lesson", addLession)
bot.action("show_groups", showGroup)

bot.on("text", async ctx => {
  handleLogin(ctx)
  handleShowGroup(ctx)
  handleAddLesson(ctx)
})

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

// Bot Launch
bot.launch()
