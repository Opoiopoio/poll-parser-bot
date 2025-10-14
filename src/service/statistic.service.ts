import { FullPoll } from '../utils'
import { User } from '../../prisma/generated/prisma'

export class StatisticService {
  constructor() {}

  public get(poll: FullPoll, statisticFormat = 'tag') {
    return poll.options
      .filter((o) => !!o.user_poll_options.length)
      .map(
        (o, i) =>
          `Проголосовавшие за: ${o?.text ?? i + 1}\n${o.user_poll_options
            .map((u) => this.formatUserInfo(u, statisticFormat))
            .join('\n')}`
      )
      .join('\n\n')
  }

  private formatUserInfo(
    data: { user?: User | null },
    statisticFormat: string
  ) {
    const { user } = data
    if (!user) return 'Неизвестный пользователь'
    const fullName = `${user.first_name} ${user.last_name ?? ''}`
    if (statisticFormat === 'name') return fullName
    if (user.username && statisticFormat === 'tag') return `@${user.username}`
    return `<a href="tg://user?id=${user.id}">${fullName}</a>`
  }
}
