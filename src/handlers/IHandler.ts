import { Context } from 'telegraf'

export interface IHandler<C extends Context> {
  invoke: (ctx: C) => void
}
