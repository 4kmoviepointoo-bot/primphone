import { useEffect, useRef, useState, lazy, Suspense } from 'react'

const FloatingLines = lazy(() => import('./FloatingLines'))

export default function HeroLiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Only run WebGL and 60fps canvas loop on desktop screens (>=1024px)
    // On mobile, Lighthouse throttles CPU 4x; skipping heavy JS/WebGL eliminates ~2000ms TBT!
    const isDesk = window.innerWidth >= 1024
    setIsDesktop(isDesk)
    if (!isDesk) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      speed: 0.05,
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = e.clientX - rect.left
      mouse.targetY = e.clientY - rect.top
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Dynamic fluid blobs mimicking Google Pixel 9 official live wallpapers
    const blobs = [
      {
        baseX: 0.3,
        baseY: 0.35,
        radius: 400,
        colorStops: [
          { stop: 0, color: 'rgba(37, 99, 235, 0.22)' },   // Sapphire blue
          { stop: 0.6, color: 'rgba(96, 165, 250, 0.12)' }, // Soft azure
          { stop: 1, color: 'rgba(255, 255, 255, 0)' },
        ],
        speedX: 0.0008,
        speedY: 0.0011,
        ampX: 140,
        ampY: 100,
        phase: 0,
      },
      {
        baseX: 0.72,
        baseY: 0.45,
        radius: 450,
        colorStops: [
          { stop: 0, color: 'rgba(129, 140, 248, 0.20)' }, // Lavender indigo
          { stop: 0.55, color: 'rgba(192, 132, 252, 0.10)' },// Soft lilac
          { stop: 1, color: 'rgba(255, 255, 255, 0)' },
        ],
        speedX: 0.0012,
        speedY: 0.0009,
        ampX: 160,
        ampY: 120,
        phase: Math.PI * 0.5,
      },
      {
        baseX: 0.5,
        baseY: 0.65,
        radius: 420,
        colorStops: [
          { stop: 0, color: 'rgba(56, 189, 248, 0.18)' },  // Sky cyan
          { stop: 0.5, color: 'rgba(167, 243, 208, 0.12)' },// Mint aurora
          { stop: 1, color: 'rgba(255, 255, 255, 0)' },
        ],
        speedX: 0.0009,
        speedY: 0.0014,
        ampX: 120,
        ampY: 90,
        phase: Math.PI,
      },
      {
        baseX: 0.2,
        baseY: 0.7,
        radius: 360,
        colorStops: [
          { stop: 0, color: 'rgba(219, 234, 254, 0.35)' }, // Pearl ice blue
          { stop: 0.7, color: 'rgba(241, 245, 249, 0.15)' },
          { stop: 1, color: 'rgba(255, 255, 255, 0)' },
        ],
        speedX: 0.0015,
        speedY: 0.0008,
        ampX: 100,
        ampY: 130,
        phase: Math.PI * 1.5,
      },
    ]

    // Floating crystalline dust particles
    const sparks = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }))

    let time = 0

    const render = () => {
      time += 1
      mouse.x += (mouse.targetX - mouse.x) * mouse.speed
      mouse.y += (mouse.targetY - mouse.y) * mouse.speed

      ctx.clearRect(0, 0, width, height)

      // 1. Draw glowing fluid aurora blobs
      blobs.forEach((blob, idx) => {
        const x =
          blob.baseX * width +
          Math.sin(time * blob.speedX + blob.phase) * blob.ampX +
          (mouse.x - width * 0.5) * (0.04 + idx * 0.015)
        const y =
          blob.baseY * height +
          Math.cos(time * blob.speedY + blob.phase) * blob.ampY +
          (mouse.y - height * 0.5) * (0.04 + idx * 0.015)

        const breathingRadius =
          blob.radius + Math.sin(time * 0.002 + idx) * 35

        const gradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          Math.max(10, breathingRadius)
        )

        blob.colorStops.forEach((cs) => {
          gradient.addColorStop(cs.stop, cs.color)
        })

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, breathingRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      // 2. Interactive Cursor Aurora Spotlight
      const cursorGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        280
      )
      cursorGrad.addColorStop(0, 'rgba(37, 99, 235, 0.15)')
      cursorGrad.addColorStop(0.5, 'rgba(96, 165, 250, 0.06)')
      cursorGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = cursorGrad
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, 280, 0, Math.PI * 2)
      ctx.fill()

      // 3. Floating Light Shimmers / Dust
      sparks.forEach((s) => {
        s.y += s.speedY
        s.x += s.speedX
        s.pulse += 0.03

        if (s.y < -10) {
          s.y = height + 10
          s.x = Math.random() * width
        }
        if (s.x < -10) s.x = width + 10
        if (s.x > width + 10) s.x = -10

        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.pulse))

        ctx.fillStyle = `rgba(37, 99, 235, ${currentAlpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
      {/* 0. Mobile CSS Aurora: Ultra-smooth, zero-CPU instant paint */}
      <div 
        className="absolute inset-0 lg:hidden pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.16), rgba(96, 165, 250, 0.08) 55%, transparent 80%)'
        }}
      />

      {/* 1. Underlying Google Pixel Fluid Aurora Canvas (Desktop only) */}
      {isDesktop && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-85 transition-opacity duration-1000 hidden lg:block"
        />
      )}

      {/* 2. Soft Frosted Glass Mesh Diffusion */}
      <div className="absolute inset-0 backdrop-blur-[30px] bg-white/10 pointer-events-none" />

      {/* 3. React Bits Three.js FloatingLines Live Animated Canvas (Desktop only) */}
      {isDesktop && (
        <div className="absolute inset-0 pointer-events-auto hidden lg:block">
          <Suspense fallback={null}>
            <FloatingLines
              enabledWaves={['top', 'middle', 'bottom']}
              lineCount={[10, 15, 20]}
              lineDistance={[8, 6, 4]}
              bendRadius={5.0}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
              parallaxStrength={0.12}
              linesGradient={['#2563EB', '#3B82F6', '#60A5FA', '#818CF8', '#38BDF8']}
              lightMode={true}
              animationSpeed={0.9}
            />
          </Suspense>
        </div>
      )}

      {/* 4. Subtle Luxury Geometric Grid Line Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.7) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 5. Top vignette to seamlessly blend with floating/sticky navbar */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

      {/* 6. Bottom transition gradient to seamlessly blend into ticker & featured sections */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
    </div>
  )
}
