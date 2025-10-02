import { User } from 'telegraf/types'
import { PollTable, UserId } from './tables'

export class DataSource {
  public readonly pollTable = new PollTable()
  public readonly userTable = new Map<UserId, User>()
}
