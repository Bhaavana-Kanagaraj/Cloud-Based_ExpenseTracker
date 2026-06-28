import React from "react";
import { Sparkles, ArrowRight, BookOpen, X, Shield, Cpu, Activity } from "lucide-react";
import { motion } from "motion/react";

interface WelcomeIntroProps {
  onDismiss: () => void;
  onViewGuide: () => void;
}

export default function WelcomeIntro({ onDismiss, onViewGuide }: WelcomeIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 border border-indigo-800/60 shadow-xl mb-8"
    >
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 text-indigo-200/75 hover:text-white bg-indigo-950/50 p-1.5 rounded-full border border-indigo-800/40 hover:scale-105 transition-all duration-150 cursor-pointer"
        title="Hide Welcome Onboarding"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="max-w-4xl relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full px-3 py-1 text-xs font-mono mb-4">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
          <span>Interactive Onboarding Guide</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display mb-3">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">Cloud Expense Tracker</span>
        </h2>
        
        <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
          A robust, serverless financial audit dashboard integrated with persistent cloud database endpoints and Smart AI. Log your income, design bespoke tags, and run real-time automated cost analysis audits.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="font-bold text-xs text-indigo-100">AI Strategist Audits</div>
              <p className="text-[10px] text-slate-400 mt-1">Select and toggle strategy perspective profiles to get custom fiscal advisor audits.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
            <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs text-indigo-100">Savings & Income Monitor</div>
              <p className="text-[10px] text-slate-400 mt-1">Log standard income and track net savings rates, progress goals, and custom limits.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3">
            <Activity className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs text-indigo-100">Custom Category Architect</div>
              <p className="text-[10px] text-slate-400 mt-1">Expand default tags! Set unique brand colors, select symbols, and persist your custom rules.</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDismiss}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer transition-all duration-150 hover:scale-[1.02]"
          >
            Explore My Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onViewGuide}
            className="bg-white/10 hover:bg-white/15 border border-white/15 text-indigo-100 font-bold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 hover:scale-[1.02]"
          >
            <BookOpen className="w-3.5 h-3.5" /> View Public Onboarding Manual
          </button>
        </div>
      </div>
    </motion.div>
  );
}
