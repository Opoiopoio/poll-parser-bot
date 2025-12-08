import { Telegraf } from 'telegraf'
import { PrismaClient } from '../../prisma/generated/prisma'
import { ReadyQueries } from '../data-source'
import { SceneContext, SceneSessionData } from 'telegraf/scenes'
import { StatisticService } from '../service'
import { DataValidationFacade } from '../utils'

export interface IApp {
  prisma: PrismaClient
  readyQueries: ReadyQueries
  bot: Telegraf<SceneContext<SceneSessionData>>
  staticService: StatisticService
  validation: DataValidationFacade
}
