import { type Group } from "@/db/schema"
import { Markup } from "telegraf"

export const groupsNavigation = (groups: Group[]) => {
  return Markup.inlineKeyboard(groups.map(group => {
    return Markup.button.callback(`📅 ${group.name}`, "show_group", )
  }),
}