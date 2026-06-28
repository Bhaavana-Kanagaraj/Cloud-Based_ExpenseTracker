import React, { useState, useEffect, useRef } from "react";
import { 
  Cloud, 
  Activity, 
  IndianRupee, 
  TrendingUp, 
  PieChart as PieIcon, 
  Search, 
  Trash2, 
  Sparkles, 
  Plus, 
  FileText, 
  Check, 
  Loader2, 
  Brain, 
  AlertTriangle, 
  UploadCloud, 
  Calendar,
  Layers,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Tv,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Info,
  Download,
  RefreshCw,
  Sun,
  Moon,
  Heart,
  Gift,
  Compass,
  BookOpen,
  Briefcase,
  Shield,
  Landmark,
  Plane,
  Phone,
  Award,
  Tag,
  PiggyBank,
  Target,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Expense } from "./types";

// Modular UI & Tooling imports
import BubbleCursor from "./components/BubbleCursor";
import BudgetAlertBanner from "./components/BudgetAlertBanner";
import WelcomeIntro from "./components/WelcomeIntro";
import InteractiveGuide from "./components/InteractiveGuide";
import IncomeSavingsManager from "./components/IncomeSavingsManager";
import CategoryDesigner, { CustomCategory } from "./components/CategoryDesigner";

