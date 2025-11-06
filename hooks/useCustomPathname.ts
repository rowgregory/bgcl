'use client'

import { usePathname } from 'next/navigation'

const useCustomPathname = () => {
  const pathname = usePathname()

  return pathname
}

export default useCustomPathname
