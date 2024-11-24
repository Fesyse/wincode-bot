import { type Group } from "@/db/schema"
import { type Context } from "@/types"
import { Markup } from "telegraf"

export const groupsNavigation = (groups: Group[], ctx: Context) => {
  return Markup.keyboard(
    groups.map(group => Markup.button.text(`${group.name} | ${group.id}`)),
    { columns: 4 }
  ).oneTime()
}
