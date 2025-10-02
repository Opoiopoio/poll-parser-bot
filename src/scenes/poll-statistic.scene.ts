import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'
import { DataSource } from '../storage'
import { UserId } from '../storage'
import { NarrowedContext } from 'telegraf'
import { Message, Poll, Update } from 'telegraf/types'

type BaseMsgContext<TMsg extends Message = Message> = NarrowedContext<
  SceneContext<SceneSessionData>,
  Update.MessageUpdate<TMsg>
>

type FullMsgContext = BaseMsgContext<Message & { poll: Poll }>
type PartialMsgContext = BaseMsgContext<Message & { poll?: Poll }>

export class PollStatisticScene extends BaseScene<SceneContext> {
  public static readonly sceneName = 'pollStatisticScene'
  constructor(private readonly storage: DataSource) {
    super(PollStatisticScene.sceneName)

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

  private handlePoll = async (ctx: FullMsgContext) => {
    const { poll } = ctx.message
    if (!this.storage.pollTable.has(poll.id)) {
      await ctx.reply('Нет статистики по опросу...')
      return ctx.scene.leave()
    }
    console.log('poll message', poll)

    const votesTable = this.storage.pollTable.get(poll.id)
    const result = votesTable
      .entries()
      .toArray()
      .map(
        ([optionId, userIds]) =>
          `Проголосовали за пункт: ${
            poll.options[optionId]?.text ?? optionId + 1
          }\n${userIds.values().toArray().map(this.formatUserInfo).join('\n')}`
      )
      .join('\n\n')

    await ctx.reply(result)
    ctx.scene.leave()
  }

  private formatUserInfo = (userId: UserId) => {
    const user = this.storage.userTable.get(userId)
    if (!user) return 'Неизвестный пользователь'
    if (user.username) return `@${user.username}`
    return `${user.first_name} ${user.last_name ?? ''}`
  }
}
