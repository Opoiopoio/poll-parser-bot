import { session, Telegraf } from 'telegraf'
import { extractPoll } from './utils'
import { PollStatisticScene } from './scenes'
import { SceneContext, SceneSessionData, Stage } from 'telegraf/scenes'
import { PrismaClient } from '@prisma/client'

if (!process.env.BOT_TOKEN) {
  console.error('Environment variable BOT_TOKEN not defined')
  process.exit(2)
}

const prisma = new PrismaClient()
const pollStatisticScene = new PollStatisticScene(prisma)
const stage = new Stage([pollStatisticScene])

const bot = new Telegraf<SceneContext<SceneSessionData>>(process.env.BOT_TOKEN)
bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.reply('Хай!'))

bot.command('pollstats', (ctx) => ctx.scene.enter(PollStatisticScene.name))

bot.on('poll', async (ctx) => {
  try {
    const pollCtx = extractPoll(ctx)
    if (!pollCtx) return

    const { poll } = pollCtx.message
    console.log('poll', poll)

    ctx.replyWithPoll(
      poll.question,
      poll.options.map((o) => o.text),
      { is_anonymous: false }
    )
  } catch (error) {
    console.error(error)
  }
})

bot.on('poll_answer', (ctx) => {
  try {
    console.log('poll_answer', ctx)
    if (!ctx.pollAnswer.user) return
    const { user, poll_id, option_ids } = ctx.pollAnswer

    storage.userTable.set(user.id, user)

    const votesTable = storage.pollTable.get(poll_id)
    option_ids.forEach((id) => votesTable.add(id, user.id))
  } catch (error) {
    console.error(error)
  }
})

bot.launch(() => {
  console.log('Раскатано')
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
