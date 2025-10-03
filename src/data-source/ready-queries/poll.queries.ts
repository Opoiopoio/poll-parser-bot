import { PrismaClient } from '../../../prisma/generated/prisma'

export class PollQueries {
  constructor(private readonly prisma: PrismaClient) {}

  public get(id: string) {
    return this.prisma.poll.findFirst({
      where: { id },
      include: {
        options: { include: { user_poll_options: { include: { user: true } } } }
      }
    })
  }
}
