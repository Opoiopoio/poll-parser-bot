import { PrismaClient } from '../../../prisma/generated/prisma'
import { PollQueries } from './poll.queries'
import { UserSettingsQueries } from './user-settings.queries'

export class ReadyQueries {
  public readonly poll: PollQueries
  public readonly userSettings: UserSettingsQueries
  constructor(private readonly prisma: PrismaClient) {
    this.poll = new PollQueries(prisma)
    this.userSettings = new UserSettingsQueries(prisma)
  }
}
