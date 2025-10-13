import { Context, Middleware, Telegraf } from 'telegraf'
import { SceneContext, SceneSessionData } from 'telegraf/scenes'
import { CreatePollScene, PollInfoScene } from '../scenes'
import { inlineKeyboard } from '../utils'

// const helpMessage =
//   'Для получения списков проголосовавших необходимо выполнить команду /create_poll, прислать опрос и бот его скопирует.' +
//   ' После чего опрос необходимо переслать в другой чат\n' +
//   'Получение статистики выполняется с помощью команды /poll_info и пересылки опроса созданного ботом'

const helpMessage = `Бот используется для получения списка \`тегов\` \\(или \`имён\`\\) проголосовавших в опросе пользователей

Из\\-за ограничений \`Telegram\`, получить данные вашего опроса \`невозможно\`\\. Поэтому используется \`процесс\` описанный далее:

\\- выполняем команду /create\\_poll
\\- присылаем \`опрос\`
\\- получаем \`копию опроса\` и \`сообщение со статистикой\`, которое будет обновляться при \`каждом\` голосе
\\- далее пересылаем \`копию опроса\` в любой чат

Также существует возможность получения статистики по \`опросу\`, в котором вы \`проголосовали или были автором\`\\. \`Процесс\` следующий:

\\- выполняем команду /poll\\_info
\\- пересылаем \`копию опроса\`, которую создал бот
\\- получаем статистику`

export class CommandsHandler {
  constructor(private readonly bot: Telegraf<SceneContext<SceneSessionData>>) {}

  init() {
    this.bot.start((ctx) =>
      ctx.replyWithMarkdownV2(helpMessage, inlineKeyboard)
    )
    this.bot.command('create_poll', (ctx) =>
      ctx.scene.enter(CreatePollScene.name)
    )
    this.bot.command('poll_info', (ctx) => ctx.scene.enter(PollInfoScene.name))
    this.bot.command('help', (ctx) =>
      ctx.replyWithMarkdownV2(helpMessage, inlineKeyboard)
    )
  }
}
