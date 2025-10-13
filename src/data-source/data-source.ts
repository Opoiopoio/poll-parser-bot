import { ReadyQueries } from './ready-queries'
import { PrismaClient } from '../../prisma/generated/prisma'

export class DataSource {
  public readonly prisma: PrismaClient
  public readonly readyQueries: ReadyQueries
  constructor() {
    this.prisma = new PrismaClient()
    this.readyQueries = new ReadyQueries(this.prisma)
  }
}
