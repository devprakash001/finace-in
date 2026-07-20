"use client"

import { useEffect, useRef, useState } from "react"

const PLANS = [
  {
    label: "YELLOW PLAN",
    title: "Yellow Compounding Plan",
    desc: "Earn 2% daily return over a 75-day compounding cycle. Saturday & Sunday markets are closed. Ideal for new investors seeking steady, low-risk growth.",
    stats: [{ v: "2.0%", l: "daily return" }, { v: "75 Days", l: "duration" }, { v: "Compounding", l: "type" }],
    gradient: "radial-gradient(circle at 70% 30%, rgba(234, 179, 8, 0.28) 0%, rgba(254, 240, 138, 0.08) 50%, transparent 100%)",
    buttonText: "Join Yellow Plan",
    tagline: "Ideal for new investors"
  },
  {
    label: "GREEN PLAN",
    title: "Green Compounding Plan (Most Popular)",
    desc: "Earn 3% daily return over a 75-day compounding cycle. Saturday & Sunday markets are closed. The most chosen plan, balancing scale and high compounding potential.",
    stats: [{ v: "3.0%", l: "daily return" }, { v: "75 Days", l: "duration" }, { v: "Compounding", l: "type" }],
    gradient: "radial-gradient(circle at 70% 30%, rgba(34, 197, 94, 0.28) 0%, rgba(220, 252, 231, 0.08) 50%, transparent 100%)",
    buttonText: "Join Green Plan",
    tagline: "Most popular choice"
  },
  {
    label: "RED PLAN",
    title: "Red Compounding Plan",
    desc: "Earn 4% daily return over a 75-day compounding cycle. Saturday & Sunday markets are closed. Maximum earning potential built for ambitious portfolios.",
    stats: [{ v: "4.0%", l: "daily return" }, { v: "75 Days", l: "duration" }, { v: "Compounding", l: "type" }],
    gradient: "radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.28) 0%, rgba(254, 226, 226, 0.08) 50%, transparent 100%)",
    buttonText: "Join Red Plan",
    tagline: "Maximum yield potential"
  },
]

const STICKY_TOP   = 80
const STICKY_STEP  = 16
const SCALE_STEP   = 0.04
const OFFSET_STEP  = 8

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

export function StackingAgentCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [depth, setDepth] = useState<number[]>(PLANS.map(() => 0))

  useEffect(() => {
    function onScroll() {
      const nextDepth = PLANS.map((_, i) => {
        let count = 0
        for (let j = i + 1; j < PLANS.length; j++) {
          const el = cardRefs.current[j]
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP
          if (rect.top <= stickyTopJ + 2) count++
        }
        return count
      })
      setDepth(nextDepth)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {PLANS.map((plan, i) => {
        const d         = depth[i]
        const scale     = 1 - d * SCALE_STEP
        const translateY = d * OFFSET_STEP

        return (
          <div
            key={plan.label}
            ref={el => { cardRefs.current[i] = el }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform:      `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition:     "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange:     "transform",
              }}
            >
              <div className="group relative bg-[#faf9f7] rounded-2xl border border-black/[0.07] overflow-hidden cursor-pointer p-8">
                {/* ── MOBILE: gradient top, fades out at bottom ── */}
                <div
                  className="absolute top-0 inset-x-0 h-52 pointer-events-none md:hidden"
                  style={{
                    background: plan.gradient,
                    maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
                  }}
                />

                {/* ── DESKTOP: gradient right, fades out at left ── */}
                <div
                  className="hidden md:block absolute inset-y-0 right-0 w-1/2 pointer-events-none"
                  style={{
                    background: plan.gradient,
                    maskImage: "linear-gradient(to right, transparent 0%, black 100%)",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 100%)",
                  }}
                />

                {/* Text content */}
                <div className="relative z-10">
                  <div className="md:max-w-[60%]">
                    <div className="flex items-center justify-between mb-6">
                      <Tag>{plan.label}</Tag>
                      <span className="text-xs text-black/40 italic font-light">{plan.tagline}</span>
                    </div>
                    <h3 className="text-2xl font-light mb-3">{plan.title}</h3>
                    <p className="text-sm text-black/45 leading-relaxed mb-8">{plan.desc}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-8 py-6 border-t border-black/[0.06] md:max-w-[60%]">
                    {plan.stats.map(s => (
                      <div key={s.l} className="min-w-[100px]">
                        <div className="text-2xl font-light">{s.v}</div>
                        <div className="text-[11px] text-black/35 tracking-widest mt-0.5 uppercase">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button className="px-6 py-2.5 bg-[#111] text-white hover:bg-[#333] transition-colors rounded-xl text-xs tracking-widest font-medium">
                      {plan.buttonText.toUpperCase()}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
