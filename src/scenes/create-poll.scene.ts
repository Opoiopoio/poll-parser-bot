import { Update } from 'telegraf/types'
import { NarrowedContext } from 'telegraf'
import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'

import { extractPoll, inlineKeyboard } from '../utils'
import { App } from '../app'

export class CreatePollScene extends BaseScene<SceneContext> {
  constructor(private readonly app: App) {
    super(CreatePollScene.name)

    this.enter(this.handleEnter)
    this.on('poll', this.handlePoll)
  }

  private handleEnter = (ctx: SceneContext<SceneSessionData>) =>
    ctx.reply('Пришлите опрос для копирования')

  private handlePoll = async (
    ctx: NarrowedContext<SceneContext<SceneSessionData>, Update.PollUpdate>
  ) => {
    try {
      const pollCtx = extractPoll(ctx)
      if (!pollCtx) return

      const { poll } = pollCtx.message
      console.log('poll', poll)
      await this.app.validation.user.invoke(pollCtx.from)

      const { options, question, type, allows_multiple_answers } = poll

      const msg = await ctx.replyWithPoll(
        poll.question,
        poll.options.map((o) => o.text),
        { ...poll, is_anonymous: false }
      )

      await this.app.prisma.poll.create({
        data: {
          id: msg.poll.id,
          question,
          type,
          allows_multiple_answers,
          author_id: pollCtx.from.id,
          options: { create: options }
        }
      })

      const statisticMsg = await ctx.reply(
        'В этом сообщении будет отображаться статистика по опросу'
      )
      await this.app.prisma.pollStatisticMessage.create({
        data: {
          id: statisticMsg.message_id,
          poll_id: msg.poll.id,
          chat_id: statisticMsg.chat.id
        }
      })

      await ctx.reply(
        'Теперь перешлите опрос в другой чат для сбора голосов',
        inlineKeyboard
      )
      await ctx.scene.leave()
    } catch (error) {
      await ctx.reply('Ошибка при обработке команды...', inlineKeyboard)
      await ctx.scene.leave()
      console.error(error)
    }
  }
}
