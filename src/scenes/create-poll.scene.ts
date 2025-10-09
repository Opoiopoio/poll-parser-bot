import { Update } from 'telegraf/types'
import { NarrowedContext } from 'telegraf'
import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'

import { extractPoll, inlineKeyboard } from '../utils'
import { DataSource } from '../data-source/data-source'

export class CreatePollScene extends BaseScene<SceneContext> {
  constructor(private readonly source: DataSource) {
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
      await this.source.dataValidation.user.invoke(pollCtx.from)

      const { options, question, type, allows_multiple_answers } = poll

      const msg = await ctx.replyWithPoll(
        poll.question,
        poll.options.map((o) => o.text),
        { ...poll, is_anonymous: false }
      )

      await this.source.prisma.poll.create({
        data: {
          id: msg.poll.id,
          question,
          type,
          allows_multiple_answers,
          author_id: pollCtx.from.id,
          options: { create: options }
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
