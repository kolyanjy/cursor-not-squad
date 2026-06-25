import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DragDirection = 'left' | 'right' | null

export interface SwipeableCardStackProps {
  images?: string[]
  borderRadius?: number
  showInnerShadows?: boolean
  greenShadowColor?: string
  redShadowColor?: string
  innerStrokeColor?: string
  shadowSize?: string
  shadowBlur?: string
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  className?: string
}

export function SwipeableCardStack({
  images = [],
  borderRadius = 16,
  showInnerShadows = true,
  greenShadowColor = 'rgba(45, 150, 45, 0.75)',
  redShadowColor = 'rgba(224, 83, 83, 0.75)',
  innerStrokeColor = 'rgba(255, 255, 255, 0.12)',
  shadowSize = '0 8px 20px',
  shadowBlur = 'rgba(0, 0, 0, 0.3)',
  rightIcon = null,
  leftIcon = null,
  className,
}: SwipeableCardStackProps) {
  const [cards, setCards] = useState([...images])
  const [dragDirections, setDragDirections] = useState<Record<number, DragDirection>>({})
  const swipeThreshold = 100

  useEffect(() => {
    if (images.length > 0 && cards.length === 0) {
      const timer = setTimeout(() => {
        setCards([...images])
        setDragDirections({})
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [cards.length, images])

  useEffect(() => {
    setCards([...images])
  }, [images])

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, index: number) => {
    setDragDirections((prev) => ({
      ...prev,
      [index]: info.offset.x > 0 ? 'right' : 'left',
    }))
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, index: number) => {
    if (Math.abs(info.offset.x) > swipeThreshold) {
      handleSwipe(index, dragDirections[index] ?? (info.offset.x > 0 ? 'right' : 'left'))
    } else {
      setDragDirections((prev) => ({ ...prev, [index]: null }))
    }
  }

  const handleSwipe = (index: number, direction: DragDirection) => {
    if (!direction) return

    setDragDirections((prev) => ({ ...prev, [index]: direction }))
    setTimeout(() => {
      setCards((prevCards) => prevCards.filter((_, i) => i !== index))
    }, 300)
  }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <AnimatePresence>
        {cards.map((image, index) => {
          const isTopCard = index === cards.length - 1
          const direction = dragDirections[index]

          return (
            <motion.div
              key={`${image}-${index}`}
              drag={isTopCard ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDrag={(event, info) => handleDrag(event, info, index)}
              onDragEnd={(event, info) => handleDragEnd(event, info, index)}
              custom={{ direction }}
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{
                scale: isTopCard ? 1 : 0.95,
                y: isTopCard ? 0 : -20,
                opacity: 1,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              exit="exit"
              variants={{
                exit: (custom: { direction?: DragDirection }) => ({
                  x: (custom?.direction ?? 'left') === 'right' ? 300 : -300,
                  rotate: (custom?.direction ?? 'left') === 'right' ? 20 : -20,
                  opacity: 0,
                  transition: { duration: 0.3, ease: 'easeIn' },
                }),
              }}
              className={cn(
                'absolute h-full w-full overflow-hidden',
                isTopCard ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
              )}
              style={{
                borderRadius,
                boxShadow: `inset 0 0 0 1px ${innerStrokeColor}, ${shadowSize} ${shadowBlur}`,
              }}
            >
              {image ? (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : null}

              <div className="absolute inset-0 border border-white/20 bg-white/[0.07] backdrop-blur-2xl backdrop-saturate-150" />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent"
              />

              {isTopCard && showInnerShadows ? (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 transition-[box-shadow] duration-200 ease-out"
                    style={{
                      borderRadius,
                      boxShadow:
                        direction === 'right'
                          ? `inset 0px -80px 60px ${greenShadowColor}`
                          : direction === 'left'
                            ? `inset 0px -80px 60px ${redShadowColor}`
                            : 'none',
                    }}
                  />
                  {direction && (rightIcon || leftIcon) ? (
                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {direction === 'right' ? rightIcon : leftIcon}
                    </div>
                  ) : null}
                </>
              ) : null}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
