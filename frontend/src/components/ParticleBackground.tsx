import { useEffect, useRef, memo } from 'react'

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

// Glowing particle dots for mobile — zero canvas, zero JS loop, pure GPU CSS
const CSS_PARTICLES = [
  // Large glow orbs (background aurora blobs)
  { id: 'orb1', left: '15%',  top: '20%',  size: 90,  blur: 55, color: '37,99,235',   opacity: 0.13, duration: '8s',  delay: '0s',   type: 'orb' },
  { id: 'orb2', left: '70%',  top: '35%',  size: 120, blur: 70, color: '96,165,250',  opacity: 0.10, duration: '10s', delay: '2s',   type: 'orb' },
  { id: 'orb3', left: '45%',  top: '70%',  size: 100, blur: 60, color: '129,140,248', opacity: 0.09, duration: '12s', delay: '4s',   type: 'orb' },
  { id: 'orb4', left: '5%',   top: '65%',  size: 70,  blur: 45, color: '56,189,248',  opacity: 0.08, duration: '9s',  delay: '1s',   type: 'orb' },
  { id: 'orb5', left: '80%',  top: '75%',  size: 80,  blur: 50, color: '167,243,208', opacity: 0.08, duration: '11s', delay: '3s',   type: 'orb' },
  // Medium glow dots
  { id: 'd1',  left: '8%',   top: '12%',  size: 6,   blur: 6,  color: '37,99,235',   opacity: 0.55, duration: '5s',  delay: '0s',   type: 'dot' },
  { id: 'd2',  left: '88%',  top: '18%',  size: 5,   blur: 5,  color: '96,165,250',  opacity: 0.50, duration: '6s',  delay: '1.2s', type: 'dot' },
  { id: 'd3',  left: '25%',  top: '8%',   size: 4,   blur: 4,  color: '59,130,246',  opacity: 0.45, duration: '7s',  delay: '0.5s', type: 'dot' },
  { id: 'd4',  left: '65%',  top: '15%',  size: 7,   blur: 7,  color: '37,99,235',   opacity: 0.50, duration: '5s',  delay: '2s',   type: 'dot' },
  { id: 'd5',  left: '50%',  top: '5%',   size: 4,   blur: 4,  color: '129,140,248', opacity: 0.40, duration: '8s',  delay: '0.8s', type: 'dot' },
  { id: 'd6',  left: '92%',  top: '45%',  size: 5,   blur: 5,  color: '96,165,250',  opacity: 0.45, duration: '6s',  delay: '3s',   type: 'dot' },
  { id: 'd7',  left: '3%',   top: '48%',  size: 6,   blur: 6,  color: '37,99,235',   opacity: 0.50, duration: '7s',  delay: '1.5s', type: 'dot' },
  { id: 'd8',  left: '78%',  top: '55%',  size: 4,   blur: 4,  color: '56,189,248',  opacity: 0.40, duration: '5s',  delay: '2.5s', type: 'dot' },
  { id: 'd9',  left: '38%',  top: '82%',  size: 5,   blur: 5,  color: '37,99,235',   opacity: 0.45, duration: '9s',  delay: '0.3s', type: 'dot' },
  { id: 'd10', left: '15%',  top: '88%',  size: 3,   blur: 3,  color: '96,165,250',  opacity: 0.35, duration: '6s',  delay: '4s',   type: 'dot' },
  { id: 'd11', left: '60%',  top: '90%',  size: 5,   blur: 5,  color: '59,130,246',  opacity: 0.45, duration: '7s',  delay: '1s',   type: 'dot' },
  { id: 'd12', left: '42%',  top: '42%',  size: 3,   blur: 3,  color: '129,140,248', opacity: 0.30, duration: '8s',  delay: '2.2s', type: 'dot' },
]

function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Particle[] = []

    const colors = [
      'rgba(37,99,235,',
      'rgba(96,165,250,',
      'rgba(148,163,184,',
      'rgba(59,130,246,',
    ]

    const resize = () => {
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
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  )
}

export default memo(function ParticleBackground() {
  return (
    <>
      {/* Desktop: canvas-based animated particles */}
      <div className="hidden md:block">
        <CanvasParticles />
      </div>

      {/* Mobile: pure CSS animated particles — aurora orbs + glowing dots, zero CPU */}
      <div
        aria-hidden="true"
        className="md:hidden pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {CSS_PARTICLES.map((p) =>
          p.type === 'orb' ? (
            /* Large blurred aurora blobs */
            <span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, rgba(${p.color},${p.opacity}) 0%, transparent 70%)`,
                filter: `blur(${p.blur}px)`,
                transform: 'translate(-50%, -50%)',
                animation: `mobileOrb ${p.duration} ${p.delay} ease-in-out infinite alternate`,
              }}
            />
          ) : (
            /* Small glowing particle dots */
            <span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                background: `rgba(${p.color},${p.opacity})`,
                boxShadow: `0 0 ${p.blur * 2}px ${p.blur}px rgba(${p.color},${p.opacity * 0.6})`,
                transform: 'translate(-50%, -50%)',
                animation: `mobilePulse ${p.duration} ${p.delay} ease-in-out infinite alternate`,
              }}
            />
          )
        )}
      </div>
    </>
  )
})
