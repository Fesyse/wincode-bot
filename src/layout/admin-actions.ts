import { Markup } from "telegraf"

export const adminActions = () => {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback(
        "🚀 Включить авто-оповещение для всех групп",
        "start_autoposting_all"
      ),
      Markup.button.callback(
        "🚀 Выключить авто-оповещение для всех групп",
        "stop_autoposting_all"
      ),
      Markup.button.callback("📝 Добавить лекцию", "add_lesson"),
      Markup.button.callback("📅 Показать все группы", "show_groups"),
      Markup.button.callback("🔐 Изменить пароль", "change_password"),
      Markup.button.callback("🚪 Выйти", "logout")
    ],
    { columns: 2 }
  )
}
