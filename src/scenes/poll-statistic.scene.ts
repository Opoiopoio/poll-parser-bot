import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'
import { NarrowedContext } from 'telegraf'
import { Message, Poll, Update } from 'telegraf/types'
import { User, PrismaClient } from '../../prisma/generated/prisma'

type BaseMsgContext<TMsg extends Message = Message> = NarrowedContext<
  SceneContext<SceneSessionData>,
  Update.MessageUpdate<TMsg>
>

type FullMsgContext = BaseMsgContext<Message & { poll: Poll }>
type PartialMsgContext = BaseMsgContext<Message & { poll?: Poll }>

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any

export class PollStatisticScene extends BaseScene<SceneContext> {
  constructor(private readonly prisma: PrismaClient) {
    super(PollStatisticScene.name)

    this.enter(this.handleEnter)
    this.on('message', this.handleMessage)
  }

  private handleEnter = (ctx: SceneContext<SceneSessionData>) =>
    ctx.reply('Пришлите опрос по которому нужна статистика')

  private isFullMessage(ctx: PartialMsgContext): ctx is FullMsgContext {
    return !!ctx.message.poll
  }

  private handleMessage = async (ctx: PartialMsgContext) => {
    console.log('message', ctx)
    if (!this.isFullMessage(ctx)) {
      await ctx.reply('Вы прислали не опрос')
      ctx.scene.leave()
      return
    }
    return this.handlePoll(ctx)
  }

  private getPoll(id: string) {
    return this.prisma.poll.findFirst({
      where: { id },
      include: {
        options: { include: { user_poll_options: { include: { user: true } } } }
      }
    })
  }

  private async validatePoll(
    ctx: FullMsgContext,
    poll: AsyncReturnType<typeof this.getPoll>
  ) {
    if (!poll) {
      await ctx.reply('Нет статистики по опросу...')
      return ctx.scene.leave()
    }
    if (
      poll.author_id === ctx.from.id ||
      poll.options.some((o) =>
        o.user_poll_options.some((upo) => upo.user_id === ctx.from.id)
      )
    ) {
      await ctx.reply(
        'Произошла ошибка или недостаточно прав для получения статистики. Проголосуйте'
      )
      return ctx.scene.leave()
    }
    return poll
  }

  private handlePoll = async (ctx: FullMsgContext) => {
    const { poll: pollMsg } = ctx.message

    const nonCheckedPoll = await this.getPoll(pollMsg.id)
    const poll = await this.validatePoll(ctx, nonCheckedPoll)
    if (!poll) return

    const result = poll.options
      .map(
        (o, i) =>
          `Проголосовали за пункт: ${o?.text ?? i + 1}\n${o.user_poll_options
            .map(this.formatUserInfo)
            .join('\n')}`
      )
      .join('\n\n')

    await ctx.reply(result)
    ctx.scene.leave()
  }

  private formatUserInfo = (data: { user?: User | null }) => {
    const { user } = data
    if (!user) return 'Неизвестный пользователь'
    if (user.username) return `@${user.username}`
    return `${user.first_name} ${user.last_name ?? ''}`
  }
}
