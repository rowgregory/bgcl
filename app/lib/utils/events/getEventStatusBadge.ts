const getEventStatusBadge = (status: string) => {
  switch (status) {
    case 'on-sale':
      return {
        text: 'On Sale',
        color: 'bg-green-500/20 text-green-400 border-green-500/30'
      }
    case 'sold-out':
      return {
        text: 'Sold Out',
        color: 'bg-red-500/20 text-red-400 border-red-500/30'
      }
    case 'low-availability':
      return {
        text: 'Low Availability',
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      }
    default:
      return {
        text: 'Draft',
        color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
      }
  }
}

export default getEventStatusBadge
