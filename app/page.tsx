"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { IntroAnimation, INTRO_DURATION_MS, HERO_REVEAL_MS } from "@/components/intro-animation"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"
import { HoldToBlast } from "@/components/hold-to-blast"
import { IncomeStructureSection } from "@/components/income-structure"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] bg-white overflow-hidden transition-all duration-700 hover:border-black/[0.15] hover:bg-[#fafaf8] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      {/* Hover glow spot */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.03), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FinanceInterestPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  // Start video zoom slightly before hero content reveals, for seamless overlap
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] text-[#111] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">

        {/* Video background — zooms in once intro is done */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4"
          style={{
            transform: videoReady ? "scale(1.05)" : "scale(0.85)",
            transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Progressive blur + light gradient rising from bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "linear-gradient(to top, #F5F4F0 0%, #F5F4F0 18%, rgba(245,244,240,0.85) 35%, rgba(245,244,240,0.5) 55%, rgba(245,244,240,0.15) 75%, transparent 100%)" }} />
        {/* Backdrop blur layers — progressively lighter toward top */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "38%", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "55%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        {/* Spacer so hero content doesn't sit under the fixed nav */}
        <div className="h-20" />

        {/* Title + metrics — anchored to bottom left */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col px-6 md:px-12 pb-12 max-w-3xl">
          {/* Tagline */}
          <div
            className="text-xs tracking-widest text-black/50 mb-3 uppercase font-mono"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0px)" : "translateY(15px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 50ms, transform 1s cubic-bezier(0.16,1,0.3,1) 50ms",
            }}
          >
            Est. 2024 · Smart finance platform
          </div>

          {/* Title */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-light text-[#111] leading-[1.0] tracking-tight mb-8"
            style={{
              fontFamily: '"IBM Plex Sans", sans-serif',
              opacity: heroReady ? 1 : 0,
              filter: heroReady ? "blur(0px)" : "blur(24px)",
              transform: heroReady ? "translateY(0px)" : "translateY(32px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 100ms, filter 1s cubic-bezier(0.16,1,0.3,1) 100ms, transform 1s cubic-bezier(0.16,1,0.3,1) 100ms",
            }}
          >
            Built to grow<br />wealth with<br />confidence.
          </h1>

          <p
            className="text-sm text-black/60 leading-relaxed mb-8 max-w-lg"
            style={{
              opacity: heroReady ? 1 : 0,
              transform: heroReady ? "translateY(0px)" : "translateY(20px)",
              transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 200ms, transform 1s cubic-bezier(0.16,1,0.3,1) 200ms",
            }}
          >
            Investment plans, compounding returns, and multi-level income — built for clarity, scale, and lasting growth.
          </p>

          {/* 3 metrics — staggered after title */}
          <div className="flex gap-8 sm:gap-12 items-center">
            {[
              { value: "2% – 4%", label: "Daily Returns" },
              { value: "75 Days", label: "Compounding" },
              { value: "10%", label: "Direct Income" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${300 + i * 80}ms`,
                }}
              >
                <div className="text-3xl sm:text-4xl text-[#111] font-light tracking-tight font-mono">{stat.value}</div>
                <div className="text-[10px] text-black/40 tracking-widest uppercase mt-1 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLL MARQUEE 1 ──────────────────────────────────────────────── */}
      <section className="py-0 border-y border-black/[0.06] overflow-hidden select-none bg-[#faf9f6]">
        <div className="flex" style={{ animation: "marqueeLeft 25s linear infinite" }}>
          {[...Array(4)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Grow", "Compound", "Prosper", "Grow", "Compound", "Prosper"].map((cap, idx) => (
                <div key={idx} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] shrink-0 font-light tracking-widest text-sm uppercase">
                  <span>{cap}</span>
                  <span className="text-black/25 font-normal">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── HOLD TO BLAST INTERACTIVE ZONE ────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 border-b border-black/[0.06] bg-[#f9f8f4]">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <Tag>INTERACTIVE NODE</Tag>
          <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
            Dare ⚡ to touch the lines · Hold to blast
          </h2>
          <p className="mt-2 text-xs text-black/40">
            Interact with real-time yielding lines and unlock wealth compounding triggers.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <HoldToBlast />
        </div>
      </section>

      {/* ── SCROLL MARQUEE 2 ──────────────────────────────────────────────── */}
      <section className="py-0 border-b border-black/[0.06] overflow-hidden select-none bg-white">
        <div className="flex" style={{ animation: "marqueeRight 35s linear infinite" }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {[
                "2% Daily Returns", "3% Green Plan", "4% Red Plan", 
                "10% Direct Income", "75 Days Compounding", "8-Level Referral", 
                "Bank-Grade Security", "Live Analytics"
              ].map((cap, idx) => (
                <div key={idx} className="flex items-center gap-6 px-12 py-4 border-r border-black/[0.06] shrink-0 text-xs tracking-wider text-black/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── KEY FACTS ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div>
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>✦ From plan to payout</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Key facts"}
            </RevealText>
            <p className="mt-4 text-sm text-black/45 leading-relaxed">
              A snapshot of our platform experience and investor impact.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { val: 3, suf: "", desc: "Investment plans with daily compounding returns" },
              { val: 10, suf: "%", desc: "Direct referral income on every new investor" },
              { val: 8, suf: "", desc: "Levels of network referral commission depth" },
              { val: 75, suf: "+", desc: "Days of compounding growth per investment cycle" },
            ].map((fact, i) => (
              <div key={i} className="p-6 rounded-2xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="text-4xl font-light text-black font-mono">
                  <Counter end={fact.val} suffix={fact.suf} />
                </div>
                <div className="text-xs text-black/45 mt-2 leading-relaxed">{fact.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES (Bento grid) ─────────────────────────────────────────── */}
      <section id="features" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>SERVICES</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {"Everything you need\nto grow."}
            </RevealText>
            <p className="mt-4 text-sm text-black/45 max-w-md leading-relaxed">
              Powerful tools for modern finance — from portfolio tracking to automated reporting and API integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onMouseMove={handleMouse}>
            
            {/* Service 1 */}
            <BentoCard className="p-8 min-h-[220px] flex flex-col justify-between" delay={0}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <h3 className="text-lg font-light mb-2">Real-time Analytics</h3>
                <p className="text-xs text-black/45 leading-relaxed">Track portfolio performance, cash flow, and market trends with live dashboards updated every second.</p>
              </div>
            </BentoCard>

            {/* Service 2 */}
            <BentoCard className="p-8 min-h-[220px] flex flex-col justify-between" delay={60}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 className="text-lg font-light mb-2">Bank-grade Security</h3>
                <p className="text-xs text-black/45 leading-relaxed">256-bit encryption, multi-factor authentication, and SOC 2 compliance keep your assets protected.</p>
              </div>
            </BentoCard>

            {/* Service 3 */}
            <BentoCard className="p-8 min-h-[220px] flex flex-col justify-between" delay={120}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h3 className="text-lg font-light mb-2">Smart Budgeting</h3>
                <p className="text-xs text-black/45 leading-relaxed">AI-powered spending insights help you allocate resources and hit savings goals automatically.</p>
              </div>
            </BentoCard>

            {/* Service 4 */}
            <BentoCard className="p-8 min-h-[220px] flex flex-col justify-between" delay={180}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3 className="text-lg font-light mb-2">Multi-currency</h3>
                <p className="text-xs text-black/45 leading-relaxed">Manage accounts in 40+ currencies with real-time exchange rates and seamless conversions.</p>
              </div>
            </BentoCard>

            {/* Service 5 */}
            <BentoCard className="p-8 min-h-[220px] flex flex-col justify-between" delay={240}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h3 className="text-lg font-light mb-2">Automated Reports</h3>
                <p className="text-xs text-black/45 leading-relaxed">Generate tax-ready reports, P&L statements, and custom exports on a schedule you define.</p>
              </div>
            </BentoCard>

            {/* Service 6 */}
            <BentoCard className="p-8 min-h-[220px] flex flex-col justify-between" delay={300}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 bg-black/[0.02] flex items-center justify-center mb-6">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <h3 className="text-lg font-light mb-2">API Integration</h3>
                <p className="text-xs text-black/45 leading-relaxed">Connect banks, payment processors, and accounting tools through our robust REST API.</p>
              </div>
            </BentoCard>

          </div>
        </div>
      </section>

      {/* ── PLANS (Stacking cards) ────────────────────────────────────────── */}
      <section id="plans" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#fdfdfc]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="pricing" size={40} />
              <div className="mt-4"><Tag>INVESTMENT PLANS</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Choose your plan & start\ncompounding daily yield."}
              </RevealText>
            </div>
            <div className="text-sm text-black/45 leading-relaxed max-w-xs">
              Yellow (2%), Green (3%), or Red (4%) daily returns over 75 days. Markets closed Saturday & Sunday.
            </div>
          </div>

          <StackingAgentCards />
        </div>
      </section>

      {/* ── INCOME STRUCTURE (Calculator + rules) ─────────────────────────── */}
      <IncomeStructureSection />

      {/* ── GATEWAYS & INTEGRATIONS ───────────────────────────────────────── */}
      <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#FAF9F5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>GATEWAYS</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Seamless deposits.\nGlobal transfers."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 leading-relaxed max-w-xs">
              We support standard crypto networks and fiat wires. Fund your compounding plans instantly and securely.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-black/[0.07] flex flex-col md:block md:relative" onMouseMove={handleMouse}>
            {/* Architectural connection visual image */}
            <div className="relative w-full h-[280px] md:h-[480px] shrink-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Org%20Arc%20-%20Upscaled-Sk90jShfu7nltLnhoQbaMJC1YaQKuU.png"
                alt="Fintech nodes architecture"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>

            {/* Float details */}
            <div className="flex flex-col gap-3 p-4 md:absolute md:bottom-4 md:right-4 md:p-0 md:w-72">
              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <Tag>STABILITY</Tag>
                <h3 className="mt-3 text-lg font-light mb-2">Automated Settlement</h3>
                <p className="text-xs text-black/45 leading-relaxed mb-4">Payouts are calculated hourly and batch-distributed automatically to wallets starting daily at 9:00 AM.</p>
                <div className="bg-black/[0.05] rounded-lg border border-black/[0.07] p-3 font-mono text-[11px] text-black/50 leading-relaxed">
                  <span className="text-black/25">// payout node script</span><br />
                  <span className="text-blue-600/70">calculateYield</span>{"({"}<br />
                  {"  "}<span className="text-amber-700/70">plan</span>: <span className="text-green-700/70">&apos;green&apos;</span>,<br />
                  {"  "}<span className="text-amber-700/70">rate</span>: <span className="text-black/35">0.03</span>,<br />
                  {"  "}<span className="text-blue-600/70">compound</span>: <span className="text-black/35">true</span><br />
                  {"})"}
                </div>
              </div>

              <div
                className="rounded-xl border border-white/50 p-6"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(255,255,255,0.60)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  <span className="text-xs text-black/40 tracking-widest">GATEWAY STATUS</span>
                </div>
                <p className="text-sm text-black/45">Fully audited smart contracts. Multiple endpoints to monitor deposits, yields, and withdraw requests.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE TRANSACTIONS ─────────────────────────────────────────────── */}
      <section id="live" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>LIVE TRANSACTIONS</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
                {"Active portfolios\nworking 24 / 7."}
              </RevealText>
              <p className="mt-6 text-sm text-black/40 leading-relaxed max-w-sm">
                At any moment, thousands of investors are funding plans, compounding profits, and collecting multi-level referral rewards globally.
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 text-sm mb-1 tracking-wide">portfolios compounding active</span>
              </div>
            </div>
            <div className="relative">
              <LiveAgentFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT FINANCE INTEREST ─────────────────────────────────────────── */}
      <section id="about" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#F7F6F2]">
        <div className="max-w-4xl mx-auto text-center">
          <PixelIcon type="platform" size={40} />
          <div className="mt-4"><Tag>OUR MISSION</Tag></div>
          
          <h2 className="mt-8 text-4xl md:text-5xl font-light tracking-tight leading-tight">
            A smart finance platform for meaningful wealth growth.
          </h2>
          
          <div className="mt-8 space-y-6 text-sm text-black/55 leading-relaxed max-w-2xl mx-auto text-left sm:text-center">
            <p>
              We design for longevity — clarity first, compounding always, built to scale your portfolio across plans and referral income.
            </p>
            <p>
              Our mission is to make wealth growth feel intuitive by building financial products that are purposeful, transparent, and meaningful to every investor.
            </p>
          </div>

          <div className="mt-12">
            <a 
              href="#plans" 
              className="inline-flex px-8 py-3 bg-[#111] text-white hover:bg-[#333] transition-colors rounded-xl text-xs tracking-widest font-medium uppercase"
            >
              Explore plans
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA / START TODAY ─────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden bg-white">
        {/* Glass panels footer graphic */}
        <img
          src="/images/footer.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
          style={{ opacity: 0.85 }}
        />
        {/* Progressive blur from bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
          }}
        />
        {/* Colour fade to match page bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgb(245,244,240) 0%, rgba(245,244,240,0.92) 18%, rgba(245,244,240,0.55) 35%, transparent 55%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
            Ready to grow your<br />wealth with confidence?
          </h2>
          <p className="text-sm text-black/45 leading-relaxed mb-10">
            Join thousands of investors on Finance Interest. Choose your plan and start compounding today.
          </p>

          {!submitted ? (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-black/25 focus:outline-none focus:border-black/25 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[#111] text-white text-sm rounded-xl hover:bg-[#333] transition-colors tracking-widest font-medium"
              >
                GET STARTED
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/20 bg-emerald-50 text-emerald-700 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {"Registration submitted. Redirecting to deposit nodes..."}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-16 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#fbfbfa]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Brand details */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#111] flex items-center justify-center text-white text-[11px] font-black tracking-tighter">FI</div>
              <span className="font-sans font-bold text-xs tracking-[0.15em] text-black/85 uppercase">Finance Interest</span>
            </div>
            <p className="text-xs text-black/40 leading-relaxed">
              Smart investment plans with compounding returns and multi-level income — built for your financial growth.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs tracking-widest uppercase font-semibold text-black/60">Navigate</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Features",     href: "#features" },
                { label: "Plans",        href: "#plans" },
                { label: "Income",       href: "#income" },
                { label: "About",        href: "#about" },
                { label: "Contact",      href: "#about" },
              ].map(l => (
                <a key={l.label} href={l.href} className="text-xs text-black/35 hover:text-black/70 transition-colors tracking-widest">{l.label}</a>
              ))}
            </div>
          </div>

          {/* Col 3: Business Support Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs tracking-widest uppercase font-semibold text-black/60">Business enquiry</h4>
            <div className="space-y-1.5 text-xs text-black/35">
              <div>Email: <a href="mailto:support@financeinterest.com" className="hover:text-black/60 underline">support@financeinterest.com</a></div>
              <div>Phone: <a href="tel:+18005550199" className="hover:text-black/60 underline">+1 (800) 555-0199</a></div>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-black/20">© 2026 Finance Interest. All rights reserved.</span>
          <span className="text-[10px] text-black/30 tracking-widest font-mono">Grow · Compound · Prosper</span>
        </div>
      </footer>
    </div>
  )
}
