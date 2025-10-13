import { IHandler } from './IHandler'
import { App } from '../app'
import { PollContext } from '../utils'

export class PollAnswerHandler implements IHandler<PollContext> {
  constructor(private readonly app: App) {}

  public invoke = async (ctx: PollContext) => {
    try {
      console.log('poll_answer', ctx)
      if (!ctx.pollAnswer.user) return
      const { user, poll_id, option_ids } = ctx.pollAnswer
      await this.app.validation.user.invoke(user)

      const poll = await this.app.dataSource.prisma.poll.findFirst({
        where: { id: poll_id },
        include: { options: true }
      })
      if (!poll) return

      await this.app.dataSource.prisma.$transaction(async () => {
        await this.app.dataSource.prisma.userPollOptions.deleteMany({
          where: { user_id: user.id, option: { poll_id } }
        })

        const promises = poll.options
          .filter((_, i) => option_ids.includes(i))
          .map((o) =>
            this.app.dataSource.prisma.userPollOptions.create({
              data: { user_id: user.id, option_id: o.id }
            })
          )

        await Promise.all(promises)
      })

      await this.updateStatisticMessage(ctx, poll_id)
    } catch (error) {
      console.error(error)
    }
  }

  private async updateStatisticMessage(ctx: PollContext, id: string) {
    const statisticMsg =
      await this.app.dataSource.prisma.pollStatisticMessage.findFirst({
        where: { poll_id: id }
      })
    const poll = await this.app.dataSource.readyQueries.poll.get(id)
    if (!statisticMsg || !poll) return

    const validationResult = this.app.validation.poll.invoke(ctx, poll)
    const newMsg =
      typeof validationResult === 'string'
        ? validationResult
        : this.app.staticService.get(validationResult)

    await this.app.bot.telegram.editMessageText(
      Number(statisticMsg.chat_id),
      Number(statisticMsg.id),
      undefined,
      newMsg,
      { parse_mode: 'HTML' }
    )
  }
}
