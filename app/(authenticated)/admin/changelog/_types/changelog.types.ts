export type ChangeType = 'feature' | 'improvement' | 'fix' | 'performance' | 'ui' | 'breaking' | 'bug'
export type ImpactLevel = 'low' | 'medium' | 'high'

export interface Change {
  type: ChangeType
  title: string
  description: string
  impact: ImpactLevel
}

export interface ChangelogEntry {
  version: string
  date: string
  changes: Change[]
}
