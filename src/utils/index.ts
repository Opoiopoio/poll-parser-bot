import { Context, NarrowedContext } from 'telegraf'
import { Update, Message, Poll } from 'telegraf/types'
export * from './data-validation.facade'
export * from './inline-keyboard'

type PollUpdate =
  | Update.PollUpdate
  | Update.MessageUpdate<Message & { poll?: Poll }>
type PollMessage<C extends Context> = NarrowedContext<
  C,
  Update.MessageUpdate<Message & { poll: Poll }>
>

export const extractPoll = <C extends Context>(
  ctx: NarrowedContext<C, PollUpdate>
): PollMessage<C> | undefined =>
  ctx.message?.poll ? (ctx as unknown as PollMessage<C>) : undefined
