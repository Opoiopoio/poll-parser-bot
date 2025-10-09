import { Telegraf } from 'telegraf'
import { SceneContext, SceneSessionData } from 'telegraf/scenes'
import { CreatePollScene, PollInfoScene } from '../scenes'

export class ActionHandler {
  constructor(private readonly bot: Telegraf<SceneContext<SceneSessionData>>) {}

  init() {
    this.bot.action('create_poll_btn', (ctx) =>
      ctx.scene.enter(CreatePollScene.name)
    )
    this.bot.action('poll_info_btn', (ctx) =>
      ctx.scene.enter(PollInfoScene.name)
    )
  }
}
