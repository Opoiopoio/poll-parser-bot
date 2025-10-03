import { Update } from 'telegraf/types'
import { NarrowedContext } from 'telegraf'
import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'

import { extractPoll } from '../utils'
import { DataSource } from '../data-source/data-source'

export class CreatePollScene extends BaseScene<SceneContext> {
  constructor(private readonly source: DataSource) {
    super(CreatePollScene.name)

    this.on('poll', this.onPoll)
  }

  private onPoll = async (
    ctx: NarrowedContext<SceneContext<SceneSessionData>, Update.PollUpdate>
  ) => {
    try {
      const pollCtx = extractPoll(ctx)
      if (!pollCtx) return

      const { poll } = pollCtx.message
      console.log('poll', poll)
      await this.source.dataValidation.user.invoke(pollCtx.from)

      await this.source.prisma.poll.create({
        data: {
          ...poll,
          author_id: pollCtx.from.id,
          options: { create: poll.options }
        }
      })
      ctx.replyWithPoll(
        poll.question,
        poll.options.map((o) => o.text),
        { is_anonymous: false }
      )
    } catch (error) {
      console.error(error)
    }
  }
}
