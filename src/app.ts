// @ts-nocheck

import {
  addLesson,
  changePassword,
  enterLogin,
  handleAddLesson,
  handleLogin,
  handleShowGroup,
  logout,
  showGroup,
  start,
  startAutoposting,
  startAutopostingAll,
  stopAutoposting,
  stopAutopostingAll
} from "@/actions"
import { env } from "@/env"
import { Telegraf } from "telegraf"
import LocalSession from "telegraf-session-local"

const autopostings = new Map<string, NodeJS.Timeout>()
const bot = new Telegraf(env.BOT_TOKEN)
const sessions = new LocalSession({ database: "session_db.json" })

bot.use(sessions.middleware())

bot.start(start)

// Autoposting
bot.command("start_autoposting_all", ctx =>
  startAutopostingAll(ctx, autopostings)
)
bot.command("stop_autoposting_all", ctx =>
  stopAutopostingAll(ctx, autopostings)
)
bot.command("start_autoposting", ctx => startAutoposting(ctx, autopostings))
bot.command("stop_autoposting", ctx => stopAutoposting(ctx, autopostings))

// Admin commands

// Auth
bot.action("login", enterLogin)
bot.action("logout", logout)
bot.action("change_password", changePassword)

// Groups | Lessons
bot.action("add_lesson", addLesson)
bot.action("show_groups", showGroup)
bot.action("start_autoposting_all", ctx =>
  startAutopostingAll(ctx, autopostings)
)
bot.action("stop_autoposting_all", ctx => stopAutopostingAll(ctx, autopostings))

bot.on("text", async ctx => {
  handleLogin(ctx)
  handleShowGroup(ctx)
  handleAddLesson(ctx)
})

process.once("SIGINT", () => {
  bot.stop("SIGINT")
  autopostings.forEach(interval => clearInterval(interval))
})
process.once("SIGTERM", () => {
  bot.stop("SIGTERM")
  autopostings.forEach(interval => clearInterval(interval))
})

// Bot Launch
bot.launch()
