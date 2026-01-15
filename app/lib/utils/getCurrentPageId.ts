const getCurrentPageId = (path: string, navigationGroups: any[]) => {
  const pathSegments = path.split('/').filter(Boolean)
  const lastSegment = pathSegments[pathSegments.length - 1]

  // Flatten all navigation items from groups
  const allItems = navigationGroups.flatMap((group) => group.items)

  // Find matching navigation item by path or id
  const matchingItem = allItems.find((item: any) => item.path === path || item.path?.includes(lastSegment))

  return matchingItem?.label || 'Dashboard'
}

export default getCurrentPageId
