import { PrismaClient } from '../../prisma/generated/prisma'
import { UserValidation } from './data-validation/user-validation'

export class DataValidationFacade {
  public readonly user: UserValidation
  constructor(prisma: PrismaClient) {
    this.user = new UserValidation(prisma)
  }
}
