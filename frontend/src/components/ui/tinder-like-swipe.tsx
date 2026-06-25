import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type DragDirection = "left" | "right" | null;

export interface SwipeCardItem {
  id: string;
  title: string;
  description: string;
  gradientClassName: string;
  /** Optional icon shown in the card's top-left corner. */
  icon?: ReactNode;
}

export interface SwipeableCardStackHandle {
  swipeTop: (direction: "left" | "right") => void;
}

export interface SwipeableCardStackProps {
  items?: SwipeCardItem[];
  borderRadius?: number;
  showInnerShadows?: boolean;
  greenShadowColor?: string;
  redShadowColor?: string;
  innerStrokeColor?: string;
  shadowSize?: string;
  shadowBlur?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  className?: string;
  /** Fired when a card leaves the deck, by drag or by `swipeTop`. */
  onSwipe?: (item: SwipeCardItem, direction: "left" | "right") => void;
}

export const SwipeableCardStack = forwardRef<
  SwipeableCardStackHandle,
  SwipeableCardStackProps
>(function SwipeableCardStack(
  {
    items = [],
    borderRadius = 16,
    showInnerShadows = true,
    greenShadowColor = "rgba(45, 150, 45, 0.75)",
    redShadowColor = "rgba(224, 83, 83, 0.75)",
    innerStrokeColor = "rgba(255, 255, 255, 0.12)",
    shadowSize = "0 8px 20px",
    shadowBlur = "rgba(0, 0, 0, 0.3)",
    rightIcon = null,
    leftIcon = null,
    className,
    onSwipe,
  },
  ref,
) {
  const [cards, setCards] = useState([...items]);
  const [dragDirections, setDragDirections] = useState<
    Record<number, DragDirection>
  >({});
  const swipeThreshold = 100;

  useEffect(() => {
    if (items.length > 0 && cards.length === 0) {
      const timer = setTimeout(() => {
        setCards([...items]);
        setDragDirections({});
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cards.length, items]);

  useEffect(() => {
    setCards([...items]);
  }, [items]);

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    index: number,
  ) => {
    setDragDirections((prev) => ({
      ...prev,
      [index]: info.offset.x > 0 ? "right" : "left",
    }));
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
    index: number,
  ) => {
    if (Math.abs(info.offset.x) > swipeThreshold) {
      handleSwipe(
        index,
        dragDirections[index] ?? (info.offset.x > 0 ? "right" : "left"),
      );
    } else {
      setDragDirections((prev) => ({ ...prev, [index]: null }));
    }
  };

  const handleSwipe = useCallback(
    (index: number, direction: DragDirection) => {
      if (!direction) return;

      const item = cards[index];
      setDragDirections((prev) => ({ ...prev, [index]: direction }));
      setTimeout(() => {
        setCards((prevCards) => prevCards.filter((_, i) => i !== index));
      }, 300);
      if (item) onSwipe?.(item, direction);
    },
    [cards, onSwipe],
  );

  useImperativeHandle(
    ref,
    () => ({
      swipeTop: (direction) => {
        if (cards.length === 0) return;
        handleSwipe(cards.length - 1, direction);
      },
    }),
    [cards.length, handleSwipe],
  );

  return (
    <div className={cn("relative h-full w-full", className)}>
      <AnimatePresence>
        {cards.map((item, index) => {
          const isTopCard = index === cards.length - 1;
          const direction = dragDirections[index];

          return (
            <motion.div
              key={`${item.id}-${index}`}
              drag={isTopCard ? "x" : false}
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
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit="exit"
              variants={{
                exit: (custom: { direction?: DragDirection }) => ({
                  x: (custom?.direction ?? "left") === "right" ? 300 : -300,
                  rotate: (custom?.direction ?? "left") === "right" ? 20 : -20,
                  opacity: 0,
                  transition: { duration: 0.3, ease: "easeIn" },
                }),
              }}
              className={cn(
                "absolute h-full w-full overflow-hidden",
                isTopCard
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-default",
              )}
              style={{
                borderRadius,
                boxShadow: `inset 0 0 0 1px ${innerStrokeColor}, ${shadowSize} ${shadowBlur}`,
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-[0.06]",
                  item.gradientClassName,
                )}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
              />

              <div className="absolute inset-0 border border-white/20 bg-white/5 backdrop-blur-3xl backdrop-saturate-150" />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent"
              />

              {item.icon ? (
                <div className="absolute left-5 top-5 z-10 flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] backdrop-blur-md">
                  {item.icon}
                </div>
              ) : null}

              <div className="relative flex h-full flex-col justify-end p-6">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {item.description}
                </p>
              </div>

              {isTopCard && showInnerShadows ? (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 transition-[box-shadow] duration-200 ease-out"
                    style={{
                      borderRadius,
                      boxShadow:
                        direction === "right"
                          ? `inset 0px -80px 60px ${greenShadowColor}`
                          : direction === "left"
                            ? `inset 0px -80px 60px ${redShadowColor}`
                            : "none",
                    }}
                  />
                  {direction && (rightIcon || leftIcon) ? (
                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {direction === "right" ? rightIcon : leftIcon}
                    </div>
                  ) : null}
                </>
              ) : null}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
});
