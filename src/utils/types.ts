import { NarrowedContext } from 'telegraf'
import { Message, Update, Poll } from 'telegraf/types'
import { SceneContext, SceneSessionData } from 'telegraf/scenes'

import { PollQueries } from '../data-source'

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any

export type FindPollResult = AsyncReturnType<PollQueries['get']>
export type FullPoll = NonNullable<FindPollResult>

export type BaseMsgContext<TMsg extends Message = Message> = NarrowedContext<
  SceneContext<SceneSessionData>,
  Update.MessageUpdate<TMsg>
>

export type FullMsgContext = BaseMsgContext<Message & { poll: Poll }>
export type PartialMsgContext = BaseMsgContext<Message & { poll?: Poll }>
export type PollContext = NarrowedContext<
  SceneContext<SceneSessionData>,
  Update.PollAnswerUpdate
>
