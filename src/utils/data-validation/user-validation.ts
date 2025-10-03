import { User as TgUser } from 'telegraf/types'
import { PrismaClient, User as DbUser } from '../../../prisma/generated/prisma'

export class UserValidation {
  constructor(private readonly prisma: PrismaClient) {}

  async invoke(user: TgUser) {
    const presentUser = await this.prisma.user.findFirst({
      where: { id: user.id }
    })

    if (!presentUser) return this.prisma.user.create({ data: user })
    if (!this.hasChanges(user, presentUser)) return

    return this.prisma.user.update({ data: user, where: { id: user.id } })
  }

  private hasChanges(user: TgUser, presentUser: DbUser) {
    for (const key in presentUser) {
      if (user[key as keyof TgUser] !== presentUser[key as keyof DbUser])
        return true
    }
    return false
  }
}