// Default preset configuration with brand colors and icons
const DEFAULT_CATEGORIES: { [key: string]: { color: string; bg: string; text: string; icon: any } } = {
  "Food & Dining": { color: "#ef4444", bg: "bg-red-50", text: "text-red-700", icon: Utensils },
  "Shopping & Clothes": { color: "#ec4899", bg: "bg-pink-50", text: "text-pink-700", icon: ShoppingBag },
  "Transportation & Fuel": { color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", icon: Car },
  "Housing & Rent": { color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700", icon: Home },
  "Entertainment & Leisure": { color: "#8b5cf6", bg: "bg-purple-50", text: "text-purple-700", icon: Tv },
  "Utilities & Bills": { color: "#06b6d4", bg: "bg-cyan-50", text: "text-cyan-700", icon: Cloud },
  "Other Expenses": { color: "#64748b", bg: "bg-slate-50", text: "text-slate-700", icon: HelpCircle }
};

// Map of all available lucide vector icons for custom categories
const ICON_MAP: { [key: string]: any } = {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Tv,
  Cloud,
  HelpCircle,
  Heart,
  Gift,
  Compass,
  BookOpen,
  Briefcase,
  Shield,
  Landmark,
  Plane,
  Phone,
  Award,
  Sparkles,
  Tag,
  PiggyBank,
  Target
};

// Preset demo receipts for simulation
const DEMO_RECEIPTS = [
  {
    name: "Swiggy Food Delivery",
    merchant: "Swiggy Delivery",
    amount: "840.00",
    category: "Food & Dining",
    description: "Lunch order for team development sprint",
    date: "2026-06-25",
    rawText: "Swiggy Pvt Ltd\nOrder ID: SW-9831289\nDate: 2026-06-25\nPaneer Butter Masala x2: ₹520.00\nTandoori Roti x6: ₹180.00\nDelivery Partner Tip: ₹40.00\nGST & Taxes: ₹100.00\nTotal Paid: INR 840.00\nPayment: UPI/GPay"
  },
  {
    name: "Jio Cloud & Fiber",
    merchant: "Reliance Jio",
    amount: "1499.00",
    category: "Utilities & Bills",
    description: "High speed fiber broadband and cloud backup plans",
    date: "2026-06-24",
    rawText: "Reliance Jio Infocomm Ltd\nInvoice Date: 2026-06-24\nPlan: JioFiber Titanium Unlimited 1Gbps\nCharges: ₹1270.34\nSGST 9%: ₹114.33\nCGST 9%: ₹114.33\nTotal Due: INR 1499.00\nPaid via Auto-pay"
  },
  {
    name: "Ola Cabs Transit",
    merchant: "Ola Cabs",
    amount: "450.00",
    category: "Transportation & Fuel",
    description: "Cab ride to workspace and client meetings",
    date: "2026-06-22",
    rawText: "ANI Technologies (Ola Cabs)\nCRN: 4893220410\nDate: 22-06-2026\nRide Distance 14.5 km\nFare: ₹390.00\nAccess Fee & Toll: ₹60.00\nTOTAL AMOUNT PAID: INR 450.00\nPayment Method: Ola Money Wallet"
  }
];

export default function App() {
  // Application states
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Income, Savings, Navigation & Welcome configs
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem("custom_categories");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [monthlyIncome, setMonthlyIncomeState] = useState<number>(() => {
    const saved = localStorage.getItem("monthly_income");
    return saved ? parseFloat(saved) : 120000;
  });

  const setMonthlyIncome = (val: number) => {
    setMonthlyIncomeState(val);
    localStorage.setItem("monthly_income", val.toString());
  };

  const [savingsGoal, setSavingsGoalState] = useState<number>(() => {
    const saved = localStorage.getItem("savings_goal");
    return saved ? parseInt(saved) : 20; // Default 20%
  });

  const setSavingsGoal = (val: number) => {
    setSavingsGoalState(val);
    localStorage.setItem("savings_goal", val.toString());
  };

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const saved = localStorage.getItem("show_welcome");
    return saved !== "false"; // Default true
  });

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("show_welcome", "false");
  };

  const [aiFocusMode, setAiFocusMode] = useState<string>("general");

  // Dynamically constructed categories, shadows default layout seamlessly
  const CATEGORIES = {
    ...DEFAULT_CATEGORIES,
    ...customCategories.reduce((acc, cat) => {
      acc[cat.name] = {
        color: cat.color,
        bg: cat.bg,
        text: cat.text,
        icon: ICON_MAP[cat.iconName] || HelpCircle
      };
      return acc;
    }, {} as { [key: string]: { color: string; bg: string; text: string; icon: any } })
  };

  const handleAddCustomCategory = (newCat: CustomCategory) => {
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    localStorage.setItem("custom_categories", JSON.stringify(updated));
  };

  const handleRemoveCustomCategory = (name: string) => {
    const updated = customCategories.filter(c => c.name !== name);
    setCustomCategories(updated);
    localStorage.setItem("custom_categories", JSON.stringify(updated));
  };

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetLimitState, setBudgetLimitState] = useState<number>(50000);

  const setBudgetLimit = (val: number) => {
    setBudgetLimitState(val);
    localStorage.setItem("budget_limit", val.toString());
  };

  // Hydrate budget limit
  useEffect(() => {
    const saved = localStorage.getItem("budget_limit");
    if (saved) {
      setBudgetLimitState(parseFloat(saved));
    }
  }, []);

  const budgetLimit = budgetLimitState;

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [cloudSynced, setCloudSynced] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Manual Form State
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    category: "Food & Dining",
    date: new Date().toISOString().split('T')[0],
    description: "",
    isRecurring: false,
    recurringFrequency: "Monthly" as "Daily" | "Weekly" | "Monthly"
  });

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiParsing, setAiParsing] = useState<boolean>(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileParsing, setFileParsing] = useState<boolean>(false);

  // AI Analyst State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiReportLoading, setAiReportLoading] = useState<boolean>(false);
  const [advisorState, setAdvisorState] = useState<string>("");

  // Fetch initial expenses from Cloud Express Backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/expenses");
      const result = await response.json();
      if (result.success) {
        setExpenses(result.data);
      } else {
        setErrorMessage(result.message || "Failed to load cloud expenses.");
      }
    } catch (err) {
      setErrorMessage("Could not connect to the cloud-native server. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  // Sync animation helper
  const triggerCloudSyncAnimation = () => {
    setCloudSynced(false);
    setTimeout(() => {
      setCloudSynced(true);
    }, 800);
  };

  // Submit manual expense
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount || isNaN(Number(formData.amount))) {
      setErrorMessage("Please verify merchant name and valid numeric amount.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: formData.merchant,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          description: formData.description,
          isRecurring: formData.isRecurring,
          recurringFrequency: formData.recurringFrequency
        })
      });
      const result = await response.json();
      if (result.success) {
        setExpenses(prev => [result.data, ...prev]);
        setFormData({
          merchant: "",
          amount: "",
          category: "Food & Dining",
          date: new Date().toISOString().split('T')[0],
          description: "",
          isRecurring: false,
          recurringFrequency: "Monthly"
        });
        triggerCloudSyncAnimation();
        // Clear report to encourage refresh on new data
        setAiReport(null);
      } else {
        setErrorMessage(result.message || "Failed to save expense.");
      }
    } catch (err) {
      setErrorMessage("Network error saving to Cloud Run Server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE"
      });
      const result = await response.json();
      if (result.success) {
        setExpenses(prev => prev.filter(e => e.id !== id));
        triggerCloudSyncAnimation();
        setAiReport(null);
      } else {
        setErrorMessage(result.message || "Failed to delete from Cloud Run.");
      }
    } catch (err) {
      setErrorMessage("Network error deleting expense.");
    }
  };

  // Trigger Gemini parsing of Natural Language Prompt
  const handleAIPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiParsing(true);
    setErrorMessage(null);
    setAiSuccessMessage(null);

    try {
      const response = await fetch("/api/gemini/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          textPrompt: aiPrompt,
          categories: Object.keys(CATEGORIES)
        })
      });
      const result = await response.json();

      if (result.success && result.data) {
        const parsed = result.data;
        // Auto-save parsed expense
        const saveResponse = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed)
        });
        const saveResult = await saveResponse.json();

        if (saveResult.success) {
          setExpenses(prev => [saveResult.data, ...prev]);
          setAiPrompt("");
          setAiSuccessMessage(`Gemini parsed: "${parsed.merchant}" for ₹${parsed.amount.toFixed(2)} [${parsed.category}]`);
          triggerCloudSyncAnimation();
          setAiReport(null);
        } else {
          setErrorMessage("AI parsed the expense, but backend could not save it.");
        }
      } else {
        setErrorMessage(result.message || "Gemini could not parse transaction details. Try typing clearly.");
      }
    } catch (err) {
      setErrorMessage("Could not connect to Gemini service. Check secrets.");
    } finally {
      setAiParsing(false);
    }
  };

  // Simulate Demo Receipt OCR scan
  const handleSimulateDemoScan = async (demo: typeof DEMO_RECEIPTS[0]) => {
    setFileParsing(true);
    setErrorMessage(null);
    setAiSuccessMessage(null);

    try {
      // Simulate receipt text analysis
      const response = await fetch("/api/gemini/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          textPrompt: `OCR Extraction dump: ${demo.rawText}`,
          categories: Object.keys(CATEGORIES)
        })
      });
      const result = await response.json();

      if (result.success && result.data) {
        const parsed = result.data;
        // Save
        const saveResponse = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsed,
            description: demo.description,
            date: demo.date // preserve demo date
          })
        });
        const saveResult = await saveResponse.json();

        if (saveResult.success) {
          setExpenses(prev => [saveResult.data, ...prev]);
          setAiSuccessMessage(`OCR Scan success! Loaded "${parsed.merchant}" (₹${parsed.amount.toFixed(2)}) into Cloud DB.`);
          triggerCloudSyncAnimation();
          setAiReport(null);
        }
      } else {
        setErrorMessage("Receipt scanner failed to interpret text layout.");
      }
    } catch (err) {
      setErrorMessage("Error communicating with AI parser.");
    } finally {
      setFileParsing(false);
    }
  };

  // Handle actual receipt image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid receipt image file (PNG, JPG, JPEG).");
      return;
    }

    setFileParsing(true);
    setErrorMessage(null);
    setAiSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = (reader.result as string).split(",")[1];
      try {
        const response = await fetch("/api/gemini/parse-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image: base64String,
            mimeType: file.type,
            categories: Object.keys(CATEGORIES)
          })
        });
        const result = await response.json();

        if (result.success && result.data) {
          const parsed = result.data;
          // Save
          const saveResponse = await fetch("/api/expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed)
          });
          const saveResult = await saveResponse.json();

          if (saveResult.success) {
            setExpenses(prev => [saveResult.data, ...prev]);
            setAiSuccessMessage(`Success! Receipt Image Analyzed: Added "${parsed.merchant}" (₹${parsed.amount.toFixed(2)})`);
            triggerCloudSyncAnimation();
            setAiReport(null);
          }
        } else {
          setErrorMessage(result.message || "AI could not read receipt details. Ensure image text is legible.");
        }
      } catch (err) {
        setErrorMessage("Error connecting to Gemini Vision core.");
      } finally {
        setFileParsing(false);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read file on client side.");
      setFileParsing(false);
    };
    reader.readAsDataURL(file);
  };

  // AI Strategic Audit Runner
  const runAIFinancialAudit = async () => {
    setAiReportLoading(true);
    setErrorMessage(null);
    setAiReport(null);

    // Dynamic loading state messages for extreme presentation UX
    const states = [
      "Securing connection to Gemini 3.5 Flash...",
      "Querying container cloud-native JSON storage database...",
      "Mapping monthly transactions into category nodes...",
      "Executing budget ceiling mathematical comparisons...",
      "Compiling financial intelligence optimization algorithms..."
    ];

    let i = 0;
    setAdvisorState(states[0]);
    const interval = setInterval(() => {
      i++;
      if (i < states.length) {
        setAdvisorState(states[i]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          budgetLimit,
          focusMode: aiFocusMode,
          monthlyIncome,
          savingsGoal
        })
      });
      const result = await response.json();
      clearInterval(interval);
      if (result.success) {
        setAiReport(result.report);
      } else {
        setErrorMessage(result.message || "Failed to generate AI Audit.");
      }
    } catch (err) {
      clearInterval(interval);
      setErrorMessage("Could not connect to AI advisor server. Please check environment.");
    } finally {
      setAiReportLoading(false);
    }
  };

  // Stats derivations
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = budgetLimit - totalSpend;
  const budgetUtilization = Math.min((totalSpend / budgetLimit) * 100, 100);

  // Group by category helper
  const getCategorySpend = () => {
    const summary: { [key: string]: number } = {};
    // Init all keys to 0
    Object.keys(CATEGORIES).forEach(cat => { summary[cat] = 0; });

    expenses.forEach(e => {
      const cat = CATEGORIES[e.category] ? e.category : "Other Expenses";
      summary[cat] += e.amount;
    });

    return Object.entries(summary)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpend > 0 ? (amount / totalSpend) * 100 : 0,
        color: CATEGORIES[category]?.color || "#64748b",
        bg: CATEGORIES[category]?.bg || "bg-slate-100",
        text: CATEGORIES[category]?.text || "text-slate-700"
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryData = getCategorySpend();

  // Get daily spends over the last 7 days for the trend chart
  const getTrendData = () => {
    const data: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      data[date] = 0;
    }

    expenses.forEach(e => {
      if (data[e.date] !== undefined) {
        data[e.date] += e.amount;
      }
    });

    return Object.entries(data).map(([dateStr, amount]) => {
      const [_, m, d] = dateStr.split('-');
      // Convert e.g., "06-25" to "Jun 25"
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDate = `${monthNames[parseInt(m) - 1]} ${d}`;
      return {
        label: formattedDate,
        amount
      };
    });
  };

  const trendData = getTrendData();
  const maxTrendAmount = Math.max(...trendData.map(d => d.amount), 50);

  // Filter and search computation
  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = 
      e.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Export active filtered expenses list to a beautifully structured CSV
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return;

    // CSV Headers
    const headers = ["Date", "Merchant", "Category", "Description", "Amount (INR)"];
    
    // Format rows
    const rows = filteredExpenses.map(e => [
      e.date,
      `"${e.merchant.replace(/"/g, '""')}"`,
      `"${e.category.replace(/"/g, '""')}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      e.amount.toFixed(2)
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    // Create browser download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cloud_expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Basic HTML markdown stylized renderer (safer than relying on raw dangerouslySetInnerHTML or bulky packages)
  const renderMarkdownText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Bold Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-md font-semibold text-slate-800 mt-4 mb-2 flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-emerald-500" />{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1 mt-6 mb-3 font-display flex items-center gap-2 text-indigo-900">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-xl font-extrabold text-indigo-950 border-b-2 border-indigo-100 pb-2 mt-8 mb-4 font-display">{line.replace("# ", "")}</h2>;
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-4 border-indigo-500 bg-indigo-50/50 p-3 rounded-r-lg my-3 text-sm text-indigo-900 italic">
            {line.replace("> ", "")}
          </blockquote>
        );
      }

      // Bullet items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const itemContent = line.replace(/^[-*]\s+/, "");
        // Highlight critical terms
        return (
          <li key={idx} className="text-slate-600 text-sm ml-5 list-disc py-0.5 leading-relaxed">
            {itemContent.includes("**") ? (
              itemContent.split("**").map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 font-semibold">{part}</strong> : part)
            ) : itemContent}
          </li>
        );
      }

      // Table formatting check
      if (line.startsWith("|") && line.includes("-|-")) {
        return null; // Skip table header dividers
      }
      if (line.startsWith("|")) {
        const cells = line.split("|").map(c => c.trim()).filter(Boolean);
        const isHeader = idx < 10 && text.split("\n")[idx + 1]?.includes("-|-");
        return (
          <div key={idx} className={`grid grid-cols-${cells.length} gap-2 p-2.5 text-xs text-slate-700 font-mono border-b border-slate-100 ${isHeader ? 'bg-slate-100 font-semibold text-slate-900 uppercase tracking-wide' : 'hover:bg-slate-50'}`}>
            {cells.map((cell, cIdx) => (
              <span key={cIdx}>{cell}</span>
            ))}
          </div>
        );
      }

      // Regular paragraphs
      if (line.trim() === "") return <div key={idx} className="h-2"></div>;

      // Regular line with bold formatting
      return (
        <p key={idx} className="text-slate-600 text-sm leading-relaxed my-1.5">
          {line.includes("**") ? (
            line.split("**").map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-800 font-semibold">{part}</strong> : part)
          ) : line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-transparent py-6 px-4 md:px-8 max-w-7xl mx-auto flex flex-col font-sans transition-colors duration-300">
      
      {/* BUBBLE TRAIL EFFECT */}
      <BubbleCursor />

      {/* SIMPLE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
            <Cloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Cloud Expense Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Simple, secure, and user-friendly expense & savings planner</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-150 dark:border-slate-850 text-xs text-slate-500 font-mono">
          <span className={`w-2 h-2 rounded-full ${cloudSynced ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500 animate-pulse'}`}></span>
          <span>{cloudSynced ? "Synced online" : "Saving..."}</span>
        </div>
      </div>

      {/* ERROR MESSAGE STRIP */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-3 text-sm shadow-sm"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1">
              <span className="font-semibold">System Notification:</span> {errorMessage}
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600 font-semibold px-1">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION TABS MENU BAR */}
      <div className="w-full bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2.5 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-150 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Workspace Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-150 cursor-pointer ${
              activeTab === "planner"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            <span>Savings & Planner</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-150 cursor-pointer ${
              activeTab === "categories"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tag Architect</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-150 cursor-pointer ${
              activeTab === "guide"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Onboarding Guide</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider w-full md:w-auto justify-center md:justify-end shrink-0">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>NET SPEND: ₹{totalSpend.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</span>
        </div>
      </div>

      {/* WELCOME ONBOARDING HERO BANNER */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeIntro 
            onDismiss={handleDismissWelcome} 
            onViewGuide={() => { setActiveTab("guide"); handleDismissWelcome(); }} 
          />
        )}
      </AnimatePresence>

      {activeTab === "dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* BUDGET WARNING AND DEFICIT ALERTS */}
          <BudgetAlertBanner totalSpend={totalSpend} budgetLimit={budgetLimit} monthlyIncome={monthlyIncome} />

          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display transition-colors duration-300">Financial Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">Secure serverless container tracking, transaction ledger, and generative AI strategist insights.</p>
        </div>
        
        {/* BUDGET OVERRIDE CONTROLLER & THEME TOGGLE */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 text-xs font-bold font-mono cursor-pointer shrink-0"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          <div className="bg-white dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto transition-colors duration-300">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider pl-1">MONTHLY BUDGET CEILING</div>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-slate-400 dark:text-slate-500 text-sm font-semibold">₹</span>
              <input 
                type="number" 
                value={budgetLimit} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBudgetLimit(val > 0 ? val : 1);
                  setAiReport(null); // Clear report on budget limit change
                }} 
                className="w-28 pl-6 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-950 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* TOTAL SPENT CARD */}
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4 relative overflow-hidden group transition-colors duration-300">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Total Cloud Spend</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 font-display">
              ₹{totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">Synced to data/expenses.json</div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5 group-hover:scale-110 transition-transform duration-300">
            <IndianRupee className="w-24 h-24 -mr-4 -mb-4 text-indigo-900 dark:text-indigo-400" />
          </div>
        </div>

        {/* REMAINING BUDGET CARD */}
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4 relative overflow-hidden group transition-colors duration-300">
          <div className={`p-3.5 rounded-xl ${remainingBudget < 5000 ? 'bg-red-50 dark:bg-red-950/40 text-red-600' : remainingBudget < 15000 ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Remaining Buffer</div>
            <div className={`text-2xl font-bold tracking-tight mt-0.5 font-display ${remainingBudget < 0 ? 'text-red-600' : remainingBudget < 15000 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ₹{remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
              {remainingBudget < 0 ? "Exceeded Budget!" : "Available spending capacity"}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5">
            <TrendingUp className="w-24 h-24 -mr-4 -mb-4 text-slate-900 dark:text-slate-300" />
          </div>
        </div>

        {/* METRIC: BUDGET UTILIZATION */}
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between min-h-[105px] transition-colors duration-300">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Ceiling Depletion</div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${budgetUtilization > 90 ? 'bg-red-50 dark:bg-red-950/40 text-red-600' : budgetUtilization > 70 ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'}`}>
              {budgetUtilization.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${budgetUtilization > 90 ? 'bg-red-500' : budgetUtilization > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${budgetUtilization}%` }}
            ></div>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 flex justify-between font-mono mt-1">
            <span>0%</span>
            <span>Budget Utilized</span>
            <span>100%</span>
          </div>
        </div>

        {/* ACTIVE CLOUD TRANSACTIONS */}
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4 relative overflow-hidden group transition-colors duration-300">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Cloud Ledger Nodes</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 font-display">
              {expenses.length} Records
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">Active ledger entries in container</div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5">
            <Activity className="w-24 h-24 -mr-4 -mb-4 text-slate-900 dark:text-slate-300" />
          </div>
        </div>

      </div>

      {/* TWO COLUMN CHARTS & AI CREATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* LEFT CHART COLUMN: Spend Trends (7 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-display">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Ledger Spending Trend
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">Trailing 7 days cloud/personal expenditures</p>
            </div>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-2 py-1 rounded font-mono font-medium">REAL-TIME</span>
          </div>

          {/* CUSTOM HIGH-CRAFTSMANSHIP REACT SVG BAR CHART */}
          <div className="h-56 w-full flex items-end justify-between gap-2.5 px-2 pt-6 relative border-b border-slate-100 dark:border-slate-800">
            {/* Grid background lines */}
            <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100/70 dark:border-slate-800/50 border-dashed pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100/70 dark:border-slate-800/50 border-dashed pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100/70 dark:border-slate-800/50 border-dashed pointer-events-none"></div>

            {trendData.map((d, index) => {
              const heightPercentage = Math.min((d.amount / maxTrendAmount) * 100, 100);
              const isToday = index === 6;

              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative z-10">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                    Spent: ₹{d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  
                  {/* Interactive Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-t-lg transition-colors duration-200 flex items-end h-40">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercentage}%` }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className={`w-full rounded-t-lg relative ${isToday ? 'bg-indigo-500 group-hover:bg-indigo-600 shadow-md' : 'bg-slate-400 dark:bg-slate-600 group-hover:bg-indigo-400'}`}
                    >
                      {/* Glow on highly spent bars */}
                      {d.amount > 100 && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-t-lg"></div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Date label */}
                  <span className={`text-[10px] font-medium font-mono mt-2.5 whitespace-nowrap ${isToday ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>* Simulated real-time container DB queries</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Today</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"></span>Historic</span>
            </div>
          </div>
        </div>

        {/* RIGHT CHART COLUMN: Category Allocations (5 columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-display">
              <PieIcon className="w-5 h-5 text-indigo-500" />
              Category Allocations
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400">Total spending weight distributions</p>
          </div>

          {categoryData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
              <Info className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No transactions recorded to categorize.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center gap-4 mt-4">
              {categoryData.slice(0, 5).map((item, index) => {
                const IconComponent = CATEGORIES[item.category]?.icon || HelpCircle;
                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${item.bg} ${item.text}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{item.category}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-slate-900 dark:text-slate-100">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1.5">({item.percentage.toFixed(0)}%)</span>
                      </div>
                    </div>
                    {/* Linear Distribution bar */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-4 text-[10px] text-slate-400 dark:text-slate-500 text-center font-mono">
            Cloud database matches strict schema specifications
          </div>
        </div>

      </div>

      {/* QUICK EXPENSE CREATOR CENTER (MANUAL + AI INTUITIVE PANELS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* LEFT BLOCK: Traditional Manual Ledger Add (5 columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-display mb-1">
            <Plus className="w-5 h-5 text-indigo-500" />
            New Ledger Entry
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mb-6">Create manual transactions inside the container database</p>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">Merchant Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g., Swiggy, Reliance Jio, Zomato"
                value={formData.merchant}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">Amount (₹) *</label>
                <input 
                  type="number"
                  required
                  step="0.01"
                  placeholder="1500.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">Date *</label>
                <input 
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">Transaction Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
              >
                {Object.keys(CATEGORIES).map((cat, i) => (
                  <option key={i} value={cat} className="dark:bg-slate-950 dark:text-slate-200">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mb-1.5">Optional Memo / Note</label>
              <textarea 
                rows={2}
                placeholder="Product SKU, business project justification, etc."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
              ></textarea>
            </div>

            {/* Recurring Toggle and Dropdown */}
            <div className="bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-850 space-y-3 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Recurring Bill / Subscription</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {formData.isRecurring && (
                <div className="grid grid-cols-1 gap-1 pt-1">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">Billing Frequency</label>
                  <select 
                    value={formData.recurringFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringFrequency: e.target.value as any }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Daily">Daily (e.g. newspaper, milk)</option>
                    <option value="Weekly">Weekly (e.g. SaaS hosting, API calls)</option>
                    <option value="Monthly">Monthly (e.g. Netflix, Server Hosting, Rent)</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-indigo-650 dark:hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Save Ledger Entry
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT BLOCK: Gemini AI Autocomplete & Receipt Scanning (7 columns) */}
        <div className="lg:col-span-7 bg-indigo-950 text-white p-6 rounded-3xl border border-indigo-900 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold flex items-center gap-2 font-display text-white">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Smart AI Quick-Capture
              </h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                Advanced AI Core
              </span>
            </div>
            <p className="text-xs text-indigo-200 mb-6">Automatically extract, categorize, and date transactions using advanced language models</p>

            {/* Sub-Panel 1: Natural Language Form */}
            <form onSubmit={handleAIPromptSubmit} className="mb-6 space-y-3">
              <label className="block text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">Describe Spending in Plain Text</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  required
                  placeholder="e.g., Spent ₹850 at Zomato restaurant yesterday..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 bg-indigo-900/60 border border-indigo-800 text-white placeholder-indigo-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={aiParsing || !aiPrompt.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold text-xs px-4 rounded-xl flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer transition-colors duration-150"
                >
                  {aiParsing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Parse
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-indigo-300 italic">Generates structured JSON mapped back to your ledger instantly.</p>
            </form>

            {/* Sub-Panel 2: Receipt OCR scanner */}
            <div className="border-t border-indigo-900/80 pt-5">
              <label className="block text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider mb-3">Receipt OCR Analysis Sandbox</label>
              
              {/* Preset triggers */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {DEMO_RECEIPTS.map((demo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={fileParsing}
                    onClick={() => handleSimulateDemoScan(demo)}
                    className="bg-indigo-900/50 hover:bg-indigo-900 text-left p-2.5 rounded-xl border border-indigo-800/60 transition-all duration-150 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="font-bold text-xs text-indigo-100 truncate">{demo.name}</div>
                    <div className="text-[10px] text-indigo-300 mt-1 font-mono">${demo.amount}</div>
                  </button>
                ))}
              </div>

              {/* Real receipt image uploader */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-800/80 hover:border-indigo-500 bg-indigo-900/20 hover:bg-indigo-900/30 rounded-2xl p-4 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2"
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {fileParsing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    <span className="text-xs font-semibold text-indigo-200">AI reading receipt details...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-indigo-400" />
                    <div>
                      <span className="text-xs font-bold text-indigo-100">Upload Real Receipt Image</span>
                      <p className="text-[10px] text-indigo-300 mt-0.5">Supports PNG, JPG, JPEG with direct AI Vision mapping</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI SUCCESS NOTIFIER */}
          <AnimatePresence>
            {aiSuccessMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 bg-emerald-500/25 border border-emerald-500/30 text-emerald-100 rounded-xl flex items-center gap-2.5 text-xs font-medium"
              >
                <Check className="w-4 h-4 shrink-0 text-emerald-300" />
                <div className="flex-1 truncate">{aiSuccessMessage}</div>
                <button onClick={() => setAiSuccessMessage(null)} className="text-emerald-300 hover:text-white font-bold font-mono">✕</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* AI ADVISOR & STRATEGIC AUDIT (BENTO SECTION) */}
      <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden mb-8 transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/50 dark:from-indigo-950/20 to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-950 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm animate-pulse">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Smart AI Financial Advisor</h2>
              <p className="text-xs text-slate-400 dark:text-slate-400">Deep transaction scans, cost-leak detections, and forecast formulas</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Strategy Select Dropdown */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 w-full sm:w-auto shrink-0 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Focus:</span>
              <select
                value={aiFocusMode}
                onChange={(e) => setAiFocusMode(e.target.value)}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none pr-1 cursor-pointer w-full"
              >
                <option value="general" className="dark:bg-slate-950">📊 General Strategy</option>
                <option value="student" className="dark:bg-slate-950">🎓 Student Budget Coach</option>
                <option value="tax" className="dark:bg-slate-950">💼 Corporate Tax-Saving</option>
                <option value="frugal" className="dark:bg-slate-950">🔥 Frugal FIRE Blueprint</option>
                <option value="business" className="dark:bg-slate-950">🏢 Startup SaaS FinOps</option>
              </select>
            </div>

            <button
              onClick={runAIFinancialAudit}
              disabled={aiReportLoading}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
            {aiReportLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating Audit...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Trigger Strategic AI Audit
              </>
            )}
          </button>
        </div>
      </div>

        {/* AUDIT OUTPUT DISPLAY */}
        <div className="p-6 bg-slate-50/40 dark:bg-slate-950/40 min-h-[160px] flex flex-col justify-center transition-colors duration-300">
          {aiReportLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400 mb-4" />
              <div className="text-sm font-semibold text-indigo-950 dark:text-white font-mono animate-pulse">{advisorState}</div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Calling cloud-native AI models securely on the server...</p>
            </div>
          ) : aiReport ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-slate max-w-none text-slate-800 dark:text-slate-200"
            >
              <div className="bg-indigo-50/30 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/50 rounded-2xl p-5 md:p-6 shadow-inner">
                {renderMarkdownText(aiReport)}
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-8 h-8 text-indigo-300 dark:text-indigo-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">Strategic AI Advisor Offline</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto mt-1">
                Trigger an automated deep audit of your current active cloud container ledger. The AI will build category charts, highlight cost leaks, and draft optimizations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CLOUD EXPENSE LEDGER (THE DATABASE ENTITY GRID) */}
      <div className="bg-white dark:bg-slate-900/60 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden transition-colors duration-300">
        
        {/* LEDGER BAR HEADERS & CONTROLS */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-display">
              <Layers className="w-5 h-5 text-indigo-500" />
              Cloud Storage Ledger
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400">Direct mapping from persistent container storage</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input 
                type="text"
                placeholder="Search merchant, memo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
              />
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 transition-colors duration-200">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none pr-1 cursor-pointer"
              >
                <option value="All" className="dark:bg-slate-950 dark:text-slate-200">All Categories</option>
                {Object.keys(CATEGORIES).map((cat, i) => (
                  <option key={i} value={cat} className="dark:bg-slate-950 dark:text-slate-200">{cat}</option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredExpenses.length === 0}
              className="flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer transition-all duration-150 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
              title="Export current ledger view as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* LEDGER LIST TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400 dark:text-slate-500 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500">Loading ledger nodes from cloud container database...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 font-display">No Ledger Entries Found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                No transactions matched your filters, or database is empty. Enter manual records above or simulate receipt scans!
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/30 dark:bg-slate-950/20">
                  <th className="py-4 px-6">Transaction Date</th>
                  <th className="py-4 px-6">Vendor / Merchant</th>
                  <th className="py-4 px-6">Expense Category</th>
                  <th className="py-4 px-6">Memo Description</th>
                  <th className="py-4 px-6 text-right">Amount (₹)</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredExpenses.map((expense) => {
                  const catConfig = CATEGORIES[expense.category] || CATEGORIES["Other Expenses"];
                  const IconComp = catConfig.icon;

                  return (
                    <tr 
                      key={expense.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 border-b border-slate-100/50 dark:border-slate-800/30 transition-colors duration-150 text-xs text-slate-700 dark:text-slate-300 group"
                    >
                      {/* Date */}
                      <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                          {expense.date}
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span>{expense.merchant}</span>
                          {expense.isRecurring && (
                            <span className="inline-flex items-center gap-1 text-[9px] text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 font-bold px-1.5 py-0.5 rounded-md w-max border border-indigo-100/50 dark:border-indigo-900/30">
                              <RefreshCw className="w-2.5 h-2.5 animate-[spin_8s_linear_infinite]" />
                              <span>{expense.recurringFrequency}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${catConfig.bg} ${catConfig.text}`}>
                          <IconComp className="w-3 h-3" />
                          {expense.category}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {expense.description || <span className="text-slate-300 dark:text-slate-750 italic">No memo attached</span>}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right font-bold text-slate-900 dark:text-white font-mono text-sm whitespace-nowrap">
                        ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Delete button */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg border border-slate-200/40 dark:border-slate-800/40 hover:border-red-100/60 dark:hover:border-red-900/40 transition-all duration-150 opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm hover:scale-105"
                          title="Delete ledger record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </motion.div>
      )}

      {/* SAVINGS & BUDGET PLANNING MODULE */}
      {activeTab === "planner" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <IncomeSavingsManager
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            savingsGoal={savingsGoal}
            setSavingsGoal={setSavingsGoal}
            totalSpend={totalSpend}
            budgetLimit={budgetLimit}
            setBudgetLimit={setBudgetLimit}
          />
        </motion.div>
      )}

      {/* BESPOKE CATEGORY DESIGNER MODULE */}
      {activeTab === "categories" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <CategoryDesigner
            customCategories={customCategories}
            onAddCategory={handleAddCustomCategory}
            onRemoveCategory={handleRemoveCustomCategory}
            defaultCategories={DEFAULT_CATEGORIES}
          />
        </motion.div>
      )}

      {/* COMPREHENSIVE COMPANION ONBOARDING WALKTHROUGH */}
      {activeTab === "guide" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <InteractiveGuide onNavigateToDashboard={() => setActiveTab("dashboard")} />
        </motion.div>
      )}

      {/* FOOTER METADATA INFO */}
      <footer className="mt-12 text-center text-xs text-slate-400 dark:text-slate-500 font-mono space-y-1 py-4 border-t border-slate-150 dark:border-slate-850">
        <p>© 2026 Cloud Expense Tracker. All rights reserved.</p>
        <p>Simple and secure budget & savings planner powered by Advanced AI Models.</p>
      </footer>

    </div>
  );
}
