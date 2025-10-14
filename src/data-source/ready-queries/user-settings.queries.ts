import { PrismaClient } from '../../../prisma/generated/prisma'

export class UserSettingsQueries {
  constructor(private readonly prisma: PrismaClient) {}

  public async getByUserId(user_id: number) {
    const userSettings = await this.prisma.userSettings.findFirst({
      where: { user_id }
    })
    if (userSettings) return userSettings

    return this.prisma.userSettings.create({ data: { user_id } })
  }
}
