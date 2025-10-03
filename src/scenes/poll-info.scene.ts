import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'
import { NarrowedContext } from 'telegraf'
import { Message, Poll, Update } from 'telegraf/types'
import { User } from '../../prisma/generated/prisma'
import { DataSource } from '../data-source'

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

export class PollInfoScene extends BaseScene<SceneContext> {
  constructor(private readonly dataSource: DataSource) {
    super(PollInfoScene.name)

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

  private async validatePoll(
    ctx: FullMsgContext,
    poll: AsyncReturnType<typeof this.dataSource.readyQueries.poll.get>
  ) {
    if (!poll) {
      await ctx.reply('Нет статистики по опросу...')
      return ctx.scene.leave()
    }
    if (
      poll.author_id !== BigInt(ctx.from.id) &&
      !poll.options.some((o) =>
        o.user_poll_options.some((upo) => upo.user_id === BigInt(ctx.from.id))
      )
    ) {
      await ctx.reply('Вы не являетесь автором или проголосовавшим')
      return ctx.scene.leave()
    }
    return poll
  }

  private handlePoll = async (ctx: FullMsgContext) => {
    try {
      const id = ctx.message.poll.id

      const nonCheckedPoll = await this.dataSource.readyQueries.poll.get(id)
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
      await ctx.scene.leave()
    } catch (error) {
      await ctx.reply('Ошибка при обработке команды...')
      await ctx.scene.leave()
      console.log(error)
    }
  }

  private formatUserInfo = (data: { user?: User | null }) => {
    const { user } = data
    if (!user) return 'Неизвестный пользователь'
    if (user.username) return `@${user.username}`
    return `${user.first_name} ${user.last_name ?? ''}`
  }
}
