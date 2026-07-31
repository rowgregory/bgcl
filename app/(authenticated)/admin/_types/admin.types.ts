export interface AdminStats {
  users: {
    total: number
    supporters: number
    staff: number
    admins: number
    growth: number
  }
  events: {
    total: number
    recentWeek: number
  }
  heroes: {
    total: number
    active: number
    activeHeroId?: string
  }
}

export interface AdminListGroup<T> {
  id: string
  label: string
}

export interface AdminListItem {
  id: string
  order?: number
  [key: string]: any
}
