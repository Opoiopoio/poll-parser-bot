import { Update } from 'telegraf/types'
import { Context, NarrowedContext } from 'telegraf'

import { FindPollResult } from '../types'

export class PollValidation {
  public invoke(ctx: NarrowedContext<Context, Update>, poll: FindPollResult) {
    if (!poll) {
      return 'Нет статистики по опросу...'
    }
    const senderId = BigInt(ctx.from?.id ?? 0)
    if (
      poll.author_id !== senderId &&
      !poll.options.some((o) =>
        o.user_poll_options.some((upo) => upo.user_id === senderId)
      )
    ) {
      return 'Вы не являетесь автором или проголосовавшим'
    }
    if (poll.options.every((o) => !o.user_poll_options.length)) {
      return 'Нет статистики по опросу...'
    }
    return poll
  }
}
