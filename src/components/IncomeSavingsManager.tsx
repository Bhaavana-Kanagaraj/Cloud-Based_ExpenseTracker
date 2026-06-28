import React from "react";
import { DollarSign, Landmark, TrendingUp, AlertCircle, Sparkles, PiggyBank, Target, Settings, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface IncomeSavingsManagerProps {
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => void;
  savingsGoal: number; // as percentage, e.g. 20
  setSavingsGoal: (goal: number) => void;
  totalSpend: number;
  budgetLimit: number;
  setBudgetLimit: (limit: number) => void;
}

export default function IncomeSavingsManager({
  monthlyIncome,
  setMonthlyIncome,
  savingsGoal,
  setSavingsGoal,
  totalSpend,
  budgetLimit,
  setBudgetLimit,
}: IncomeSavingsManagerProps) {
  const netSavings = monthlyIncome - totalSpend;
  const savingsRate = monthlyIncome > 0 ? (netSavings / monthlyIncome) * 100 : 0;
  const goalShortfall = savingsGoal - savingsRate;
  const isGoalMet = savingsRate >= savingsGoal;

  // Pie segment calculation for custom inline visual
  const spendPercentage = Math.min((totalSpend / monthlyIncome) * 100, 100);
  const savingsPercentage = Math.max(0, 100 - spendPercentage);

  return (
    <div className="space-y-8">
      {/* HEADER ROW */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md border border-indigo-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-600/50 rounded-2xl text-cyan-300">
            <PiggyBank className="w-5 h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-display">Savings & Budget Planner</h1>
        </div>
        <p className="text-slate-300 text-xs md:text-sm">
          Set your monthly benchmarks, configure automatic savings rates, and review advanced visual metrics based on real database records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Input Control Panel (5 columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Settings className="w-4 h-4 text-indigo-500" />
            Financial Targets Configuration
          </h2>

          {/* 1. Monthly Income Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
              Recorded Monthly Income (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400 dark:text-slate-500">₹</span>
              <input
                type="number"
                value={monthlyIncome || ""}
                onChange={(e) => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="120000"
              />
            </div>
            <p className="text-[10px] text-slate-400">Your total monthly salary or profit base.</p>
          </div>

          {/* 2. Monthly Budget Limit Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
              Monthly Budget Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400 dark:text-slate-500">₹</span>
              <input
                type="number"
                value={budgetLimit || ""}
                onChange={(e) => setBudgetLimit(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="50000"
              />
            </div>
            <p className="text-[10px] text-slate-400">Aggressive spend threshold ceiling.</p>
          </div>

          {/* 3. Savings Goal Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
              <span>Savings Goal Percentage</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{savingsGoal}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>0% (Frugal optional)</span>
              <span>45% (Balanced)</span>
              <span>90% (Aggressive wealth)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Visual Dashboard Metrics (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STATS DECK GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Total Income Stat */}
            <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Total Income</span>
                <Landmark className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                ₹{monthlyIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Logged monthly budget basis</p>
            </div>

            {/* Net Savings Stat */}
            <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Net Savings</span>
                <PiggyBank className="w-4 h-4 text-indigo-500" />
              </div>
              <div className={`text-lg font-black font-mono ${netSavings >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                ₹{netSavings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Income minus active spend</p>
            </div>

            {/* Savings Rate Stat */}
            <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Savings Rate</span>
                <Target className="w-4 h-4 text-purple-500" />
              </div>
              <div className={`text-lg font-black font-mono ${savingsRate >= savingsGoal ? "text-emerald-600 dark:text-emerald-400" : savingsRate > 0 ? "text-amber-500" : "text-rose-600 dark:text-rose-400"}`}>
                {savingsRate.toFixed(1)}%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Target benchmark: {savingsGoal}%</p>
            </div>

          </div>

          {/* GRAPHICAL BREAKDOWN SECTION */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Savings-to-Spend Visual Balance
            </h3>

            {/* Visual ratio bar */}
            <div className="space-y-2">
              <div className="flex h-5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/30">
                {/* Spend Bar segment */}
                {totalSpend > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${spendPercentage}%` }}
                    className="bg-indigo-500/80 dark:bg-indigo-600/80 hover:opacity-90 relative flex items-center justify-center text-[10px] font-bold text-white transition-all font-mono"
                  >
                    {spendPercentage > 15 && `${spendPercentage.toFixed(0)}% Spent`}
                  </motion.div>
                )}
                {/* Savings Bar segment */}
                {netSavings > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${savingsPercentage}%` }}
                    className="bg-emerald-500/80 dark:bg-emerald-600/80 hover:opacity-90 relative flex items-center justify-center text-[10px] font-bold text-white transition-all font-mono"
                  >
                    {savingsPercentage > 15 && `${savingsPercentage.toFixed(0)}% Saved`}
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span>Spend Weight</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>Savings Margin</span>
              </div>
            </div>

            {/* Target Alert summary block */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex gap-3.5 text-xs text-slate-500 dark:text-slate-400">
              {netSavings < 0 ? (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-800 dark:text-rose-400">Negative Savings Margin Detected</span>
                    <p className="mt-1 leading-normal text-[11px]">
                      Your expenditures have completely consumed your monthly income! Consider checking the **AI Strategic Advisor** under **Frugal FIRE Mode** to generate custom ideas for reducing non-essential card-swipes.
                    </p>
                  </div>
                </>
              ) : isGoalMet ? (
                <>
                  <ArrowUpRight className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 bg-emerald-50 rounded-full" />
                  <div>
                    <span className="font-bold text-emerald-800 dark:text-emerald-400">Target Savings Achieved!</span>
                    <p className="mt-1 leading-normal text-[11px]">
                      Great job! Your savings rate of <strong>{savingsRate.toFixed(1)}%</strong> is ahead of your target <strong>{savingsGoal}%</strong>. Consider routing your net excess of <strong>₹{netSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong> into systematic investment plans (SIPs) or debt repayment.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-800 dark:text-amber-400">Savings Target Shortfall ({goalShortfall.toFixed(1)}% Left)</span>
                    <p className="mt-1 leading-normal text-[11px]">
                      You are currently saving <strong>{savingsRate.toFixed(1)}%</strong> of your income, which is below your target goal of <strong>{savingsGoal}%</strong>. You need to reduce spending by another <strong>₹{((goalShortfall / 100) * monthlyIncome).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong> this month to satisfy your goal.
                    </p>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
