import { ReadyQueries } from './ready-queries'
import { DataValidationFacade } from '../utils'
import { PrismaClient } from '../../prisma/generated/prisma'

export class DataSource {
  public readonly prisma: PrismaClient
  public readonly readyQueries: ReadyQueries
  public readonly dataValidation: DataValidationFacade
  constructor() {
    this.prisma = new PrismaClient()
    this.readyQueries = new ReadyQueries(this.prisma)
    this.dataValidation = new DataValidationFacade(this.prisma)
  }
}
