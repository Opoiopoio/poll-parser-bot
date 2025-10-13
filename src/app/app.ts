import { session, Telegraf } from 'telegraf'
import { SceneContext, SceneSessionData, Stage } from 'telegraf/scenes'
import { DataSource } from '../data-source'
import { CreatePollScene, PollInfoScene } from '../scenes'
import { ActionHandler, CommandsHandler, PollAnswerHandler } from '../handlers'
import { StatisticService } from '../service'
import { DataValidationFacade } from '../utils'

export class App {
  public readonly dataSource = new DataSource()
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
      { command: 'create_poll', description: 'Новый опрос' },
      { command: 'poll_info', description: 'Статистика опроса' }
    ])
    this.validation = new DataValidationFacade(this.dataSource.prisma)
    this._commandHandler = new CommandsHandler(this.bot)
    this._actionHandler = new ActionHandler(this.bot)
  }

  async init() {
    const pollStatisticScene = new PollInfoScene(this)
    const createPollScene = new CreatePollScene(this)
    const stage = new Stage([pollStatisticScene, createPollScene])

    this.bot.use(session())
    this.bot.use(stage.middleware())
    this.initHandlers()

    await this.dataSource.prisma.$connect()
    await this.bot.launch(() => console.log('Бот запущен!'))
  }

  private initHandlers() {
    this._commandHandler.init()
    this._actionHandler.init()
    const pollAnswerHandler = new PollAnswerHandler(this)
    this.bot.on('poll_answer', pollAnswerHandler.invoke)
  }

  async destroy(reason?: string) {
    await this.dataSource.prisma.$disconnect()
    this.bot.stop(reason)
  }
}
