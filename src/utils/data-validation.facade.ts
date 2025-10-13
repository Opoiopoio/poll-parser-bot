import { PrismaClient } from '../../prisma/generated/prisma'
import { PollValidation } from './data-validation/poll-validation'
import { UserValidation } from './data-validation/user-validation'

export class DataValidationFacade {
  public readonly user: UserValidation
  public readonly poll: PollValidation
  constructor(prisma: PrismaClient) {
    this.user = new UserValidation(prisma)
    this.poll = new PollValidation()
  }
}
