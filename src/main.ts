import { App } from './app'

if (!process.env.BOT_TOKEN) {
  console.error('Environment variable BOT_TOKEN not defined')
  process.exit(2)
}

const app = new App(process.env.BOT_TOKEN)

app.init().catch((e) => {
  console.log(e)
  process.exit(2)
})

process.once('SIGINT', () => app.destroy('SIGINT'))
process.once('SIGTERM', () => app.destroy('SIGTERM'))
