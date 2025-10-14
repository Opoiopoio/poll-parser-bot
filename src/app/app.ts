import { session, Telegraf } from 'telegraf'
import { SceneContext, SceneSessionData, Stage } from 'telegraf/scenes'
import { CreatePollScene, PollInfoScene, UserSettingsScene } from '../scenes'
import { ActionHandler, CommandsHandler, PollAnswerHandler } from '../handlers'
import { StatisticService } from '../service'
import { DataValidationFacade } from '../utils'
import { PrismaClient } from '../../prisma/generated/prisma'
import { ReadyQueries } from '../data-source'

export class App {
  public readonly prisma = new PrismaClient()
  public readonly readyQueries: ReadyQueries
  public readonly bot: Telegraf<SceneContext<SceneSessionData>>
  public readonly staticService = new StatisticService()
  public readonly validation: DataValidationFacade
  private readonly _commandHandler: CommandsHandler
  private readonly _actionHandler: ActionHandler

  constructor(botToken: string) {
    this.bot = new Telegraf(botToken)
    this.bot.telegram.setMyCommands([
      { command: 'start', description: 'Запустить бота' },
      { command: 'help', description: 'Помощь' },
      { command: 'settings', description: 'Настройки' },
      { command: 'create_poll', description: 'Новый опрос' },
      { command: 'poll_info', description: 'Статистика опроса' }
    ])
    this.readyQueries = new ReadyQueries(this.prisma)
    this.validation = new DataValidationFacade(this.prisma)
    this._commandHandler = new CommandsHandler(this.bot)
    this._actionHandler = new ActionHandler(this.bot)
  }

  async init() {
    const pollStatisticScene = new PollInfoScene(this)
    const createPollScene = new CreatePollScene(this)
    const userSettingsScene = new UserSettingsScene(this)
    const stage = new Stage([
      pollStatisticScene,
      createPollScene,
      userSettingsScene
    ])

    this.bot.use(session())
    this.bot.use(stage.middleware())
    this.initHandlers()

    await this.prisma.$connect()
    await this.bot.launch(() => console.log('Бот запущен!'))
  }

  private initHandlers() {
    this._commandHandler.init()
    this._actionHandler.init()
    const pollAnswerHandler = new PollAnswerHandler(this)
    this.bot.on('poll_answer', pollAnswerHandler.invoke)
  }

  async destroy(reason?: string) {
    await this.prisma.$disconnect()
    this.bot.stop(reason)
  }
}
