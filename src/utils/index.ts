import { Context, NarrowedContext } from 'telegraf'
import { Update, Message, Poll } from 'telegraf/types'

type PollUpdate =
  | Update.PollUpdate
  | Update.MessageUpdate<Message & { poll?: Poll }>
type PollMessage = Update.MessageUpdate<Message & { poll: Poll }>

export const extractPoll = (
  ctx: NarrowedContext<Context<Update>, PollUpdate>
): PollMessage | undefined =>
  ctx.message?.poll ? (ctx as unknown as PollMessage) : undefined
