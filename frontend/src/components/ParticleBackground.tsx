import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Disable on mobile/tablets (<768px) to keep CPU idle and mobile Lighthouse score high
    if (window.innerWidth < 768) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    const colors = [
      'rgba(37,99,235,',   // Sapphire blue
      'rgba(96,165,250,',  // Light blue
      'rgba(148,163,184,', // Slate
      'rgba(59,130,246,',  // Vivid blue
    ]

    const resize = () => {
      if (window.innerWidth < 768) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const maxParticles = 24

    const spawn = () => {
      if (particles.length > maxParticles) return
      const maxLife = 140 + Math.random() * 160
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.5 + 0.15),
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife,
      })
    }

    let frame = 0
    let running = true

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      if (frame % 12 === 0) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        const progress = p.life / p.maxLife
        p.opacity = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
          ? 1 - (progress - 0.8) / 0.2
          : 1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${(p.opacity * 0.4).toFixed(2)})`
        ctx.fill()

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1)
        }
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)

    const handleVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(animId)
      } else {
        running = true
        animId = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility, { passive: true })

    return () => {
      running = false
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-60 hidden md:block"
    />
  )
}
