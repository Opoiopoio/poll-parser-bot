import { BaseScene, SceneContext, SceneSessionData } from 'telegraf/scenes'

import { App } from '../app'
import { Markup } from 'telegraf'
import { mainButtons } from '../utils'

const statisticFormatQueueMap = new Map([
  ['tag', 'link'],
  ['link', 'name'],
  ['name', 'tag']
])

const statisticFormatTitleMap = new Map([
  ['tag', 'Тег'],
  ['link', 'Ссылка'],
  ['name', 'Имя']
])

export class UserSettingsScene extends BaseScene<SceneContext> {
  constructor(private readonly app: App) {
    super(UserSettingsScene.name)

    this.enter(this.handleEnter)
    this.action('toggle_fag_format_btn', this.handleToggleTagFormat)
  }

  private handleEnter = async (ctx: SceneContext<SceneSessionData>) => {
    if (!ctx.from) return ctx.scene.leave()
    const userSettings = await this.app.readyQueries.userSettings.getByUserId(
      ctx.from.id
    )

    const { statistic_format } = userSettings
    const tagFormatMsg = this.getTagFormatMsg(statistic_format)

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(tagFormatMsg, 'toggle_fag_format_btn')],
      mainButtons
    ])
    await ctx.reply('НАСТРОЙКИ', keyboard)
  }

  private handleToggleTagFormat: Parameters<typeof this.action>[1] = async (
    ctx
  ) => {
    if (!ctx.from) return ctx.answerCbQuery()

    const userSettings = await this.app.readyQueries.userSettings.getByUserId(
      ctx.from.id
    )
    userSettings.statistic_format =
      statisticFormatQueueMap.get(userSettings.statistic_format) ?? 'tag'
    await this.app.prisma.userSettings.update({
      data: userSettings,
      where: { id: userSettings.id }
    })

    const tagFormatMsg = this.getTagFormatMsg(userSettings.statistic_format)

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback(tagFormatMsg, 'toggle_fag_format_btn')],
      mainButtons
    ])
    await ctx.answerCbQuery()
    await ctx.editMessageText('НАСТРОЙКИ', keyboard)
  }

  private getTagFormatMsg(statisticFormat: string) {
    const state = statisticFormatTitleMap.get(statisticFormat) ?? 'Тег'
    return `Формат отображения статистики: ${state}`
  }
}
