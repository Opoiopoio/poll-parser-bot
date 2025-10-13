import { FullPoll } from '../utils'
import { User } from '../../prisma/generated/prisma'

export class StatisticService {
  constructor() {}

  public get(poll: FullPoll, isTagFormat = true) {
    return poll.options
      .filter((o) => !!o.user_poll_options.length)
      .map(
        (o, i) =>
          `Проголосовавшие за: ${o?.text ?? i + 1}\n${o.user_poll_options
            .map((u) => this.formatUserInfo(u, isTagFormat))
            .join('\n')}`
      )
      .join('\n\n')
  }

  private formatUserInfo(data: { user?: User | null }, isTagFormat: boolean) {
    const { user } = data
    if (!user) return 'Неизвестный пользователь'
    if (user.username && isTagFormat) return `@${user.username}`
    const fullName = `${user.first_name} ${user.last_name ?? ''}`
    return `<a href="tg://user?id=${user.id}">${fullName}</a>`
  }
}
