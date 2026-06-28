import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle, Compass, HelpCircle, Activity, Info, Trophy, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

interface InteractiveGuideProps {
  onNavigateToDashboard: () => void;
}

export default function InteractiveGuide({ onNavigateToDashboard }: InteractiveGuideProps) {
  // Simple onboarding task checklist state
  const [tasks, setTasks] = useState<{ id: string; text: string; description: string; checked: boolean }[]>(() => {
    const saved = localStorage.getItem("onboarding_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "add-expense", text: "Create an expense entry", description: "Use the simple transaction form on the main dashboard to add an expense.", checked: false },
      { id: "set-income", text: "Set your monthly income", description: "Go to the Savings & Budget Planner tab and enter your monthly salary.", checked: false },
      { id: "create-category", text: "Create a custom category tag", description: "Design your own custom label with your choice of color and icon.", checked: false },
      { id: "scan-receipt", text: "Upload or write a receipt to scan", description: "Provide a quick text note or upload a receipt image for automatic AI reading.", checked: false },
      { id: "trigger-audit", text: "Get an AI budget coach review", description: "Click the review button to let the Smart AI check your expenses and give you tips.", checked: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem("onboarding_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const completedCount = tasks.filter(t => t.checked).length;
  const progressPercent = (completedCount / tasks.length) * 100;

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md border border-indigo-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-600/50 rounded-2xl text-cyan-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold font-display">How to Use Your Cloud Expense Tracker</h1>
        </div>
        <p className="text-slate-300 text-xs md:text-sm">
          Welcome! This guide will help you understand how to manage your daily spending, set savings goals, and use our smart AI to get helpful financial tips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Walkthrough Progress (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Your Checklist
              </h2>
              <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
                {completedCount}/{tasks.length} Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-mono text-right">
                {progressPercent === 100 ? "🎉 Amazing! You have mastered the budget tracker!" : "Check off items below as you try them."}
              </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-2xl border transition-all duration-150 flex items-start gap-3 cursor-pointer select-none ${
                    task.checked
                      ? "bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-200"
                      : "bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/60 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <button className="mt-0.5 shrink-0">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        task.checked ? "text-emerald-500 fill-emerald-500/10" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                  <div>
                    <div className={`text-xs font-bold ${task.checked ? "line-through text-slate-400 dark:text-slate-500" : ""}`}>
                      {task.text}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5 leading-normal">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToDashboard}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
        </div>

        {/* RIGHT COLUMN: Conceptual Guide & Example (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: What is it? */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-400 flex items-center gap-2 mb-2 font-display">
              <Compass className="w-5 h-5 text-indigo-500" />
              1. What is this app?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The **Cloud Expense Tracker** is a simple, friendly tool to help you write down your daily spending, set a budget, and plan your monthly savings. It saves all your data securely on the cloud server so that your expenses are kept safe even if you refresh your browser or close the app.
            </p>
            <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-3 text-xs text-slate-500 dark:text-slate-400 leading-normal">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong>Auto-Save:</strong> Every expense you add is saved instantly. You don't have to worry about clicking save buttons!
              </div>
            </div>
          </div>

          {/* Section 2: How to use it? */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-400 flex items-center gap-2 mb-3 font-display">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              2. Easy Steps to Track Your Money
            </h3>
            
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center font-mono shrink-0 text-[10px]">A</span>
                <div>
                  <strong>Add Your Expenses:</strong> Fill out the simple form to type in your expenses (like groceries, cab rides, or rent). You can set how much you spent in Indian Rupees (₹) and choose a category.
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center font-mono shrink-0 text-[10px]">B</span>
                <div>
                  <strong>Scan or Upload Receipts:</strong> If you have a physical or digital bill receipt, you can upload it or type its text! The AI will automatically read the receipt details, identify the correct category, and log it for you.
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center font-mono shrink-0 text-[10px]">C</span>
                <div>
                  <strong>Choose an AI Coach Style:</strong> You can choose how the AI talks to you! Select the <em>"Student Budget Coach"</em> for simple daily savings tips, or the <em>"Frugal FIRE Blueprint"</em> for extreme savings guides.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Real-Life Worked Out Example */}
          <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-950/40 dark:to-indigo-950/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
            <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-300 flex items-center gap-2 mb-3 font-display">
              <Trophy className="w-5 h-5 text-indigo-600" />
              3. Real-Life Example: Ravi's Monthly Budget
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Let's see how a real person, **Ravi** (a software developer living in Bengaluru), uses this app to save more money every month:
            </p>
            
            <div className="space-y-3 text-xs bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-indigo-100/60 dark:border-slate-800/60 shadow-inner">
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Ravi's Monthly Salary:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">₹1,20,000</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Monthly Savings Target (20%):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">₹24,000</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Allowed Budget Limit:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">₹50,000</span>
              </div>
              
              <div className="mt-3">
                <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold block mb-1.5 font-mono">Ravi's Logged Monthly Expenses:</span>
                <div className="space-y-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>• Rent & Utilities</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">₹15,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Broadband Internet & Mobile bill</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">₹2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Groceries & Food delivery</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">₹8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Commute & Cab rides</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">₹4,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Server Hosting subscriptions</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-300">₹1,500</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-50 dark:border-slate-850 flex items-center justify-between font-bold text-indigo-950 dark:text-indigo-200 text-xs">
                <span>Ravi's Total Spending:</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹31,000</span>
              </div>
              <div className="flex items-center justify-between font-bold text-emerald-700 dark:text-emerald-400 text-xs mt-1">
                <span>Actual Saved Amount:</span>
                <span>₹89,000 (Exceeded Savings Target!)</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-3 leading-relaxed">
              💡 **AI Insight for Ravi:** If Ravi changes the AI Coach to "Frugal FIRE Blueprint", the AI will suggest that switching Swiggy orders to self-cooked meals can save an additional ₹3,000 every month!
            </p>
          </div>

          {/* Section 4: Why is it useful? */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-400 flex items-center gap-2 mb-3 font-display">
              <Activity className="w-5 h-5 text-indigo-500" />
              4. Why is this App Helpful?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-50 dark:border-indigo-900/30 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-1">Easy Visuals</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Instead of staring at boring math numbers, you get a beautiful breakdown of where your money goes, with warnings when you spend too much.
                </p>
              </div>

              <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-50 dark:border-indigo-900/30 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 mb-1">Smart AI Advice</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Get automated budget tips tailored to your lifestyle. The AI can find areas where you might be overspending and help you cut costs.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
