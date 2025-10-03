import { Telegraf } from 'telegraf'
import { SceneContext, SceneSessionData } from 'telegraf/scenes'
import { CreatePollScene, PollInfoScene } from '../scenes'

const helpMessage =
  'Для получения списков проголосовавших необходимо выполнить команду /create_poll, прислать опрос и бот его скопирует.' +
  ' После чего опрос необходимо переслать в другой чат\n' +
  'Получение статистики выполняется с помощью команды /poll_info и пересылки опроса созданного ботом'

export class CommandsHandler {
  constructor(private readonly bot: Telegraf<SceneContext<SceneSessionData>>) {}

  init() {
    this.bot.start((ctx) =>
      ctx.reply(
        'Этот бот используется для получения списков проголосовавших в опросе\n' +
          helpMessage
      )
    )
    this.bot.command('create_poll', (ctx) =>
      ctx.scene.enter(CreatePollScene.name)
    )
    this.bot.command('poll_info', (ctx) => ctx.scene.enter(PollInfoScene.name))
    this.bot.command('help', (ctx) => ctx.reply(helpMessage))
  }
}
