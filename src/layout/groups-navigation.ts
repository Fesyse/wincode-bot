import { type Group } from "@/db/schema"
import { Markup } from "telegraf"

export const groupsNavigation = (groups: Group[]) => {
  return Markup.keyboard(
    groups.map(group => Markup.button.text(`${group.name} | ${group.id}`))
  )
}
