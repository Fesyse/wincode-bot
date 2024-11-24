import type { NarrowedContext, Context as TelegrafContext } from "telegraf"
import type { Message, Update } from "typegram"

export type Session = {
  type?: "login_username" | "login_password" | "add_lesson"
  username?: string
  adminId?: string
  admin?: boolean
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
