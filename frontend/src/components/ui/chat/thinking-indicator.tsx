import { motion } from 'framer-motion'

import { AssistantAvatar } from './assistant-avatar'

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-start gap-3"
    >
      <AssistantAvatar />
      <div className="flex h-9 items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="size-1.5 rounded-full bg-primary/80"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.16,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
