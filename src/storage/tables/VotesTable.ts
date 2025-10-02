import { OptionId, UserId } from './types'

export class VotesTable extends Map<OptionId, Set<UserId>> {
  add(id: OptionId, userId: UserId) {
    let userIds = this.get(id)
    if (!userIds) {
      userIds = new Set()
      this.set(id, userIds)
    }
    userIds.add(userId)
  }
}
