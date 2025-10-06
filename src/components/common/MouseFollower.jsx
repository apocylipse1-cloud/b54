import React, { useEffect, useRef, useState } from 'react'

const MouseFollower = () => {
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])
  const mousePos = useRef({ x: 0, y: 0 })
  const animationFrame = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      // Use requestAnimationFrame for smooth updates
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }

      animationFrame.current = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect()
        mousePos.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      })
    }

    const handleMouseEnter = () => {
      createParticles()
    }

    const createParticles = () => {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        angle: (Math.PI * 2 * i) / 12,
        distance: 0,
        opacity: 1,
        size: Math.random() * 3 + 2
      }))
      setParticles(newParticles)
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseenter', handleMouseEnter, { passive: true })

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  useEffect(() => {
    if (particles.length === 0) return

    const animate = () => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          distance: p.distance + 2,
          opacity: Math.max(0, 1 - p.distance / 100)
        })).filter(p => p.opacity > 0.05)

        if (updated.length > 0) {
          animationFrame.current = requestAnimationFrame(animate)
        }
        return updated
      })
    }

    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [particles.length > 0])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'contents'
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <defs>
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#D3FD50" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D3FD50" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {particles.map(particle => {
          const x = mousePos.current.x + Math.cos(particle.angle) * particle.distance
          const y = mousePos.current.y + Math.sin(particle.angle) * particle.distance

          return (
            <circle
              key={particle.id}
              cx={x}
              cy={y}
              r={particle.size}
              fill="url(#particleGradient)"
              opacity={particle.opacity}
              filter="url(#glow)"
            />
          )
        })}

        <circle
          cx={mousePos.current.x}
          cy={mousePos.current.y}
          r="8"
          fill="none"
          stroke="#D3FD50"
          strokeWidth="2"
          opacity="0.3"
          filter="url(#glow)"
        >
          <animate
            attributeName="r"
            from="4"
            to="20"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <div
        className="absolute w-32 h-32 rounded-full pointer-events-auto cursor-none transition-opacity duration-300 hover:opacity-100 opacity-0"
        style={{
          left: mousePos.current.x - 64,
          top: mousePos.current.y - 64,
          background: 'radial-gradient(circle, rgba(211, 253, 80, 0.1), transparent 70%)',
          filter: 'blur(20px)'
        }}
      />

      <div className="absolute bottom-8 right-8 text-[#D3FD50]/30 text-sm font-[font1] animate-pulse">
        
      </div>
    </div>
  )
}

export default MouseFollower
