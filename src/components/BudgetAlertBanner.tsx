import React from "react";
import { AlertTriangle, TrendingUp, Info } from "lucide-react";
import { motion } from "motion/react";

interface BudgetAlertBannerProps {
  totalSpend: number;
  budgetLimit: number;
  monthlyIncome: number;
}

export default function BudgetAlertBanner({ totalSpend, budgetLimit, monthlyIncome }: BudgetAlertBannerProps) {
  const utilization = (totalSpend / budgetLimit) * 100;
  const isOverSpend = totalSpend > monthlyIncome;

  if (utilization < 80 && !isOverSpend) return null;

  return (
    <div className="space-y-3 mb-6">
      {/* Deficit warning */}
      {isOverSpend && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-sm"
        >
          <div className="p-2 bg-rose-500 text-white rounded-lg shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">Active Financial Deficit Alert</div>
            <p className="text-xs text-rose-700/90 dark:text-rose-200/90 mt-1">
              Your overall spend (<strong>₹{totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>) has exceeded your recorded monthly income (<strong>₹{monthlyIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>). Your net savings rate is currently negative!
            </p>
          </div>
        </motion.div>
      )}

      {/* 90% Critical Budget Limit warning */}
      {utilization >= 90 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start gap-3 shadow-sm animate-pulse"
        >
          <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5 shadow-md">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-2">
              <span>CRITICAL LIMIT EXCEEDED ({utilization.toFixed(0)}%)</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <p className="text-xs text-amber-800/95 dark:text-amber-200/90 mt-1">
              You are extremely close to depleting your budget ceiling of <strong>₹{budgetLimit.toLocaleString("en-IN")}</strong>. We advise auditing non-essential categories (like leisure and shopping) and using the **Smart AI Strategist** under "Extreme Savings Mode" for quick expense-slashing steps.
            </p>
          </div>
        </motion.div>
      )}

      {/* 80% to 90% Caution limit warning */}
      {utilization >= 80 && utilization < 90 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/30 text-yellow-800 dark:text-yellow-200 flex items-start gap-3 shadow-sm"
        >
          <div className="p-2 bg-yellow-500 text-white rounded-lg shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">CAUTION: Approaching Budget Ceiling ({utilization.toFixed(0)}%)</div>
            <p className="text-xs text-yellow-800/95 dark:text-yellow-200/90 mt-1">
              You have consumed <strong>₹{totalSpend.toLocaleString("en-IN")}</strong> of your monthly limit. Plan remaining ledger transactions wisely for the rest of the month.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
