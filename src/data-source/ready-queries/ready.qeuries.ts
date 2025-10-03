import { PrismaClient } from '../../../prisma/generated/prisma'
import { PollQueries } from './poll.queries'

export class ReadyQueries {
  public readonly poll: PollQueries
  constructor(private readonly prisma: PrismaClient) {
    this.poll = new PollQueries(prisma)
  }
}
