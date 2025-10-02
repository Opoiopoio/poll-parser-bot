import { PollId } from './types'
import { VotesTable } from './VotesTable'

export class PollTable {
  private readonly _map = new Map<PollId, VotesTable>()

  has(id: PollId) {
    return this._map.has(id)
  }

  get(id: PollId) {
    let votesMap = this._map.get(id)
    if (!votesMap) {
      votesMap = new VotesTable()
      this._map.set(id, votesMap)
    }
    return votesMap
  }
}
