"use client"

import React, { useState } from "react"

const REFERRAL_LEVELS = [
  { level: "Level 1", rate: 4 },
  { level: "Level 2", rate: 3 },
  { level: "Level 3", rate: 2 },
  { level: "Level 4", rate: 1 },
  { level: "Level 5", rate: 0.5 },
  { level: "Level 6", rate: 0.5 },
  { level: "Level 7", rate: 0.5 },
  { level: "Level 8", rate: 0.5 },
]

export function IncomeStructureSection() {
  const [activeTab, setActiveTab] = useState<"rules" | "calculator" | "timings">("rules")
  
  // Calculator state
  const [amount, setAmount] = useState<number>(1000)
  const [referralsPerUser, setReferralsPerUser] = useState<number>(3)

  // Calculations
  const directCommission = amount * 0.10
  
  // Calculate down the tree levels
  const levelData = REFERRAL_LEVELS.map((lev, index) => {
    // Number of users at this level = referralsPerUser ^ (index + 1)
    // To avoid ridiculous numbers, let's assume a realistic network depth:
    // e.g. Level 1 has referralsPerUser. Level 2 has referralsPerUser * referralsPerUser, but let's cap total users at level 8 for display sanity.
    const userCount = Math.pow(referralsPerUser, index + 1)
    // Rate is in percent
    const commissionPerUser = amount * (lev.rate / 100)
    const totalLevelEarnings = userCount * commissionPerUser

    return {
      level: lev.level,
      rate: lev.rate,
      users: userCount,
      earnings: totalLevelEarnings
    }
  })

  const totalReferralEarnings = levelData.reduce((acc, curr) => acc + curr.earnings, 0)
  const grandTotal = directCommission + totalReferralEarnings

  return (
    <section id="income" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#fdfdfb]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04] uppercase">
            Income Structure
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            Earn through direct referrals &<br />
            multi-level network rewards.
          </h2>
          <p className="mt-4 text-sm text-black/45 max-w-lg leading-relaxed">
            Our powerful 8-level network income plan is designed for clarity, scale, and lasting portfolio growth.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-black/[0.06] pb-4 mb-8">
          {[
            { id: "rules", label: "COMMISSION RATES" },
            { id: "calculator", label: "EARNINGS CALCULATOR" },
            { id: "timings", label: "TIMINGS & CLOSURES" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs tracking-widest font-medium px-4 py-2 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#111] text-white"
                  : "text-black/40 hover:text-black/70 hover:bg-black/[0.03]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[380px]">
          
          {/* Rules Tab */}
          {activeTab === "rules" && (
            <>
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-black/[0.07] bg-white p-8">
                  <div className="text-[11px] tracking-widest text-black/45 uppercase mb-2">Direct Referral</div>
                  <div className="text-5xl font-light text-black tracking-tight mb-4">10%</div>
                  <p className="text-xs text-black/40 leading-relaxed">
                    Earn an instant 10% direct income on the principal amount of every investor you directly refer to the Finance Interest platform. Uncapped earning potential.
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.07] bg-white p-8">
                  <div className="text-[11px] tracking-widest text-black/45 uppercase mb-2">Network Depth</div>
                  <div className="text-5xl font-light text-black tracking-tight mb-4">8 Levels</div>
                  <p className="text-xs text-black/40 leading-relaxed">
                    Commissions flow down 8 referral generations deep, letting you leverage passive income as your network grows.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 rounded-2xl border border-black/[0.07] bg-white p-8">
                <div className="text-xs text-black/30 tracking-widest uppercase mb-6 font-mono">8-Level Commission Breakdown</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {REFERRAL_LEVELS.map((lev, index) => (
                    <div key={lev.level} className="p-4 rounded-xl bg-black/[0.02] border border-black/[0.04] text-center hover:bg-black/[0.04] transition-colors">
                      <div className="text-[10px] text-black/35 tracking-widest uppercase font-mono">{lev.level}</div>
                      <div className="text-2xl font-light text-black mt-2">{lev.rate}%</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-black/[0.06] text-xs text-black/35 leading-relaxed">
                  ✦ Note: Commission is instantly credited to your wallet in the currency deposited by the referral. Withdrawals are processed daily subject to limits.
                </div>
              </div>
            </>
          )}

          {/* Calculator Tab */}
          {activeTab === "calculator" && (
            <>
              <div className="lg:col-span-5 rounded-2xl border border-black/[0.07] bg-white p-8 space-y-6">
                <h3 className="text-lg font-light text-black mb-4">Simulate Network Earnings</h3>
                
                {/* Investment principal input */}
                <div>
                  <label className="block text-xs text-black/45 uppercase tracking-widest mb-2 font-mono">
                    Referral Principal: ${amount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#111]"
                  />
                  <div className="flex justify-between text-[10px] text-black/30 mt-1 font-mono">
                    <span>$100</span>
                    <span>$5,000</span>
                    <span>$10,000</span>
                  </div>
                </div>

                {/* Network duplication multiplier */}
                <div>
                  <label className="block text-xs text-black/45 uppercase tracking-widest mb-2 font-mono">
                    Network Multiplier (Referrals/User): {referralsPerUser}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    step="1"
                    value={referralsPerUser}
                    onChange={(e) => setReferralsPerUser(Number(e.target.value))}
                    className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#111]"
                  />
                  <div className="flex justify-between text-[10px] text-black/30 mt-1 font-mono">
                    <span>2 users</span>
                    <span>3 users</span>
                    <span>5 users</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-800 leading-relaxed">
                  ⚠️ **Projection Model**: Assumes every user down the network replicates the multiplier by referring the same number of active investors with the chosen amount.
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-black/[0.07] bg-white p-8 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-black/30 tracking-widest uppercase mb-4 font-mono">Estimated Earnings Projection</div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-xs py-2 border-b border-black/[0.04]">
                      <span className="text-black/55">Direct Commission (10% rate)</span>
                      <span className="font-mono font-medium text-black">${directCommission.toFixed(2)}</span>
                    </div>

                    {/* Show first few levels detailed, collapse others for brevity */}
                    {levelData.slice(0, 4).map((lvl) => (
                      <div key={lvl.level} className="flex justify-between text-xs py-1.5 border-b border-black/[0.03]">
                        <span className="text-black/40">{lvl.level} ({lvl.rate}%) — {lvl.users} users</span>
                        <span className="font-mono text-black/60">${lvl.earnings.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                      </div>
                    ))}

                    <div className="flex justify-between text-xs py-1.5 border-b border-black/[0.03] text-black/35 italic">
                      <span>Levels 5 - 8 (0.5% rate) — {levelData.slice(4).reduce((sum, l) => sum + l.users, 0)} users</span>
                      <span className="font-mono">${levelData.slice(4).reduce((sum, l) => sum + l.earnings, 0).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-black/35 tracking-widest uppercase font-mono">Total Potential Returns</div>
                    <div className="text-3xl font-light text-emerald-600 tracking-tight mt-1 font-mono">
                      ${grandTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-[#111] text-white hover:bg-[#333] transition-colors rounded-xl text-xs tracking-widest font-medium">
                    START BUILDING NETWORK
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Timings Tab */}
          {activeTab === "timings" && (
            <div className="lg:col-span-12 rounded-2xl border border-black/[0.07] bg-white p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                <div className="text-xs text-black/30 tracking-widest uppercase font-mono mb-2">Weekend Closure</div>
                <div className="text-2xl font-light text-[#111] mb-3">Sat &amp; Sun closed</div>
                <p className="text-xs text-black/45 leading-relaxed">
                  Financial markets are closed on Saturday and Sunday. Earnings calculations occur Monday through Friday.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                <div className="text-xs text-black/30 tracking-widest uppercase font-mono mb-2">Office Timing</div>
                <div className="text-2xl font-light text-[#111] mb-3">9:00 AM – 5:00 PM</div>
                <p className="text-xs text-black/45 leading-relaxed">
                  Customer service and technical support agents are active during regular office hours to handle business enquiries.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-black/[0.02] border border-black/[0.04]">
                <div className="text-xs text-black/30 tracking-widest uppercase font-mono mb-2">Withdrawal Timing</div>
                <div className="text-2xl font-light text-[#111] mb-3">9:00 AM Daily</div>
                <p className="text-xs text-black/45 leading-relaxed">
                  All eligible referral rewards and claimed compounding yields are batch-processed daily starting at 9:00 AM.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  )
}
