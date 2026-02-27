import Image from 'next/image'
import { FC, memo, MouseEventHandler } from 'react'

interface PictureProps {
  src: string
  alt?: string
  className?: string
  priority?: boolean
  onClick?: MouseEventHandler<HTMLImageElement>
  width?: number
  height?: number
  sizes?: string
  role?: string
  decorative?: boolean
}

const Picture: FC<PictureProps> = ({
  src,
  alt,
  className,
  priority = false,
  onClick,
  width,
  height,
  sizes = '100vw',
  role,
  decorative = false
}) => {
  // Decorative images must have empty alt and aria-hidden
  // If decorative prop is passed, override whatever alt was given
  const resolvedAlt = decorative ? '' : alt || 'Boys & Girls Club of Lynn'
  const ariaHidden = decorative ? true : undefined

  return (
    <Image
      onClick={onClick}
      src={src || '/images/placeholder.png'}
      alt={resolvedAlt}
      width={width || 1}
      height={height || 1}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      unoptimized
      role={role}
      aria-hidden={ariaHidden}
    />
  )
}

export default memo(Picture)
