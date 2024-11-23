import { Markup } from "telegraf"

export const adminActions = () => {
  return Markup.inlineKeyboard([
		Markup.button.callback("📝 Добавить лекцию", "add_lesson"),
		Markup.button.callback("📅 Показать все группы", "show_groups"),
		Markup.button.callback("🔐 Изменить пароль", "change_password"),
    Markup.button.callback("🚪 Выйти", "logout"),
  ], { columns: 2 })
}
