export const getCurrentPageId = (path: string, navigationGroups: any[]) => {
  const allItems = navigationGroups.flatMap((group) => group.items)

  // Exact match first
  const exactMatch = allItems.find((item: any) => item.path === path)
  if (exactMatch) return exactMatch.label

  // Fall back to checking if the item path is a prefix of the current path
  const prefixMatch = allItems.find((item: any) => item.path && path.startsWith(item.path))
  if (prefixMatch) return prefixMatch.label

  return 'Dashboard'
}
