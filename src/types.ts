import type { days } from "@/db/schema"
import type { NarrowedContext, Context as TelegrafContext } from "telegraf"
import type { Message, Update } from "typegram"

type AuthTypes = "login_username" | "login_password" | "change_password"
type LessonTypes =
  | "add_lesson"
  | "add_lesson__day"
  | "add_lesson__start_time"
  | "add_lesson__end_time"
type GroupTypes = "show_group"

export type Session = {
  type?: AuthTypes | LessonTypes | GroupTypes
  username?: string
  adminId?: string
  admin?: boolean

  lesson?: {
    day?: (typeof days)[number]
    startTime?: string
    endTime?: string
    groupId?: string
  }
}

export type Context = NarrowedContext<
  // @ts-expect-error somewhy it gives ts error, but it all fine
  TelegrafContext<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage
    update_id: number
  }
> & {
  session: Session
}
