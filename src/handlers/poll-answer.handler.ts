import { Update } from 'telegraf/types'
import { NarrowedContext, Telegraf } from 'telegraf'
import { SceneContext, SceneSessionData } from 'telegraf/scenes'

import { DataSource } from '../data-source'
import { IHandler } from './IHandler'

type PollContext = NarrowedContext<
  SceneContext<SceneSessionData>,
  Update.PollAnswerUpdate
>

export class PollAnswerHandler implements IHandler<PollContext> {
  constructor(private readonly dataSource: DataSource) {}

  public invoke = async (ctx: PollContext) => {
    try {
      console.log('poll_answer', ctx)
      if (!ctx.pollAnswer.user) return
      const { user, poll_id, option_ids } = ctx.pollAnswer
      await this.dataSource.dataValidation.user.invoke(user)

      const poll = await this.dataSource.prisma.poll.findFirst({
        where: { id: poll_id },
        include: { options: true }
      })
      if (!poll) return

      await this.dataSource.prisma.$transaction(async () => {
        await this.dataSource.prisma.userPollOptions.deleteMany({
          where: { user_id: user.id, option: { poll_id } }
        })

        const promises = poll.options
          .filter((_, i) => option_ids.includes(i))
          .map((o) =>
            this.dataSource.prisma.userPollOptions.create({
              data: { user_id: user.id, option_id: o.id }
            })
          )

        await Promise.all(promises)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
