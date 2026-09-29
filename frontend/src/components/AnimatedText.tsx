import { motion } from 'framer-motion'

interface Props {
  text: string
  className?: string
  delay?: number
  stagger?: number
  type?: 'words' | 'chars'
  once?: boolean
}

export default function AnimatedText({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  type = 'words',
}: Props) {
  const items = type === 'chars' ? text.split('') : text.split(' ')

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }

  const child = {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={child}
          className="inline-block"
          style={{ marginRight: type === 'words' ? '0.3em' : undefined }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.span>
  )
}


