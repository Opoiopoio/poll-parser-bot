import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'

import { inlineKeyboard, FullMsgContext, PartialMsgContext } from '../utils'
import { App } from '../app'

export class PollInfoScene extends BaseScene<SceneContext> {
  constructor(private readonly app: App) {
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
      await ctx.reply('Вы прислали не опрос', inlineKeyboard)
      ctx.scene.leave()
      return
    }
    return this.handlePoll(ctx)
  }

  private handlePoll = async (ctx: FullMsgContext) => {
    try {
      const id = ctx.message.poll.id

      // const statisticMsg = await this.app.prisma.pollStatisticMessage.findFirst(
      //   { where: { poll_id: id } }
      // )

      // if (statisticMsg) {
      //   await ctx.telegram.copyMessage(
      //     ctx.chat.id,
      //     Number(statisticMsg.chat_id),
      //     Number(statisticMsg.id)
      //   )
      //   await ctx.reply('Выберите следующее действие', inlineKeyboard)
      //   return await ctx.scene.leave()
      // }

      const poll = await this.app.readyQueries.poll.get(id)
      const userSettings = await this.app.readyQueries.userSettings.getByUserId(
        ctx.from.id
      )

      const validationResult = this.app.validation.poll.invoke(ctx, poll)
      const result =
        typeof validationResult === 'string'
          ? validationResult
          : this.app.staticService.get(
              validationResult,
              userSettings.statistic_format
            )

      const msg = await ctx.replyWithHTML(result, inlineKeyboard)
      await this.app.prisma.pollStatisticMessage.create({
        data: { chat_id: ctx.chat.id, id: msg.message_id, poll_id: id }
      })
      await ctx.scene.leave()
    } catch (error) {
      console.log(error)
      await ctx.reply('Ошибка при обработке команды...', inlineKeyboard)
      await ctx.scene.leave()
    }
  }
}
