"use client"

import React, { useRef, useEffect, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  type: "coin" | "arrow" | "text" | "spark"
  text?: string
  color: string
  size: number
  alpha: number
  rotation: number
  rotationSpeed: number
  bounceCount: number
}

export function HoldToBlast() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Interactive state
  const [isHolding, setIsHolding] = useState(false)
  const [charge, setCharge] = useState(0) // 0 to 100
  const [blasted, setBlasted] = useState(false)
  const [blastInfo, setBlastInfo] = useState("")

  // Refs for animation loop variables (to avoid re-renders)
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    isMouseOver: false,
    particles: [] as Particle[],
    isHolding: false,
    charge: 0,
    blasted: false,
    time: 0,
  })

  // Sync React state to animation loop refs
  useEffect(() => {
    stateRef.current.isHolding = isHolding
  }, [isHolding])

  useEffect(() => {
    stateRef.current.blasted = blasted
  }, [blasted])

  // Canvas size and physics loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      canvas.width = (rect?.width || 800) * (window.devicePixelRatio || 1)
      canvas.height = 300 * (window.devicePixelRatio || 1)
      canvas.style.width = "100%"
      canvas.style.height = "300px"
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Helper to spawn a burst of particles
    const spawnBlast = (x: number, y: number) => {
      const newParticles: Particle[] = []
      const blastTexts = ["+2% DAILY", "+3% GREEN", "+4% RED", "+10% DIRECT", "75 DAYS", "FINANCE", "INTEREST", "COMPOUND"]
      const colors = ["#EAB308", "#22C55E", "#EF4444", "#3B82F6", "#EC4899"]

      // Spawn coins and sparks
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 12 + 4
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        let type: Particle["type"] = "spark"
        if (Math.random() > 0.6) type = "coin"
        else if (Math.random() > 0.8) type = "arrow"

        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 3, // slightly upward bias
          type,
          color,
          size: Math.random() * 8 + 4,
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          bounceCount: 0,
        })
      }

      // Spawn text particles
      blastTexts.forEach((txt, idx) => {
        const angle = (idx / blastTexts.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const speed = Math.random() * 6 + 3
        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          type: "text",
          text: txt,
          color: colors[idx % colors.length],
          size: 11,
          alpha: 1,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          bounceCount: 0,
        })
      })

      stateRef.current.particles = [...stateRef.current.particles, ...newParticles]
    };

    // Draw loops
    const draw = () => {
      const W = canvas.width / (window.devicePixelRatio || 1)
      const H = canvas.height / (window.devicePixelRatio || 1)
      stateRef.current.time += 0.02
      const t = stateRef.current.time

      ctx.clearRect(0, 0, W, H)

      // ── Draw background grid lines ──
      ctx.strokeStyle = "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // ── Draw interactive financial lines (wavy string curves) ──
      const lines = [
        { label: "Yellow (2%)", y: H * 0.35, color: "rgba(234, 179, 8, 0.4)", activeColor: "rgba(234, 179, 8, 0.8)", amp: 12, freq: 0.005 },
        { label: "Green (3%)", y: H * 0.50, color: "rgba(34, 197, 94, 0.4)", activeColor: "rgba(34, 197, 94, 0.8)", amp: 18, freq: 0.007 },
        { label: "Red (4%)", y: H * 0.65, color: "rgba(239, 68, 68, 0.4)", activeColor: "rgba(239, 68, 68, 0.8)", amp: 15, freq: 0.006 },
      ]

      lines.forEach((line) => {
        ctx.beginPath()
        ctx.lineWidth = 2
        
        let hoveredSegment = false

        for (let x = 0; x <= W; x += 5) {
          // Base wavy height
          let waveY = line.y + Math.sin(x * line.freq + t * 2) * line.amp

          // Pull/spring force if cursor is close to the line
          if (stateRef.current.isMouseOver) {
            const dx = x - stateRef.current.mouseX
            const dy = waveY - stateRef.current.mouseY
            const dist = Math.sqrt(dx * dx + dy * dy)
            
            if (dist < 80) {
              hoveredSegment = true
              // Bending factor: stronger closer to mouse
              const bend = (1 - dist / 80) * 0.7
              waveY = waveY + (stateRef.current.mouseY - waveY) * bend

              // Spawn mild hover sparkles occasionally
              if (Math.random() > 0.95 && Math.abs(x - stateRef.current.mouseX) < 10) {
                stateRef.current.particles.push({
                  x,
                  y: waveY,
                  vx: (Math.random() - 0.5) * 2,
                  vy: (Math.random() - 0.5) * 2 - 1,
                  type: "spark",
                  color: line.activeColor,
                  size: Math.random() * 3 + 1,
                  alpha: 0.8,
                  rotation: 0,
                  rotationSpeed: 0,
                  bounceCount: 0,
                })
              }
            }
          }

          if (x === 0) {
            ctx.moveTo(x, waveY)
          } else {
            ctx.lineTo(x, waveY)
          }
        }

        ctx.strokeStyle = hoveredSegment ? line.activeColor : line.color
        ctx.stroke()
      })

      // ── Handle Charging Mechanics ──
      if (stateRef.current.isHolding && !stateRef.current.blasted) {
        stateRef.current.charge = Math.min(100, stateRef.current.charge + 1.25)
        setCharge(Math.round(stateRef.current.charge))

        const cx = stateRef.current.mouseX
        const cy = stateRef.current.mouseY

        // Spawn charging pull particles
        if (Math.random() > 0.3) {
          const angle = Math.random() * Math.PI * 2
          const dist = Math.random() * 60 + 20
          stateRef.current.particles.push({
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            vx: -Math.cos(angle) * (dist * 0.08), // sucked in
            vy: -Math.sin(angle) * (dist * 0.08),
            type: "spark",
            color: "#EAB308",
            size: Math.random() * 4 + 1,
            alpha: 0.8,
            rotation: 0,
            rotationSpeed: 0,
            bounceCount: 0,
          })
        }

        // Draw charge circular meter around mouse
        ctx.beginPath()
        ctx.arc(cx, cy, 24, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (stateRef.current.charge / 100)))
        ctx.strokeStyle = "#EAB308"
        ctx.lineWidth = 3
        ctx.stroke()

        // Draw pulsing core
        const pulse = 6 + Math.sin(t * 15) * 2
        ctx.beginPath()
        ctx.arc(cx, cy, pulse, 0, Math.PI * 2)
        ctx.fillStyle = "#EAB308"
        ctx.fill()

        // Text display
        ctx.fillStyle = "#111"
        ctx.font = "bold 9px monospace"
        ctx.textAlign = "center"
        ctx.fillText(`POWER: ${Math.round(stateRef.current.charge)}%`, cx, cy - 35)

        // Trigger blast when fully charged
        if (stateRef.current.charge >= 100) {
          stateRef.current.blasted = true
          setBlasted(true)
          spawnBlast(cx, cy)
          setBlastInfo("BLAST COMPLETE! ⚡ COMPOUNDING PROTOCOLS ONLINE")
          
          // Auto-hide blast notification after 4 seconds
          setTimeout(() => {
            setBlasted(false)
            stateRef.current.blasted = false
            stateRef.current.charge = 0
            setCharge(0)
          }, 4000)
        }
      } else if (!stateRef.current.isHolding && stateRef.current.charge > 0) {
        // Drain charge slowly if let go
        stateRef.current.charge = Math.max(0, stateRef.current.charge - 3)
        setCharge(Math.round(stateRef.current.charge))
      }

      // ── Update and Draw Particles ──
      const updatedParticles: Particle[] = []
      stateRef.current.particles.forEach((p) => {
        // Physics update
        p.vy += 0.25 // Gravity
        p.vx *= 0.98 // Air resistance
        p.vy *= 0.98 // Air resistance
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Bouncing on the bottom of the canvas (H)
        const radius = p.type === "text" ? 5 : p.size / 2
        if (p.y + radius >= H) {
          p.y = H - radius
          p.vy = -Math.abs(p.vy) * 0.55 // bounce
          p.vx *= 0.7 // friction
          p.bounceCount++
        }

        // Bouncing on left/right walls
        if (p.x - radius <= 0) {
          p.x = radius
          p.vx = Math.abs(p.vx) * 0.6
        } else if (p.x + radius >= W) {
          p.x = W - radius
          p.vx = -Math.abs(p.vx) * 0.6
        }

        // Fade out
        if (p.bounceCount > 3 || p.y >= H - 1) {
          p.alpha -= 0.02
        } else if (p.type === "text") {
          p.alpha -= 0.008 // Text lasts longer
        } else {
          p.alpha -= 0.005
        }

        if (p.alpha > 0.01) {
          ctx.save()
          ctx.globalAlpha = p.alpha

          if (p.type === "coin") {
            // Draw gold coin circle with inner details
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.fill()
            ctx.strokeStyle = "rgba(0,0,0,0.15)"
            ctx.lineWidth = 1
            ctx.stroke()
            
            // Inner coin star/details
            ctx.beginPath()
            ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
            ctx.fill()
          } else if (p.type === "arrow") {
            // Draw upward pointing investment arrow
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            
            ctx.beginPath()
            ctx.moveTo(0, -p.size)
            ctx.lineTo(p.size * 0.7, p.size * 0.4)
            ctx.lineTo(p.size * 0.3, p.size * 0.4)
            ctx.lineTo(p.size * 0.3, p.size)
            ctx.lineTo(-p.size * 0.3, p.size)
            ctx.lineTo(-p.size * 0.3, p.size * 0.4)
            ctx.lineTo(-p.size * 0.7, p.size * 0.4)
            ctx.closePath()
            ctx.fillStyle = "#10B981"
            ctx.fill()
          } else if (p.type === "text" && p.text) {
            // Draw premium typography text
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            ctx.font = "bold 10px sans-serif"
            ctx.fillStyle = p.color
            ctx.strokeStyle = "white"
            ctx.lineWidth = 3
            ctx.strokeText(p.text, 0, 0)
            ctx.fillText(p.text, 0, 0)
          } else {
            // Spark: tiny simple circle/square
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.fill()
          }

          ctx.restore()
          updatedParticles.push(p)
        }
      })
      stateRef.current.particles = updatedParticles

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Event handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    stateRef.current.mouseX = e.clientX - rect.left
    stateRef.current.mouseY = e.clientY - rect.top
    stateRef.current.isMouseOver = true
  }

  const handleMouseLeave = () => {
    stateRef.current.isMouseOver = false
    setIsHolding(false)
  }

  const handleMouseDown = () => {
    if (!blasted) {
      setIsHolding(true)
    }
  }

  const handleMouseUp = () => {
    setIsHolding(false)
  }

  return (
    <div ref={containerRef} className="w-full relative select-none">
      {/* Interactive canvas zone */}
      <div 
        className="relative border border-black/[0.06] bg-black/[0.02] rounded-2xl overflow-hidden cursor-crosshair group"
        style={{ height: "300px" }}
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={(e) => {
            const touch = e.touches[0]
            const rect = canvasRef.current?.getBoundingClientRect()
            if (rect && touch) {
              stateRef.current.mouseX = touch.clientX - rect.left
              stateRef.current.mouseY = touch.clientY - rect.top
              stateRef.current.isMouseOver = true
              if (!blasted) setIsHolding(true)
            }
          }}
          onTouchEnd={() => setIsHolding(false)}
          onTouchMove={(e) => {
            const touch = e.touches[0]
            const rect = canvasRef.current?.getBoundingClientRect()
            if (rect && touch) {
              stateRef.current.mouseX = touch.clientX - rect.left
              stateRef.current.mouseY = touch.clientY - rect.top
            }
          }}
          className="absolute inset-0 z-10 block"
        />

        {/* Floating guidance overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pointer-events-none z-20">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-widest font-sans text-black/40 bg-white/60 border border-black/5 uppercase">
            {isHolding ? "HOLDING STEADY..." : "TOUCH & HOLD ON A LINE"}
          </div>

          {!blasted ? (
            <div className="flex flex-col items-center text-center">
              <div className="text-sm font-medium text-black/60 tracking-wider">
                {isHolding ? "RELEASING POWER INCOMING" : "DARE ⚡ TO TOUCH THE LINES"}
              </div>
              <div className="text-[11px] text-black/35 mt-1">
                {isHolding ? "Hold until progress charges 100%!" : "Click / Touch and hold anywhere on the grid to blast"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center animate-bounce">
              <div className="text-sm font-bold text-emerald-600 tracking-wider">
                ⚡ BLAST ACTIVATED ⚡
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Compounding returns active: 2% – 4% Daily Yield
              </div>
            </div>
          )}

          <div className="w-full max-w-xs bg-black/[0.05] rounded-full h-1 overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-100" 
              style={{ width: `${charge}%` }}
            />
          </div>
        </div>

        {/* Live background text marquee */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] font-black font-sans text-[12vw] tracking-wider pointer-events-none select-none">
          {isHolding ? "CHARGING" : blasted ? "BLASTED" : "INTEREST"}
        </div>
      </div>

      {/* Floating success banner */}
      {blasted && (
        <div className="absolute -top-12 inset-x-0 mx-auto max-w-md bg-emerald-50 border border-emerald-500/20 text-emerald-800 text-xs px-4 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2.5 animate-fadeIn z-30">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold tracking-wide">{blastInfo}</span>
        </div>
      )}
    </div>
  )
}
