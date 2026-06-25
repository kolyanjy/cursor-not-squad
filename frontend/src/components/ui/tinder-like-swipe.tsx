import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { forwardRef, useEffect, useImperativeHandle, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type DragDirection = 'left' | 'right' | null

export interface SwipeCardItem {
  id: string
  title: string
  description: string
  gradientClassName: string
}

export interface SwipeableCardStackHandle {
  swipeTop: (direction: 'left' | 'right') => void
}

export interface SwipeableCardStackProps {
  items?: SwipeCardItem[]
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

export const SwipeableCardStack = forwardRef<SwipeableCardStackHandle, SwipeableCardStackProps>(function SwipeableCardStack({
  items = [],
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
}, ref) {
  const [cards, setCards] = useState([...items])
  const [dragDirections, setDragDirections] = useState<Record<number, DragDirection>>({})
  const swipeThreshold = 100

  useEffect(() => {
    if (items.length > 0 && cards.length === 0) {
      const timer = setTimeout(() => {
        setCards([...items])
        setDragDirections({})
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [cards.length, items])

  useEffect(() => {
    setCards([...items])
  }, [items])

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

  useImperativeHandle(ref, () => ({
    swipeTop: (direction) => {
      if (cards.length === 0) return
      handleSwipe(cards.length - 1, direction)
    },
  }), [cards.length])

  return (
    <div className={cn('relative h-full w-full', className)}>
      <AnimatePresence>
        {cards.map((item, index) => {
          const isTopCard = index === cards.length - 1
          const direction = dragDirections[index]

          return (
            <motion.div
              key={`${item.id}-${index}`}
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
              <div className={cn('absolute inset-0 opacity-10', item.gradientClassName)} />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/15 to-transparent"
              />

              <div className="absolute inset-0 border border-white/25 bg-white/10 backdrop-blur-3xl backdrop-saturate-150" />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent"
              />

              <div className="relative flex h-full flex-col justify-end p-6">
                <h3 className="text-xl font-bold tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{item.description}</p>
              </div>

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
})
