import { Markup } from 'telegraf'

export const mainButtons = [
  Markup.button.callback('Новый опрос', 'create_poll_btn'),
  Markup.button.callback('Статистика опроса', 'poll_info_btn')
]

export const inlineKeyboard = Markup.inlineKeyboard([mainButtons])
