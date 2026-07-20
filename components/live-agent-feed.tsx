"use client"

import { useEffect, useState, useRef } from "react"

const INVESTOR_NAMES = [
  "investor-7f2a", "wealth-3b1c", "compound-9d4e", "grow-2c8f",
  "yield-5a3d", "capital-1e9b", "portfolio-4f2c", "alpha-8d1a",
  "saver-6b3e", "finance-0c7f",
]

const TRANSACTIONS = [
  "Deposited $1,250 into Green Plan",
  "Withdrew $340.50 compounding profit",
  "Reinvested $5,000 into Red Plan",
  "Earned $125.00 Level 1 Direct Income",
  "Earned $15.00 Level 3 Referral Income",
  "Deposited $800 into Yellow Plan",
  "Reinvested $1,500 into Green Plan",
  "Earned $500.00 Level 1 Direct Income",
  "Withdrew $1,200.00 to crypto wallet",
  "Deposited $10,000 into Red Plan",
  "Compounded $450.00 in Yellow Plan",
  "Earned $40.00 Level 2 Referral Income",
  "Deposited $2,500 into Green Plan",
  "Withdrew $90.00 compounding balance",
]

const NETWORKS = ["USDT-TRC20", "BTC Network", "ETH Network", "USDC-ERC20", "Bank Wire"]
const STATUSES = [
  { label: "completed",  color: "#10b981" },
  { label: "completed",  color: "#10b981" },
  { label: "completed",  color: "#10b981" },
  { label: "processing", color: "#f59e0b" },
  { label: "completed",  color: "#10b981" },
]

type TransactionRow = {
  id: string
  name: string
  task: string
  region: string
  status: typeof STATUSES[number]
  progress: number
  elapsed: string
  key: number
}

function randomRow(key: number): TransactionRow {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    name: INVESTOR_NAMES[Math.floor(Math.random() * INVESTOR_NAMES.length)],
    task: TRANSACTIONS[Math.floor(Math.random() * TRANSACTIONS.length)],
    region: NETWORKS[Math.floor(Math.random() * NETWORKS.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    progress: Math.floor(Math.random() * 85 + 10),
    elapsed: `${Math.floor(Math.random() * 14 + 1)}m ${Math.floor(Math.random() * 59)}s`,
    key,
  }
}

// Animated progress bar that slowly ticks forward
function ProgressBar({ initial }: { initial: number }) {
  const [pct, setPct] = useState(initial)
  const rafRef = useRef<number>(0)
  const pctRef = useRef(initial)

  useEffect(() => {
    const tick = () => {
      pctRef.current = Math.min(99, pctRef.current + 0.015)
      setPct(Math.round(pctRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div style={{ width: "100%", height: 2, background: "rgba(0,0,0,0.08)", borderRadius: 9 }}>
      <div style={{
        height: "100%", borderRadius: 9,
        width: `${pct}%`,
        background: "rgba(0,0,0,0.35)",
        transition: "width 0.5s linear",
      }} />
    </div>
  )
}

// Stable seed rows — same on server and client, no random values
const SEED_ROWS: TransactionRow[] = [
  { id: "A1B2C3", name: "investor-7f2a",  task: "Deposited $1,250 into Green Plan",    region: "USDT-TRC20",  status: STATUSES[0], progress: 100, elapsed: "3m 12s", key: 0 },
  { id: "D4E5F6", name: "wealth-3b1c",    task: "Reinvested $5,000 into Red Plan",     region: "BTC Network", status: STATUSES[0], progress: 100, elapsed: "7m 48s", key: 1 },
  { id: "G7H8I9", name: "grow-2c8f",      task: "Withdrew $340.50 compounding profit", region: "ETH Network", status: STATUSES[3], progress: 85,  elapsed: "1m 05s", key: 2 },
  { id: "J0K1L2", name: "yield-5a3d",     task: "Earned $125.00 Level 1 Direct Income",region: "USDC-ERC20", status: STATUSES[0], progress: 100, elapsed: "5m 30s", key: 3 },
  { id: "M3N4O5", name: "alpha-8d1a",     task: "Deposited $10,000 into Red Plan",     region: "Bank Wire",   status: STATUSES[0], progress: 100, elapsed: "11m 22s", key: 4 },
  { id: "P6Q7R8", name: "saver-6b3e",     task: "Compounded $450.00 in Yellow Plan",   region: "USDT-TRC20",  status: STATUSES[4], progress: 100, elapsed: "14m 01s", key: 5 },
]

export function LiveAgentFeed() {
  const [rows, setRows] = useState<TransactionRow[]>(SEED_ROWS)
  const [mounted, setMounted] = useState(false)
  const keyRef = useRef(100)

  useEffect(() => {
    setMounted(true)
    setRows(Array.from({ length: 6 }, (_, i) => randomRow(i)))

    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [...prev.slice(1), randomRow(keyRef.current)])
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 16,
      overflow: "hidden",
      background: "rgba(255,255,255,0.7)",
    }}>
      {/* Table header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr 100px 80px",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(0,0,0,0.03)",
      }}>
        {["INVESTOR", "TRANSACTION", "ASSET / NETWORK", "STATUS"].map(h => (
          <span key={h} style={{ fontSize: 8, letterSpacing: "0.16em", color: "rgba(0,0,0,0.30)", fontFamily: "monospace" }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div style={{ overflow: "hidden" }}>
        {rows.map((row, i) => (
          <div
            key={row.key}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 100px 80px",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
              gap: 8,
              alignItems: "center",
              animation: i === rows.length - 1 ? "rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
            }}
          >
            {/* Investor */}
            <div>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(0,0,0,0.65)", marginBottom: 1 }}>{row.name}</div>
              <div style={{ fontSize: 7.5, fontFamily: "monospace", color: "rgba(0,0,0,0.25)" }}>#{row.id}</div>
            </div>

            {/* Transaction + progress */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 9, color: "rgba(0,0,0,0.50)", lineHeight: 1.35, marginBottom: 5,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{row.task}</div>
              <ProgressBar initial={row.progress} />
            </div>

            {/* Network */}
            <div style={{ fontSize: 8, fontFamily: "monospace", color: "rgba(0,0,0,0.30)" }}>{row.region}</div>

            {/* Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: row.status.color,
                boxShadow: row.status.label === "processing" ? `0 0 6px ${row.status.color}` : "none",
                animation: row.status.label === "processing" ? "statusPulse 2s ease-in-out infinite" : "none",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 8, fontFamily: "monospace", color: "rgba(0,0,0,0.35)" }}>{row.status.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export function LiveAgentCounter() {
  const [count, setCount] = useState(6492)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.random() * 3 - 1))
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <span style={{
      fontFamily: "monospace",
      fontSize: "clamp(3rem, 6vw, 5rem)",
      fontWeight: 300,
      color: "rgba(0,0,0,0.85)",
      lineHeight: 1,
      letterSpacing: "-0.02em",
      transition: "color 0.3s ease",
    }}>
      {mounted ? count.toLocaleString("en-US") : "6,492"}
    </span>
  )
}
