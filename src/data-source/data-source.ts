import { PrismaClient } from '../../prisma/generated/prisma'
import { DataValidationFacade } from '../utils'

export class DataSource {
  public readonly prisma: PrismaClient
  public readonly dataValidation: DataValidationFacade
  constructor() {
    this.prisma = new PrismaClient()
    this.dataValidation = new DataValidationFacade(this.prisma)
  }
}
